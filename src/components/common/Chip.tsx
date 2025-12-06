import { forwardRef, type ButtonHTMLAttributes, type ReactElement } from 'react'

import { cn } from '@/lib/cn'

export type ChipProps = {
  readonly selected?: boolean
  readonly label: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

/**
 * Filter chip with pressed state and token-driven styling.
 *
 * @example
 * ```tsx
 * <Chip selected={isActive} onClick={() => setActive((prev) => !prev)} label="Hydrating" />
 * ```
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected = false, label, className, ...rest },
  ref,
): ReactElement {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex min-h-[44px] items-center justify-center rounded-full border border-lines bg-paper px-4 py-2 text-sm font-medium text-body transition-colors motion-reduce:transition-none motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        selected && 'border-primary bg-primary/10 text-primary',
        className,
      )}
      aria-pressed={selected}
      {...rest}
    >
      {label}
    </button>
  )
})
