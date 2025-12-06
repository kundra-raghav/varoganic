import { useId, useMemo, useState, type KeyboardEvent, type ReactElement } from 'react'

import { cn } from '@/lib/cn'

export type RatingProps = {
  readonly max?: number
  readonly value?: number
  readonly defaultValue?: number
  readonly onValueChange?: (value: number) => void
  readonly readOnly?: boolean
  readonly label?: string
  readonly id?: string
  readonly className?: string
}

/**
 * Star rating component supporting read-only and interactive modes with keyboard navigation.
 *
 * @example
 * ```tsx
 * <Rating value={rating} onValueChange={setRating} label="Product rating" />
 * ```
 */
export const Rating = ({
  max = 5,
  value,
  defaultValue = 0,
  onValueChange,
  readOnly = false,
  label = 'Rating',
  id: providedId,
  className,
}: RatingProps): ReactElement => {
  const generatedId = useId()
  const id = providedId ?? `rating-${generatedId}`
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = typeof value === 'number'
  const currentValue = isControlled && typeof value === 'number' ? value : internalValue

  const stars = useMemo(() => Array.from({ length: max }, (_, index) => index + 1), [max])

  const handleSelect = (nextValue: number): void => {
    if (readOnly) {
      return
    }

    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, star: number): void => {
    if (readOnly) {
      return
    }

    const isHorizontalEvent = event.key === 'ArrowRight' || event.key === 'ArrowLeft'
    const isVerticalEvent = event.key === 'ArrowUp' || event.key === 'ArrowDown'

    if (event.key === 'Home') {
      event.preventDefault()
      handleSelect(1)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      handleSelect(max)
      return
    }

    if (!(isHorizontalEvent || isVerticalEvent)) {
      return
    }

    event.preventDefault()
    const increment = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : -1
    const next = star + increment

    if (next < 1) {
      handleSelect(max)
    } else if (next > max) {
      handleSelect(1)
    } else {
      handleSelect(next)
    }
  }

  return (
    <div
      className={cn('flex items-center gap-2 text-accent', className)}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={label}
      aria-readonly={readOnly || undefined}
      id={id}
    >
      {stars.map((star) => {
        const isActive = star <= currentValue
        const commonClasses = cn(
          'inline-flex items-center justify-center transition-transform motion-reduce:transition-none',
          isActive ? 'text-accent' : 'text-lines',
        )

        if (readOnly) {
          return (
            <span key={star} className={cn(commonClasses, 'size-6')} aria-hidden="true">
              <StarIcon filled={isActive} />
            </span>
          )
        }

        const isCurrent = star === Math.round(currentValue)
        const labelText = star === 1 ? '1 star' : `${String(star)} stars`

        return (
          <button
            key={star}
            type="button"
            className={cn(
              commonClasses,
              'size-8 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
            )}
            role="radio"
            aria-checked={isCurrent}
            aria-label={labelText}
            tabIndex={isCurrent ? 0 : -1}
            onClick={() => {
              handleSelect(star)
            }}
            onKeyDown={(event) => {
              handleKeyDown(event, star)
            }}
          >
            <StarIcon filled={isActive} />
          </button>
        )
      })}
    </div>
  )
}

const StarIcon = ({ filled }: { readonly filled: boolean }): ReactElement => (
  <svg
    className={cn('size-6 transition-colors motion-reduce:transition-none', filled ? 'fill-current' : 'fill-none')}
    viewBox="0 0 24 24"
    role="presentation"
  >
    <path
      d="M12 3.5 14.813 9l5.813.844-4.207 4.098.994 5.81L12 17.896l-5.413 2.856.994-5.81-4.207-4.098L9.187 9 12 3.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)
