import { forwardRef, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type IconButtonProps = {
  readonly icon: ReactNode
  readonly label: string
  readonly variant?: 'ghost' | 'solid'
  readonly size?: 'sm' | 'md' | 'lg'
} & ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Icon-only button for toolbars and minimal affordances. Uses an aria-label for accessibility.
 *
 * @example
 * ```tsx
 * <IconButton icon={<HeartIcon />} label="Save item" onClick={toggleFavorite} />
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'ghost', size = 'md', className, ...rest },
  ref,
): ReactElement {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      aria-label={label}
      {...rest}
    >
      <span className="flex items-center justify-center text-lg">{icon}</span>
    </button>
  )
})

const variantStyles: Record<Required<IconButtonProps>['variant'], string> = {
  ghost: 'text-primary hover:bg-primary/10 hover:text-primary-hover',
  solid: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover',
}

const sizeStyles: Record<Required<IconButtonProps>['size'], string> = {
  sm: 'h-10 w-10 text-base',
  md: 'h-11 w-11 text-lg',
  lg: 'h-12 w-12 text-xl',
}
