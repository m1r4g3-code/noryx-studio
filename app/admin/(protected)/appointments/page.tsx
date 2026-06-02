import { createServerSupabaseClient } from '@/lib/supabase-server'
import { AppointmentsTable } from '@/components/dashboard/AppointmentsTable'
import type { AppointmentWithService } from '@/types'
import { updateAppointmentStatus, deleteAppointment } from './actions'

export default async function AppointmentsPage() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('appointments')
    .select('*, services(name, price, duration_minutes)')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false })

  const appointments = (data ?? []) as AppointmentWithService[]

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-6 bg-gold" />
          <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
            Manage
          </span>
        </div>
        <h1 className="font-display text-4xl tracking-widests text-text-primary">APPOINTMENTS</h1>
        <p className="text-text-muted text-sm font-body mt-1">
          {appointments.length} total appointment{appointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-surface border border-border rounded-sm p-5">
        <AppointmentsTable
          appointments={appointments}
          onStatusChange={updateAppointmentStatus}
          onDelete={deleteAppointment}
        />
      </div>
    </div>
  )
}
