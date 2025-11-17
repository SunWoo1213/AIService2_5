import { cn } from '@/utils/cn'

const variants = {
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  gray: 'bg-gray-100 text-gray-700',
}

/**
 * Badge Component
 */
export default function Badge({ children, variant = 'primary', className, ...props }) {
  return (
    <span className={cn('badge', variants[variant], className)} {...props}>
      {children}
    </span>
  )
}

