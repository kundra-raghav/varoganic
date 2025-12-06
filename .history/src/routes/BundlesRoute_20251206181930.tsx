import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Fragment, useMemo, useState, type ReactElement } from 'react'

import { Accordion, AccordionItem } from '@/components/common/Accordion'
import { Button } from '@/components/common/Button'
import {
  AnimatedList,
  AnimatedSection,
  PageContainer,
  PageHero,
  SectionHeader,
  StatGrid,
  type Stat,
} from '@/components/layout/PageSections'
import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { SEO } from '@/components/layout/SEO'
import { PRODUCTS } from '@/data/products'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { formatCurrency } from '@/lib/formatters'

import type { Product } from '@/types/product'

type BundleDefinition = {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly excerpt: string
  readonly ritual: string
  readonly focus: string
  readonly image: string
  readonly productIds: Array<string>
  readonly perks: Array<string>
}

const bundleDefinitions: Array<BundleDefinition> = [
  {
    id: 'clarity-ritual',
    title: 'Clarify & Calm Ritual',
    subtitle: 'Neem bar + Hydrating Gel',
    excerpt: 'A two-step balancing duo that purifies without stripping and recharges moisture reservoirs.',
    ritual: 'Morning shower + post-cleanse hydration',
    focus: 'Breakout-prone, urban skin needing gentle daily resetting.',
    image: 'https://vorganic.shop/Gemini.png',
    productIds: ['soap-neem', 'gel-hydrating'],
    perks: ['Tea tree + neem microbiome balancing', '12-hour hydration layer', 'Cooling gel texture for humid days'],
  },
  {
    id: 'dew-on-demand',
    title: 'Dew On Demand Set',
    subtitle: 'Rose Mist + Glow Elixir',
    excerpt: 'A mist-and-elixir pairing that infuses antioxidants, revives tired complexions, and delivers moonlit luminosity.',
    ritual: 'Afternoon refresh spritz + night elixir seal',
    focus: 'Dull, undernourished skin needing radiance without oiliness.',
    image: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?auto=format&fit=crop&w=900&q=80',
    productIds: ['mist-rose', 'elixir-glow'],
    perks: ['Ultra-fine rose hydrosol cloud', 'Ceramide-rich night oil', 'Layer-friendly and pillow-safe finish'],
  },
  {
    id: 'bright-weekend',
    title: 'Weekend Brightening Edit',
    subtitle: 'Detan Bar + Ubtan Mask',
    excerpt: 'Exfoliant-meets-mask duo to reset tone, clear congestion, and prep skin for events.',
    ritual: 'Friday exfoliation + Sunday ubtan polish',
    focus: 'Uneven tone, dark spots, post-sun dullness.',
    image: 'https://images.unsplash.com/photo-1496483648148-47c686dc86a8?auto=format&fit=crop&w=900&q=80',
    productIds: ['soap-detan', 'pack-ubtan'],
    perks: ['Coffee + amba haldi resurfacing', 'Licorice-powered brightness', 'Visible glow within 2 uses'],
  },
]

type Bundle = BundleDefinition & {
  readonly products: Array<Product>
  readonly price: number
  readonly mrp: number
  readonly savingsPercent: number
}

const buildBundles = (): Array<Bundle> => {
  return bundleDefinitions
    .map((bundle) => {
      const products = bundle.productIds
        .map((id) => PRODUCTS.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product))

      if (products.length === 0) {
        return null
      }

      const mrp = products.reduce((total, product) => total + product.mrp, 0)
      const price = Math.round(products.reduce((total, product) => total + product.price, 0) * 0.92)
      const savingsPercent = Math.round(((mrp - price) / mrp) * 100)

      return {
        ...bundle,
        products,
        price,
        mrp,
        savingsPercent,
      }
    })
    .filter((bundle): bundle is Bundle => Boolean(bundle))
}

const bundleStats: Array<Stat> = [
  { label: 'Average savings', value: '12-18%', description: 'Automatic bundle pricing, no codes needed.' },
  { label: 'Routine time saved', value: '7 min', description: 'Pre-curated steps across morning & night.' },
  { label: 'Customer approval', value: '92%', description: 'Community members who reordered within 60 days.' },
  { label: 'Refill compatible', value: '100%', description: 'Every bundle ships with refill path guidance.' },
]

