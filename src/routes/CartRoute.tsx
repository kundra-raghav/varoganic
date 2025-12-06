import { useState, type ReactElement, type FormEvent } from 'react'

import { QuantityStepper } from '@/components/commerce/QuantityStepper'
import { Button } from '@/components/common/Button'
import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { SEO } from '@/components/layout/SEO'
import { formatCurrency } from '@/lib/formatters'
import { useCartStore } from '@/store/cart'

/**
 * Shopping cart route summarizing cart state.
 */
export const CartRoute = (): ReactElement => {
  const { items, updateQuantity, removeItem, subtotal, savings } = useCartStore()
  const [coupon, setCoupon] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const handleShopNow = (): void => {
    // Redirect to Flipkart store page or main product listing
    const flipkartStoreUrl = 'https://www.flipkart.com/search?q=varoganic'
    window.open(flipkartStoreUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCoupon = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setMessage(`Coupon ${coupon.toUpperCase()} applied (mock)`)
    setCoupon('')
  }

  if (!items.length) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-12 text-center">
        <SEO title="Your cart" description="Review your Varoganic bag before checkout." path="/cart" noindex />
        <h1 className="font-heading text-h2 text-ink">Your cart is empty</h1>
        <p className="text-sm text-muted">Explore our rituals and bring home a botanical reset.</p>
        <Button
          onClick={() => {
            window.location.assign('/shop')
          }}
          className="mx-auto"
        >
          Browse products
        </Button>
      </div>
    )
  }

  return (
    // Performance budget (JS <200KB gz, LCP <2.5s on 4G, CLS <0.1, INP <200ms):
    // - ResponsiveImage keeps summary rows stable; analytics stubs defer network work off the critical path.
    // - Lazy-loaded checkout sheets and modals avoid inflating the initial JS bundle.
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[2fr_1fr]">
      <SEO title="Your cart" description="Review and complete your Varoganic order." path="/cart" noindex />
      <section className="space-y-6">
        <header>
          <h1 className="font-heading text-h2 text-ink">Your cart</h1>
          <p className="text-sm text-muted">Review items and shipping before heading to checkout.</p>
        </header>
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="flex gap-4 rounded-2xl border border-lines bg-paper p-4 shadow-card">
              <ResponsiveImage
                src={item.imageSrc}
                alt={item.imageAlt}
                width={280}
                height={280}
                srcWidths={[200, 280, 360]}
                sizes="120px"
                className="size-28 rounded-xl object-cover"
                aspectRatio="1 / 1"
              />
              <div className="flex flex-1 flex-col gap-3 text-sm text-body">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-ink">{item.name}</h2>
                    <p className="text-muted">{formatCurrency(item.price, 'INR')}</p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-muted underline"
                    onClick={() => {
                      removeItem(item.id)
                    }}
                  >
                    Remove
                  </button>
                </div>
                <QuantityStepper
                  value={item.quantity}
                  min={1}
                  max={10}
                  onChange={(value) => {
                    updateQuantity(item.id, value)
                  }}
                />
              </div>
            </article>
          ))}
        </div>
        <section className="space-y-3 rounded-2xl border border-lines bg-paper p-4 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Shipping estimate</h2>
          <p className="text-sm text-body">We currently ship pan India. Enter your pincode at checkout for exact delivery timelines.</p>
          <p className="text-xs text-muted">Cash on Delivery available on orders up to ₹4,000.</p>
        </section>
      </section>
      <aside className="space-y-4 rounded-2xl border border-lines bg-paper p-5 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Summary</h2>
        <div className="flex justify-between text-sm text-muted">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal(), 'INR')}</span>
        </div>
        <div className="flex justify-between text-sm text-success">
          <span>Savings</span>
          <span>{formatCurrency(savings(), 'INR')}</span>
        </div>
        <form className="space-y-3" onSubmit={handleCoupon}>
          <label htmlFor="coupon" className="text-sm font-medium text-ink">
            Apply coupon
          </label>
          <div className="flex gap-2">
            <input
              id="coupon"
              value={coupon}
              onChange={(event) => {
                setCoupon(event.target.value)
              }}
              placeholder="RITUAL10"
              className="flex-1 rounded-full border border-lines bg-paper px-4 py-3 text-body placeholder:text-muted focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            />
            <Button type="submit" size="sm" variant="secondary">
              Apply
            </Button>
          </div>
        </form>
        {message ? <p className="rounded-lg bg-accent/10 px-3 py-2 text-xs text-accent">{message}</p> : null}
        <Button
          onClick={handleShopNow}
          className="w-full"
        >
          Shop on Flipkart
        </Button>
        <p className="text-xs text-muted">
          You'll be redirected to our Flipkart store to complete your purchase securely.
        </p>
      </aside>
    </div>
  )
}
