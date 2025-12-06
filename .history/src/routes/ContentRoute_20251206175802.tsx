import { useState, type ReactElement, type ReactNode } from 'react'
import { motion } from 'framer-motion'

import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Accordion, AccordionItem } from '@/components/common/Accordion'
import { SEO } from '@/components/layout/SEO'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/cn'

export type HeroAction = {
  readonly label: string
  readonly href: string
  readonly variant?: 'primary' | 'secondary'
}

type HeroHighlight = {
  readonly label: string
  readonly value: string
}

type HeroContent = {
  readonly eyebrow?: string
  readonly title: string
  readonly description: string
  readonly image?: {
    readonly src: string
    readonly alt: string
  }
  readonly actions?: Array<HeroAction>
  readonly highlights?: Array<HeroHighlight>
}

type PageDefinition = {
  readonly hero: HeroContent
  readonly Component: () => ReactElement
  readonly seo: {
    readonly title: string
    readonly description: string
    readonly path: string
    readonly image?: string
  }
  readonly structuredData?: Array<Record<string, unknown>> | Record<string, unknown>
}

type AnimatedSectionProps = {
  readonly children: ReactNode
  readonly delay?: number
  readonly variant?: 'card' | 'plain' | 'split'
  readonly className?: string
  readonly id?: string
}

const sanitizePath = (path: string): string => {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}

type PolicySection = {
  readonly title: string
  readonly paragraphs: Array<string>
  readonly list?: Array<string>
  readonly note?: string
}

const PolicySections = ({ sections }: { readonly sections: Array<PolicySection> }): ReactElement => {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <AnimatedSection key={section.title} className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">{section.title}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={`${section.title}-${index}`} className="text-sm text-body">
              {paragraph}
            </p>
          ))}
          {section.list ? (
            <ul className="space-y-2 text-sm text-body">
              {section.list.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-primary">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {section.note ? <p className="text-xs text-muted">{section.note}</p> : null}
        </AnimatedSection>
      ))}
    </div>
  )
}

const AnimatedSection = ({ children, delay = 0, variant = 'card', className, id }: AnimatedSectionProps): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const baseClass =
    variant === 'plain'
      ? 'space-y-6'
      : variant === 'split'
        ? 'grid gap-8 rounded-3xl border border-lines bg-paper p-8 shadow-card/50 lg:grid-cols-2'
        : 'rounded-3xl border border-lines bg-paper p-8 shadow-card/40'

  if (prefersReducedMotion) {
    return (
      <section id={id} className={cn(baseClass, className)}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={cn(baseClass, className)}
    >
      {children}
    </motion.section>
  )
}

