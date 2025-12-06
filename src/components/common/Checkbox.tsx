import { forwardRef, useId, type InputHTMLAttributes, type ReactElement } from 'react'

import { cn } from '@/lib/cn'

export type CheckboxProps = {
  readonly label: string
  readonly helperText?: string
  readonly errorText?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

/**
 * Checkbox control with Evergreen focus treatment and helper messaging.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Subscribe to offers"
 *   helperText="No more than one email per week."
 *   checked={subscribed}
 *   onChange={(event) => setSubscribed(event.target.checked)}
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, helperText, errorText, id: providedId, className, ...rest },
  ref,
): ReactElement {
  const generatedId = useId()
  const id = providedId ?? `checkbox-${generatedId}`
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = errorText ? `${id}-error` : undefined

  const hasError = Boolean(errorText)

  return (
    <div className={cn('flex w-full flex-col gap-2 text-sm text-body', className)}>
      <label htmlFor={id} className="flex min-h-[44px] cursor-pointer items-start gap-3">
        <span className="relative flex size-5 items-center justify-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded border border-lines bg-paper focus-visible:outline-none"
            aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={Boolean(errorText) || undefined}
            {...rest}
          />
          <span
            className={cn(
              'inline-flex size-full items-center justify-center bg-paper border border-lines rounded transition-colors motion-reduce:transition-none pointer-events-none peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper',
              hasError && 'border-error peer-checked:border-error peer-checked:bg-error peer-checked:text-primary-foreground',
            )}
          >
            <svg
              aria-hidden="true"
              className="size-3.5 opacity-0 transition-opacity peer-checked:opacity-100 motion-reduce:transition-none"
              viewBox="0 0 16 12"
              fill="none"
            >
              <path
                d="M1.5 6.75 5.25 10.5 14.5 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
        <span className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-ink">{label}</span>
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
        </span>
      </label>
    </div>
  )
})
