'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import {
  sendClientConfirmationNotification,
  sendClientCancellationNotification,
  sendClientCompletedNotification,
} from '@/lib/notifications'
import type { AppointmentStatus, ActionResult } from '@/types'

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)

  if (error) return { data: null, error: error.message }

  // Notify the client on confirmed / cancelled / completed (best-effort)
  if (status === 'confirmed' || status === 'cancelled' || status === 'completed') {
    try {
      const { data: appt } = await supabase
        .from('appointments')
        .select('*, services(name, price, duration_minutes)')
        .eq('id', id)
        .single()

      if (appt) {
        const payload = { ...appt, service_name: appt.services?.name ?? 'Service' }
        if (status === 'confirmed') await sendClientConfirmationNotification(payload)
        else if (status === 'cancelled') await sendClientCancellationNotification(payload)
        else if (status === 'completed') await sendClientCompletedNotification(payload)
      }
    } catch {
      // Notification failure must never affect the status update
    }
  }

  return { data: null, error: null }
}

export async function deleteAppointment(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('appointments').delete().eq('id', id)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}
