import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Fragment, useMemo, useState, type ReactElement } from 'react'

import botanicalHeroImage from '@/assets/Natural botanical ingredients and herbs.jpg'
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
  { label: 'Natural Ingredients', value: '25+ Herbs', description: 'Sourced from across India\'s rich botanical heritage.' },
  { label: 'Handmade Products', value: '100% Natural', description: 'Crafted with love, care, and traditional wisdom.' },
  { label: 'Ayurvedic Recipes', value: 'Time-Tested', description: 'Ancient formulas passed down through generations.' },
  { label: 'Chemical-Free', value: 'Pure & Safe', description: 'No parabens, sulfates, or artificial additives.' },
]

const ingredients = [
  {
    id: 'rose',
    name: 'Pure Rose Petals & Rose Oil',
    origin: 'Sourced from Indian rose gardens',
    profile: 'Natural antioxidants & aromatic oils',
    benefits: 'Soothes skin, reduces redness, provides deep hydration, and leaves a fresh floral glow.',
    ritual: 'We carefully handpick fresh rose petals and infuse them with nourishing rose oil, blending them into our soaps and mists to give your skin natural radiance and calmness.',
    color: 'text-rose-500',
  },
  {
    id: 'neem',
    name: 'Neem Leaves & Neem Oil',
    origin: 'Traditional Indian neem trees',
    profile: 'Antibacterial & purifying properties',
    benefits: 'Controls acne, fights bacteria, reduces inflammation, and deeply cleanses pores.',
    ritual: 'Neem leaves are dried and ground, then combined with pure neem oil in our handmade soaps to create a powerful natural cleanser that purifies and protects your skin.',
    color: 'text-emerald-500',
  },
  {
    id: 'kesar',
    name: 'Kesar (Saffron) Threads',
    origin: 'Premium Indian saffron fields',
    profile: 'Brightening & anti-aging properties',
    benefits: 'Brightens skin tone, reduces dark spots, fights signs of aging, and gives a natural glow.',
    ritual: 'Pure saffron threads are carefully infused into our products, delivering the ancient beauty secret of Indian royalty for radiant, even-toned skin.',
    color: 'text-orange-500',
  },
  {
    id: 'camel-milk',
    name: 'Pure Camel Milk',
    origin: 'Rajasthan desert regions',
    profile: 'Rich in vitamins & natural proteins',
    benefits: 'Deeply moisturizes, nourishes dry skin, and promotes a soft, supple texture.',
    ritual: 'Fresh camel milk is gently processed and blended into our handmade soaps, bringing you the traditional desert beauty secret for deeply hydrated, glowing skin.',
    color: 'text-amber-500',
  },
  {
    id: 'chandan',
    name: 'Chandan (Sandalwood)',
    origin: 'Pure Indian sandalwood',
    profile: 'Cooling & skin-soothing properties',
    benefits: 'Calms irritation, reduces blemishes, evens skin tone, and provides a cooling effect.',
    ritual: 'Traditional sandalwood powder is carefully ground and mixed into our soaps and face packs, offering you the timeless Ayurvedic remedy for clear, glowing skin.',
    color: 'text-yellow-600',
  },
  {
    id: 'honey',
    name: 'Pure Natural Honey',
    origin: 'Indian beekeepers',
    profile: 'Antibacterial & moisturizing',
    benefits: 'Locks in moisture, fights acne-causing bacteria, and leaves skin soft and supple.',
    ritual: 'Raw honey is blended into our handmade soaps to provide natural hydration and antibacterial protection, giving your skin a healthy, radiant glow.',
    color: 'text-amber-600',
  },
]

const ingredientFocus = [
  {
    id: 'hydrate',
    title: 'Deep Hydration & Nourishment',
    description:
      'Rose water, hibiscus, sandalwood oil, vitamin C, almond oil, and 20+ herbal extracts work together to deeply hydrate, refresh, and nourish your skin naturally.',
    pairings: ['Skin Hydrating Gel', 'Radiant Rose Water', 'Pure Glow Face Elixir'],
  },
  {
    id: 'brighten',
    title: 'Brightening & Glow',
    description:
      'Kesar (saffron), camel milk, vitamin E & C oils, sandalwood, and rose petals combine to brighten skin tone, reduce dark spots, and deliver a natural radiant glow.',
    pairings: ['Kesar Milky Soap', 'Rose Soap', 'Face Pack & Scrub'],
  },
  {
    id: 'purify',
    title: 'Purifying & Clarifying',
    description:
      'Neem leaves, neem oil, tea tree oil, multani mitti, chandan, and amba haldi cleanse deeply, control acne, reduce tanning, and purify your skin for a clear complexion.',
    pairings: ['Neem Soap', 'De-Tan Soap'],
  },
  {
    id: 'repair',
    title: 'Refreshing & Revitalizing',
    description:
      'Honey, lemon, olive oil, tea tree oil, and vitamin E refresh, brighten, and revitalize dull skin while providing natural antibacterial protection.',
    pairings: ['Honey Lemon Soap'],
  },
  {
    id: 'haircare',
    title: 'Hair Nourishment & Growth',
    description:
      'Amla, shikakai, bhringraj, brahmi, jatamansi, neem, hibiscus, olive oil, almond oil, and 25+ herbs strengthen hair, control dandruff, reduce hair fall, and promote healthy growth.',
    pairings: ['Varo Herbs Shampoo', 'Kesh Vaidya Hair Oil'],
  },
]

