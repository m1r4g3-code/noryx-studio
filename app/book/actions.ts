'use server'

import { format } from 'date-fns'
import { headers } from 'next/headers'
import { createServiceRoleClient } from '@/lib/supabase-server'
import { generateReference } from '@/lib/utils'
import { bookingSchema } from '@/lib/validations'
import { sendBarberNewBookingNotification } from '@/lib/notifications'
import type { BookingFormData, ActionResult, BarberContactSettings } from '@/types'

export async function createAppointment(
  bookingData: BookingFormData
): Promise<ActionResult<string>> {
  // Service-role client: appointments/settings are not publicly readable, and we
  // need the rate_limit RPC. This action is the trust boundary — validate here.
  const admin = createServiceRoleClient()

  // ── 1. Validate input shape (never trust the client) ──────────────────────
  const dateStr = format(new Date(bookingData.appointment_date), 'yyyy-MM-dd')
  const parsed = bookingSchema.safeParse({
    service_id: bookingData.service_id,
    appointment_date: dateStr,
    appointment_time: bookingData.appointment_time,
    client_name: bookingData.client_name,
    client_phone: bookingData.client_phone,
    client_email: bookingData.client_email ?? '',
    notes: bookingData.notes ?? '',
  })
  if (!parsed.success) {
    return { data: null, error: 'Please check your booking details and try again.' }
  }
  const input = parsed.data

  // ── 2. Rate limiting (per IP + per phone) ─────────────────────────────────
  const ip = (headers().get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  const [ipLimit, phoneLimit] = await Promise.all([
    admin.rpc('rate_limit', { p_bucket: `book:ip:${ip}`, p_max: 8, p_window_seconds: 3600 }),
    admin.rpc('rate_limit', { p_bucket: `book:phone:${input.client_phone}`, p_max: 4, p_window_seconds: 86400 }),
  ])
  if (ipLimit.data === false || phoneLimit.data === false) {
    return { data: null, error: 'Too many booking attempts. Please try again later, or reach us on WhatsApp.' }
  }

  // ── 3. Business rules (server-enforced) ───────────────────────────────────
  const { data: enabled } = await admin.from('settings').select('value').eq('key', 'booking_enabled').single()
  if (enabled?.value === false) {
    return { data: null, error: 'Online booking is currently unavailable.' }
  }

  if (input.appointment_date < format(new Date(), 'yyyy-MM-dd')) {
    return { data: null, error: 'That date is in the past.' }
  }

  const { data: slotsSetting } = await admin.from('settings').select('value').eq('key', 'time_slots').single()
  const slots = (slotsSetting?.value as string[] | null) ?? []
  if (!slots.includes(input.appointment_time)) {
    return { data: null, error: 'That time slot is not available.' }
  }

  const { data: service } = await admin
    .from('services')
    .select('id, name, is_active')
    .eq('id', input.service_id)
    .single()
  if (!service || !service.is_active) {
    return { data: null, error: 'That service is no longer available.' }
  }

  // ── 4. Insert — handle reference collision AND slot conflict ──────────────
  let attempts = 0
  while (attempts < 4) {
    attempts++
    const reference = generateReference()

    const { error } = await admin.from('appointments').insert({
      reference,
      service_id: input.service_id,
      client_name: input.client_name,
      client_phone: input.client_phone,
      client_email: input.client_email || null,
      appointment_date: input.appointment_date,
      appointment_time: input.appointment_time,
      notes: input.notes || null,
      status: 'pending',
    })

    if (error) {
      if (error.code === '23505') {
        // Partial unique index on (date,time) for active appointments
        if (error.message.includes('uniq_active_slot')) {
          return { data: null, error: 'Sorry, that time slot was just booked. Please choose another time.' }
        }
        // Otherwise it's a reference collision — retry with a new reference
        if (attempts < 4) continue
      }
      return { data: null, error: 'Booking failed. Please try again.' }
    }

    // ── Success → notify barber (best-effort) ───────────────────────────────
    try {
      const { data: bc } = await admin.from('settings').select('value').eq('key', 'barber_contact').single()
      const barber = bc?.value as BarberContactSettings | null
      await sendBarberNewBookingNotification(
        {
          id: '',
          reference,
          service_id: input.service_id,
          client_name: input.client_name,
          client_phone: input.client_phone,
          client_email: input.client_email || null,
          appointment_date: input.appointment_date,
          appointment_time: input.appointment_time,
          notes: input.notes || null,
          status: 'pending',
          created_at: new Date().toISOString(),
          service_name: service.name,
        },
        barber?.notification_email || null,
        barber?.notification_phone || null
      )
    } catch {
      // notification failure must never block booking success
    }

    return { data: reference, error: null }
  }

  return { data: null, error: 'Booking failed after multiple attempts. Please try again.' }
}
