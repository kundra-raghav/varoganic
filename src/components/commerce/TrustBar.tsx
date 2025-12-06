import type { ReactElement } from 'react'

/**
 * Row of trust badges and guarantees.
 */
export type TrustBarProps = {
  readonly items: Array<{ icon: string; label: string; description: string }>
}

export const TrustBar = ({ items }: TrustBarProps): ReactElement => {
  return (
    <section className="grid gap-3 rounded-2xl border border-lines bg-paper p-4 text-sm text-body sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-3">
          <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
            {item.icon}
          </span>
          <div>
            <p className="font-semibold text-ink">{item.label}</p>
            <p className="text-muted">{item.description}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
