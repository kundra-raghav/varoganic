import { Chip } from '@/components/common/Chip'

import type { ReactElement } from 'react'

export type Concern = {
  readonly label: string
  readonly href: string
}

export type ShopByConcernProps = {
  readonly concerns: Array<Concern>
}

/**
 * Chip-based navigation for jumping into concern-specific listings.
 */
export const ShopByConcern = ({ concerns }: ShopByConcernProps): ReactElement => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="font-heading text-h3 text-ink">Shop by concern</h2>
        <p className="text-sm text-muted">Curate rituals for your skin goals in a tap.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {concerns.map((concern) => (
          <Chip
            key={concern.href}
            label={concern.label}
            onClick={() => {
              window.location.assign(concern.href)
            }}
          />
        ))}
      </div>
    </section>
  )
}
