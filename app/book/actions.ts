'use server'

import { format } from 'date-fns'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { generateReference } from '@/lib/utils'
import { sendBarberNewBookingNotification } from '@/lib/notifications'
import type { BookingFormData, ActionResult, BarberContactSettings } from '@/types'

export async function createAppointment(
  bookingData: BookingFormData
): Promise<ActionResult<string>> {
  const supabase = createServerSupabaseClient()

  // Retry up to 3 times in case of reference collision
  let attempts = 0
  while (attempts < 3) {
    attempts++
    const reference = generateReference()

    const { error } = await supabase.from('appointments').insert({
      reference,
      service_id: bookingData.service_id,
      client_name: bookingData.client_name,
      client_phone: bookingData.client_phone,
      client_email: bookingData.client_email || null,
      appointment_date: format(new Date(bookingData.appointment_date), 'yyyy-MM-dd'),
      appointment_time: bookingData.appointment_time,
      notes: bookingData.notes || null,
      status: 'pending',
    })

    if (error) {
      // Unique constraint violation — retry with a new reference
      if (error.code === '23505' && attempts < 3) continue
      return { data: null, error: 'Booking failed. Please try again.' }
    }

    // Booking succeeded — send barber notification (best-effort, don't block on it).
    // Use the service-role client because barber_contact is not publicly readable
    // under RLS, and bookings run as an anonymous user.
    try {
      const admin = createServiceRoleClient()
      const { data: barberContactSetting } = await admin
        .from('settings')
        .select('value')
        .eq('key', 'barber_contact')
        .single()

      const barberContact = barberContactSetting?.value as BarberContactSettings | null

      await sendBarberNewBookingNotification(
        {
          id: '',
          reference,
          service_id: bookingData.service_id,
          client_name: bookingData.client_name,
          client_phone: bookingData.client_phone,
          client_email: bookingData.client_email || null,
          appointment_date: format(new Date(bookingData.appointment_date), 'yyyy-MM-dd'),
          appointment_time: bookingData.appointment_time,
          notes: bookingData.notes || null,
          status: 'pending',
          created_at: new Date().toISOString(),
          service_name: bookingData.service_name,
        },
        barberContact?.notification_email || null,
        barberContact?.notification_phone || null
      )
    } catch {
      // Notification failure must never block booking success
    }

    return { data: reference, error: null }
  }

  return { data: null, error: 'Booking failed after multiple attempts. Please try again.' }
}
