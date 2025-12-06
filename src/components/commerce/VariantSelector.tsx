import { useState, type ReactElement } from 'react'

export type VariantOption = {
  readonly id: string
  readonly label: string
  readonly description?: string
}

export type VariantSelectorProps = {
  readonly options: Array<VariantOption>
  readonly onChange?: (option: VariantOption) => void
}

/**
 * Product variant picker supporting swatches and dropdowns.
 */
export const VariantSelector = ({ options, onChange }: VariantSelectorProps): ReactElement => {
  const [selected, setSelected] = useState(options[0]?.id ?? '')

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-ink">Variant</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected === option.id
          return (
            <button
              key={option.id}
              type="button"
              className="rounded-full border border-lines bg-paper px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              data-active={isActive}
              aria-pressed={isActive}
              onClick={() => {
                setSelected(option.id)
                onChange?.(option)
              }}
            >
              <span className="font-medium text-body">{option.label}</span>
              {option.description ? <span className="ml-2 text-xs text-muted">{option.description}</span> : null}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
