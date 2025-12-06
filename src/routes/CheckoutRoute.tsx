import { motion, type TargetAndTransition, type Transition } from 'framer-motion'
import { useEffect, useMemo, useState, type ReactElement } from 'react'

import { ProductCard } from '@/components/commerce/ProductCard'
import { Button } from '@/components/common/Button'
import { SEO } from '@/components/layout/SEO'
import { PRODUCTS, findProductById, getRelatedProducts } from '@/data/products'
import { begin_checkout } from '@/lib/analytics'
import { launchCheckout, requestCheckoutToken } from '@/lib/checkout'
import { formatCurrency } from '@/lib/formatters'
import { useCartStore, type CartItem } from '@/store/cart'
import { useUIStore } from '@/store/ui'

import type { Product } from '@/types/product'

type TimelineEntry = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly meta: string
}

type PromiseCard = {
  readonly id: string
  readonly title: string
  readonly description: string
}

type FAQEntry = {
  readonly id: string
  readonly question: string
  readonly answer: string
}

const DELIVERY_TIMELINE: Array<TimelineEntry> = [
  {
    id: 'confirmation',
    title: 'Confirm ritual',
    meta: 'Instant',
    description: 'Lock in your chosen ritual and we trigger a freshness check at our climate-stable facility.',
  },
  {
    id: 'prep',
    title: 'Botanical prep',
    meta: '4–6 hours',
    description: 'Herb concentrates are bottled to order, sealed with nitrogen flush, and hand-packed with recycled shavings.',
  },
  {
    id: 'dispatch',
    title: 'Dispatch & tracking',
    meta: 'Day 1',
    description: 'Receive live tracking via SMS and WhatsApp once the parcel leaves our Bengaluru studio.',
  },
  {
    id: 'delight',
    title: 'Delivered & supported',
    meta: 'Day 2–5',
    description: 'We follow up with personalised layering tips and remain on standby for ingredient guidance.',
  },
]

const CHECKOUT_PROMISES: Array<PromiseCard> = [
  {
    id: 'payments',
    title: 'Trusted payments',
    description: 'UPI, netbanking, credit/debit cards, and COD routed through 256-bit encrypted gateways.',
  },
  {
    id: 'carbon',
    title: 'Carbon-considered',
    description: 'We offset every dispatch and consolidate routes to cut transport emissions by up to 38%.',
  },
  {
    id: 'support',
    title: '24/7 ritual experts',
    description: 'Licensed skin coaches respond within 30 minutes over chat for any pre or post-order question.',
  },
  {
    id: 'packaging',
    title: 'Planet-kind packaging',
    description: 'Compostable wraps, soy ink, and reusable glass ensure your ritual arrives light on the planet.',
  },
]

const FAQS: Array<FAQEntry> = [
  {
    id: 'cod',
    question: 'Can I still pay by Cash on Delivery?',
    answer: 'Absolutely. COD remains available for orders up to ₹4,000. You can switch payment mode on the final step without losing your cart.',
  },
  {
    id: 'shipping',
    question: 'How fast will my order arrive?',
    answer: 'Metro cities see delivery in 48 hours. Tier-2 regions average 3–5 business days. You will receive stage-wise alerts as the parcel moves.',
  },
  {
    id: 'returns',
    question: 'What if it doesn’t suit my skin?',
    answer: 'We offer a 30-day comfort guarantee. If the ritual feels off, request a return and our team organises a free doorstep pickup.',
  },
]

const paymentMethods = ['UPI', 'Visa / Mastercard', 'Rupay', 'Netbanking', 'Cash on Delivery', 'Wallets']

/**
 * Immersive checkout landing that reassures before launching payment sheet.
 */
