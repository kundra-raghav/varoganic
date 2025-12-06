import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Fragment, useMemo, useState, type ReactElement } from 'react'

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
import { PRODUCTS } from '@/data/products'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

const launchMeta = [
  {
    id: 'mist-rose',
    tagline: 'Featherlight hydration cloud',
    highlight: 'Collected from sunrise distillation for maximum bloom potency.',
    ritualMoment: 'AM reset, between meetings, post-flight skin quencher.',
  },
  {
    id: 'gel-hydrating',
    tagline: 'Waterburst botanical gel',
    highlight: 'Charged with hibiscus enzymes and niacinamide for glass-skin finish.',
    ritualMoment: 'Layer under SPF for humidity-proof comfort.',
  },
  {
    id: 'elixir-glow',
    tagline: 'Night-repair elixir concentrate',
    highlight: 'Cold-pressed saffron threads suspended in a ceramide cocoon.',
    ritualMoment: '3-drop facial massage before sleep for plush morning bounce.',
  },
  {
    id: 'pack-ubtan',
    tagline: 'Flash facial ubtan',
    highlight: 'Fresh-milled licorice and turmeric for 7-minute brightness.',
    ritualMoment: 'Weekend masking paired with rose mist refreshers.',
  },
] as const

const storyTiles = [
  {
    title: 'Sonic-infused extraction',
    description:
      'Our new lab process sonicates botanicals at low temperatures, preserving heat-reactive flavonoids that typically degrade in traditional decoctions.',
    metric: '+38% active retention',
  },
  {
    title: 'Fermented microflora',
    description:
      'We inoculate every new formula with a lacto-ferment starter to pre-digest actives, improving dermal absorption without harsher penetration enhancers.',
    metric: 'Sub 0.2 irritation index',
  },
  {
    title: 'Slow-beauty cadence',
    description:
      'Small-batch launch windows with live auditing ensure every jar is tracked from farm lot to fulfillment within 48 hours of maceration.',
    metric: 'Trackable to the farm lot',
  },
  {
    title: 'Sustainably refillable',
    description:
      'New arrivals ship with glass vessels and compostable refill pods so you restock formulas without reordering hardware.',
    metric: '78% plastic saved per routine',
  },
] as const

const launchStats: Array<Stat> = [
  { label: 'Sensory testers', value: '146', description: 'Across Delhi, Mumbai & Bengaluru humidity zones.' },
  { label: 'Dermatologist trials', value: '4 weeks', description: 'Clinically observed epidermal barrier boost.' },
  { label: 'Refill waitlist', value: '3.2k', description: 'Community members pre-subscribed for drops.' },
  { label: 'Freshness window', value: '45 days', description: 'Time from harvest to ritual shelf.' },
]

const dropSchedule = [
  {
    month: 'January',
    theme: 'Reset the barrier',
    focus: 'Ceramide-gel duo with clinical transepidermal water loss reduction.',
  },
  {
    month: 'March',
    theme: 'Sun-season prep',
    focus: 'Phyto SPF booster concentrate and vitamin C powder activator.',
  },
  {
    month: 'June',
    theme: 'Monsoon calm',
    focus: 'Ayurvedic micro-mist set for decongesting humid, breakout-prone skin.',
  },
  {
    month: 'September',
    theme: 'Festive radiance',
    focus: 'Saffron night elixir relaunch with limited florals from Kashmir valley.',
  },
] as const

const editorialHighlights = [
  {
    outlet: 'Vogue India',
    blurb: '“Varoganic is the rare indie label marrying slow-beauty rituals with clinical discipline.”',
    url: 'https://www.vogue.in/beauty/content/varoganic-ayurvedic-skincare-review',
  },
  {
    outlet: 'ELLE',
    blurb: '“Consider the Glow Elixir an overnight facial that makes Monday mornings look like Friday.”',
    url: 'https://www.elle.in/beauty/varoganic-glow-elixir-review',
  },
  {
    outlet: 'Platforms For Purpose',
    blurb: '“Farm-to-face storytelling that honours smallholder botanists.”',
    url: 'https://www.platformsforpurpose.com/brands/varoganic',
  },
] as const

const DropBadge = ({ label, index }: { readonly label: string; readonly index: number }): ReactElement => {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">{index + 1}</span>
      {label}
    </span>
  )
}

