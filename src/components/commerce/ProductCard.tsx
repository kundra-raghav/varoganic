import { useState } from 'react'

// Temporarily commented out - customers shop on Flipkart
// import { AddToCartButton } from '@/components/commerce/AddToCartButton'
import { Button } from '@/components/common/Button'
import { Rating } from '@/components/common/Rating'
import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { view_item } from '@/lib/analytics'
import { formatCurrency } from '@/lib/formatters'
import { notifyWishlist } from '@/lib/toasts'

import type { Product } from '@/types/product'
import type { ReactElement } from 'react'

export type ProductCardProps = {
  readonly product: Product
  readonly lastViewedId?: string | null
}

/**
 * Product summary card used in grids and carousels.
 */
export const ProductCard = ({ product, lastViewedId }: ProductCardProps): ReactElement => {
  const [wishlist, setWishlist] = useState(false)

  const savingsPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const isLastViewed = lastViewedId === product.id

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-lines bg-paper shadow-card transition-transform duration-200 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg">
      {isLastViewed ? (
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
          Last viewed
        </span>
      ) : null}
      <div className="relative">
        <ResponsiveImage
          src={product.imageSrc}
          alt={product.imageAlt}
          width={640}
          height={800}
          srcWidths={[320, 480, 640, 960]}
          sizes="(min-width: 1024px) 320px, 60vw"
          className="aspect-[4/5] w-full object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.02]"
          aspectRatio="4 / 5"
        />
        <button
          type="button"
          onClick={() => {
            setWishlist((prev) => {
              const next = !prev
              notifyWishlist({ productName: product.name, saved: next })
              return next
            })
          }}
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-lines bg-paper/95 text-ink shadow-card transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlist ? '♥' : '♡'}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-2">
          <h3 className="font-heading text-lg text-ink">{product.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Rating value={product.rating} readOnly label={`${product.rating.toString()} out of 5`} />
            <span aria-hidden="true">·</span>
            <span>{product.reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>
        <div className="flex items-baseline gap-3 text-sm">
          <span className="text-base font-semibold text-primary">{formatCurrency(product.price, 'INR')}</span>
          <span className="text-muted line-through">{formatCurrency(product.mrp, 'INR')}</span>
          <span className="text-success">-{savingsPercent}%</span>
        </div>
        <div className="mt-auto flex items-center gap-3">
          {/* Temporarily commented out - customers shop on Flipkart */}
          {/* <AddToCartButton product={product} label="Add to cart" className="flex-1" /> */}
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => {
              view_item({
                item: {
                  id: product.id,
                  name: product.name,
                  category: product.category,
                  price: product.price,
                },
              })
              window.location.assign(`/product?id=${product.id}`)
            }}
          >
            View
          </Button>
        </div>
      </div>
    </article>
  )
}
