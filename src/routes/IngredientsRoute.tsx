import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Fragment, useMemo, useState, type ReactElement } from 'react'

import { Accordion, AccordionItem } from '@/components/common/Accordion'
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
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

const heroStats: Array<Stat> = [
  { label: 'Botanical library', value: '47 botanicals', description: 'Curated across Indian micro-climates.' },
  { label: 'Clinical screening', value: '128 assays', description: 'Each ingredient undergoes in-vitro and in-vivo tests.' },
  { label: 'Traceable partners', value: '22 farms', description: 'Regenerative agriculture partners with soil audits.' },
  { label: 'Extraction styles', value: '6 methods', description: 'From cold-maceration to ultrasonic infusion.' },
]

const ingredients = [
  {
    id: 'hibiscus',
    name: 'Hibiscus Petal Bioferment',
    origin: 'Shantiniketan, West Bengal',
    profile: 'Alpha-hydroxy acids + plant peptides',
    benefits: 'Speeds up cell renewal, boosts elasticity, softly resurfaces without abrasion.',
    ritual: 'We ferment hibiscus petals for 48 hours with a lactobacillus starter, dropping the pH to 3.8—ideal for gentle exfoliation.',
    color: 'text-rose-500',
  },
  {
    id: 'neem',
    name: 'Neem Leaf CO2 Extract',
    origin: 'Kerala biodiverse groves',
    profile: 'Azadirachtin-rich essential oil',
    benefits: 'Clarifies congested pores, soothes redness, supports microbiome balance.',
    ritual: 'Our supercritical CO2 extraction isolates actives without solvents, keeping the oil lightweight and quick-absorbing.',
    color: 'text-emerald-500',
  },
  {
    id: 'camel-milk',
    name: 'Camel Milk Concentrate',
    origin: 'Bikaner desert cooperatives',
    profile: 'Phospholipids + lactic acid',
    benefits: 'Deeply nourishes, supports barrier lipids, gently brightens.',
    ritual: 'Freeze-dried within 4 hours of milking to lock nutrients, then reconstituted with botanical humectants in our lab.',
    color: 'text-amber-500',
  },
  {
    id: 'saffron',
    name: 'Kashmiri Saffron Threads',
    origin: 'Pampore valley',
    profile: 'Crocin, safranal, antioxidants',
    benefits: 'Targets dullness, evens tone, delivers glow with a single drop.',
    ritual: 'We infuse saffron in cold-pressed oils for 21 days, rotating vials daily for even saturation.',
    color: 'text-orange-500',
  },
]

const ingredientFocus = [
  {
    id: 'barrier',
    title: 'Barrier Rescue Complex',
    description:
      'Rose hydrosol, camel milk lipids, and ceramide-mimicking rice bran all work together to replenish the moisture barrier after sun exposure or active-heavy routines.',
    pairings: ['Skin Hydrating Gel', 'Milky Kesar Soap'],
  },
  {
    id: 'clarify',
    title: 'Clarify & Reset Blend',
    description:
      'Neem, amba haldi, and green coffee extract tackle congestion while licorice keeps hyperpigmentation in check.',
    pairings: ['Detan Soap', 'Whitening & Tightening Face Pack'],
  },
  {
    id: 'brighten',
    title: 'Radiance Accelerator',
    description:
      'Saffron threads, rosehip oil, and vitamin C esters merge for an instantly lit-from-within glow.',
    pairings: ['Pure Glow Face Elixir', 'Radiant Rose Water Mist'],
  },
]

const labProtocols = [
  {
    value: 'coldbrew',
    title: 'Cold-brew botanical extraction',
    body: 'We steep petals and leaves at room temperature for 12-21 days with sonic agitation. This guards heat-sensitive compounds like crocin and flavonoids so they stay potent until application.',
  },
  {
    value: 'biome',
    title: 'Microbiome-safe preservation',
    body: 'Our preservative system blends radish root ferment and gluconolactone to keep products fresh without disrupting your skin flora.',
  },
  {
    value: 'testing',
    title: 'Clinical integrity testing',
    body: 'Every ingredient lot is tested for heavy metals, pesticides, and microbiological safety before it can enter formulation. Certificates are logged on-chain for transparency.',
  },
]

const fieldDiaries = [
  {
    month: 'April',
    headline: 'Desert bloom harvest',
    copy: 'Camel milk cooperatives implemented water recycling units, cutting usage by 38% while improving milk nutrient density.',
  },
  {
    month: 'July',
    headline: 'Monsoon neem flush',
    copy: 'Neem leaves picked at peak chlorophyll, flash dehydrated to preserve azadirachtin levels for the Clarify Stack.',
  },
  {
    month: 'October',
    headline: 'Saffron plucking at dawn',
    copy: 'Our farmer collective hand-plucks stigmas within 90 minutes of bloom, then air-dries them on silk mesh for premium potency.',
  },
]

const IngredientCard = ({
  name,
  origin,
  profile,
  benefits,
  ritual,
  color,
}: (typeof ingredients)[number]): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  const body = (
    <article className="shadow-card/40 flex h-full flex-col gap-4 rounded-3xl border border-lines bg-paper/95 p-6">
      <div>
        <h3 className="font-heading text-xl text-ink">{name}</h3>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{origin}</p>
      </div>
      <p className={color}>Profile · {profile}</p>
      <p className="text-sm text-body">{benefits}</p>
      <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-xs text-primary shadow-inner">
        <p className="font-semibold uppercase tracking-[0.4em] text-primary/70">Lab ritual</p>
        <p className="mt-2 text-sm text-primary">{ritual}</p>
      </div>
    </article>
  )

  if (prefersReducedMotion) {
    return body
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {body}
    </motion.article>
  )
}