const LaunchCard = ({
  name,
  description,
  imageSrc,
  tagline,
  highlight,
  ritualMoment,
  index,
}: {
  readonly name: string
  readonly description: string
  readonly imageSrc: string
  readonly tagline: string
  readonly highlight: string
  readonly ritualMoment: string
  readonly index: number
}): ReactElement => {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-lines bg-paper/95 shadow-card transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl">
      <div className="relative">
        <img src={imageSrc} alt={name} className="aspect-[4/5] w-full object-cover" loading="lazy" />
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <DropBadge label="Fresh launch" index={index} />
          <span className="inline-flex items-center rounded-full bg-paper/80 px-3 py-1 text-xs font-medium text-muted shadow-card">
            {tagline}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <h3 className="font-heading text-lg text-ink">{name}</h3>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-xs text-primary shadow-inner">
          <p className="font-semibold uppercase tracking-widest text-primary/80">What&apos;s new</p>
          <p className="mt-1 text-sm text-primary">{highlight}</p>
        </div>
        <p className="mt-auto text-xs uppercase tracking-wide text-muted">{ritualMoment}</p>
      </div>
    </article>
  )
}

const StoryTile = ({ title, description, metric }: (typeof storyTiles)[number]): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  const tile = (
    <div className="shadow-card/40 flex h-full flex-col justify-between gap-4 rounded-3xl border border-lines/70 bg-paper p-6">
      <div className="space-y-2">
        <h3 className="font-heading text-lg text-ink">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
        <span className="inline-flex size-2 rounded-full bg-accent" aria-hidden="true" />
        {metric}
      </span>
    </div>
  )

  if (prefersReducedMotion) {
    return tile
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {tile}
    </motion.div>
  )
}

const FloatingAura = (): ReactElement | null => {
  const prefersReducedMotion = useReducedMotionSafe()

  if (prefersReducedMotion) {
    return null
  }

  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0.25, scale: 0.9, y: 0 }}
      animate={{ opacity: 0.6, scale: 1.05, y: -10 }}
      transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
      className="pointer-events-none absolute -top-10 right-10 hidden size-48 rounded-full bg-primary/20 blur-3xl lg:block"
    />
  )
}

const UpcomingDrop = ({ month, theme, focus }: (typeof dropSchedule)[number]): ReactElement => {
  return (
    <div className="shadow-card/30 rounded-2xl border border-lines/70 bg-paper/95 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{month}</p>
      <p className="mt-1 font-heading text-lg text-ink">{theme}</p>
      <p className="mt-3 text-sm text-body">{focus}</p>
    </div>
  )
}

const EditorialQuote = ({ outlet, blurb, url }: (typeof editorialHighlights)[number]): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  const card = (
    <blockquote className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-primary/15 bg-primary/5 p-6 text-primary shadow-inner">
      <p className="text-sm leading-relaxed">{blurb}</p>
      <cite className="text-xs font-semibold uppercase not-italic tracking-[0.4em] text-primary/80">
        <a href={url} className="transition-colors hover:text-primary" rel="noreferrer" target="_blank">
          {outlet}
        </a>
      </cite>
    </blockquote>
  )

  if (prefersReducedMotion) {
    return card
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {card}
    </motion.div>
  )
}

type Launch = {
  readonly id: string
  readonly tagline: string
  readonly highlight: string
  readonly ritualMoment: string
  readonly name: string
  readonly description: string
  readonly imageSrc: string
}

const mapLaunch = (meta: (typeof launchMeta)[number]): Launch | null => {
  const product = PRODUCTS.find((item) => item.id === meta.id)
  if (!product) {
    return null
  }
  return {
    ...meta,
    name: product.name,
    description: product.description,
    imageSrc: product.imageSrc,
  }
}

const useLaunches = (): Array<Launch> => {
  return useMemo(() => launchMeta.map(mapLaunch).filter((launch): launch is Launch => launch !== null), [])
}

type SpotlightState = {
  readonly active: Launch | null
  readonly activeIndex: number
  readonly launches: Array<Launch>
  readonly setActiveIndex: (index: number) => void
}

const useSpotlightLaunch = (): SpotlightState => {
  const launches = useLaunches()
  const [activeIndex, setActiveIndex] = useState(0)
  const safeIndex = launches.length > 0 ? Math.min(activeIndex, launches.length - 1) : 0
  const active = launches[safeIndex] ?? null

  return {
    active,
    activeIndex: safeIndex,
    launches,
    setActiveIndex,
  }
}

