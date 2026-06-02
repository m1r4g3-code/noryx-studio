import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  goldTop?: boolean
  hover?: boolean
}

export function Card({ children, className, goldTop = false, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-sm',
        goldTop && 'border-t-2 border-t-gold',
        hover && 'card-hover-glow cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'px-5 py-4 border-b border-border',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('px-5 py-4', className)}>{children}</div>
  )
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'px-5 py-4 border-t border-border',
        className
      )}
    >
      {children}
    </div>
  )
}
