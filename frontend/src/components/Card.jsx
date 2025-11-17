import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'

/**
 * Modern Card Component
 */
export default function Card({
  children,
  className,
  hover = true,
  padding = true,
  onClick,
  ...props
}) {
  const Component = onClick ? motion.div : 'div'
  
  return (
    <Component
      className={cn(
        'card',
        hover && 'card-hover cursor-pointer',
        !padding && 'p-0',
        className
      )}
      onClick={onClick}
      whileHover={hover && onClick ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Card Header
 */
export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Title
 */
export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-xl font-bold text-gray-900', className)} {...props}>
      {children}
    </h3>
  )
}

/**
 * Card Description
 */
export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-sm text-gray-500 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

/**
 * Card Content
 */
export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Footer
 */
export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-100', className)} {...props}>
      {children}
    </div>
  )
}