const valueProps = [
  {
    title: 'Strategies for your climate',
    copy: 'Each stack mixes textures made to handle Indian humidity, hard water, and polluted air — no guesswork or endless layering required.',
  },
  {
    title: 'Dermatologist approved choreography',
    copy: 'We choreograph cleansing-to-sealing steps so actives never clash. Just follow the order card and watch your ritual streamline itself.',
  },
  {
    title: 'Refill-first mindset',
    copy: 'Keep the glass, replace the formula. Bundles ship with compostable refill pods so you reload without the landfill guilt.',
  },
]

const shippingFAQs = [
  {
    value: 'shipping',
    title: 'How fast do bundles ship?',
    body: 'Bundles leave our Delhi micro-warehouse within 24 hours. Metro deliveries arrive in 2-3 days, while other regions land within 5 working days.',
  },
  {
    value: 'mix-match',
    title: 'Can I customise bundles?',
    body: 'Yes! Once you add a bundle to cart you can swap shades or add-ons. We keep savings intact as long as two ritual steps stay in the stack.',
  },
  {
    value: 'refills',
    title: 'Do bundles include refills?',
    body: 'Launch bundles ship with a refill voucher. You can redeem it within 60 days for 15% off on your first refill purchase.',
  },
]

const BenefitPill = ({ label }: { readonly label: string }): ReactElement => (
  <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
    {label}
  </span>
)

const BundleCard = ({ bundle, index }: { readonly bundle: Bundle; readonly index: number }): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  const body = (
    <article className="shadow-card/40 flex h-full flex-col gap-4 rounded-3xl border border-lines bg-paper/95 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Stack {index + 1}</p>
          <h3 className="mt-1 font-heading text-xl text-ink">{bundle.title}</h3>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">Save {bundle.savingsPercent}%</span>
      </div>
      <p className="text-sm text-body">{bundle.excerpt}</p>
      <div className="flex flex-wrap gap-2">
        {bundle.perks.map((perk) => (
          <BenefitPill key={perk} label={perk} />
        ))}
      </div>
      <div className="mt-auto flex items-baseline gap-3 text-sm">
        <span className="text-lg font-semibold text-primary">{formatCurrency(bundle.price, 'INR')}</span>
        <span className="text-muted line-through">{formatCurrency(bundle.mrp, 'INR')}</span>
      </div>
    </article>
  )

  if (prefersReducedMotion) {
    return body
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {body}
    </motion.article>
  )
}

const BundleSpotlight = ({ bundle }: { readonly bundle: Bundle }): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]">
      <div className="relative overflow-hidden rounded-3xl border border-lines bg-paper shadow-card">
        <ResponsiveImage
          src={bundle.image}
          alt={bundle.title}
          width={960}
          height={1200}
          srcWidths={[480, 720, 960]}
          sizes="(min-width: 1024px) 480px, 100vw"
          className="aspect-[4/5] w-full object-cover"
          aspectRatio="4 / 5"
        />
        {!prefersReducedMotion ? (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0.2, y: 0 }}
            animate={{ opacity: 0.5, y: -12 }}
            transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
            className="pointer-events-none absolute -left-10 top-10 hidden size-48 rounded-full bg-primary/20 blur-3xl lg:block"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper via-paper/70 to-transparent p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Ritual choreography</p>
          <h3 className="mt-2 font-heading text-xl text-ink">{bundle.subtitle}</h3>
          <p className="mt-3 text-sm text-body">{bundle.ritual}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6 text-primary shadow-inner">
          <p className="text-xs uppercase tracking-[0.4em] text-primary/70">Focus</p>
          <p className="mt-2 text-sm text-primary">{bundle.focus}</p>
        </div>
        <div className="space-y-3">
          {bundle.products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-2xl border border-lines/70 bg-paper px-4 py-3 text-sm"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {product.category.slice(0, 2).toUpperCase()}
              </span>
              <div className="flex flex-col">
                <span className="font-medium text-ink">{product.name}</span>
                <span className="text-xs text-muted">{product.goals.slice(0, 2).join(' • ')}</span>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            window.location.assign(`/cart?bundle=${bundle.id}`)
          }}
        >
          Add bundle to cart
        </Button>
      </div>
    </div>
  )
}

const ValueCard = ({ title, copy }: (typeof valueProps)[number]): ReactElement => {
  return (
    <div className="shadow-card/30 rounded-3xl border border-lines/70 bg-paper p-6">
      <h3 className="font-heading text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{copy}</p>
    </div>
  )
}

