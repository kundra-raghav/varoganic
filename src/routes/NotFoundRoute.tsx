import { Button } from '@/components/common/Button'
import { SEO } from '@/components/layout/SEO'

import type { ReactElement } from 'react'

/**
 * Catch-all 404 route with helpful links.
 */
export const NotFoundRoute = (): ReactElement => {
  return (
    // Performance budget (JS <200KB gz, LCP <2.5s on 4G, CLS <0.1, INP <200ms):
    // - Lightweight fallback ensures fast recovery even on constrained networks.
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center">
      <SEO title="Page not found" description="The ritual you were looking for has moved." path={window.location.pathname} noindex />
      <span className="text-4xl" aria-hidden="true">
        🌿
      </span>
      <h1 className="font-heading text-h2 text-ink">We couldn’t find that page</h1>
      <p className="text-sm text-muted">
        The link may be outdated. Explore our latest rituals or return to the home page to continue your journey.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => {
            window.location.assign('/')
          }}
        >
          Back to home
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            window.location.assign('/shop')
          }}
        >
          Browse products
        </Button>
      </div>
    </div>
  )
}
