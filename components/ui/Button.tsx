'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variants = {
  primary:
    'bg-gold text-bg font-semibold hover:bg-gold-light active:scale-[0.98] border border-gold hover:border-gold-light',
  outline:
    'bg-transparent border border-gold text-gold hover:bg-gold hover:text-bg active:scale-[0.98]',
  secondary:
    'bg-surface-elevated border border-border text-text-primary hover:border-gold active:scale-[0.98]',
  ghost:
    'bg-transparent text-text-muted hover:text-text-primary hover:bg-surface active:scale-[0.98]',
  danger:
    'bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-900/40 active:scale-[0.98]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs tracking-[0.12em]',
  md: 'px-5 py-2.5 text-sm tracking-[0.15em]',
  lg: 'px-8 py-3.5 text-base tracking-[0.15em]',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 uppercase font-body transition-all duration-200 rounded-sm',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
