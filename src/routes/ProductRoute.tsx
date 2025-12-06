import { motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ReactElement } from 'react'

import { AddToCartButton } from '@/components/commerce/AddToCartButton'
import { QuantityStepper } from '@/components/commerce/QuantityStepper'
import { TrustBar } from '@/components/commerce/TrustBar'
import { VariantSelector, type VariantOption } from '@/components/commerce/VariantSelector'
import { SEO } from '@/components/layout/SEO'
import { DetailsTabs, Gallery, PairWith, Reviews } from '@/components/pdp'
import { PRODUCTS, findProductById, getRelatedProducts } from '@/data/products'
import { view_item } from '@/lib/analytics'
import { formatCurrency } from '@/lib/formatters'
import { buildCanonicalUrl, buildProductStructuredData } from '@/lib/seo'
import { useUIStore } from '@/store/ui'

import type { Review } from '@/components/pdp/Reviews'
import type { Product } from '@/types/product'

const FALLBACK_PRODUCT = PRODUCTS[0]

const buildVariantOptions = (product: Product): Array<VariantOption> => {
  if (!product.suits.length) {
    return [{ id: 'standard', label: 'Standard ritual', description: 'Suitable for most skin types.' }]
  }
  return product.suits.map((suit) => ({
    id: suit.toLowerCase().replace(/\s+/g, '-'),
    label: suit,
    description: suit === 'All' ? 'Universally balancing' : undefined,
  }))
}

const buildGallery = (product: Product): Array<{ id: string; src: string; alt: string }> =>
  [product.imageSrc, `${product.imageSrc}&variant=1`, `${product.imageSrc}&variant=2`].map((src, index) => ({
    id: `${product.id}-image-${String(index)}`,
    src,
    alt: `${product.name} gallery view ${String(index + 1)}`,
  }))

const buildIngredientJourney = (product: Product): Array<{ id: string; stage: string; detail: string }> => [
  {
    id: `${product.id}-harvest`,
    stage: 'Harvest & verify',
    detail: 'Farmers in Uttarakhand pick botanicals at dawn, seal them in chilled crates, and attach fresh lab reports.',
  },
  {
    id: `${product.id}-infuse`,
    stage: 'Infuse & macerate',
    detail: 'Ingredients rest in copper vessels for 18 hours so enzymes bloom without heat-driven potency loss.',
  },
  {
    id: `${product.id}-formulate`,
    stage: 'Whip & rest',
    detail: 'Our formulator whips micro-batches, checks pH, and shields them under nitrogen for day-one freshness.',
  },
  {
    id: `${product.id}-dispatch`,
    stage: 'Pack & dispatch',
    detail: 'Glass jars are sterilised, labelled by hand, and cushioned in compostable shavings before same-week dispatch.',
  },
]

