import { cn } from '@/lib/cn'

import type { HTMLAttributes, ReactElement } from 'react'

export type BadgeVariant = 'status' | 'new' | 'bestseller' | 'clean'

export type BadgeProps = {
  readonly variant?: BadgeVariant
} & HTMLAttributes<HTMLSpanElement>

/**
 * Label badge for statuses and merchandising callouts.
 *
 * @example
 * ```tsx
 * <Badge variant="bestseller">Bestseller</Badge>
 * ```
 */
export const Badge = ({ variant = 'status', className, children, ...rest }: BadgeProps): ReactElement => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        badgeStyles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

const badgeStyles: Record<BadgeVariant, string> = {
  status: 'bg-primary/10 text-primary',
  new: 'bg-accent/15 text-accent',
  bestseller: 'bg-warning/15 text-warning',
  clean: 'bg-success/15 text-success',
}
