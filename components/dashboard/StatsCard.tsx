import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  sublabel?: string
  accent?: 'gold' | 'green' | 'blue' | 'red'
  icon?: React.ReactNode
}

const accentMap = {
  gold: 'border-l-gold text-gold',
  green: 'border-l-green-400 text-green-400',
  blue: 'border-l-blue-400 text-blue-400',
  red: 'border-l-red-400 text-red-400',
}

export function StatsCard({
  label,
  value,
  sublabel,
  accent = 'gold',
  icon,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border border-l-4 rounded-sm p-5 flex items-center gap-4',
        accentMap[accent]
      )}
    >
      {icon && (
        <div className="shrink-0 opacity-50">{icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted font-body mb-1">
          {label}
        </div>
        <div className="font-display text-4xl tracking-wider text-text-primary leading-none">
          {value}
        </div>
        {sublabel && (
          <div className="text-[11px] text-text-muted font-body tracking-wide mt-1">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  )
}
