import { format } from 'date-fns'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { AppointmentsTable } from '@/components/dashboard/AppointmentsTable'
import { formatCurrency } from '@/lib/utils'
import type { AppointmentWithService } from '@/types'
import { updateAppointmentStatus, deleteAppointment } from './appointments/actions'

export default async function AdminDashboardPage() {
  const supabase = createServerSupabaseClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  const [{ data: allAppointments }, { data: todayData }, { data: revenueData }] =
    await Promise.all([
      supabase
        .from('appointments')
        .select('*, services(name, price, duration_minutes)')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('appointments')
        .select('id, status')
        .eq('appointment_date', today),
      supabase
        .from('appointments')
        .select('services(price)')
        .eq('status', 'completed'),
    ])

  const pending = (allAppointments ?? []).filter((a) => a.status === 'pending').length
  const todayCount = todayData?.length ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalRevenue = (revenueData ?? []).reduce((sum: number, a: any) => {
    const svc = Array.isArray(a.services) ? a.services[0] : a.services
    return sum + (svc?.price ?? 0)
  }, 0)

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-6 bg-gold" />
          <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
            Dashboard
          </span>
        </div>
        <h1 className="font-display text-4xl tracking-widest text-text-primary">OVERVIEW</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Today's Appointments" value={todayCount} accent="gold" />
        <StatsCard label="Pending" value={pending} accent="red" />
        <StatsCard
          label="Completed (All Time)"
          value={(allAppointments ?? []).filter((a) => a.status === 'completed').length}
          accent="green"
        />
        <StatsCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          sublabel="Completed appointments"
          accent="gold"
        />
      </div>

      <div className="bg-surface border border-border rounded-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display text-lg tracking-widest text-text-primary">
            RECENT APPOINTMENTS
          </h2>
          <a
            href="/admin/appointments"
            className="text-xs text-gold hover:text-gold-light transition-colors font-body uppercase tracking-wider"
          >
            View All →
          </a>
        </div>
        <div className="p-5">
          <AppointmentsTable
            appointments={(allAppointments ?? []) as AppointmentWithService[]}
            onStatusChange={updateAppointmentStatus}
            onDelete={deleteAppointment}
          />
        </div>
      </div>
    </div>
  )
}
