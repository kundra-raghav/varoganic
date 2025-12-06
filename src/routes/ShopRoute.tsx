import { motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ReactElement } from 'react'

import {
  AnimatedList,
  AnimatedSection,
  PageContainer,
  PageHero,
  SectionHeader,
  StatGrid,
  type Stat,
} from '@/components/layout/PageSections'
import { SEO } from '@/components/layout/SEO'
import { FiltersDrawer, LoadMore, ProductGrid, SortBar } from '@/components/plp'
import { PRODUCTS, getUniqueGoals, getUniqueSuits } from '@/data/products'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useFiltersStore } from '@/store/filters'

const PAGE_SIZE = 8

const matchesSuit = (productSuit: string, filter: string): boolean => {
  if (!filter) {
    return true
  }
  if (filter.toLowerCase() === 'all') {
    return true
  }
  return productSuit.toLowerCase() === filter.toLowerCase()
}

const matchesGoal = (goal: string, filter: string): boolean => goal.toLowerCase() === filter.toLowerCase()

const shopStats: Array<Stat> = [
  { label: 'Formulas', value: `${PRODUCTS.length.toString()} hero rituals`, description: 'Derm-guided and community tested.' },
  { label: 'Refill adoption', value: '78%', description: 'Customers who reorder via refill pouches.' },
  { label: 'Avg. rating', value: '4.7 / 5', description: 'Across 2,400 verified reviews.' },
  { label: 'Dispatch time', value: '24 hrs', description: 'Fresh batches leave our lab within a day.' },
]

const ritualPlaylists = [
  {
    title: 'Morning dew defenders',
    description: 'Start with Rose Soap, layer Skin Hydrating Gel, seal with Radiant Mist for 12-hour bounce.',
    focus: 'Dry & sensitive skin needing pillowy hydration.',
  },
  {
    title: 'Pollution armour',
    description: 'Neem Soap lifts grime, Detan scrub resets tone, Glow Elixir shields with antioxidants.',
    focus: 'Urban commuters facing dust + blue light.',
  },
  {
    title: 'Weekend reset',
    description: 'Milky Kesar Soap softens, Ubtan mask brightens, Rose Mist refreshes between errands.',
    focus: 'Dullness and uneven tone before events.',
  },
]

const serviceHighlights = [
  {
    title: 'Smart refills',
    copy: 'Every order ships with QR codes to schedule refills exactly when your routine is due, ensuring minimum waste.',
  },
  {
    title: 'Derm support',
    copy: 'Book a 15-minute check-in with our advisory dermatologists to personalise layering and actives.',
  },
  {
    title: 'Carbon-conscious shipping',
    copy: 'Deliveries are carbon-offset via regenerative farming projects within our sourcing communities.',
  },
]

type Mood = {
  readonly label: string
  readonly value: string
  readonly type: 'skin' | 'concern'
}

const buildSkinMoods = (): Array<Mood> => {
  const suits = getUniqueSuits().map((suit) => ({ label: `${suit} skin`, value: suit, type: 'skin' as const }))
  const concerns = getUniqueGoals().map((concern) => ({ label: concern, value: concern, type: 'concern' as const }))
  return [...suits, ...concerns]
}

const MoodChip = ({ mood, activeSkin, activeConcern }: { readonly mood: Mood; readonly activeSkin: string | null; readonly activeConcern: string | null }): ReactElement => {
  const { setSkinType, setConcern } = useFiltersStore()
  const prefersReducedMotion = useReducedMotionSafe()
  const isActive = mood.type === 'skin' ? activeSkin === mood.value : activeConcern === mood.value

  return (
    <button
      type="button"
      onClick={() => {
        if (mood.type === 'skin') {
          setSkinType(isActive ? null : mood.value)
        } else {
          setConcern(isActive ? null : mood.value)
        }
      }}
      className="relative overflow-hidden rounded-full border border-lines/60 bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      {mood.label}
      {prefersReducedMotion ? (
        isActive ? (
          <span className="absolute inset-0 -z-10 rounded-full border border-primary/40 bg-primary/10" aria-hidden="true" />
        ) : null
      ) : (
        <motion.span
          aria-hidden="true"
          layoutId={`mood-${mood.value}`}
          className="absolute inset-0 -z-10 rounded-full border border-primary/40 bg-primary/10"
          initial={false}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
      )}
    </button>
  )
}

/**
 * Product listing hub with storytelling and interactive filters.
 */
