import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState, useEffect, type ReactElement } from 'react'

import {
  BeforeAfter,
  BestsellersCarousel,
  BundlesStrip,
  Hero,
  IngredientStories,
  MomentumWidgets,
  NewsletterInline,
  RitualMatchmaker,
  ShopByConcern,
  UGCGrid,
  USPChips,
} from '@/components/home'
import { SEO } from '@/components/layout/SEO'
import { PRODUCTS, getBestSellers, getUniqueGoals, getUniqueSuits } from '@/data/products'

const uspItems = ['100% organic', 'Dermatologically tested', 'Made in India', 'Cruelty-free']

const heroStoriesData = [
  {
    id: 'soap-rose',
    eyebrow: 'Kiss Dry Skin Goodbye',
    headline: 'Indulge in Rose-Powered Hydration',
    subcopy:
      'Our soothing soap, infused with fresh rose petals and Vitamin E, transforms your daily shower into a hydrating ritual, leaving your skin irresistibly soft and calm.',
    cta: 'Shop Rose Soap',
  },
  {
    id: 'soap-milky-kesar',
    eyebrow: 'Unlock Your Natural Glow',
    headline: 'Radiance in a Bar',
    subcopy:
      'Experience the magic of Camel milk and Kesar. This luxurious blend brightens your complexion, fades dark spots, and reveals luminous, youthful skin.',
    cta: 'Shop Kesar Soap',
  },
  {
    id: 'gel-hydrating',
    eyebrow: 'The Ultimate Skin Quencher',
    headline: 'Lightweight Hydration, Powerful Results',
    subcopy:
      'A refreshing burst of rose, hibiscus, and kesar. This non-greasy gel calms acne, banishes dullness, and provides all-day hydration for a dewy, fresh look.',
    cta: 'Shop Hydrating Gel',
  },
]

const suitLinks = getUniqueSuits().map((suit) => ({ label: `${suit} skin`, href: `/shop?skin=${encodeURIComponent(suit)}` }))
const concernLinks = getUniqueGoals().map((goal) => ({ label: goal, href: `/shop?concern=${encodeURIComponent(goal)}` }))

const shopByConcernLinks = Array.from(new Map([...suitLinks, ...concernLinks].map((item) => [item.href, item]))).map(
  ([, value]) => value,
)

const ingredientStories = PRODUCTS.slice(0, 3).map((product) => ({
  id: product.id,
  name: product.name,
  summary: product.description,
  benefits: product.goals.slice(0, 3),
  imageSrc: product.imageSrc,
  imageAlt: product.imageAlt,
}))

const bundleHighlights = PRODUCTS.slice(0, 3).map((product, index) => ({
  id: `${product.id}-bundle`,
  title: `${product.name.split(' ')[0]} ritual bundle`,
  description: product.description,
  savings: `${String(12 + index * 3)}%`,
  href: `/product?id=${product.id}`,
}))

const beforeAfter = {
  beforeSrc: 'https://i.ibb.co/ZzP5Q6vq/Whats-App-Image-2025-10-23-at-12-10-43-AM-1.jpg',
  afterSrc: 'https://i.ibb.co/hRLdkCt0/Whats-App-Image-2025-10-23-at-12-10-43-AM.jpg',
  alt: 'Varoganic ritual before and after glow comparison',
  disclaimer: 'Actual community results after 6 weeks of consistent ritual use. Images unretouched.',
}

const withWidthParam = (url: string, width: number): string => {
  const widthPattern = /([?&])w=\d+/
  if (widthPattern.test(url)) {
    return url.replace(widthPattern, `$1w=${String(width)}`)
  }
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}w=${String(width)}`
}

const marqueePhrases = [
  '100% chemical-free',
  'Dermatologist verified',
  'Handmade in small batches',
  'Zero parabens • Zero sulphates',
  'Cruelty-free & planet-kind',
] as const

/**
 * Home landing route assembling hero modules.
 */
export const HomeRoute = (): ReactElement => {
  const heroStories = useMemo(
    () =>
      heroStoriesData
        .map((story) => ({ ...story, product: PRODUCTS.find((p) => p.id === story.id) }))
        .filter((story) => story.product),
    [],
  )

  const [activeStoryIndex, setActiveStoryIndex] = useState(0)

  useEffect(() => {
    if (heroStories.length <= 1) return
    const interval = setInterval(() => {
      setActiveStoryIndex((prevIndex) => (prevIndex + 1) % heroStories.length)
    }, 7000) // 7 seconds per slide
    return () => clearInterval(interval)
  }, [heroStories.length])

  const activeStory = heroStories[activeStoryIndex]
  const activeProduct = activeStory.product!

  const heroContent = {
    eyebrow: activeStory.eyebrow,
    headline: activeStory.headline,
    subcopy: activeStory.subcopy,
    primaryCta: { label: activeStory.cta, href: `/product?id=${activeProduct.id}` },
    secondaryCta: { label: 'Explore All Products', href: '/shop' },
    media: {
      src: activeProduct.imageSrc,
      alt: activeProduct.imageAlt,
    },
  }

  const heroWidths = [480, 720, 960, 1280] as const
  const heroImageSrcSet = heroWidths
    .map((width) => `${withWidthParam(heroContent.media.src, width)} ${String(width)}w`)
    .join(', ')
  const heroPreloadSrc = withWidthParam(heroContent.media.src, heroWidths[heroWidths.length - 1])

  // Performance budget (JS <200KB gz, LCP <2.5s on 4G, CLS <0.1, INP <200ms):
  // - Hero imagery preloaded with responsive sizing to accelerate LCP and prevent layout shifts.
  // - Route-level code splitting keeps initial JS lean; below-the-fold modules rely on lazy assets.
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-12 md:py-16">
      <SEO
        title="Restorative organic skincare rituals"
        description="Evergreen botanicals for glow, balance, and calm. Discover dermatologist-formulated routines crafted for Indian skin."
        path="/"
        image={activeProduct.imageSrc}
      >
        <link
          rel="preload"
          as="image"
          href={heroPreloadSrc}
          imageSrcSet={heroImageSrcSet}
          imageSizes="(min-width: 1024px) 480px, 100vw"
        />
      </SEO>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStory.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeOut' } }}
        >
          <Hero {...heroContent} />
        </motion.div>
      </AnimatePresence>
      <USPChips items={uspItems} />
      <div className="relative overflow-hidden rounded-full border border-lines bg-paper/90 py-3 shadow-card">
        <motion.div
          className="flex min-w-max items-center gap-6 px-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
        >
          {[...marqueePhrases, ...marqueePhrases].map((phrase, index) => (
            <span key={`${phrase}-${String(index)}`}>{phrase}</span>
          ))}
        </motion.div>
      </div>
      <BestsellersCarousel items={getBestSellers(4)} />
      <MomentumWidgets />
      <RitualMatchmaker />
      <ShopByConcern concerns={shopByConcernLinks.slice(0, 6)} />
      <IngredientStories stories={ingredientStories} />
      <BeforeAfter {...beforeAfter} />
      <UGCGrid />
      <BundlesStrip bundles={bundleHighlights} />
      <NewsletterInline />
    </div>
  )
}