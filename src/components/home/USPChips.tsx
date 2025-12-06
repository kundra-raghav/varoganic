import type { ReactElement } from 'react'

export type USPChipsProps = {
  readonly items: Array<string>
}

/**
 * Inline chips that surface brand proof points.
 */
export const USPChips = ({ items }: USPChipsProps): ReactElement => {
  return (
    <section className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-lines bg-paper px-4 py-3 text-sm text-muted">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-2 rounded-full border border-lines bg-paper px-4 py-2 font-medium text-body transition-colors hover:border-primary hover:text-primary"
        >
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          {item}
        </span>
      ))}
    </section>
  )
}