export const ShopRoute = (): ReactElement => {
  const { sort, skinType, concern } = useFiltersStore()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [lastViewedId, setLastViewedId] = useState<string | null>(() => localStorage.getItem('varoganic:last-viewed'))
  const moods = useMemo(buildSkinMoods, [])

  useEffect(() => {
    const handler = (): void => {
      setLastViewedId(localStorage.getItem('varoganic:last-viewed'))
    }
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('storage', handler)
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const products = PRODUCTS.filter((product) => {
      const suitsMatch = skinType ? product.suits.some((suit) => matchesSuit(suit, skinType)) : true
      const goalsMatch = concern ? product.goals.some((goal) => matchesGoal(goal, concern)) : true
      return suitsMatch && goalsMatch
    })

    const sorted = [...products]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        sorted.reverse()
        break
      case 'featured':
        break
      default:
        break
    }
    return sorted
  }, [concern, skinType, sort])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length
  const filterSummary = [skinType ? `${skinType} skin` : null, concern ? `${concern} goals` : null]
    .filter(Boolean)
    .join(' • ')

  const description = filterSummary
    ? `Discover ${String(filteredProducts.length)} rituals tailored for ${filterSummary.toLowerCase()} with Varoganic.`
    : 'Discover dermatologist-backed organic skincare rituals for all Indian skin types.'

  return (
    <>
      <SEO title="Shop organic skincare essentials" description={description} path="/shop" openGraph={{ type: 'website' }} />
      <PageContainer>
        <PageHero
          eyebrow="Shop"
          title="Build a ritual that moves with your skin"
          description="Filters, stories, and playlists that make choosing skincare feel like curating a playlist. Every product is small-batch brewed and refill-ready."
          actions={[
            { label: 'Explore new arrivals', href: '/collections/new' },
            { label: 'View ritual bundles', href: '/collections/bundles', variant: 'secondary' },
          ]}
          highlights={[
            { label: 'Free shipping', value: '₹999 & above' },
            { label: 'Instant derm chat', value: '10am — 8pm IST' },
          ]}
          media={{
            src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
            alt: 'Varoganic skincare displayed on stone blocks',
          }}
        />

        <AnimatedSection>
          <SectionHeader
            eyebrow="Why Varoganic"
            title="Treatments with heart, science, and traceability"
            description="Stats that keep us honest and obsessed with your results."
          />
          <StatGrid stats={shopStats} />
        </AnimatedSection>

        <AnimatedSection variant="split">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Skin moods"
              title="Tap a mood to auto-filter the grid"
              description="We track skin stories across India, so whether you battle monsoon stickiness or mountain dryness, there’s a routine ready."
            />
            <p className="text-sm text-body">
              Filters apply instantly and can be layered. Tap again to reset a mood.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => (
              <MoodChip key={`${mood.type}-${mood.value}`} mood={mood} activeSkin={skinType} activeConcern={concern} />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Ritual playlists"
            title="How the community layers their favourites"
            description="Screenshotted, DM’d, and stitched into routines across the Varoganic community."
          />
          <AnimatedList
            items={ritualPlaylists}
            renderItem={(playlist) => (
              <article className="shadow-card/40 h-full rounded-3xl border border-lines bg-paper/95 p-6">
                <h3 className="font-heading text-lg text-ink">{playlist.title}</h3>
                <p className="mt-2 text-sm text-body">{playlist.description}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted">{playlist.focus}</p>
              </article>
            )}
          />
        </AnimatedSection>

        <AnimatedSection variant="card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeader
              eyebrow="Shop the grid"
              title="Filter, sort, discover"
              description={filterSummary ? `Filtered by ${filterSummary.toLowerCase()}.` : 'Mix filters or browse organically — everything you need lives below.'}
            />
            <div className="flex items-center gap-3 self-start lg:self-end">
              <FiltersDrawer />
              <SortBar />
            </div>
          </div>
          <ProductGrid products={visibleProducts} lastViewedId={lastViewedId} />
          <LoadMore
            hasMore={hasMore}
            isLoading={false}
            onLoadMore={() => {
              setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProducts.length))
            }}
          />
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Service"
            title="We stay with you beyond checkout"
            description="Personalised support and planet-positive touches built into every order."
          />
          <AnimatedList
            items={serviceHighlights}
            renderItem={(service) => (
              <article className="h-full rounded-3xl border border-primary/20 bg-primary/10 p-6 text-primary shadow-inner">
                <h3 className="font-heading text-lg text-primary">{service.title}</h3>
                <p className="mt-2 text-sm text-primary/90">{service.copy}</p>
              </article>
            )}
          />
        </AnimatedSection>
      </PageContainer>
    </>
  )
}
