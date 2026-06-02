import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted"
          >
            {label}
            {props.required && (
              <span className="text-gold ml-1">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-bg border text-text-primary placeholder:text-text-muted',
            'px-3 py-2.5 text-sm font-body rounded-sm',
            'transition-all duration-200 outline-none',
            'focus:border-gold focus:ring-1 focus:ring-gold/20',
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
              : 'border-border',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400 font-body">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-text-muted font-body">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
