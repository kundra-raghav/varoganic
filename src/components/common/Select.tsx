import { forwardRef, useId, type ReactElement, type SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type SelectProps = {
  readonly label: string
  readonly helperText?: string
  readonly errorText?: string
} & SelectHTMLAttributes<HTMLSelectElement>

/**
 * Accessible select element with label, helper, and inline error text.
 *
 * @example
 * ```tsx
 * <Select label="Shade" defaultValue="medium">
 *   <option value="light">Light</option>
 *   <option value="medium">Medium</option>
 *   <option value="deep">Deep</option>
 * </Select>
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, helperText, errorText, id: providedId, className, required, children, ...rest },
  ref,
): ReactElement {
  const generatedId = useId()
  const id = providedId ?? `select-${generatedId}`
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
          'relative flex min-h-[44px] w-full items-center rounded-md border border-lines bg-paper px-3 py-2 text-base text-body transition-colors motion-reduce:transition-none focus-within:border-primary focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-paper',
          errorText && 'border-error focus-within:border-error focus-within:ring-error/40',
          className,
        )}
      >
        <select
          ref={ref}
          id={id}
          required={required}
          className="size-full appearance-none bg-transparent text-base text-body focus-visible:outline-none"
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={Boolean(errorText) || undefined}
          {...rest}
        >
          {children}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-muted">
          <svg viewBox="0 0 10 6" fill="none" className="size-full">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
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
