import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'

import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

export type GalleryImage = {
  readonly id: string
  readonly src: string
  readonly alt: string
}

export type GalleryProps = {
  readonly images: Array<GalleryImage>
}

/**
 * Rich media gallery for product detail page.
 */
export const Gallery = ({ images }: GalleryProps): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotionSafe()
  const listRef = useRef<HTMLDivElement>(null)

  const activeImage = useMemo(() => images[activeIndex] ?? images[0], [activeIndex, images])

  const handleKey = useCallback(
    (event: KeyboardEvent): void => {
      if (event.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % images.length)
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
      }
    },
    [images.length],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
    }
  }, [handleKey])

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="flex-1 overflow-hidden rounded-3xl border border-lines bg-paper shadow-card">
        <ResponsiveImage
          src={activeImage.src}
          alt={activeImage.alt}
          width={960}
          height={1200}
          srcWidths={[640, 960, 1200]}
          sizes="(min-width: 1024px) 540px, 100vw"
          className="w-full object-cover"
          aspectRatio="4 / 5"
          style={{
            touchAction: 'pan-y pinch-zoom',
            transition: prefersReducedMotion ? undefined : 'opacity 150ms ease-out',
          }}
        />
      </div>
      <div
        ref={listRef}
        className="flex shrink-0 gap-3 overflow-x-auto lg:flex-col"
        role="tablist"
        aria-label="Product media thumbnails"
      >
        {images.map((image, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className="relative size-24 overflow-hidden rounded-2xl border border-lines focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              onClick={() => {
                setActiveIndex(index)
              }}
            >
              {isActive ? (
                <span className="absolute inset-1 rounded-xl border-2 border-primary" aria-hidden="true" />
              ) : null}
              <ResponsiveImage
                src={image.src}
                alt={image.alt}
                width={160}
                height={160}
                srcWidths={[120, 160, 240]}
                sizes="80px"
                className="size-full object-cover"
                aspectRatio="1 / 1"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
