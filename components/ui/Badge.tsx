import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'green' | 'red' | 'yellow' | 'blue' | 'muted' | 'purple'
  className?: string
}

const variantStyles = {
  gold: 'bg-gold/10 text-gold border-gold/30',
  green: 'bg-green-500/10 text-green-400 border-green-500/30',
  red: 'bg-red-500/10 text-red-400 border-red-500/30',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  muted: 'bg-surface-elevated text-text-muted border-border',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

export function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[11px] font-semibold',
        'uppercase tracking-[0.1em] border rounded-sm',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