const labProtocols = [
  {
    value: 'handmade',
    title: 'Handmade with Love & Care',
    body: 'Every Varoganic product is carefully handcrafted in small batches using traditional methods. We take our time to ensure each soap, gel, and oil is made with attention to detail, preserving the natural goodness of every ingredient.',
  },
  {
    value: 'natural',
    title: '100% Natural & Chemical-Free',
    body: 'We never use harsh chemicals, parabens, sulfates, or artificial additives in our products. Everything is made from pure, natural ingredients sourced directly from nature, ensuring your skin gets only the best.',
  },
  {
    value: 'ayurvedic',
    title: 'Ancient Ayurvedic Wisdom',
    body: 'Our formulas are inspired by time-tested Ayurvedic recipes passed down through generations. We blend traditional herbal knowledge with modern skincare needs to bring you products that truly work in harmony with your skin.',
  },
  {
    value: 'quality',
    title: 'Quality You Can Trust',
    body: 'Each batch is carefully prepared using premium ingredients. We believe in creating products that are safe, effective, and gentle on all skin types. Our commitment is to deliver natural beauty solutions you can trust.',
  },
]

const fieldDiaries = [
  {
    month: 'Spring',
    headline: 'Rose & Hibiscus Harvest',
    copy: 'Fresh rose petals and hibiscus flowers are handpicked at dawn when their natural oils are most potent. These delicate botanicals are carefully dried and processed to preserve their soothing and brightening properties.',
  },
  {
    month: 'Monsoon',
    headline: 'Neem & Herbal Collection',
    copy: 'Neem leaves, amla, shikakai, and other Ayurvedic herbs are sourced during the monsoon season when they are at their nutritional peak. Traditional drying methods ensure all their natural benefits are retained.',
  },
  {
    month: 'Winter',
    headline: 'Premium Saffron & Milk',
    copy: 'Pure Kashmiri saffron threads and fresh camel milk are sourced from trusted suppliers. These precious ingredients bring age-old beauty secrets to your skincare routine, delivering radiant, nourished skin.',
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
        <p className="font-semibold uppercase tracking-[0.4em] text-primary/70">How We Use It</p>
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
        title="Natural Ingredients — Pure Ayurvedic Botanicals"
        description="Discover Varoganic's natural ingredients: handpicked herbs, traditional recipes, and pure botanicals that bring ancient beauty wisdom to your skincare routine."
        path="/ingredients"
      />
      <PageContainer>
        <PageHero
          eyebrow="Our Natural Ingredients"
          title="From Nature's Garden to Your Skin"
          description="Every herb carefully selected, every ingredient thoughtfully sourced, every formula lovingly handmade — discover the pure, natural botanicals that power your Varoganic skincare ritual."
          actions={[
            { label: 'Shop All Products', href: '/shop' },
            { label: 'Learn Our Process', href: '#protocols', variant: 'secondary' },
          ]}
          highlights={[
            { label: 'Handmade Products', value: 'With Love & Care' },
            { label: 'Natural Ingredients', value: '100% Pure' },
          ]}
          media={{
            src: botanicalHeroImage,
            alt: 'Natural botanical ingredients and herbs',
          }}
        />

        <AnimatedSection>
          <SectionHeader
            eyebrow="Why Varoganic"
            title="Nature's Purity in Every Product"
            description="We believe in the power of nature. Our handmade products combine traditional Ayurvedic wisdom with pure, natural ingredients to bring you skincare that truly cares."
          />
          <StatGrid stats={heroStats} />
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Star Ingredients"
            title="Meet the botanicals that power your glow"
            description="Discover the natural herbs and ingredients we use in our handmade products. Each one is carefully selected for its unique benefits and time-tested effectiveness."
          />
          <AnimatedList items={ingredientList} renderItem={(ingredient) => <IngredientCard {...ingredient} />} />
        </AnimatedSection>

        <AnimatedSection variant="split">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Ingredient Benefits"
              title="Targeted solutions for your skin needs"
              description="Select a category to discover which natural ingredients work together to deliver specific skincare benefits."
            />
            <p className="text-sm text-body">
              Our Ayurvedic formulas combine multiple herbs and natural ingredients to create powerful, effective skincare solutions for every skin type and concern.
            </p>
          </div>
          <FocusSwitcher focuses={ingredientFocus} />
        </AnimatedSection>

        <div id="protocols">
          <AnimatedSection variant="frosted">
            <SectionHeader
              eyebrow="Our Promise"
              title="How we create our products"
              description="Learn about our commitment to quality, purity, and traditional craftsmanship."
            />
            <Accordion defaultValue="handmade">
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
            eyebrow="Seasonal Sourcing"
            title="Fresh ingredients, harvested with care"
            description="We source our botanicals seasonally to ensure maximum freshness and potency."
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
