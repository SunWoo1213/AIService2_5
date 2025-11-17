import { cn } from '@/utils/cn'
import { forwardRef } from 'react'

/**
 * Modern Textarea Component
 */
const Textarea = forwardRef(
  ({ className, label, error, helperText, maxLength, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <div className="flex justify-between items-center mb-2">
            <label className="label !mb-0" htmlFor={props.id}>
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {maxLength && props.value && (
              <span className="text-xs text-gray-400">
                {props.value.length} / {maxLength}
              </span>
            )}
          </div>
        )}
        
        <textarea
          className={cn(
            'textarea',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
            className
          )}
          ref={ref}
          maxLength={maxLength}
          {...props}
        />
        
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea

