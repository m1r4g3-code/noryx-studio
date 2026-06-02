'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

export function StarRating({
  value,
  onChange,
  size = 'md',
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const interactive = !!onChange

  const displayValue = interactive && hovered > 0 ? hovered : value

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          className={cn(
            'transition-transform duration-100',
            interactive && 'hover:scale-110 cursor-pointer',
            !interactive && 'cursor-default'
          )}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <svg
            className={cn(
              sizeMap[size],
              displayValue >= star ? 'text-gold' : 'text-border'
            )}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}
