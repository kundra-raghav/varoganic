import { SEO } from '@/components/layout/SEO'

import type { ReactElement } from 'react'

/**
 * Customer account dashboard route.
 */
export const AccountRoute = (): ReactElement => {
  return (
    // Performance budget (JS <200KB gz, LCP <2.5s on 4G, CLS <0.1, INP <200ms):
    // - Minimal placeholder keeps bundle impact negligible until account features are introduced.
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-12 text-center">
      <SEO title="My account" description="Access order history and refill your favourite rituals." path="/account" noindex />
      <h1 className="font-heading text-h2 text-ink">Account</h1>
      <p className="text-sm text-muted">
        Account management is coming soon. Meanwhile, reach us at care@varoganic.shop for order support.
      </p>
    </div>
  )
}