const HeroSection = ({ hero }: { readonly hero: HeroContent }): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const heroContent = (
    <div className="grid gap-10 lg:grid-cols-[1fr,320px] lg:items-center">
      <div className="space-y-6">
        {hero.eyebrow ? <p className="text-sm uppercase tracking-[0.2em] text-muted">{hero.eyebrow}</p> : null}
        <h1 className="font-heading text-h1 leading-tight text-ink">{hero.title}</h1>
        <p className="max-w-2xl text-base text-body">{hero.description}</p>
        {hero.actions && hero.actions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {hero.actions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                className={cn(
                  'inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                  action.variant === 'secondary'
                    ? 'border border-primary/50 text-primary hover:border-primary hover:bg-primary/10'
                    : 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover',
                )}
              >
                {action.label}
              </a>
            ))}
          </div>
        ) : null}
        {hero.highlights && hero.highlights.length > 0 ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            {hero.highlights.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary shadow-inner"
              >
                <dt className="text-xs uppercase tracking-wide text-primary/80">{highlight.label}</dt>
                <dd className="mt-1 text-lg font-semibold text-primary">{highlight.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {hero.image ? (
        <div className="relative overflow-hidden rounded-3xl border border-lines bg-paper shadow-card">
          <img
            src={hero.image.src}
            alt={hero.image.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper/20 via-transparent to-transparent" />
        </div>
      ) : null}
    </div>
  )

  if (prefersReducedMotion) {
    return (
      <section className="overflow-hidden rounded-3xl border border-lines bg-confetti bg-paper px-6 py-10 shadow-card md:px-12">
        {heroContent}
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="overflow-hidden rounded-3xl border border-lines bg-confetti bg-paper px-6 py-10 shadow-card md:px-12"
    >
      {heroContent}
    </motion.section>
  )
}

const containerClass = 'mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12'

const NotFoundFallback = (): ReactElement => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center">
      <h2 className="font-heading text-h2 text-ink">We&apos;re still steeping this page</h2>
      <p className="text-sm text-muted">
        The page you&apos;re looking for hasn&apos;t been brewed yet. Head back to the rituals you love while we infuse it.
      </p>
      <a
        href="/"
        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
      >
        Back to home
      </a>
    </div>
  )
}

const AllProductsContent = (): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const stats = [
    {
      label: 'Routine journeys',
      value: '4 guided rituals',
      description: 'Cleanse, Treat, Seal, and Protect routines curated for humid, tropical, and urban climates.',
    },
    {
      label: 'Clinical validation',
      value: '92% saw brighter skin',
      description: 'Measured across an 8-week consumer study with 214 routine diary submissions.',
    },
    {
      label: 'Botanical repertoire',
      value: '32 hero botanicals',
      description: 'Each extract is cold-pressed within 12 hours of harvest to lock in active phytonutrients.',
    },
  ]

  const ritualCategories = [
    {
      title: 'Cleanse & Reset',
      copy:
        'Ayurvedic soaps, powder cleansers, and oil balms that detox without stripping. Infused with vetiver, manjistha, and kokum butter.',
      href: '/shop?concern=Purifying',
      colorClass: 'from-primary/10 via-transparent to-primary/5',
    },
    {
      title: 'Treat & Target',
      copy:
        'Serums layered with stabilized Vitamin C, bakuchiol, and niacinamide encapsulated in plant liposomes for deep delivery.',
      href: '/shop?concern=Brightening',
      colorClass: 'from-accent/10 via-transparent to-accent/5',
    },
    {
      title: 'Seal & Nourish',
      copy:
        'Moisturising creams and sleeping masks that fortify the barrier using moringa peptides and fermented rice water.',
      href: '/shop?concern=Barrier%20repair',
      colorClass: 'from-primary/10 via-transparent to-primary/5',
    },
    {
      title: 'Protect & Glow',
      copy:
        'Mineral SPF, lip treatments, and midday spritzes that defend from UVA, PM2.5, and tech glare without a white cast.',
      href: '/shop?concern=Defense',
      colorClass: 'from-accent/10 via-transparent to-accent/5',
    },
  ]

  const layeringTips = [
    {
      step: 'Patch test on the wrist',
      detail:
        'Introduce one active-rich formulation every 48 hours. Our botanicals are potent; your microbiome needs a gentle ramp-up.',
    },
    {
      step: 'Layer by texture',
      detail:
        'Move from misty toners to aqueous serums and seal with richer creams. Featherlight emulsions pair best with humidity-heavy days.',
    },
    {
      step: 'Seal within 60 seconds',
      detail:
        'Lock hydration in while skin is still dewy. Finish with SPF every morning; reapply using our cloud SPF stick every 3 hours.',
    },
  ]

  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-8">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Curated rituals for every skin mood</h2>
          <p className="max-w-3xl text-sm text-muted">
            Use the filters on the shop page to sort by texture, active percentage, climate, or time of day. Every formula is designed to
            layer effortlessly without pilling.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={prefersReducedMotion ? undefined : { y: -8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="group flex h-full flex-col justify-between rounded-2xl border border-lines bg-paper px-5 py-6 shadow-card/30"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{stat.label}</p>
                <p className="mt-3 text-lg font-semibold text-primary">{stat.value}</p>
              </div>
              <p className="mt-4 text-sm text-body">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="open-roles" className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Build your evergreen capsule</h2>
          <p className="max-w-3xl text-sm text-muted">
            Start with a hero from each ritual lane. Everything is batch-crafted in micro lots to preserve potency and reduce waste.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {ritualCategories.map((category) => (
            <motion.a
              key={category.title}
              href={category.href}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-lines bg-paper shadow-card"
            >
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100',
                  category.colorClass,
                )}
                aria-hidden="true"
              />
              <div className="relative space-y-4 p-6">
                <h3 className="text-lg font-semibold text-ink">{category.title}</h3>
                <p className="text-sm text-body">{category.copy}</p>
              </div>
              <div className="relative flex items-center justify-between border-t border-lines/60 px-6 py-4 text-sm text-primary">
                <span>Explore ritual</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="launch-waitlist" variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Layering playbook</h2>
          <p className="text-sm text-muted">
            Simplify routines with our three-step technique that keeps actives stable and your barrier joyful. Each order ships with a
            personalised ritual cadence card.
          </p>
          <ul className="space-y-4 text-sm text-body">
            {layeringTips.map((tip) => (
              <li key={tip.step} className="rounded-2xl border border-lines bg-paper px-4 py-3 shadow-inner">
                <p className="font-medium text-primary">{tip.step}</p>
                <p className="mt-1 text-muted">{tip.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-lines bg-paper shadow-card">
          <img
            src="https://images.unsplash.com/photo-1600180758890-6d3cb53bbefe?auto=format&fit=crop&w=900&q=80"
            alt="Layering skincare textures on palette"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-paper/40 via-transparent to-transparent" />
        </div>
      </AnimatedSection>
    </div>
  )
}

const NewArrivalsContent = (): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const launchCalendar = [
    {
      name: 'Neem Dew Essence Mist',
      launch: '15 March',
      focus: 'Flash hydration infused with niacinamide and holy basil hydrosol.',
    },
    {
      name: 'Midnight Recovery Cloud Mask',
      launch: '6 April',
      focus: 'Barrier-repairing ceramide souffle with moth bean retinol alternative.',
    },
    {
      name: 'Sunveil Mineral SPF 40',
      launch: '24 April',
      focus: 'Triple protection against UVA, UVB, and digital glare with zero white cast.',
    },
  ]

  const labNotes = [
    {
      title: 'Sensory-first textures',
      description:
        'We co-create swatches with our in-house estheticians to ensure glide, slip, and dry-down complement Indian humidity.',
    },
    {
      title: 'Rigorous patch testing',
      description:
        'Every launch goes through 7,200 cumulative patch tests across diverse melanin-rich skin to anticipate sensitivities.',
    },
    {
      title: 'Community beta panels',
      description:
        'Our Varoganic Insiders sample early batches, logging texture, scent, and results in a shared ritual diary.',
    },
  ]

  const waitlistBenefits = ['Early access shopping window', 'Launch-only ritual pairing card', 'Priority restock alerts']

  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Fresh blends landing every moon cycle</h2>
          <p className="max-w-3xl text-sm text-muted">
            New arrivals arrive in micro-lots every 3–4 weeks so the botanicals stay potent. Tap a drop in our launch calendar to set
            reminders.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {launchCalendar.map((product) => (
            <motion.div
              key={product.name}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 130, damping: 12 }}
              className="flex h-full flex-col justify-between rounded-3xl border border-lines bg-paper px-5 py-6 shadow-card"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{product.launch}</p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{product.name}</h3>
                <p className="mt-3 text-sm text-body">{product.focus}</p>
              </div>
              <a
                href="/shop?sort=newest"
                className="mt-6 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Notify me
              </a>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="leadership" variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Inside the Varoganic lab</h2>
          <p className="text-sm text-muted">
            Formulations move through sensory, stability, and efficacy checkpoints before we share them with you.
          </p>
          <ul className="space-y-4 text-sm text-body">
            {labNotes.map((note) => (
              <li key={note.title} className="rounded-2xl border border-lines bg-paper px-4 py-3 shadow-inner">
                <p className="font-medium text-primary">{note.title}</p>
                <p className="mt-1 text-muted">{note.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex h-full w-full flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-lines bg-paper p-6 shadow-card">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Launch waitlist</p>
            <h3 className="text-lg font-semibold text-ink">Be the first to try each drop</h3>
            <p className="text-sm text-body">
              Sign up to unlock early access windows, paired ritual guides, and private community AMAs with our formulators.
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              const form = event.currentTarget
              form.reset()
            }}
          >
            <Input label="Email" type="email" name="email" placeholder="you@example.com" required helperText="We send 2 launch emails a month." />
            <Button type="submit" variant="primary">
              Join early access
            </Button>
          </form>
          <ul className="space-y-2 text-xs text-muted">
            {waitlistBenefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-primary">
                  ●
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      <AnimatedSection className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Launch ritual preview</h2>
          <p className="max-w-3xl text-sm text-muted">
            Each newcomer ships with a three-week rhythm plan. Pair it with existing staples to see faster, longer-lasting results.
          </p>
        </header>
        <div className="grid gap-5 md:grid-cols-3">
          {['Week 1: Gentle acclimation', 'Week 2: Active layering', 'Week 3: Lock the glow'].map((title) => (
            <motion.div
              key={title}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex h-full flex-col justify-between rounded-3xl border border-lines bg-paper px-5 py-6 shadow-card/30"
            >
              <h3 className="text-base font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm text-body">
                Alternate with barrier-friendly basics, introduce night actives, and then seal with ceramide souffles for plump, lit-from-within skin.
              </p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}

const GiftBundlesContent = (): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const bundles = [
    {
      name: 'Morning Dew Duo',
      savings: 'Save 14% vs. individual',
      description: 'Holy basil cleansing whip + Aloe cloud gel moisturiser to awaken and balance combination skin moods.',
      href: '/shop?concern=Hydration',
    },
    {
      name: 'Weekend Reset Trunk',
      savings: 'Save 18%',
      description: 'Exfoliating ubtan polish, tulsi clay masque, and moringa facial oil for Sunday detox rituals.',
      href: '/shop?concern=Purifying',
    },
    {
      name: 'Eternal Glow Ceremony',
      savings: 'Save 22%',
      description: 'Bakuchiol night serum, rosehip elixir, and saffron luminising cream for pre-event luminosity.',
      href: '/shop?concern=Brightening',
    },
  ]

  const giftingMoments = [
    { title: 'Festive hampers', detail: 'Customise Diwali trays with brass accessories, handwritten notes, and artisanal incense.' },
    { title: 'Wedding favours', detail: 'Mini clay masques paired with rose quartz spoons and name tags for mehendi giveaways.' },
    { title: 'Corporate care kits', detail: 'Desk hydration bundles with adaptogenic tea, mist, and aromatherapy roll-ons.' },
  ]

  const steps = [
    {
      step: 'Tell us about the recipient',
      copy: 'Share their skin concerns, scent preferences, and daily rituals. Our concierges curate textures they will actually finish.',
    },
    {
      step: 'We assemble & dress the bundle',
      copy: 'Every gift arrives in seed-paper boxes with pressed botanical keepsakes and reusable muslin pouches.',
    },
    {
      step: 'Add a personal voice note',
      copy: 'Record a message on our secure microsite. Recipients scan the NFC token to hear your wishes when they unbox.',
    },
  ]

  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Bundles brewed for every love language</h2>
          <p className="max-w-3xl text-sm text-muted">
            Choose a ready-to-ship ritual or personalise the sensory journey with engraved accessories, playlists, and printed affirmations.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {bundles.map((bundle) => (
            <motion.a
              key={bundle.name}
              href={bundle.href}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              className="group flex h-full flex-col justify-between rounded-3xl border border-lines bg-paper p-6 shadow-card"
            >
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{bundle.savings}</p>
                <h3 className="text-lg font-semibold text-ink">{bundle.name}</h3>
                <p className="text-sm text-body">{bundle.description}</p>
              </div>
              <span className="mt-6 inline-flex items-center text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                View bundle →
              </span>
            </motion.a>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Gifting concierge</h2>
          <p className="text-sm text-muted">
            Our team dreams up tactile unboxings that mirror the story you want to tell. From seed paper cards to custom embroideries, we handle every nuance.
          </p>
          <ul className="space-y-3 text-sm text-body">
            {giftingMoments.map((moment) => (
              <li key={moment.title} className="rounded-2xl border border-lines bg-paper px-4 py-3 shadow-inner">
                <p className="font-medium text-primary">{moment.title}</p>
                <p className="mt-1 text-muted">{moment.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-lines bg-paper p-6 shadow-card">
          <h3 className="text-lg font-semibold text-ink">How it works</h3>
          <ol className="space-y-4 text-sm text-body">
            {steps.map((item, index) => (
              <li key={item.step} className="flex gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-primary">{item.step}</p>
                  <p className="mt-1 text-muted">{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <a
            href="mailto:concierge@varoganic.com"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Start bespoke brief →
          </a>
        </div>
      </AnimatedSection>

      <AnimatedSection className="space-y-4">
        <h2 className="font-heading text-h3 text-ink">Moments we love to celebrate</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            'First-trimester care packages with fragrance-free rituals and grounding teas.',
            'Promotion applauses with desk-friendly energy sprays and focus mists.',
            'Sibling gratitude boxes featuring dual routines for shared vanity shelves.',
            'Retreat welcome kits complete with body polishes, hair oils, and mindful journaling prompts.',
          ].map((item) => (
            <motion.div
              key={item}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 160, damping: 16 }}
              className="rounded-3xl border border-lines bg-paper px-5 py-4 text-sm text-body shadow-card/20"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}

const IngredientStoriesContent = (): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const ingredients = [
    {
      name: 'Kalonji (Black seed)',
      origin: 'Coorg, India',
      profile:
        'Cold-pressed within 8 hours of harvest to retain thymoquinone. Calms inflammation and balances sebum without clogging pores.',
      ritual: 'Find it in our Clarifying Nectar Serum.',
      image:
        'https://images.unsplash.com/photo-1615485290382-43c82f75bd73?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Vetiver root',
      origin: 'Madurai, India',
      profile:
        'Hydro-distilled to create a mineral-rich hydrosol. Grounds the nervous system while delivering cooling hydration to overheated skin.',
      ritual: 'A star in our Grounding Essence Mist.',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Sea Buckthorn berry',
      origin: 'Leh, India',
      profile:
        'Hand-plucked at sunrise, sun-dried, and CO₂ extracted. Overflowing with Omegas 3, 6, 7, 9 for deep barrier repair.',
      ritual: 'Whipped into our Radiance Concentrate.',
      image:
        'https://images.unsplash.com/photo-1615485290715-ecfd6718b02f?auto=format&fit=crop&w=600&q=80',
    },
  ]

  const extractionSteps = [
    {
      title: 'Farmer-first sourcing',
      detail:
        'We partner with regenerative farms and women-run cooperatives, paying 14% above Fairtrade rates and funding soil health labs.',
    },
    {
      title: 'Low-temperature extraction',
      detail:
        'Phytonutrients degrade above 45°C. Our oils are pressed slowly in climate-controlled rooms to keep actives vibrant.',
    },
    {
      title: 'Triple filtration',
      detail:
        'Each extract rests for 72 hours before passing through bamboo charcoal filters that remove residue but keep aromatics intact.',
    },
  ]

  const clinicalNotes = [
    'Dermatologist panel reviews ingredient synergy for sensitivity-prone skin.',
    'Every batch is third-party tested for heavy metals, pesticides, and microbial safety.',
    'We publish our potency indices so you know the exact percentage of each active and why it is there.',
  ]

  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Our botanicals, their journeys</h2>
          <p className="max-w-3xl text-sm text-muted">
            Every ingredient has a provenance, a story, and a mood. Meet a few of the heroes that make Varoganic rituals addictive.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {ingredients.map((ingredient) => (
            <motion.article
              key={ingredient.name}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-lines bg-paper shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={ingredient.image} alt={ingredient.name} className="size-full object-cover" loading="lazy" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper/30 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{ingredient.origin}</p>
                <h3 className="text-lg font-semibold text-ink">{ingredient.name}</h3>
                <p className="text-sm text-body">{ingredient.profile}</p>
                <p className="text-sm font-medium text-primary">{ingredient.ritual}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Extraction rituals</h2>
          <p className="text-sm text-muted">
            We treat extraction like slow craft. Gentle methods keep the actives intact while minimising waste.
          </p>
          <ol className="space-y-4 text-sm text-body">
            {extractionSteps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-primary">{step.title}</p>
                  <p className="mt-1 text-muted">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-lines bg-paper p-6 shadow-card">
          <h3 className="text-lg font-semibold text-ink">Clinical validation snapshots</h3>
          <ul className="space-y-3 text-sm text-body">
            {clinicalNotes.map((note) => (
              <li key={note} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 text-primary">
                  ✺
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
          <a
            href="/shop?sort=featured"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Shop by ingredient →
          </a>
        </div>
      </AnimatedSection>

      <AnimatedSection className="space-y-4">
        <h2 className="font-heading text-h3 text-ink">Transparency promise</h2>
        <div className="space-y-3 rounded-3xl border border-lines bg-paper px-5 py-4 text-sm text-body shadow-card/20">
          <p>
            Every product page lists sourcing coordinates, extraction method, allergen notes, and third-party lab reports. Scan the QR code on
            your bottle to trace the journey from seed to sink.
          </p>
          <p>Still curious? Our ingredient educators host live breakdowns every Friday on Instagram @varoganic.</p>
        </div>
      </AnimatedSection>
    </div>
  )
}

const faqItems = [
  {
    id: 'order-window',
    question: 'How long do orders take to ship?',
    answer:
      'Orders ship within 24 hours (Mon–Sat) from our Mumbai ritual studio. Metro deliveries reach within 2-3 working days, while tier-2 cities take 4-6 working days. You will receive tracking updates via WhatsApp and email at every milestone.',
  },
  {
    id: 'custom-routines',
    question: 'Can I get a customised routine recommendation?',
    answer:
      'Absolutely. Tap the routine quiz or write to ritualguide@varoganic.com with a selfie in natural light, current regimen, and pinch tests you have tried. Our skin coaches respond within 36 hours.',
  },
  {
    id: 'returns',
    question: 'What is your return or exchange policy?',
    answer:
      'For safety, we accept returns on sealed, unused products within 10 days of delivery. If something arrives damaged, share photos within 48 hours and we will dispatch a fresh batch instantly.',
  },
  {
    id: 'sensitive-skin',
    question: 'Are the products safe for pregnancy or sensitive skin?',
    answer:
      'Yes. Most rituals are pregnancy-safe and formulated without essential oils, parabens, or drying alcohols. Look for the pregnancy-safe badge on each product page. Patch test on the inner arm if you are introducing new actives.',
  },
  {
    id: 'subscriptions',
    question: 'Do you offer subscriptions or refills?',
    answer:
      'You can subscribe to recurring deliveries every 30, 45, or 60 days with up to 12% savings. Many products now come in aluminium or glass refills that slot into your original jar.',
  },
]

const FAQsContent = (): ReactElement => {
  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-4">
        <h2 className="font-heading text-h3 text-ink">Frequently asked rituals</h2>
        <p className="text-sm text-muted">
          Everything you ask us during consultations, compiled in one place. Still need guidance? Start a chat with our ritual guides.
        </p>
        <Accordion type="single" defaultValue={faqItems[0]?.id ?? ''}>
          {faqItems.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} title={faq.question}>
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>

      <AnimatedSection variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Need a human?</h2>
          <p className="text-sm text-muted">
            Our ritual care team is awake 9am–9pm IST, seven days a week. Expect a response in under 15 minutes during service hours.
          </p>
          <div className="space-y-3 text-sm text-body">
            <p>
              WhatsApp: <a className="text-primary" href="https://wa.me/917888654495">+91 999 999 8888</a>
            </p>
            <p>Email: <a className="text-primary" href="mailto:care@varoganic.com">care@varoganic.com</a></p>
            <p>DM: <a className="text-primary" href="https://instagram.com/varoganic">@varoganic</a></p>
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-lines bg-paper p-6 shadow-card">
          <h3 className="text-lg font-semibold text-ink">Live consultation slots</h3>
          <p className="text-sm text-body">Book a 15-minute video ritual consult with our skin coaches.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {['Monday 7PM', 'Wednesday 1PM', 'Thursday 8AM', 'Saturday 11AM'].map((slot) => (
              <div key={slot} className="rounded-full border border-lines px-4 py-2 text-center text-sm text-primary">
                {slot}
              </div>
            ))}
          </div>
          <a
            href="mailto:consult@varoganic.com?subject=Ritual%20consult%20booking"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Reserve a slot →
          </a>
        </div>
      </AnimatedSection>
    </div>
  )
}

type OrderStatus = {
  readonly id: string
  readonly status: 'Processing' | 'Packed' | 'In transit' | 'Out for delivery' | 'Delivered'
  readonly eta: string
  readonly courier: string
  readonly timeline: Array<{
    readonly title: string
    readonly description: string
    readonly timestamp: string
  }>
}

const orders: Record<string, OrderStatus> = {
  VGO12874: {
    id: 'VGO12874',
    status: 'Out for delivery',
    eta: 'Arriving today between 5 – 7 PM',
    courier: 'Delhivery Express Air',
    timeline: [
      { title: 'Order confirmed', description: 'Payment received and ritual queued for batching.', timestamp: '02 Mar • 11:18 AM' },
      { title: 'Packed with botanicals', description: 'Our fulfilment team sealed your kit in temperature controlled boxes.', timestamp: '02 Mar • 9:42 PM' },
      { title: 'Dispatched from Mumbai hub', description: 'Handed over to Delhivery • Tracking ID DLV569911', timestamp: '03 Mar • 7:05 AM' },
      { title: 'Arrived at city facility', description: 'Out for delivery with rider Aditi', timestamp: '04 Mar • 8:54 AM' },
    ],
  },
  VGO12875: {
    id: 'VGO12875',
    status: 'In transit',
    eta: 'Expected by 7 March',
    courier: 'BlueDart Climate Neutral',
    timeline: [
      { title: 'Order confirmed', description: 'We locked your botanicals into production.', timestamp: '28 Feb • 6:02 PM' },
      { title: 'Batch curing', description: 'Freshly poured moisturiser curing for 24 hours.', timestamp: '01 Mar • 8:00 AM' },
      { title: 'Dispatched from warehouse', description: 'Left our Pune facility.', timestamp: '01 Mar • 6:45 PM' },
      { title: 'In transit', description: 'Reached Bengaluru hub. Awaiting next scan.', timestamp: '03 Mar • 10:14 AM' },
    ],
  },
}

const statusBadgeStyles: Record<OrderStatus['status'], string> = {
  Processing: 'bg-warning/10 text-warning',
  Packed: 'bg-primary/10 text-primary',
  'In transit': 'bg-info/10 text-info',
  'Out for delivery': 'bg-accent/10 text-accent-strong',
  Delivered: 'bg-primary/10 text-primary',
}

const TrackOrderContent = (): ReactElement => {
  const [trackingInput, setTrackingInput] = useState('VGO12874')
  const [queriedId, setQueriedId] = useState('VGO12874')
  const trackingId = trackingInput.trim().toUpperCase()
  const order = orders[queriedId]

  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Track your ritual in real time</h2>
          <p className="max-w-3xl text-sm text-muted">
            Enter the Varoganic order ID from your confirmation email or WhatsApp message. We update scans every time your ritual reaches a new hub.
          </p>
        </header>
        <form
          className="flex flex-col gap-4 rounded-3xl border border-lines bg-paper p-6 shadow-card sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            if (orders[trackingId]) {
              setQueriedId(trackingId)
            } else {
              setQueriedId('')
            }
          }}
        >
          <div className="flex-1">
            <Input
              label="Order ID"
              placeholder="e.g. VGO12874"
              value={trackingInput}
              onChange={(event) => {
                setTrackingInput(event.target.value)
              }}
              required
              helperText="Find this in your order confirmation email."
            />
          </div>
          <Button type="submit" variant="primary" className="sm:w-auto">
            Track order
          </Button>
        </form>
        {queriedId && !order ? (
          <div className="rounded-3xl border border-warning/40 bg-warning/10 px-5 py-4 text-sm text-warning">
            We couldn&apos;t find that ID. Double-check the spelling or reply to your order email and we&apos;ll help within minutes.
          </div>
        ) : null}
      </AnimatedSection>

      {order ? (
        <AnimatedSection className="space-y-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-lines bg-paper p-6 shadow-card md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Order {order.id}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{order.status}</h3>
              <p className="text-sm text-body">{order.eta}</p>
            </div>
            <span className={cn('inline-flex rounded-full px-4 py-2 text-sm font-medium', statusBadgeStyles[order.status])}>
              {order.courier}
            </span>
          </div>
          <div className="space-y-4">
            <h4 className="font-heading text-base text-ink">Journey timeline</h4>
            <ul className="space-y-4">
              {order.timeline.map((event, index) => (
                <li key={event.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={cn('flex size-8 items-center justify-center rounded-full border border-lines bg-paper text-sm font-semibold text-primary', index === order.timeline.length - 1 ? 'border-primary bg-primary/10 text-primary' : '')}>
                      {index + 1}
                    </span>
                    {index !== order.timeline.length - 1 ? <span className="h-full w-px bg-lines" aria-hidden="true" /> : null}
                  </div>
                  <div className="rounded-3xl border border-lines bg-paper px-5 py-4 shadow-card/20">
                    <p className="text-sm font-medium text-primary">{event.title}</p>
                    <p className="mt-1 text-sm text-body">{event.description}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-muted">{event.timestamp}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      ) : null}

      <AnimatedSection variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Delivery promise</h2>
          <p className="text-sm text-muted">
            Rituals travel in insulated boxes with cold packs during summer months so your botanicals stay stable.
          </p>
          <ul className="space-y-3 text-sm text-body">
            <li>Same-day dispatch for orders placed before 3 PM IST.</li>
            <li>Reusable glass bottles nested in compostable moulded pulp trays.</li>
            <li>Free express upgrades for subscription members.</li>
          </ul>
        </div>
        <div className="space-y-3 rounded-3xl border border-lines bg-paper p-6 shadow-card">
          <h3 className="text-lg font-semibold text-ink">Contact the rider</h3>
          <p className="text-sm text-body">Need to reschedule? Message your rider directly after the out-for-delivery scan.</p>
          <div className="rounded-2xl border border-lines bg-paper px-4 py-3 text-sm text-primary">
            SMS “RESCHEDULE” + your order ID to 88822 44220
          </div>
          <p className="text-xs text-muted">Works across major couriers including Delhivery, BlueDart, and Ecom Express.</p>
        </div>
      </AnimatedSection>
    </div>
  )
}

const AboutContent = (): ReactElement => {
  const milestones = [
    {
      year: '2016',
      title: 'Seed of an idea',
      description:
        'Founder Rhea Kundra begins blending cold-pressed oils for her mother, documenting barrier repair recipes from family Ayurvedic journals.',
    },
    {
      year: '2018',
      title: 'Ritual studio opens',
      description: 'Our first micro-batch studio launches in Mumbai with 6 formulators and a community of 500 early adopters.',
    },
    {
      year: '2020',
      title: 'Dermatologist collective',
      description: 'We onboard Dr. Aditi Sharma and a panel of dermatologists to co-create actives for melanin-rich skin.',
    },
    {
      year: '2023',
      title: 'Nationwide glow',
      description: 'Varoganic rituals reach 120,000 households with refillable packaging and climate neutral shipping.',
    },
  ]

  const values = [
    {
      title: 'Plant intelligence meets clinical rigour',
      detail:
        'Every formulation pairs time-honoured botanicals with clinically proven actives to deliver visible results without compromising joy.',
    },
    {
      title: 'Circular by design',
      detail:
        'We invest in glass refills, seed-paper sleeves, and aluminium lids. 87% of our packaging is recyclable or reusable.',
    },
    {
      title: 'Community-led innovation',
      detail:
        'Ritual diaries, WhatsApp focus groups, and beta trials inform our next drops. You tell us what skin mood you want to solve next.',
    },
  ]

  const leadership = [
    {
      name: 'Rhea Kundra',
      role: 'Founder & Formulator-in-chief',
      note: 'Her mission: make mindful routines effortless for Indian skin navigating climate stress.',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Dr. Aditi Sharma',
      role: 'Dermatology Partner',
      note: 'Board-certified dermatologist overseeing clinical testing and skin coach training.',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    },
  ]

  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">The Varoganic story</h2>
          <p className="max-w-3xl text-sm text-muted">
            We exist to help you build rituals that feel like an exhale — grounding, sensory, and clinically rewarding for melanin-rich skin.
          </p>
        </header>
        <div className="space-y-6">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="flex flex-col gap-4 rounded-3xl border border-lines bg-paper p-6 shadow-card md:flex-row md:items-start md:gap-8">
              <div className="flex-shrink-0 text-3xl font-semibold text-primary md:text-4xl">{milestone.year}</div>
              <div>
                <h3 className="text-lg font-semibold text-ink">{milestone.title}</h3>
                <p className="mt-2 text-sm text-body">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Our values</h2>
          <p className="text-sm text-muted">Every decision has to nurture people, planet, and soulful routines.</p>
          <ul className="space-y-4 text-sm text-body">
            {values.map((value) => (
              <li key={value.title} className="rounded-3xl border border-lines bg-paper px-5 py-4 shadow-card/20">
                <p className="text-base font-medium text-primary">{value.title}</p>
                <p className="mt-2 text-muted">{value.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-6">
          {leadership.map((leader) => (
            <div key={leader.name} className="overflow-hidden rounded-3xl border border-lines bg-paper shadow-card">
              <img src={leader.image} alt={leader.name} className="h-56 w-full object-cover" loading="lazy" />
              <div className="space-y-2 px-6 py-4">
                <p className="text-sm uppercase tracking-[0.3em] text-muted">{leader.role}</p>
                <h3 className="text-lg font-semibold text-ink">{leader.name}</h3>
                <p className="text-sm text-body">{leader.note}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="space-y-4">
        <h2 className="font-heading text-h3 text-ink">Join the ritual circle</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: 'Skincare circles',
              copy: 'Monthly gatherings on mindful skincare led by therapists and breathwork coaches.',
            },
            {
              title: 'Community composting',
              copy: 'Bring your empties to our studio. We clean, refill, or recycle them responsibly.',
            },
            {
              title: 'Ingredient residencies',
              copy: 'Spend a weekend on our partner farms to see how botanicals are grown and harvested.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-lines bg-paper px-5 py-4 text-sm text-body shadow-card/20">
              <p className="text-base font-semibold text-primary">{item.title}</p>
              <p className="mt-2 text-muted">{item.copy}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}

const SustainabilityContent = (): ReactElement => {
  const stats = [
    { label: 'Water saved in 2023', value: '1.8 million litres', detail: 'Through rainwater harvesting and waterless powder cleansers.' },
    { label: 'Packaging circularity', value: '87% refillable', detail: 'Glass, aluminium, and seed paper components designed for reuse.' },
    { label: 'Farmer partners', value: '42 cooperatives', detail: 'Across Maharashtra, Assam, and Leh supporting regenerative agriculture.' },
  ]

  const initiatives = [
    {
      title: 'Soil health labs',
      description:
        'We fund on-site soil labs that monitor microbial activity, moisture, and nutrient density so farmers can adapt regenerative practices with data.',
    },
    {
      title: 'Zero-waste batching',
      description:
        'Our studio only pours micro-lots based on demand forecasting. Offcuts are upcycled into solid perfumes and hand balms for community drives.',
    },
    {
      title: 'Climate neutral shipping',
      description: 'We offset carbon via verified agroforestry projects and bundle metro deliveries using EV fleets during peak hours.',
    },
  ]

  const roadmap = [
    {
      year: '2024',
      goal: 'Launch refill bars in 6 cities',
      detail: 'Bring your empties to refill counters and earn ritual credits.',
    },
    {
      year: '2025',
      goal: '100% compostable secondary packaging',
      detail: 'Phasing out laminated labels in favour of plant-based inks and adhesives.',
    },
    {
      year: '2026',
      goal: 'Solar-powered production',
      detail: 'Transitioning our studio to rooftop solar and sharing energy with neighbouring artisans.',
    },
  ]

  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Sourcing with soul</h2>
          <p className="max-w-3xl text-sm text-muted">
            Sustainability isn’t a checklist. It’s a living practice with the farmers, scientists, and dreamers who make Varoganic possible.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-lines bg-paper p-6 text-sm text-body shadow-card/20">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">{stat.label}</p>
              <p className="mt-3 text-lg font-semibold text-primary">{stat.value}</p>
              <p className="mt-2 text-muted">{stat.detail}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Regenerative initiatives</h2>
          <p className="text-sm text-muted">Every purchase funds better soil and better futures.</p>
          <ul className="space-y-4 text-sm text-body">
            {initiatives.map((item) => (
              <li key={item.title} className="rounded-3xl border border-lines bg-paper px-5 py-4 shadow-card/20">
                <p className="text-base font-medium text-primary">{item.title}</p>
                <p className="mt-2 text-muted">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-5 rounded-3xl border border-lines bg-paper p-6 shadow-card">
          <h3 className="text-lg font-semibold text-ink">2024 Impact Report</h3>
          <p className="text-sm text-body">
            Peek into detailed lifecycle assessments, sourcing audits, and community investments. We publish updates every quarter.
          </p>
          <a
            href="https://varoganic.com/impact-report.pdf"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Download report →
          </a>
          <p className="text-xs text-muted">PDF • 3.5 MB</p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="space-y-4">
        <h2 className="font-heading text-h3 text-ink">Roadmap to 2026</h2>
        <div className="space-y-4">
          {roadmap.map((item) => (
            <div key={item.year} className="flex flex-col gap-4 rounded-3xl border border-lines bg-paper p-6 shadow-card md:flex-row md:items-center md:justify-between">
              <div className="text-2xl font-semibold text-primary md:text-3xl">{item.year}</div>
              <div className="md:flex-1">
                <p className="text-base font-medium text-ink">{item.goal}</p>
                <p className="mt-1 text-sm text-body">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}

const PressContent = (): ReactElement => {
  const features = [
    {
      outlet: 'Vogue India',
      headline: 'The homegrown brand decoding climate-aware skincare',
      date: 'Jan 2024',
      link: 'https://www.vogue.in',
    },
    {
      outlet: 'The Hindu',
      headline: 'Harnessing indigenous botanicals for urban skin stress',
      date: 'Nov 2023',
      link: 'https://www.thehindu.com',
    },
    {
      outlet: 'Elle India',
      headline: 'Why dermatologists recommend Varoganic routines',
      date: 'Sep 2023',
      link: 'https://elle.in',
    },
  ]

  const pressAssets = [
    { label: 'Brand story deck', size: '6 MB • PPTX', href: 'https://varoganic.com/press/brand-story.pptx' },
    { label: 'Product imagery (HI-RES)', size: '18 MB • ZIP', href: 'https://varoganic.com/press/imagery.zip' },
    { label: 'Founder bio sheet', size: '1.8 MB • PDF', href: 'https://varoganic.com/press/founder-bio.pdf' },
  ]

  const talkingPoints = [
    'Micro-batching ensures zero inventory burn and fresher actives for customers.',
    'We partner with 42 regenerative farms and publish potency indices for transparency.',
    'All formulas are vegan, cruelty-free, and dermatologist reviewed for melanin-rich skin.',
  ]

  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Featured press</h2>
          <p className="max-w-3xl text-sm text-muted">
            We love partnering with storytellers, beauty editors, and creators who care about slow rituals and mindful skincare.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <a
              key={feature.headline}
              href={feature.link}
              className="flex h-full flex-col justify-between rounded-3xl border border-lines bg-paper p-6 text-left shadow-card transition-colors hover:border-primary"
            >
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{feature.outlet}</p>
                <h3 className="text-lg font-semibold text-ink">{feature.headline}</h3>
              </div>
              <p className="mt-4 text-sm text-primary">{feature.date} →</p>
            </a>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Press assets</h2>
          <p className="text-sm text-muted">Download approved imagery, logos, and bios for editorial coverage.</p>
          <ul className="space-y-3 text-sm text-body">
            {pressAssets.map((asset) => (
              <li key={asset.label} className="flex items-center justify-between rounded-3xl border border-lines bg-paper px-5 py-4 shadow-card/20">
                <div>
                  <p className="font-medium text-primary">{asset.label}</p>
                  <p className="text-xs uppercase tracking-wide text-muted">{asset.size}</p>
                </div>
                <a
                  href={asset.href}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 rounded-3xl border border-lines bg-paper p-6 shadow-card">
          <h3 className="text-lg font-semibold text-ink">Need a quote or expert?</h3>
          <p className="text-sm text-body">We can contribute expert commentary on dermatologist-backed botanicals, sustainable packaging, and mindful rituals.</p>
          <ul className="space-y-2 text-sm text-body">
            {talkingPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 text-primary">
                  ●
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <a
            href="mailto:press@varoganic.com"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Connect with press team →
          </a>
        </div>
      </AnimatedSection>
    </div>
  )
}

const CareersContent = (): ReactElement => {
  const roles = [
    {
      title: 'Senior Formulation Scientist',
      type: 'Full-time • Mumbai studio',
      description:
        'Own R&D across new rituals, run stability tests, and collaborate with dermatology partners to bring climate-aware actives to life.',
      tags: ['5+ years experience', 'Chemistry / Cosmetic Science'],
      email: 'careers@varoganic.com?subject=Senior%20Formulation%20Scientist',
    },
    {
      title: 'Lifecycle Marketing Lead',
      type: 'Full-time • Remote (India)',
      description:
        'Design lifecycle flows, craft ritual education series, and build retention programs that feel like a warm hug, not spam.',
      tags: ['4+ years experience', 'CRM & storytelling'],
      email: 'careers@varoganic.com?subject=Lifecycle%20Marketing%20Lead',
    },
    {
      title: 'Retail Experience Manager',
      type: 'Contract • Bengaluru',
      description:
        'Launch our first refill bar experience — from aroma curation to team training and community events.',
      tags: ['Customer experience', 'Events'],
      email: 'careers@varoganic.com?subject=Retail%20Experience%20Manager',
    },
  ]

  const culture = [
    {
      title: 'Flexible rituals',
      detail: '4-day workweeks every alternate month and wellness stipends to try new healing modalities.',
    },
    {
      title: 'Learning credits',
      detail: '₹20,000 annual allowance for certifications, workshops, or residencies at our partner farms.',
    },
    {
      title: 'Inclusive benefits',
      detail: 'Gender-neutral parental leave, mental health coverage, and transition support for trans employees.',
    },
  ]

  return (
    <div className="space-y-10">
      <AnimatedSection className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading text-h3 text-ink">Open roles</h2>
          <p className="max-w-3xl text-sm text-muted">We hire people who are obsessed with sensorial details and building better futures.</p>
        </header>
        <div className="space-y-5">
          {roles.map((role) => (
            <div key={role.title} className="flex flex-col gap-4 rounded-3xl border border-lines bg-paper p-6 shadow-card md:flex-row md:items-center md:justify-between">
              <div className="md:max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{role.type}</p>
                <h3 className="mt-2 text-lg font-semibold text-ink">{role.title}</h3>
                <p className="mt-3 text-sm text-body">{role.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-primary">
                  {role.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={`mailto:${role.email}`}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
              >
                Apply via email →
              </a>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="split" className="items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-h3 text-ink">Life at Varoganic</h2>
          <p className="text-sm text-muted">Built for curious makers, scientists, storytellers, and care-first humans.</p>
          <ul className="space-y-4 text-sm text-body">
            {culture.map((item) => (
              <li key={item.title} className="rounded-3xl border border-lines bg-paper px-5 py-4 shadow-card/20">
                <p className="text-base font-medium text-primary">{item.title}</p>
                <p className="mt-2 text-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 rounded-3xl border border-lines bg-paper p-6 shadow-card">
          <h3 className="text-lg font-semibold text-ink">Not seeing your role?</h3>
          <p className="text-sm text-body">Send us a note on how you want to shape the future of slow skincare.</p>
          <a
            href="mailto:talent@varoganic.com?subject=Dream%20role%20pitch"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Pitch a role →
          </a>
          <p className="text-xs text-muted">Attach a one-page ritual resume or portfolio link.</p>
        </div>
      </AnimatedSection>
    </div>
  )
}

const PrivacyPolicyContent = (): ReactElement => {
  const sections: Array<PolicySection> = [
    {
      title: 'How we collect your data',
      paragraphs: [
        'We collect the information you share when you create an account, place an order, or join our ritual waitlists. This includes your name, contact details, shipping address, and product preferences gathered through quizzes or consultations.',
        'We also receive anonymised analytics data via cookies and pixels to understand store performance. You can opt out through Cookie Preferences at any time.',
      ],
    },
    {
      title: 'How we use your information',
      paragraphs: [
        'Data fuels personalised rituals — from replenishment reminders to ingredient education. We only email you when you explicitly opt in. Your mobile number helps us send delivery updates or urgent recalls.',
        'We never sell your data. Select, vetted partners (payment gateways, fulfilment, dermatology consultants) access the minimum data needed to serve you.',
      ],
      list: ['Process and deliver your orders securely', 'Provide customer support and skincare consultations', 'Send ritual education, offers, or community event invites (only with consent)'],
    },
    {
      title: 'Your privacy controls',
      paragraphs: [
        'You can request, update, or delete your data by emailing privacy@varoganic.com. We respond to all requests within 7 working days.',
        'Unsubscribe links appear in every marketing email. Transactional updates remain active so you never miss delivery alerts.',
      ],
    },
    {
      title: 'Data retention & security',
      paragraphs: [
        'Order data is retained for 5 years to comply with accounting laws. Consultation notes are stored for 24 months so our coaches can recommend relevant follow-ups.',
        'Our systems run on encrypted servers with restricted access, multi-factor authentication, and regular security audits.',
      ],
      note: 'Last updated: 01 March 2024. Significant changes will always land in your inbox first.',
    },
  ]

  return <PolicySections sections={sections} />
}

const TermsContent = (): ReactElement => {
  const sections: Array<PolicySection> = [
    {
      title: 'Using our website',
      paragraphs: [
        'By accessing varoganic.com, you agree to use the platform responsibly. Content (images, copy, ritual guides) is owned by Varoganic and cannot be republished without permission.',
        'We may update services, prices, or availability without prior notice. Cart totals are confirmed at checkout before you are charged.',
      ],
    },
    {
      title: 'Orders & cancellations',
      paragraphs: [
        'Orders are confirmed once payment succeeds. You can modify or cancel within 2 hours by contacting care@varoganic.com. After shipping, cancellations are not possible.',
        'If a product is out of stock post-purchase, we will notify you and offer a full refund or an alternative ritual recommendation.',
      ],
    },
    {
      title: 'Returns & refunds',
      paragraphs: [
        'We accept returns on sealed, unused products within 10 days of delivery. Initiate a request via your order confirmation or by emailing returns@varoganic.com.',
        'Refunds are processed to your original payment method within 7 working days of inspection.',
      ],
    },
    {
      title: 'Liability disclaimer',
      paragraphs: [
        'Our products are formulated with dermatological rigour. However, skin responses vary. Please patch test and consult a doctor if you have medical concerns.',
        'Varoganic is not responsible for delays caused by third-party couriers or force majeure events, though we will always help resolve them as swiftly as possible.',
      ],
      note: 'Effective date: 01 March 2024.',
    },
  ]

  return <PolicySections sections={sections} />
}

const CookiesContent = (): ReactElement => {
  const sections: Array<PolicySection> = [
    {
      title: 'Essential cookies',
      paragraphs: [
        'These cookies keep the store functional — remembering cart items, processing payments, and maintaining secure sessions. They can’t be switched off.',
      ],
    },
    {
      title: 'Performance & personalisation cookies',
      paragraphs: [
        'We use analytics cookies to study product popularity and improve navigation. Personalisation cookies allow us to recommend routines tailored to your skin mood.',
      ],
      list: ['Analytics: Shopify, Google Analytics (IP anonymised)', 'Personalisation: Klaviyo for ritual journeys', 'Advertising: Meta pixel for opt-in campaigns'],
    },
    {
      title: 'Managing preferences',
      paragraphs: [
        'Toggle categories from the Cookie Preferences centre in our footer. You can revisit the panel anytime and update your choices instantly.',
      ],
      note: 'Preferences reset every 12 months or sooner if regulations change.',
    },
  ]

  return <PolicySections sections={sections} />
}

const AccessibilityContent = (): ReactElement => {
  const sections: Array<PolicySection> = [
    {
      title: 'Our accessible design approach',
      paragraphs: [
        'We design Varoganic for everyone. Colours follow WCAG AA contrast, text is resizable, and primary actions are large enough for comfortable tapping.',
        'Screen reader labels, semantic HTML, and descriptive alt text help you navigate whether you use a keyboard, assistive tech, or voice control.',
      ],
    },
    {
      title: 'Ongoing improvements',
      paragraphs: [
        'Quarterly accessibility audits ensure we meet or exceed WCAG 2.2 AA guidance. We work with accessibility consultants and community testers to continuously remove friction.',
      ],
      list: ['Keyboard testing for all interactive components', 'Video captions and transcripts for ritual workshops', 'Reduced-motion-friendly animations across the site'],
    },
    {
      title: 'Need assistance?',
      paragraphs: [
        'Email access@varoganic.com or WhatsApp +91 999 999 7777 for personalised support. We offer human-guided shopping sessions and product guides in large-print PDF.',
      ],
      note: 'Statement updated: 01 March 2024. We welcome your feedback to do better.',
    },
  ]

  return <PolicySections sections={sections} />
}

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

const pages: Record<string, PageDefinition> = {
  '/shop/all-products': {
    hero: {
      eyebrow: 'Shop',
      title: 'All Varoganic products',
      description:
        'Explore every ritual we craft — from cold-pressed cleansing bars to adaptogenic serums. Filter by skin mood, texture, or occasion to build a routine that feels personal.',
      image: {
        src: 'https://images.unsplash.com/photo-1542838686-73e7d57d07d8?auto=format&fit=crop&w=900&q=80',
        alt: 'Varoganic product arrangement on marble tray',
      },
      actions: [
        { label: 'Shop bestsellers', href: '/shop?sort=featured' },
        { label: 'Take routine quiz', href: '/shop?concern=Hydration', variant: 'secondary' },
      ],
      highlights: [
        { label: 'Formulations', value: '38 ritual staples' },
        { label: 'Botanical actives', value: '72% indigenous sourcing' },
      ],
    },
    Component: AllProductsContent,
    seo: {
      title: 'All Products | Varoganic',
      description:
        'Browse every Varoganic skincare ritual, thoughtfully crafted with indigenous botanicals and dermatologist guidance.',
      path: '/shop/all-products',
      image: 'https://images.unsplash.com/photo-1542838686-73e7d57d07d8?auto=format&fit=crop&w=1200&q=80',
    },
  },
  '/shop/new-arrivals': {
    hero: {
      eyebrow: 'Launchpad',
      title: 'New arrivals & limited drops',
      description:
        'Be the first to meet our freshest formulations. Micro-batched, lab-verified, and inspired by the skincare questions you send us.',
      image: {
        src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
        alt: 'New skincare products arranged on pastel background',
      },
      actions: [
        { label: 'Shop newest first', href: '/shop?sort=newest' },
        { label: 'Join early access', href: '#launch-waitlist', variant: 'secondary' },
      ],
      highlights: [
        { label: 'Drop cadence', value: 'Every 3-4 weeks' },
        { label: 'Insider panel', value: '2,100 beta testers' },
      ],
    },
    Component: NewArrivalsContent,
    seo: {
      title: 'New Arrivals | Varoganic',
      description: 'Discover the latest Varoganic rituals and limited edition drops before they sell out.',
      path: '/shop/new-arrivals',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    },
  },
  '/shop/gift-bundles': {
    hero: {
      eyebrow: 'Gift Bundles',
      title: 'Ritual gifting, reimagined',
      description:
        'Curated bundles and bespoke concierge styling for every milestone. Layered with sensorial keepsakes that feel deeply personal.',
      image: {
        src: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80',
        alt: 'Gift boxes with skincare and flowers',
      },
      actions: [
        { label: 'Browse curated sets', href: '/shop?concern=Brightening' },
        { label: 'Email concierge', href: 'mailto:concierge@varoganic.com', variant: 'secondary' },
      ],
      highlights: [
        { label: 'Bundles crafted', value: '12,400+ to date' },
        { label: 'Bespoke lead time', value: '3-5 days' },
      ],
    },
    Component: GiftBundlesContent,
    seo: {
      title: 'Gift Bundles | Varoganic',
      description: 'Celebrate every occasion with personalised Varoganic gift bundles, concierge styling, and ritual storytelling.',
      path: '/shop/gift-bundles',
      image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=1200&q=80',
    },
  },
  '/ingredient-stories': {
    hero: {
      eyebrow: 'Ingredients',
      title: 'Ingredient stories & origins',
      description:
        'Trace every botanical back to the soil. Discover how we extract, test, and blend ingredients to keep them potent and kind.',
      image: {
        src: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80',
        alt: 'Botanical ingredients on table',
      },
      actions: [{ label: 'Shop by ingredient', href: '/shop?sort=featured' }],
      highlights: [
        { label: 'Hero botanicals', value: '32 extracts' },
        { label: 'Farm partners', value: '42 cooperatives' },
      ],
    },
    Component: IngredientStoriesContent,
    seo: {
      title: 'Ingredient Stories | Varoganic',
      description: 'Meet the botanicals behind Varoganic — where they are grown, how they are extracted, and why they work.',
      path: '/ingredient-stories',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    },
  },
  '/help/faqs': {
    hero: {
      eyebrow: 'Help Centre',
      title: 'FAQs & ritual guidance',
      description:
        'Your most asked questions on orders, routines, and aftercare — answered by our ritual guides.',
      image: {
        src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
        alt: 'Customer support team helping over chat',
      },
      actions: [{ label: 'Chat with us', href: 'https://wa.me/917888654495' }],
      highlights: [
        { label: 'Average reply time', value: '15 minutes' },
        { label: 'Service hours', value: '9 AM – 9 PM IST' },
      ],
    },
    Component: FAQsContent,
    seo: {
      title: 'FAQs | Varoganic',
      description: 'Answers to shipping, routines, returns, and more from the Varoganic care team.',
      path: '/help/faqs',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    },
    structuredData: faqStructuredData,
  },
  '/help/track-order': {
    hero: {
      eyebrow: 'Order support',
      title: 'Track your order',
      description:
        'Monitor your ritual from batching to doorstep delivery. Enter the Varoganic order ID to fetch live courier updates.',
      image: {
        src: 'https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=900&q=80',
        alt: 'Delivery person handling packages',
      },
      actions: [{ label: 'View shipping policy', href: '/help/faqs#order-window', variant: 'secondary' }],
      highlights: [
        { label: 'Same-day dispatch', value: 'Order before 3 PM' },
        { label: 'Courier partners', value: 'Delhivery, BlueDart' },
      ],
    },
    Component: TrackOrderContent,
    seo: {
      title: 'Track Order | Varoganic',
      description: 'Enter your Varoganic order ID for live courier updates, estimated arrivals, and contact details.',
      path: '/help/track-order',
      image: 'https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=1200&q=80',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Track Order',
      url: 'https://varoganic.com/help/track-order',
    },
  },
  '/about': {
    hero: {
      eyebrow: 'Our Story',
      title: 'About Varoganic',
      description:
        'Born from kitchen experiments and dermatologist partnerships, Varoganic crafts soulful skincare for melanin-rich skin.',
      image: {
        src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
        alt: 'Founder blending skincare in studio',
      },
      actions: [{ label: 'Meet the team', href: '#leadership' }],
      highlights: [
        { label: 'Founded', value: '2016, Mumbai' },
        { label: 'Community', value: '120k rituals' },
      ],
    },
    Component: AboutContent,
    seo: {
      title: 'About Varoganic',
      description: 'Learn how Varoganic began, our values, and the team crafting rituals for Indian skin.',
      path: '/about',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Varoganic',
      url: 'https://varoganic.com',
      logo: 'https://varoganic.com/logo.png',
      sameAs: ['https://instagram.com/varoganic', 'https://youtube.com/varoganic'],
    },
  },
  '/about/sustainability': {
    hero: {
      eyebrow: 'Impact',
      title: 'Sourcing & sustainability',
      description:
        'See how regenerative farming, refillable design, and climate-neutral shipping power every Varoganic ritual.',
      image: {
        src: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
        alt: 'Farmer holding fresh herbs',
      },
      actions: [{ label: 'Read impact report', href: 'https://varoganic.com/impact-report.pdf' }],
      highlights: [
        { label: 'Water saved 2023', value: '1.8M litres' },
        { label: 'Circular packaging', value: '87% refillable' },
      ],
    },
    Component: SustainabilityContent,
    seo: {
      title: 'Sourcing & Sustainability | Varoganic',
      description: 'Discover the sustainability practices behind Varoganic — from regenerative sourcing to climate-neutral deliveries.',
      path: '/about/sustainability',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    },
  },
  '/press': {
    hero: {
      eyebrow: 'Press',
      title: 'Press & media',
      description: 'Access story angles, brand assets, and expert commentary for your next feature.',
      image: {
        src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
        alt: 'Press event with skincare display',
      },
      actions: [{ label: 'Download press kit', href: 'https://varoganic.com/press/imagery.zip' }],
      highlights: [
        { label: 'Media mentions', value: '60+ features' },
        { label: 'Response time', value: '< 12 hours' },
      ],
    },
    Component: PressContent,
    seo: {
      title: 'Press | Varoganic',
      description: 'Press coverage, media kit downloads, and contacts for Varoganic PR requests.',
      path: '/press',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    },
  },
  '/careers': {
    hero: {
      eyebrow: 'Careers',
      title: 'Build rituals with us',
      description:
        'We are a collective of formulators, designers, storytellers, and care-first humans building the future of slow skincare.',
      image: {
        src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
        alt: 'Team collaborating in studio',
      },
      actions: [{ label: 'View open roles', href: '#open-roles' }],
      highlights: [
        { label: 'Team size', value: '41 humans' },
        { label: 'Work model', value: 'Hybrid + remote' },
      ],
    },
    Component: CareersContent,
    seo: {
      title: 'Careers | Varoganic',
      description: 'Explore open roles and life at Varoganic — flexible rituals, inclusive benefits, and endless curiosity.',
      path: '/careers',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    },
  },
  '/policies/privacy': {
    hero: {
      eyebrow: 'Policies',
      title: 'Privacy policy',
      description:
        'Learn how Varoganic collects, uses, and protects your data. Transparency and consent guide every ritual we share.',
      actions: [{ label: 'Email privacy team', href: 'mailto:privacy@varoganic.com', variant: 'secondary' }],
      highlights: [
        { label: 'Response SLA', value: '7 working days' },
        { label: 'Data retention', value: '5 years (orders)' },
      ],
    },
    Component: PrivacyPolicyContent,
    seo: {
      title: 'Privacy Policy | Varoganic',
      description: 'Understand Varoganic’s commitment to safeguarding your personal data and privacy choices.',
      path: '/policies/privacy',
    },
  },
  '/policies/terms': {
    hero: {
      eyebrow: 'Policies',
      title: 'Terms of service',
      description:
        'The ground rules for shopping, receiving, and enjoying Varoganic rituals. Please read them before placing an order.',
      actions: [{ label: 'Contact support', href: 'mailto:care@varoganic.com', variant: 'secondary' }],
      highlights: [
        { label: 'Effective from', value: '01 Mar 2024' },
        { label: 'Returns window', value: '10 days sealed' },
      ],
    },
    Component: TermsContent,
    seo: {
      title: 'Terms of Service | Varoganic',
      description: 'Review the terms that govern your use of Varoganic products, services, and website.',
      path: '/policies/terms',
    },
  },
  '/policies/cookies': {
    hero: {
      eyebrow: 'Policies',
      title: 'Cookie preferences',
      description:
        'Control how Varoganic uses cookies to power the shop, personalise rituals, and measure performance.',
      actions: [{ label: 'Update cookie settings', href: '#cookie-preferences' }],
      highlights: [
        { label: 'Review cadence', value: 'Every 12 months' },
        { label: 'Opt-out available', value: 'Yes' },
      ],
    },
    Component: CookiesContent,
    seo: {
      title: 'Cookie Preferences | Varoganic',
      description: 'Manage the cookies Varoganic uses — essential, analytics, and personalisation.',
      path: '/policies/cookies',
    },
  },
  '/policies/accessibility': {
    hero: {
      eyebrow: 'Policies',
      title: 'Accessibility statement',
      description:
        'We design Varoganic to be inclusive and accessible. Explore the steps we take and how to get support.',
      actions: [{ label: 'Request assistance', href: 'mailto:access@varoganic.com', variant: 'secondary' }],
      highlights: [
        { label: 'Audit cadence', value: 'Quarterly' },
        { label: 'Compliance goal', value: 'WCAG 2.2 AA' },
      ],
    },
    Component: AccessibilityContent,
    seo: {
      title: 'Accessibility | Varoganic',
      description: 'Read our accessibility commitment and the inclusive practices behind the Varoganic experience.',
      path: '/policies/accessibility',
    },
  },
}

export const ContentRoute = (): ReactElement => {
  const path = typeof window !== 'undefined' ? sanitizePath(window.location.pathname) : '/'
  const page = pages[path]

  if (!page) {
    return <NotFoundFallback />
  }

  return (
    <>
      <SEO
        title={page.seo.title}
        description={page.seo.description}
        path={page.seo.path}
        image={page.seo.image}
        structuredData={page.structuredData}
      />
      <div className={containerClass}>
        <HeroSection hero={page.hero} />
        <page.Component />
      </div>
    </>
  )
}
