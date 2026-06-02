'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { sendClientConfirmationNotification } from '@/lib/notifications'
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

  // Send client notification when confirmed
  if (status === 'confirmed') {
    try {
      const { data: appt } = await supabase
        .from('appointments')
        .select('*, services(name, price, duration_minutes)')
        .eq('id', id)
        .single()

      if (appt) {
        await sendClientConfirmationNotification({
          ...appt,
          service_name: appt.services?.name ?? 'Service',
        })
      }
    } catch {
      // Notification failure must never affect status update
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
