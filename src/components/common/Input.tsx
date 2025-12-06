import { forwardRef, useId, type InputHTMLAttributes, type ReactElement } from 'react'

import { cn } from '@/lib/cn'

export type InputProps = {
  readonly label: string
  readonly helperText?: string
  readonly errorText?: string
  readonly prefix?: ReactElement
  readonly suffix?: ReactElement
} & InputHTMLAttributes<HTMLInputElement>

/**
 * Evergreen text input with visible label, helper, and error messaging. Meets 44px tap target guidance.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   helperText="We'll never share your email."
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, errorText, id: providedId, className, prefix, suffix, required, ...rest },
  ref,
): ReactElement {
  const generatedId = useId()
  const id = providedId ?? `input-${generatedId}`
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = errorText ? `${id}-error` : undefined

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-body" htmlFor={id}>
      <span className="flex items-center justify-between text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-error">*</span> : null}
      </span>
      <div
        className={cn(
          'flex min-h-[44px] w-full items-center gap-2 rounded-md border border-lines bg-paper px-3 py-2 text-base text-body transition-colors motion-reduce:transition-none focus-within:border-primary focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-paper',
          errorText && 'border-error focus-within:border-error focus-within:ring-error/40',
          className,
        )}
      >
        {prefix ? <span className="text-muted">{prefix}</span> : null}
        <input
          ref={ref}
          id={id}
          required={required}
          className="size-full border-0 bg-transparent p-0 text-base text-body placeholder:text-muted focus-visible:outline-none"
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={Boolean(errorText) || undefined}
          {...rest}
        />
        {suffix ? <span className="text-muted">{suffix}</span> : null}
      </div>
      {helperText ? (
        <span id={helperId} className="text-xs text-muted">
          {helperText}
        </span>
      ) : null}
      {errorText ? (
        <span id={errorId} className="text-xs font-medium text-error">
          {errorText}
        </span>
      ) : null}
    </label>
  )
})
