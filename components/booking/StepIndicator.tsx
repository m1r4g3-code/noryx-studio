import { cn } from '@/lib/utils'
import type { BookingStep } from '@/types'

interface Step {
  number: BookingStep
  label: string
}

interface StepIndicatorProps {
  currentStep: BookingStep
  steps: Step[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-lg mx-auto">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number
        const isActive = currentStep === step.number
        const isLast = index === steps.length - 1

        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-sm flex items-center justify-center border text-xs font-bold transition-all duration-300',
                  isCompleted &&
                    'bg-gold border-gold text-bg',
                  isActive &&
                    'bg-surface border-gold text-gold shadow-gold-sm',
                  !isCompleted &&
                    !isActive &&
                    'bg-surface border-border text-text-muted'
                )}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              {/* Label */}
              <span
                className={cn(
                  'text-[10px] font-semibold uppercase tracking-[0.1em] font-body whitespace-nowrap',
                  isActive || isCompleted ? 'text-gold' : 'text-text-muted'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'flex-1 h-px mx-2 mb-5 transition-all duration-300',
                  isCompleted ? 'bg-gold' : 'bg-border'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
