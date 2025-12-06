import { useCallback, type ReactElement } from 'react'

export type QuantityStepperProps = {
  readonly value: number
  readonly min?: number
  readonly max?: number
  readonly onChange: (value: number) => void
}

/**
 * Increment/decrement control for quantity selection.
 */
export const QuantityStepper = ({ value, min = 1, max = 10, onChange }: QuantityStepperProps): ReactElement => {
  const handleIncrement = useCallback(() => {
    if (value < max) {
      onChange(value + 1)
    }
  }, [max, onChange, value])

  const handleDecrement = useCallback(() => {
    if (value > min) {
      onChange(value - 1)
    }
  }, [min, onChange, value])

  return (
    <div className="inline-flex items-center rounded-full border border-lines bg-paper">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="size-10 text-lg text-ink transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-[3rem] text-center text-sm font-semibold text-ink" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="size-10 text-lg text-ink transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