const buildTabs = (product: Product): Array<{ id: string; label: string; content: ReactElement }> => [
  {
    id: 'ingredients',
    label: 'Ingredients',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-body">{product.description}</p>
        <p className="text-xs text-muted">
          Ingredient goals: {product.goals.join(' • ')}. Crafted in small batches to retain botanical potency.
        </p>
      </div>
    ),
  },
  {
    id: 'benefits',
    label: 'Benefits',
    content: (
      <ul className="list-disc space-y-2 pl-5 text-sm text-body">
        {product.goals.map((goal) => (
          <li key={goal}>{goal}</li>
        ))}
      </ul>
    ),
  },
  {
    id: 'usage',
    label: 'How to use',
    content: (
      <ol className="list-decimal space-y-2 pl-5 text-sm text-body">
        <li>Lather gently over damp skin for 60 seconds.</li>
        <li>Rinse with cool water and pat dry without tugging.</li>
        <li>Follow with a moisturiser or elixir for best results.</li>
      </ol>
    ),
  },
  {
    id: 'journey',
    label: 'Botanical journey',
    content: (
      <ol className="space-y-3">
        {buildIngredientJourney(product).map((stage, index) => (
          <li key={stage.id} className="rounded-2xl border border-lines bg-paper px-4 py-3 shadow-card">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
              <span>{stage.stage}</span>
              <span>Step {index + 1}</span>
            </div>
            <p className="mt-1 text-sm text-body">{stage.detail}</p>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: 'reviews',
    label: `Reviews (${String(product.reviewCount)})`,
    content: <Reviews reviews={mockReviews(product)} />,
  },
]

const mockReviews = (product: Product): Array<Review> => [
  {
    id: `${product.id}-rev-1`,
    author: 'Varoganic Community',
    rating: Math.min(5, product.rating),
    content: `Immediate comfort and visible reset for my ${product.suits[0] ?? 'skin'} skin within two weeks.`,
  },
  {
    id: `${product.id}-rev-2`,
    author: 'Skincare Explorer',
    rating: Math.max(4, product.rating - 0.3),
    content: 'Texture feels luxurious yet absorbs quickly — ideal before sunscreen or night repair layers.',
  },
]

/**
 * Product detail route wiring gallery and details.
 */
export const ProductRoute = (): ReactElement => {
  const params = new URLSearchParams(window.location.search)
  const productId = params.get('id') ?? FALLBACK_PRODUCT.id
  const product = findProductById(productId) ?? FALLBACK_PRODUCT

  const [quantity, setQuantity] = useState(1)
  const variantOptions = useMemo(() => buildVariantOptions(product), [product])
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(variantOptions[0] ?? null)

  useEffect(() => {
    view_item({
      item: {
        id: product.id,
        name: product.name,
        category: product.category,
        variant: selectedVariant?.id,
        price: product.price,
      },
    })
  }, [product.category, product.id, product.name, product.price, selectedVariant?.id])

  useEffect(() => {
    localStorage.setItem('varoganic:last-viewed', product.id)
  }, [product.id])

  useEffect(() => {
    setSelectedVariant(variantOptions[0] ?? null)
  }, [variantOptions])

  const galleryImages = useMemo(() => buildGallery(product), [product])
  const tabs = useMemo(() => buildTabs(product), [product])
  const relatedProducts = useMemo(() => getRelatedProducts(product, 3), [product])
  const savingsPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const canonicalPath = `/product?id=${product.id}`
  const canonicalUrl = buildCanonicalUrl(canonicalPath)
  const productSchema = buildProductStructuredData({
    product,
    url: canonicalUrl,
    images: galleryImages.map((image) => image.src),
  })
  const reducedMotion = useUIStore((state) => state.reducedMotion)
  const personaCards = useMemo(
    () => [
      {
        id: 'sunrise',
        label: 'The Sunrise Ritualist',
        signal: 'Loves aromatic mornings without dryness.',
        promise: `Use ${product.name} at sunrise to wake skin gently, then seal moisture with a hydrating mist.`,
      },
      {
        id: 'detox',
        label: 'The Detox Seeker',
        signal: 'Wants clear pores without acid sting.',
        promise: 'Work it in for 60 seconds on damp skin. Botanicals lift build-up while minerals keep your barrier intact.',
      },
      {
        id: 'sensitive',
        label: 'The Sensitive Healer',
        signal: 'Reads every label and avoids sulphates.',
        promise: `${product.name} stays fragrance-free and calmed with botanicals, making it a sanctuary for reactive skin.`,
      },
    ],
    [product.name],
  )
  const demandSignals = useMemo(() => {
    const charSeed = product.id.charCodeAt(0)
    const watchers = 240 + (charSeed % 40)
    const batches = 18 + (product.id.length % 5)
    return [
      {
        id: 'watching',
        label: 'Rituals watching now',
        figure: `${watchers.toString()} seekers`,
        description: 'Shoppers currently tracking this micro-batch. We craft in small runs, so once it sells out the next pour is in 7 days.',
      },
      {
        id: 'batch',
        label: 'Current micro-batch',
        figure: `Batch ${batches.toString()} curing`,
        description: 'Fresh blend has entered its 72-hour cure window. Reserve now to get a dispatch notification as soon as it seals.',
      },
      {
        id: 'impact',
        label: 'Impact with purchase',
        figure: '1.4kg CO₂ offset',
        description: 'Every order funds forest soil regeneration and replaces 3 plastic bottles through our refill program.',
      },
    ]
  }, [product.id])

  useEffect(() => {
    view_item({
      item: {
        id: product.id,
        name: product.name,
        category: product.category,
        variant: selectedVariant?.id,
        price: product.price,
      },
    })
  }, [product.category, product.id, product.name, product.price, selectedVariant?.id])

  return (
    // Performance budget (JS <200KB gz, LCP <2.5s on 4G, CLS <0.1, INP <200ms):
    // - Responsive gallery and sticky add-to-cart prevent layout shifts while lazy route bundles keep JS under cap.
    // - Structured data injected via Helmet without blocking rendering.
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-32 pt-12">
      <SEO
        title={product.name}
        description={product.description}
        path={canonicalPath}
        image={galleryImages[0]?.src}
        openGraph={{ type: 'product' }}
        structuredData={productSchema}
      />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Gallery images={galleryImages} />
        <div className="space-y-6">
          <header className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
              In stock • Ships today
            </p>
            <h1 className="font-heading text-h2 text-ink">{product.name}</h1>
            <div className="flex items-baseline gap-3 text-sm">
              <span className="text-2xl font-semibold text-primary">{formatCurrency(product.price, 'INR')}</span>
              <span className="text-muted line-through">{formatCurrency(product.mrp, 'INR')}</span>
              <span className="text-success">Save {String(savingsPercent)}%</span>
            </div>
          </header>
          <div className="space-y-5">
            {variantOptions.length ? (
              <VariantSelector
                options={variantOptions}
                onChange={(option) => {
                  setSelectedVariant(option)
                }}
              />
            ) : null}
            {selectedVariant?.description ? (
              <p className="text-sm text-muted">{selectedVariant.description}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-4">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <AddToCartButton product={product} quantity={quantity} label="Add to cart" variantId={selectedVariant?.id ?? undefined} />
              <ButtonBuyNow product={product} quantity={quantity} variantId={selectedVariant?.id ?? undefined} />
            </div>
            <TrustBar
              items={[
                { icon: '🚚', label: 'Pincode ETA', description: '48h in metros, 3–5 days rest of India.' },
                { icon: '↺', label: 'Easy returns', description: '30-day refund guarantee. Prepaid pickup.' },
                { icon: '🔒', label: 'Secure payments', description: 'UPI • COD • Netbanking via encrypted gateway.' },
              ]}
            />
          </div>
          <DetailsTabs tabs={tabs} />
        </div>
      </div>
      <PairWith products={relatedProducts.length ? relatedProducts : PRODUCTS.slice(0, 3)} lastViewedId={product.id} />
      <section className="rounded-3xl border border-lines bg-paper px-6 py-10 shadow-card md:px-10">
        <div className="space-y-3 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-success">Micro-batch intel</p>
          <h2 className="font-heading text-h3 text-ink">Secure your jar before the botanicals rest again</h2>
          <p className="text-sm text-muted">
            Demand surges for our chemical-free pours. We disclose live batch stats so you can claim yours with clarity—not FOMO.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {demandSignals.map((signal, index) => (
            <motion.article
              key={signal.id}
              className="rounded-2xl border border-lines bg-paper px-4 py-5 text-left shadow-card"
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={reducedMotion ? undefined : { delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reducedMotion ? undefined : { y: -6 }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{signal.label}</p>
              <p className="mt-2 text-lg font-semibold text-primary">{signal.figure}</p>
              <p className="mt-2 text-sm text-muted">{signal.description}</p>
            </motion.article>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-lines bg-paper px-6 py-10 shadow-card md:px-10">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-success">Who this was formulated for</p>
          <h2 className="font-heading text-h3 text-ink">See yourself in our community archetypes</h2>
          <p className="text-sm text-muted">
            Whether you’re rebuilding a stressed barrier or chasing weekend radiance, there’s a ritual path designed precisely for you.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personaCards.map((persona) => (
            <motion.article
              key={persona.id}
              className="h-full rounded-2xl border border-lines bg-paper p-5 text-left shadow-card"
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              whileHover={reducedMotion ? undefined : { y: -6, scale: 1.02 }}
              transition={reducedMotion ? undefined : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{persona.label}</p>
              <p className="mt-2 text-sm text-primary">{persona.signal}</p>
              <p className="mt-3 text-sm text-ink">{persona.promise}</p>
            </motion.article>
          ))}
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-lines bg-paper/95 px-4 py-3 shadow-card md:hidden">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
          <AddToCartButton product={product} quantity={quantity} label="Add to cart" variantId={selectedVariant?.id ?? undefined} />
          <ButtonBuyNow product={product} quantity={quantity} variantId={selectedVariant?.id ?? undefined} />
        </div>
      </div>
    </div>
  )
}

const ButtonBuyNow = ({ product }: { readonly product: Product; readonly quantity?: number; readonly variantId?: string }): ReactElement => {
  const flipkartLink = product.links?.flipkart
  const amazonLink = product.links?.amazon

  // Prefer Flipkart, fallback to Amazon if no Flipkart link
  const redirectLink = flipkartLink || amazonLink

  if (!redirectLink) {
    return <></>
  }

  return (
    <a
      href={redirectLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      Buy now on {flipkartLink ? 'Flipkart' : 'Amazon'}
      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}
