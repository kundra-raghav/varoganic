import type { Product } from '@/types/product'

const SITE_NAME = 'Varoganic Store'
const SITE_URL = 'https://varoganic.shop'
const DEFAULT_DESCRIPTION =
  'Organic, dermatologist-backed rituals from the Western Ghats. Discover cleansers, serums, and balms crafted for Indian skin.'
const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80'

export type OpenGraphInput = {
  readonly title?: string
  readonly description?: string
  readonly image?: string
  readonly url?: string
  readonly type?: 'website' | 'product' | 'article'
}

export type OpenGraphMeta = Required<OpenGraphInput> & { readonly siteName: string }

export type SeoPayload = {
  readonly title?: string
  readonly description?: string
  readonly path?: string
  readonly canonical?: string
  readonly image?: string
  readonly noindex?: boolean
  readonly openGraph?: OpenGraphInput
}

export type ProductStructuredDataInput = {
  readonly product: Product
  readonly url: string
  readonly images?: Array<string>
  readonly priceCurrency?: string
}

/**
 * Normalise page titles to include brand attribution.
 */
export const buildPageTitle = (title?: string): string => {
  if (!title) {
    return `${SITE_NAME} · Soil-to-skin skincare rituals`
  }
  if (title.includes(SITE_NAME)) {
    return title
  }
  return `${title} · ${SITE_NAME}`
}

export const buildMetaDescription = (description?: string): string => {
  const trimmed = description?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_DESCRIPTION
}

export const buildCanonicalUrl = (path: string): string => {
  if (!path) {
    return SITE_URL
  }
  const normalised = path.startsWith('http') ? path : `${SITE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  return normalised.replace(/(?<!:)\/\//g, '/').replace(':/', '://')
}

export const buildRobotsValue = (noindex = false): string => (noindex ? 'noindex, nofollow' : 'index, follow')

export const buildOpenGraphMeta = ({
  title,
  description,
  image,
  url,
  type = 'website',
}: OpenGraphInput, canonical?: string): OpenGraphMeta => ({
  title: title ?? buildPageTitle(),
  description: buildMetaDescription(description),
  image: image ?? DEFAULT_OG_IMAGE,
  url: url ?? canonical ?? SITE_URL,
  type,
  siteName: SITE_NAME,
})

export const normaliseSeoPayload = ({
  title,
  description,
  path,
  canonical,
  image,
  noindex,
  openGraph,
}: SeoPayload): {
  readonly title: string
  readonly description: string
  readonly canonical: string
  readonly robots: string
  readonly openGraph: OpenGraphMeta
} => {
  const resolvedCanonical = buildCanonicalUrl(canonical ?? path ?? '')
  const resolvedTitle = buildPageTitle(title)
  const resolvedDescription = buildMetaDescription(description)
  const og = buildOpenGraphMeta(
    {
      ...openGraph,
      title: openGraph?.title ?? resolvedTitle,
      description: openGraph?.description ?? resolvedDescription,
      image: openGraph?.image ?? image,
      url: openGraph?.url ?? resolvedCanonical,
    },
    resolvedCanonical,
  )

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    canonical: resolvedCanonical,
    robots: buildRobotsValue(noindex),
    openGraph: og,
  }
}

export const buildProductStructuredData = ({
  product,
  url,
  images,
  priceCurrency = 'INR',
}: ProductStructuredDataInput): Record<string, unknown> => {
  const gallery = images?.length ? images : [product.imageSrc]

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: buildMetaDescription(product.description),
    sku: product.id,
    image: gallery,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency,
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

export const seoDefaults = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  ogImage: DEFAULT_OG_IMAGE,
}
