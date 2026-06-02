import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import type { Service } from '@/types'

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group bg-surface border border-border border-t-2 border-t-gold rounded-sm p-6 flex flex-col gap-4 card-hover-glow transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl tracking-[0.06em] text-text-primary group-hover:text-gold transition-colors">
          {service.name}
        </h3>
        <div className="text-right shrink-0">
          <div className="font-display text-2xl text-gold tracking-wider">
            {formatCurrency(service.price)}
          </div>
          <div className="text-[11px] text-text-muted tracking-[0.12em] font-body">
            {service.duration_minutes} MIN
          </div>
        </div>
      </div>

      {service.description && (
        <p className="text-text-muted text-sm font-body leading-relaxed flex-1">
          {service.description}
        </p>
      )}

      <Link href={`/book?service=${service.id}`}>
        <Button variant="outline" size="sm" className="w-full mt-auto">
          Book This Service
        </Button>
      </Link>
    </div>
  )
}

export async function ServicesSection() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  const services: Service[] = data ?? []

  return (
    <section id="services" className="section-padding bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
              What We Offer
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl tracking-[0.05em] text-text-primary">
            OUR SERVICES
          </h2>
        </div>

        {services.length === 0 ? (
          <p className="text-text-muted font-body">Services coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
