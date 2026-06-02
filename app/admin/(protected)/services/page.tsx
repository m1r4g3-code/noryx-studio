import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ServicesTable } from '@/components/dashboard/ServicesTable'
import type { Service } from '@/types'
import {
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
  moveServiceUp,
  moveServiceDown,
} from './actions'

export default async function ServicesPage() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })

  const services = (data ?? []) as Service[]

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-6 bg-gold" />
          <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
            Manage
          </span>
        </div>
        <h1 className="font-display text-4xl tracking-widests text-text-primary">SERVICES</h1>
      </div>

      <div className="bg-surface border border-border rounded-sm p-5">
        <ServicesTable
          services={services}
          onCreate={createService}
          onUpdate={updateService}
          onDelete={deleteService}
          onToggleActive={toggleServiceActive}
          onMoveUp={moveServiceUp}
          onMoveDown={moveServiceDown}
        />
      </div>
    </div>
  )
}
