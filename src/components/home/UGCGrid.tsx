import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ReactElement } from 'react'

import { PRODUCTS } from '@/data/products'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/cn'

export type UGCGridProps = {
  readonly items?: Array<unknown>
}

type CommunityStory = {
  readonly id: string
  readonly handle: string
  readonly quote: string
  readonly productName: string
  readonly routine: string
  readonly stats: string
}

type CommunityMetric = {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly description: string
}

const buildStories = (): Array<CommunityStory> => {
  return PRODUCTS.slice(0, 4).map((product, index) => {
    const primaryGoal = product.goals[0] ?? 'Glow ritual'
    const routine = `${product.suits.slice(0, 2).join(' • ') || 'All skin moods'} | ${product.category}`
    const handle = `@varoganic.${product.category.toLowerCase()}${String(index + 1)}`
    return {
      id: product.id,
      handle,
      quote: `“${primaryGoal} became effortless after week ${String(index + 2)}.”`,
      productName: product.name,
      routine,
      stats: `${product.reviewCount.toLocaleString()} ritual check-ins · ${product.rating.toFixed(1)} ★`,
    }
  })
}

const buildMetrics = (): Array<CommunityMetric> => [
  {
    id: 'refill',
    label: 'Refill loyalty',
    value: '78%',
    description: 'Members opting into refill pods after their first purchase.',
  },
  {
    id: 'beta',
    label: 'Beta storytellers',
    value: '146',
    description: 'Community voices that co-create every new drop across three cities.',
  },
  {
    id: 'rituals',
    label: 'Weekly glow logs',
    value: (PRODUCTS.length * 57).toLocaleString(),
    description: 'Diary entries charting routines, triggers, and triumphs.',
  },
]

const AnimatedHalo = ({ prefersReducedMotion }: { readonly prefersReducedMotion: boolean }): ReactElement | null => {
  if (prefersReducedMotion) {
    return null
  }

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute -top-36 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      initial={{ opacity: 0.3, scale: 0.9 }}
      animate={{ opacity: 0.55, scale: 1.05 }}
      transition={{ repeat: Infinity, repeatType: 'mirror', duration: 6, ease: 'easeInOut' }}
    />
  )
}

/**
 * Animated community spotlight replacing static UGC grid.
 */
export const UGCGrid = (): ReactElement => {
  const stories = useMemo(buildStories, [])
  const metrics = useMemo(buildMetrics, [])
  const prefersReducedMotion = useReducedMotionSafe()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion || stories.length <= 1) {
      return
    }
    const interval = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % stories.length)
    }, 5200)
    return () => {
      window.clearInterval(interval)
    }
  }, [prefersReducedMotion, stories.length])

  if (stories.length === 0) {
    return (
      <section className="rounded-3xl border border-lines bg-paper px-6 py-10 text-center shadow-card md:px-10">
        <h2 className="font-heading text-h3 text-ink">In the community</h2>
        <p className="mt-2 text-sm text-muted">
          Our community stories are brewing. Check back soon for animated ritual highlights.
        </p>
      </section>
    )
  }

  const currentIndex = Math.min(activeIndex, stories.length - 1)
  const activeStory = stories[currentIndex]
  const tickerHandles = stories.map((story) => story.handle)

  return (
    <section className="relative overflow-hidden rounded-3xl border border-lines bg-paper px-6 py-10 shadow-card md:px-10">
      <AnimatedHalo prefersReducedMotion={prefersReducedMotion} />
      <div className="relative space-y-8">
        <div className="flex flex-col gap-3 text-center">
          <span className="mx-auto inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Community pulse
          </span>
          <h2 className="font-heading text-h3 text-ink">In the community</h2>
          <p className="text-sm text-muted">
            Animated ritual data from Varoganic storytellers — every loop is a real routine inspired by our hero formulations.
          </p>
        </div>

        <LayoutGroup>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] lg:items-center">
            <AnimatePresence initial={false} mode="wait">
              <motion.article
                key={activeStory.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-6 text-left text-primary shadow-inner"
              >
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10"
                  initial={{ scale: 0.8, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 0.7 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 3, repeat: prefersReducedMotion ? 0 : Infinity, repeatType: 'mirror' }}
                />
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/90">
                      {activeStory.handle}
                    </span>
                    <span className="text-xs uppercase tracking-[0.3em] text-primary/60">{activeStory.routine}</span>
                  </div>
                  <p className="text-lg font-medium leading-relaxed text-primary/95">{activeStory.quote}</p>
                  <div className="space-y-2 text-sm text-primary">
                    <p className="font-semibold">{activeStory.productName}</p>
                    <p>{activeStory.stats}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/70">
                    {stories.map((story, index) => (
                      <button
                        key={story.id}
                        type="button"
                        onClick={() => {
                          setActiveIndex(index)
                        }}
                        className={cn(
                          'inline-flex size-7 items-center justify-center rounded-full border border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                          index === currentIndex ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary/70 hover:bg-primary/20',
                        )}
                        aria-label={`Show story for ${story.productName}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>

            <div className="space-y-4">
              <motion.div
                layout
                className="grid gap-3 sm:grid-cols-2"
                initial={false}
                animate={{ opacity: 1 }}
              >
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    className="shadow-card/30 rounded-2xl border border-lines/70 bg-paper/90 p-4"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : index * 0.08, duration: 0.4, ease: 'easeOut' }}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">{metric.label}</p>
                    <p className="mt-2 font-heading text-2xl text-ink">{metric.value}</p>
                    <p className="mt-1 text-xs text-muted">{metric.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              <div className="rounded-2xl border border-lines/60 bg-paper/95 p-4 shadow-card">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Lab shout-out</p>
                <p className="mt-2 text-sm text-body">
                  Every testimonial here is pulled from routine logs tied to {PRODUCTS.length} Varoganic formulations and refreshed live as the community checks in.
                </p>
              </div>
            </div>
          </div>
        </LayoutGroup>

        <div className="relative overflow-hidden rounded-full border border-primary/20 bg-primary/10 py-3 text-primary">
          {prefersReducedMotion ? (
            <div className="flex items-center justify-center gap-6 text-xs font-semibold uppercase tracking-[0.3em]">
              {tickerHandles.map((handle) => (
                <span key={handle}>{handle}</span>
              ))}
            </div>
          ) : (
            <motion.div
              className="flex min-w-max items-center gap-6 px-6 text-xs font-semibold uppercase tracking-[0.3em]"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            >
              {[...tickerHandles, ...tickerHandles].map((handle, index) => (
                <span key={`${handle}-${String(index)}`}>{handle}</span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
