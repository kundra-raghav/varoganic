import { Fragment, type ReactElement, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'

import { normaliseSeoPayload, type SeoPayload } from '@/lib/seo'

export type SEOProps = SeoPayload & {
  readonly structuredData?: Array<Record<string, unknown>> | Record<string, unknown>
  readonly children?: ReactNode
}

/**
 * Centralised SEO component encapsulating Helmet usage with consistent defaults.
 */
export const SEO = ({ structuredData, children, ...rest }: SEOProps): ReactElement => {
  const payload = normaliseSeoPayload(rest)
  const schemas = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []

  return (
    <>
      <Helmet>
        <title>{payload.title}</title>
        <meta name="description" content={payload.description} />
        <meta name="robots" content={payload.robots} />
        <link rel="canonical" href={payload.canonical} />

        <meta property="og:title" content={payload.openGraph.title} />
        <meta property="og:description" content={payload.openGraph.description} />
        <meta property="og:image" content={payload.openGraph.image} />
        <meta property="og:url" content={payload.openGraph.url} />
        <meta property="og:site_name" content={payload.openGraph.siteName} />
        <meta property="og:type" content={payload.openGraph.type} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={payload.openGraph.title} />
        <meta name="twitter:description" content={payload.openGraph.description} />
        <meta name="twitter:image" content={payload.openGraph.image} />

        {schemas.map((schema, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>
      {children ? <Fragment>{children}</Fragment> : null}
    </>
  )
}
