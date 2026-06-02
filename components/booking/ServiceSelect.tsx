'use client'

import { cn, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { Service } from '@/types'

interface ServiceSelectProps {
  services: Service[]
  selectedServiceId: string | null
  onSelect: (service: Service) => void
}

export function ServiceSelect({
  services,
  selectedServiceId,
  onSelect,
}: ServiceSelectProps) {
  return (
    <div className="w-full">
      <h2 className="font-display text-3xl tracking-[0.08em] text-text-primary mb-2">
        SELECT A SERVICE
      </h2>
      <p className="text-text-muted text-sm font-body mb-8">
        Choose the service you&apos;d like to book.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service)}
              className={cn(
                'text-left bg-surface border rounded-sm p-5 transition-all duration-200',
                'hover:border-gold hover:shadow-gold-sm',
                'flex flex-col gap-3 group',
                isSelected
                  ? 'border-gold shadow-gold bg-surface-elevated'
                  : 'border-border'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Selection indicator */}
                  <div
                    className={cn(
                      'w-4 h-4 border rounded-sm flex-shrink-0 flex items-center justify-center transition-all',
                      isSelected
                        ? 'bg-gold border-gold'
                        : 'border-border group-hover:border-gold'
                    )}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={cn(
                      'font-display text-xl tracking-wider transition-colors',
                      isSelected ? 'text-gold' : 'text-text-primary group-hover:text-gold'
                    )}
                  >
                    {service.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display text-xl text-gold">
                    {formatCurrency(service.price)}
                  </div>
                  <div className="text-[11px] text-text-muted font-body tracking-wider">
                    {service.duration_minutes} min
                  </div>
                </div>
              </div>

              {service.description && (
                <p className="text-text-muted text-sm font-body leading-relaxed pl-7">
                  {service.description}
                </p>
              )}
            </button>
          )
        })}
      </div>

      {selectedServiceId && (
        <div className="mt-8 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              const service = services.find((s) => s.id === selectedServiceId)
              if (service) onSelect(service)
            }}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  )
}