type FocusState = (typeof ingredientFocus)[number]

const FocusSwitcher = ({ focuses }: { readonly focuses: Array<FocusState> }): ReactElement => {
  const [active, setActive] = useState<FocusState>(focuses[0])
  const prefersReducedMotion = useReducedMotionSafe()

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {focuses.map((focus) => {
            const isActive = focus.id === active.id
            return (
              <button
                key={focus.id}
                type="button"
                onClick={() => {
                  setActive(focus)
                }}
                className="relative overflow-hidden rounded-full border border-lines/70 bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                {focus.title}
                <AnimatePresence>
                  {isActive && !prefersReducedMotion ? (
                    <motion.span
                      layoutId="focus-badge"
                      className="absolute inset-0 -z-10 rounded-full border border-primary/40 bg-primary/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  ) : null}
                </AnimatePresence>
              </button>
            )
          })}
        </div>

        <div className="rounded-3xl border border-lines bg-paper p-6 shadow-card">
          <h3 className="font-heading text-xl text-ink">{active.title}</h3>
          <p className="mt-2 text-sm text-body">{active.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {active.pairings.map((pairing) => (
              <span
                key={pairing}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary"
              >
                {pairing}
              </span>
            ))}
          </div>
        </div>
      </div>
    </LayoutGroup>
  )
}

const FieldDiaryCard = ({ month, headline, copy }: (typeof fieldDiaries)[number]): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  const card = (
    <article className="shadow-card/30 flex h-full flex-col justify-between gap-4 rounded-3xl border border-lines/70 bg-paper p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{month}</p>
        <h3 className="mt-2 font-heading text-lg text-ink">{headline}</h3>
      </div>
      <p className="text-sm text-body">{copy}</p>
    </article>
  )

  if (prefersReducedMotion) {
    return card
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {card}
    </motion.article>
  )
}

/**
 * Ingredient storytelling and sourcing transparency.
 */
const IngredientsRouteComponent = (): ReactElement => {
  const ingredientList = useMemo(() => ingredients, [])

  return (
    <Fragment>
      <SEO
        title="Ingredient library — transparent botanicals"
        description="Dive into Varoganic\'s ingredient lab: sourcing diaries, lab rituals, and interactive blends that show how each botanical transforms your skin."
        path="/ingredients"
      />
      <PageContainer>
        <PageHero
          eyebrow="Ingredient lab"
          title="From regenerative farms to your vanity"
          description="Every extraction method, every farmer handshake, every lab note — documented so you know exactly what powers your ritual."
          actions={[
            { label: 'Shop by concern', href: '/shop?concern=Hydration' },
            { label: 'Download ingredient index', href: '#protocols', variant: 'secondary' },
          ]}
          highlights={[
            { label: 'Transparency report', value: 'Updated quarterly' },
            { label: 'Clinical screenings', value: '128 assays' },
          ]}
          media={{
            src: 'https://images.unsplash.com/photo-1542838686-73e7d57d07d8?auto=format&fit=crop&w=900&q=80',
            alt: 'Botanical ingredients and lab glassware',
          }}
        />

        <AnimatedSection>
          <SectionHeader
            eyebrow="Lab at a glance"
            title="Potency without compromise"
            description="We take the scenic route: longer extraction times, meticulous testing, and regeneratively grown botanicals so every drop feels intentional."
          />
          <StatGrid stats={heroStats} />
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Hero botanicals"
            title="Meet the ingredients in our bestselling rituals"
            description="Swipe through the cards to see how each botanical is processed and why it earned a permanent spot on our lab bench."
          />
          <AnimatedList items={ingredientList} renderItem={(ingredient) => <IngredientCard {...ingredient} />} />
        </AnimatedSection>

        <AnimatedSection variant="split">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Targeted blends"
              title="Layered concentrates for specific skin moods"
              description="Select a focus to reveal which ingredients choreograph the results."
            />
            <p className="text-sm text-body">
              Built with TCM-meets-Ayurveda philosophy, our blends respect circadian rhythms and keep your microbiome happy.
            </p>
          </div>
          <FocusSwitcher focuses={ingredientFocus} />
        </AnimatedSection>

        <div id="protocols">
          <AnimatedSection variant="frosted">
            <SectionHeader
              eyebrow="Lab protocols"
              title="How we preserve potency"
              description="Open the accordions to understand the method behind each ritual."
            />
            <Accordion defaultValue="coldbrew">
              {labProtocols.map((protocol) => (
                <AccordionItem key={protocol.value} value={protocol.value} title={protocol.title}>
                  {protocol.body}
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Field diaries"
            title="Snapshots from our sourcing journeys"
            description="Seasonal updates direct from our farmer partners."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {fieldDiaries.map((diary) => (
              <FieldDiaryCard key={diary.month} {...diary} />
            ))}
          </div>
        </AnimatedSection>
      </PageContainer>
    </Fragment>
  )
}

export default IngredientsRouteComponent
export const IngredientsRoute = IngredientsRouteComponent