const Spotlight = (): ReactElement | null => {
  const { active, activeIndex, setActiveIndex, launches } = useSpotlightLaunch()
  const prefersReducedMotion = useReducedMotionSafe()

  if (!active) {
    return null
  }

  return (
    <LayoutGroup>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-3xl border border-lines bg-paper shadow-card">
          <FloatingAura />
          <img src={active.imageSrc} alt={active.name} className="size-full object-cover" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper/95 via-paper/70 to-transparent p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white">Spotlight Ritual</p>
            <h3 className="mt-2 font-heading text-2xl text-ink">{active.name}</h3>
            <p className="mt-3 text-sm text-body">{active.highlight}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">Tap into each drop&apos;s specific ritual mood.</p>
          <div className="grid gap-3">
            {launches.map((launch, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={launch.id}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index)
                  }}
                  className="relative flex items-center gap-4 rounded-2xl border border-lines/70 bg-paper px-4 py-3 text-left text-sm transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  <span className="flex h-full max-w-[80%] flex-col">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted">Drop {index + 1}</span>
                    <span className="mt-1 font-medium text-ink">{launch.tagline}</span>
                    <span className="mt-1 text-xs text-muted">{launch.ritualMoment}</span>
                  </span>
                  <AnimatePresence>
                    {isActive && !prefersReducedMotion ? (
                      <motion.span
                        layoutId="active-spotlight"
                        className="absolute inset-0 -z-10 rounded-2xl border border-primary/40 bg-primary/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : null}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </LayoutGroup>
  )
}

/**
 * Drop calendar and storytelling for fresh arrivals.
 */
const NewRouteComponent = (): ReactElement => {
  const launches = useMemo(() => {
    return launchMeta
      .map((item, index) => {
        const launch = mapLaunch(item)
        if (!launch) {
          return null
        }
        return { ...launch, index }
      })
      .filter((launch): launch is Launch & { readonly index: number } => launch !== null)
  }, [])

  return (
    <Fragment>
      <SEO
        title="New arrivals — freshly-brewed rituals"
        description="Explore Varoganic drops fresh from the lab: small-batch botanicals, fermented actives, and refill-first designs to futureproof your ritual."
        path="/collections/new"
      />
      <PageContainer>
        <PageHero
          eyebrow="New arrivals"
          title="Freshly steeped rituals for your evolving skin moods"
          description="Every launch is brewed in micro-batches, clinically patch-tested, and infused with indigenous botanicals within 45 days of harvest."
          actions={[
            { label: 'Build a launch bundle', href: '/collections/bundles' },
            { label: 'Shop all products', href: '/shop', variant: 'secondary' },
          ]}
          highlights={[
            { label: 'Community Beta', value: '146 early reviewers' },
            { label: 'Clinical panel', value: '4-week results' },
          ]}
          media={{
            src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
            alt: 'Varoganic new launch textures on marble tray',
          }}
        />

        <AnimatedSection>
          <SectionHeader
            eyebrow="Launch stats"
            title="What went into the latest drop"
            description="We track every experiment across labs, farms, and focus groups so you can feel confident in what touches your skin."
            align="center"
          />
          <StatGrid stats={launchStats} />
        </AnimatedSection>

        <AnimatedSection variant="split">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Spotlight"
              title="Choose the drop that matches your rhythm"
              description="Maybe you need a humidity-proof hydrator, or a night repair elixir that doesn&apos;t leave residue on pillows. Match your skin mood with the drop built for it."
            />
            <p className="text-sm text-body">
              Tap a card to preview our lab notes, ritual cadence, and best layering partners.
            </p>
          </div>
          <Spotlight />
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Fresh on shelf"
            title="What&apos;s brewing right now"
            description="Limited-release textures formulated to take you through seasonal shifts without overhauling your entire ritual."
          />
          <AnimatedList
            items={launches}
            renderItem={(launch) => (
              <LaunchCard
                name={launch.name}
                description={launch.description}
                imageSrc={launch.imageSrc}
                tagline={launch.tagline}
                highlight={launch.highlight}
                ritualMoment={launch.ritualMoment}
                index={launch.index}
              />
            )}
          />
        </AnimatedSection>

        <AnimatedSection variant="plain">
          <SectionHeader
            eyebrow="Process"
            title="How the new ritual gets bottled"
            description="Each drop is tracked from idea to refill. Every improvement you suggested shows up somewhere between these tiles."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {storyTiles.map((tile) => (
              <StoryTile key={tile.title} {...tile} />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection variant="frosted">
          <SectionHeader
            eyebrow="Roadmap"
            title="Upcoming drop calendar"
            description="Mark the mood on your calendar and subscribe to be the first to sample lab batches."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {dropSchedule.map((drop) => (
              <UpcomingDrop key={drop.month} {...drop} />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Press"
            title="What editors are saying"
            description="From glossy pages to conscious commerce newsletters, here&apos;s how the community is reacting to our new wave."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {editorialHighlights.map((highlight) => (
              <EditorialQuote key={highlight.outlet} {...highlight} />
            ))}
          </div>
        </AnimatedSection>
      </PageContainer>
    </Fragment>
  )
}

export default NewRouteComponent
export const NewRoute = NewRouteComponent
