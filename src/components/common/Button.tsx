import { forwardRef, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  readonly iconLeft?: ReactNode
  readonly iconRight?: ReactNode
  readonly loading?: boolean
  readonly fullWidth?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Primary Evergreen action button with secondary and tertiary variants.
 * Icons, loading state, and reduced-motion safe interactions are supported.
 *
 * @example
 * ```tsx
 * <Button variant="primary" iconLeft={<LeafIcon />} onClick={() => console.log('add to cart')}>
 *   Add to Cart
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    loading = false,
    disabled,
    className,
    fullWidth = false,
    children,
    ...rest
  },
  ref,
): ReactElement {
  const isDisabled = disabled ?? loading

  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors motion-reduce:transition-none motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-60',
        variantClassNames[variant],
        sizeClassNames[size],
        loading && 'cursor-progress',
        fullWidth ? 'w-full' : 'w-auto',
        className,
      )}
      disabled={isDisabled}
      data-variant={variant}
      data-size={size}
      aria-busy={loading}
      {...rest}
    >
      {iconLeft ? <span className="inline-flex size-5 items-center justify-center">{iconLeft}</span> : null}
      <span className={cn('inline-flex items-center', loading && 'opacity-80')}>{children}</span>
      {loading ? <Spinner /> : null}
      {!loading && iconRight ? (
        <span className="inline-flex size-5 items-center justify-center">{iconRight}</span>
      ) : null}
    </button>
  )
})

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-sm transition-transform duration-200 ease-out hover:bg-primary-hover focus-visible:bg-primary-hover',
  secondary:
    'border border-primary/60 bg-paper text-primary transition-transform duration-200 ease-out hover:border-primary hover:bg-primary/10 focus-visible:border-primary focus-visible:bg-primary/15',
  tertiary:
    'bg-transparent text-primary transition-colors duration-150 ease-in hover:text-primary-hover focus-visible:text-primary-hover',
}

const sizeClassNames: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] px-3 py-2 text-sm',
  md: 'min-h-[44px] px-4 py-2 text-base',
  lg: 'min-h-[48px] px-6 py-3 text-base',
}

const Spinner = (): ReactElement => (
  <span aria-hidden="true" className="inline-flex size-5 items-center justify-center">
    <svg
      className="size-4 animate-spin text-primary motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
      role="presentation"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </span>
)