export const CheckoutRoute = (): ReactElement => {
  const { items, subtotal, savings } = useCartStore()
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const reducedMotion = useUIStore((state) => state.reducedMotion)
  const [spotlight, setSpotlight] = useState<Product | null>(null)
  const [intentQuantity, setIntentQuantity] = useState<number>(1)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const productFromQuery = searchParams.get('product')
    const quantityFromQuery = Number.parseInt(searchParams.get('qty') ?? '1', 10)
    const normalizedQuantity = Number.isFinite(quantityFromQuery) && quantityFromQuery > 0 ? Math.min(quantityFromQuery, 10) : 1

    if (productFromQuery) {
      const product = findProductById(productFromQuery)
      if (product) {
        setSpotlight(product)
        setIntentQuantity(normalizedQuantity)
        return
      }
    }

    const lastViewedId = localStorage.getItem('varoganic:last-viewed')
    if (lastViewedId) {
      const fallbackProduct = findProductById(lastViewedId)
      if (fallbackProduct) {
        setSpotlight(fallbackProduct)
        setIntentQuantity(normalizedQuantity)
      }
    }
  }, [])

  const spotlightLineItem: CartItem | null = useMemo(() => {
    if (!spotlight) {
      return null
    }
    return {
      id: spotlight.id,
      name: spotlight.name,
      price: spotlight.price,
      mrp: spotlight.mrp,
      imageSrc: spotlight.imageSrc,
      imageAlt: spotlight.imageAlt,
      quantity: intentQuantity,
    }
  }, [intentQuantity, spotlight])

  const derivedItems = items.length ? items : spotlightLineItem ? [spotlightLineItem] : []
  const derivedSubtotal = items.length ? subtotal() : derivedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const derivedSavings = items.length ? savings() : derivedItems.reduce((acc, item) => acc + (item.mrp - item.price) * item.quantity, 0)

  const recommendationSeed = spotlight ?? (items.length ? findProductById(items[0]?.id) ?? PRODUCTS[0] : PRODUCTS[0])
  const recommendations = useMemo(() => getRelatedProducts(recommendationSeed, 3), [recommendationSeed])
  const curatedRecommendations = recommendations.length
    ? recommendations
    : PRODUCTS.filter((product) => product.id !== recommendationSeed.id).slice(0, 3)

  useEffect(() => {
    if (message === 'Select at least one ritual to continue.' && derivedItems.length) {
      setMessage(null)
    }
  }, [derivedItems.length, message])

  const handleCheckout = async (): Promise<void> => {
    try {
      setSubmitting(true)
      setMessage(null)

      const analyticsItems = derivedItems.map((item, index) => {
        const product = findProductById(item.id)
        return {
          id: item.id,
          name: item.name,
          category: product?.category,
          price: item.price,
          quantity: item.quantity,
          index,
        }
      })

      if (analyticsItems.length) {
        begin_checkout({ items: analyticsItems, value: derivedSubtotal, currency: 'INR' })
      }

      const response = await requestCheckoutToken()
      await launchCheckout(null, response.token, `${window.location.origin}/thank-you`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start checkout. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const shimmerAnimate = useMemo<TargetAndTransition | undefined>(() => {
    if (reducedMotion) {
      return undefined
    }
    return {
      scale: [1, 1.05, 1],
      opacity: [0.4, 0.65, 0.4],
      rotate: [0, 6, -4, 0],
    }
  }, [reducedMotion])

  const shimmerTransition = useMemo<Transition | undefined>(() => {
    if (reducedMotion) {
      return undefined
    }
    return {
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }, [reducedMotion])

  return (
    // Performance budget (JS <200KB gz, LCP <2.5s on 4G, CLS <0.1, INP <200ms):
    // - Motion effects respect reduced-motion preferences and reuse existing product data to avoid extra fetches.
    // - Checkout token request stays deferred until CTA interaction to keep initial render light.
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-12">
      <SEO
        title="Secure checkout"
        description="Complete your Varoganic ritual with encrypted payments, botanical freshness, and doorstep support."
        path="/checkout"
        noindex
      />
      <section className="relative overflow-hidden rounded-3xl border border-lines bg-paper px-6 py-10 shadow-card md:px-12 md:py-14">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-6 size-64 rounded-full bg-primary/10 blur-3xl"
          animate={shimmerAnimate}
          transition={shimmerTransition}
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -right-20 size-72 rounded-full bg-accent/15 blur-3xl"
          animate={shimmerAnimate}
          transition={shimmerTransition}
        />
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reducedMotion ? undefined : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
              Step 3 • Secure checkout
            </span>
            <h1 className="font-heading text-h2 text-ink md:text-h1">Every ritual is hand-packed within hours of your order</h1>
            <p className="max-w-xl text-sm text-muted md:text-base">
              Breeze through payment with safeguarded gateways, freshness tracking, and concierge-level guidance. This page summarises your order so the final payment sheet is all confidence, zero surprises.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  window.location.assign('/cart')
                }}
                variant="secondary"
              >
                Modify items
              </Button>
              <Button
                onClick={() => {
                  window.location.assign('/shop')
                }}
                variant="tertiary"
              >
                Continue exploring
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {paymentMethods.map((method, index) => (
                <motion.span
                  key={method}
                  className="rounded-full border border-lines px-3 py-1"
                  initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={
                    reducedMotion ? undefined : { delay: 0.18 + index * 0.05, duration: 0.45, ease: 'easeOut' }
                  }
                >
                  {method}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.aside
            initial={reducedMotion ? undefined : { opacity: 0, scale: 0.98, y: 18 }}
            animate={reducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={reducedMotion ? undefined : { delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 rounded-2xl border border-lines bg-paper/95 p-6 shadow-card backdrop-blur"
          >
            <header className="space-y-1">
              <h2 className="text-lg font-semibold text-ink">Order overview</h2>
              <p className="text-xs text-muted">Encrypted with 256-bit TLS and verified by Shiprocket.</p>
            </header>
            <div className="space-y-3">
              {derivedItems.length ? (
                derivedItems.map((item) => (
                  <motion.article
                    key={`${item.id}-${String(item.quantity)}`}
                    className="flex items-center gap-3 rounded-2xl border border-lines/70 bg-paper p-3"
                    whileHover={reducedMotion ? undefined : { y: -4 }}
                    transition={reducedMotion ? undefined : { duration: 0.3, ease: 'easeOut' }}
                  >
                    <img src={item.imageSrc} alt={item.imageAlt} className="size-16 rounded-xl object-cover" />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-semibold text-ink">{item.name}</span>
                      <span className="text-xs text-muted">Qty {item.quantity}</span>
                    </div>
                    <div className="text-right text-sm">
                      <span className="font-semibold text-primary">{formatCurrency(item.price * item.quantity, 'INR')}</span>
                      {item.quantity > 1 ? (
                        <p className="text-xs text-muted">{formatCurrency(item.price, 'INR')} each</p>
                      ) : null}
                    </div>
                  </motion.article>
                ))
              ) : (
                <p className="rounded-xl bg-lines/20 px-4 py-6 text-sm text-muted">
                  Add a ritual to your bag or pick one from the recommendations below to begin checkout.
                </p>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(derivedSubtotal, 'INR')}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Savings</span>
                <span>{formatCurrency(derivedSavings, 'INR')}</span>
              </div>
              <div className="flex justify-between text-ink">
                <span>Payable today</span>
                <span className="text-base font-semibold text-primary">{formatCurrency(derivedSubtotal, 'INR')}</span>
              </div>
            </div>
            {message ? <p className="rounded-lg bg-accent/10 px-3 py-2 text-xs text-accent">{message}</p> : null}
            <Button
              onClick={() => {
                if (!derivedItems.length) {
                  setMessage('Select at least one ritual to continue.')
                  return
                }
                void handleCheckout()
              }}
              loading={submitting}
              className="w-full"
            >
              Complete secure checkout
            </Button>
            <p className="text-xs text-muted">Need quick help? Chat with a ritual expert via the bubble on the bottom right once checkout opens.</p>
          </motion.aside>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-lines bg-paper px-6 py-10 shadow-card md:grid-cols-[0.95fr_1.05fr] md:px-12">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">What happens after you confirm</h2>
          <p className="text-sm text-muted">
            We choreograph every step so your ritual reaches you fresh, intact, and with the guidance you need to begin confidently.
          </p>
        </div>
        <ol className="space-y-5">
          {DELIVERY_TIMELINE.map((entry, index) => (
            <motion.li
              key={entry.id}
              className="grid gap-2 rounded-2xl border border-lines bg-paper px-5 py-4 shadow-card"
              initial={reducedMotion ? undefined : { opacity: 0, x: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={reducedMotion ? undefined : { delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
                <span>{entry.meta}</span>
                <span>Step {index + 1}</span>
              </div>
              <h3 className="text-base font-semibold text-ink">{entry.title}</h3>
              <p className="text-sm text-muted">{entry.description}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-4">
            <h2 className="font-heading text-h3 text-ink">Why checkout feels different with Varoganic</h2>
            <p className="text-sm text-muted">
              Rituals are more than products—they are daily anchors. These promises keep your experience elevated from cart to delivery.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {CHECKOUT_PROMISES.map((item, index) => (
              <motion.article
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-lines bg-paper p-5 shadow-card"
                whileHover={reducedMotion ? undefined : { translateY: -6 }}
                transition={
                  reducedMotion ? undefined : { delay: index * 0.05, duration: 0.28, ease: [0.16, 1, 0.3, 1] }
                }
                initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
              >
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 top-1/2 size-32 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl transition-opacity group-hover:opacity-100"
                  animate={shimmerAnimate}
                  transition={shimmerTransition}
                />
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
        <motion.blockquote
          className="relative overflow-hidden rounded-3xl border border-lines bg-paper px-6 py-8 text-center shadow-card md:px-12"
          initial={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={reducedMotion ? undefined : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
            animate={shimmerAnimate}
            transition={shimmerTransition}
          />
          <p className="mx-auto max-w-3xl text-lg text-ink">
            “Varoganic’s checkout was the first time I felt a skincare brand cared past payment. My cleanser arrived chilled, with a handwritten layering guide and WhatsApp check-ins for the first week.”
          </p>
          <footer className="mt-4 text-sm font-semibold text-muted">Aanya, community tester • Bengaluru</footer>
        </motion.blockquote>
      </section>

      <section className="grid gap-5 rounded-3xl border border-lines bg-paper px-6 py-10 shadow-card md:grid-cols-[0.8fr_1.2fr] md:px-12">
        <div className="space-y-3">
          <h2 className="font-heading text-h3 text-ink">Questions before you pay?</h2>
          <p className="text-sm text-muted">We’ve answered the most common ones. Need more? Ping us directly from checkout.</p>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <motion.details
              key={faq.id}
              className="group rounded-2xl border border-lines bg-paper px-5 py-4 shadow-card"
              initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <summary className="cursor-pointer text-sm font-semibold text-ink">
                {faq.question}
              </summary>
              <motion.p
                className="mt-2 text-sm text-muted"
                initial={reducedMotion ? undefined : { opacity: 0, y: 6 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={reducedMotion ? undefined : { duration: 0.3, ease: 'easeOut' }}
              >
                {faq.answer}
              </motion.p>
            </motion.details>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-h3 text-ink">You may also love</h2>
          <p className="text-sm text-muted">Complete your ritual stack with these community-favourite pairings.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {curatedRecommendations.map((product) => (
            <motion.div
              key={product.id}
              initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={reducedMotion ? undefined : { duration: 0.5, ease: 'easeOut' }}
            >
              <ProductCard product={product} lastViewedId={spotlight?.id ?? null} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