/**
 * Bundle landing with interactive spotlight and FAQ.
 */
const BundlesRouteComponent = (): ReactElement => {
  const bundles = useMemo(buildBundles, [])
  const [activeId, setActiveId] = useState<string>(() => bundles[0]?.id ?? '')

  if (bundles.length === 0) {
    return (
      <Fragment>
        <SEO
          title="Curated bundles — effortless ritual stacks"
          description="Our ritual bundles are infusing as we speak. Check back soon for choreographed routines."
          path="/collections/bundles"
        />
        <PageContainer>
          <PageHero
            eyebrow="Ritual stacks"
            title="Bundles brewing soon"
            description="We&apos;re rebalancing inventory and will reopen curated bundles shortly. In the meantime, customise your own ritual from the shop."
            actions={[{ label: 'Explore products', href: '/shop' }]}
          />
        </PageContainer>
      </Fragment>
    )
  }

  const activeBundle = bundles.find((bundle) => bundle.id === activeId) ?? bundles[0]

  return (
    <Fragment>
      <SEO
        title="Curated bundles — effortless ritual stacks"
        description="Meet ready-made Varoganic bundles that align cleansing, treatment, and sealing steps. Save time, save coin, keep it refillable."
        path="/collections/bundles"
      />
      <PageContainer>
        <PageHero
          eyebrow="Ritual stacks"
          title="Bundles built like playlists for your skin"
          description="We studied thousands of routines to craft three-step choreographies that level up your ritual while trimming decision fatigue."
          actions={[
            { label: 'Shop newest bundle', href: '#spotlight' },
            { label: 'View all products', href: '/shop', variant: 'secondary' },
          ]}
          highlights={[
            { label: 'Avg. savings', value: '₹540 per bundle' },
            { label: 'Routine time', value: '3 steps • 4 minutes' },
          ]}
          media={{
            src: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
            alt: 'Skincare bundle arranged with natural botanicals',
          }}
        />

        <AnimatedSection>
          <SectionHeader
            eyebrow="Why bundles"
            title="Formulated to play well together"
            description="Each stack is engineered to layer without pilling, keep pH balanced, and deliver visible change within the first fortnight."
          />
          <StatGrid stats={bundleStats} />
        </AnimatedSection>

        <div id="spotlight">
          <AnimatedSection variant="split">
            <div className="space-y-6">
              <SectionHeader
                eyebrow="Pick your playlist"
                title="Choose the ritual stack that fits your current season"
                description="Tap the cards to preview savings, choreography, and the skin goals they fast-track."
              />
              <div className="grid gap-3">
              <LayoutGroup>
                {bundles.map((bundle, index) => {
                  const isActive = bundle.id === activeId
                  return (
                    <button
                      key={bundle.id}
                      type="button"
                      onClick={() => {
                        setActiveId(bundle.id)
                      }}
                      className="relative flex items-center justify-between gap-4 rounded-2xl border border-lines/70 bg-paper px-4 py-3 text-left transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">Stack {index + 1}</p>
                        <p className="font-medium text-ink">{bundle.title}</p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Save {bundle.savingsPercent}%</span>
                      <AnimatePresence>
                        {isActive ? (
                          <motion.span
                            layoutId="bundle-selector"
                            className="absolute inset-0 -z-10 rounded-2xl border border-primary/40 bg-primary/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                          />
                        ) : null}
                      </AnimatePresence>
                    </button>
                  )
                })}
              </LayoutGroup>
            </div>
          </div>
          <BundleSpotlight bundle={activeBundle} />
          </AnimatedSection>
        </div>

        <AnimatedSection>
          <SectionHeader
            eyebrow="All bundles"
            title="Explore the full ritual library"
            description="Hover to see the perks, savings, and best times to use each bundle."
          />
          <AnimatedList items={bundles} renderItem={(item, index) => <BundleCard bundle={item} index={index} />} />
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Play nice"
            title="Three reasons our bundles stay in rotation"
            description="Real routines, less guesswork."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {valueProps.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="FAQ"
            title="Bundle know-how"
            description="Everything you need before you hit add-to-cart."
          />
          <Accordion defaultValue="shipping">
            {shippingFAQs.map((faq) => (
              <AccordionItem key={faq.value} value={faq.value} title={faq.title}>
                {faq.body}
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </PageContainer>
    </Fragment>
  )
}

export default BundlesRouteComponent
export const BundlesRoute = BundlesRouteComponent
