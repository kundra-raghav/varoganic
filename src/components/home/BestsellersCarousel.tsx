import { useEffect, useState, type ReactElement } from 'react'

import { Button } from '@/components/common/Button'
import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { useEmbla } from '@/hooks/useEmbla'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/cn'
import { formatCurrency } from '@/lib/formatters'

import type { Product } from '@/types/product'

export type BestsellersCarouselProps = {
  readonly items: Array<Product>
}

/**
 * Embla-powered carousel for top selling products.
 */
export const BestsellersCarousel = ({ items }: BestsellersCarouselProps): ReactElement => {
  const [viewportRef, emblaApi] = useEmbla({ align: 'start', containScroll: 'trimSnaps' })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const prefersReducedMotion = useReducedMotionSafe()

  useEffect(() => {
    if (!emblaApi) {
      return
    }

    const updateButtons = (): void => {
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
    }

    emblaApi.on('select', updateButtons)
    updateButtons()

    return () => {
      emblaApi.off('select', updateButtons)
    }
  }, [emblaApi])

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-h2 text-ink">Bestsellers</h2>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              emblaApi?.scrollPrev()
            }}
            disabled={!canPrev}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              emblaApi?.scrollNext()
            }}
            disabled={!canNext}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="relative" role="region" aria-roledescription="carousel" aria-label="Bestselling skincare products">
        <div className="overflow-hidden" ref={viewportRef}>
          <div className="-ml-4 flex touch-pan-x space-x-4">
            {items.map((item) => (
              <article
                key={item.id}
                className={cn(
                  'min-w-[75%] max-w-[75%] rounded-2xl border border-lines bg-paper p-4 shadow-card transition-transform duration-200 ease-out sm:min-w-[45%] sm:max-w-[45%] lg:min-w-[30%] lg:max-w-[30%]',
                  prefersReducedMotion ? '' : 'motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg',
                )}
              >
                <figure className="overflow-hidden rounded-xl border border-lines/60">
                  <ResponsiveImage
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    width={640}
                    height={640}
                    srcWidths={[320, 480, 640, 960]}
                    sizes="(min-width: 1024px) 320px, 70vw"
                    className="aspect-square w-full object-cover transition-transform duration-200 ease-out motion-safe:hover:scale-[1.02]"
                    aspectRatio="1 / 1"
                  />
                </figure>
                <div className="mt-4 space-y-2">
                  <h3 className="text-base font-semibold text-ink">{item.name}</h3>
                  <p className="text-sm text-primary">{formatCurrency(item.price, 'INR')}</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      window.location.assign(`/product?id=${item.id}`)
                    }}
                  >
                    Shop now
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
