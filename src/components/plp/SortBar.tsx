import { useMemo, type ChangeEvent, type ReactElement } from 'react'

import { useFiltersStore } from '@/store/filters'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest arrivals' },
]

/**
 * Sorting controls for PLP.
 */
export const SortBar = (): ReactElement => {
  const { sort, setSort } = useFiltersStore()

  const selectedLabel = useMemo(() => sortOptions.find((option) => option.value === sort)?.label ?? 'Featured', [sort])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSort(event.target.value as typeof sort)
  }

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-lines bg-paper px-4 py-3 text-sm text-muted">
      <p>
        Sorted by <strong className="text-body">{selectedLabel}</strong>
      </p>
      <label className="flex items-center gap-2">
        <span className="sr-only">Sort products</span>
        <select
          value={sort}
          onChange={handleChange}
          className="rounded-full border border-lines bg-paper px-3 py-2 text-body focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}
