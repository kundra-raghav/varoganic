import type { ReactElement } from 'react'

export type BundleHighlight = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly savings: string
  readonly href: string
}

export type BundlesStripProps = {
  readonly bundles: Array<BundleHighlight>
}

/**
 * Horizontal strip emphasising value bundles with savings callouts.
 */
export const BundlesStrip = ({ bundles }: BundlesStripProps): ReactElement => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="font-heading text-h3 text-ink">Bundle &amp; save more</h2>
        <p className="text-sm text-muted">Curated rituals with automatic savings and free shipping.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {bundles.map((bundle) => (
          <a
            key={bundle.id}
            href={bundle.href}
            className="group flex flex-col gap-3 rounded-2xl border border-lines bg-paper p-5 shadow-card transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg"
          >
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
              Save {bundle.savings}
            </div>
            <h3 className="font-heading text-lg text-ink">{bundle.title}</h3>
            <p className="text-sm text-muted">{bundle.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
