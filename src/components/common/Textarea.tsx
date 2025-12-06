import { forwardRef, useId, type ReactElement, type TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type TextareaProps = {
  readonly label: string
  readonly helperText?: string
  readonly errorText?: string
  readonly minRows?: number
} & TextareaHTMLAttributes<HTMLTextAreaElement>

/**
 * Textarea with Evergreen styling and helper/error messaging.
 *
 * @example
 * ```tsx
 * <Textarea label="Notes" placeholder="Add an optional message" rows={4} />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, helperText, errorText, minRows = 3, id: providedId, className, required, ...rest },
  ref,
): ReactElement {
  const generatedId = useId()
  const id = providedId ?? `textarea-${generatedId}`
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = errorText ? `${id}-error` : undefined

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-body" htmlFor={id}>
      <span className="flex items-center justify-between text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-error">*</span> : null}
      </span>
      <textarea
        ref={ref}
        id={id}
        required={required}
        rows={rest.rows ?? minRows}
        className={cn(
          'min-h-[44px] w-full rounded-md border border-lines bg-paper px-3 py-2 text-base text-body transition-colors motion-reduce:transition-none placeholder:text-muted focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
          errorText && 'border-error focus:border-error focus:ring-error/40',
          className,
        )}
        aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={Boolean(errorText) || undefined}
        {...rest}
      />
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
