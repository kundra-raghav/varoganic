import { motion } from 'framer-motion'
import { Fragment, type ReactElement } from 'react'

import { Button } from '@/components/common/Button'
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

const brandStats: Array<Stat> = [
  { label: 'Rituals brewed', value: '8 core formulas', description: 'Crafted in micro-batches every fortnight.' },
  { label: 'Cities shipped', value: '196 pin codes', description: 'Across metros, hills, and the coasts.' },
  { label: 'Return rate', value: '1.6%', description: 'Thanks to derm-guided formulation and honest marketing.' },
  { label: 'Community', value: '12k members', description: 'Contributing feedback via our Ritual Lab.' },
]

const brandValues = [
  {
    title: 'Slow, not stagnant',
    description:
      'We iterate with intention. Instead of chasing trends, we improve core formulas using community feedback and seasonal ingredient shifts.',
  },
  {
    title: 'Science x Ayurveda, no shortcuts',
    description:
      'Traditional rituals get modern QA — from stability studies to dermatologists on speed dial when we iterate actives.',
  },
  {
    title: 'Radical transparency',
    description:
      'Every product gets a living ingredient dossier, lab notes, and farmer stories so you can trace impact beyond marketing fluff.',
  },
]

const milestones = [
  {
    year: '2018',
    heading: 'Kitchen experiments in Udaipur',
    copy: 'Founder Vani began brewing her grandmother’s ubtan recipes with modern actives for friends battling post-acne scars.',
  },
  {
    year: '2020',
    heading: 'First community lab drop',
    copy: 'We opened the Ritual Lab to 500 beta testers, iterating the Rose Mist formula across 12 batches of aroma, pH, and spray mechanics.',
  },
  {
    year: '2022',
    heading: 'Dermatology board on retainer',
    copy: 'A four-member advisory council now audits every launch for safety, efficacy, and inclusive testing across Fitzpatrick scale.',
  },
  {
    year: '2024',
    heading: 'Regenerative sourcing network',
    copy: 'Partnered with 22 farms using rainwater harvesting, fair-wage policies, and soil-health audits every quarter.',
  },
]

const advisoryTeam = [
  {
    name: 'Dr. Aditi Narang',
    title: 'Dermatologist & Clinical Advisor',
    focus: 'Leads patch testing protocols and sensitive skin formulation audits.',
  },
  {
    name: 'Ravi Mehta',
    title: 'Regenerative Agriculture Lead',
    focus: 'Works with farm collectives to ensure soil-first cultivation and fair wages.',
  },
  {
    name: 'Nandita Sharma',
    title: 'Head of Ritual Lab',
    focus: 'Translates community feedback into iteration cycles and user research.',
  },
]

const founderNote = {
  name: 'Vand Kundra',
  role: 'Founder & Formulator-in-chief',
  message:
    '“Varoganic was born from blending my nani’s ritual teas with my chemist training. We obsess over details — the way your skin smells after the mist, how a bar lathers in hard water, whether a serum layers under makeup in Mumbai humidity. It’s beauty that respects the pace of your life.”',
  image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
}

const communityHighlights = [
  {
    stat: '4.7 / 5',
    label: 'Average ritual rating across 2,400 reviews',
  },
  {
    stat: '78%',
    label: 'Customers who opt into refills after first order',
  },
  {
    stat: '34',
    label: 'Workshops hosted with dermatologists & Ayurvedic vaidyas',
  },
]

const ValueCard = ({ title, description }: (typeof brandValues)[number]): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const card = (
    <article className="shadow-card/30 h-full rounded-3xl border border-lines bg-paper/95 p-6">
      <h3 className="font-heading text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </article>
  )

  if (prefersReducedMotion) {
    return card
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {card}
    </motion.article>
  )
}

const MilestoneCard = ({ year, heading, copy }: (typeof milestones)[number]): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const card = (
    <div className="shadow-card/40 relative rounded-3xl border border-lines/70 bg-paper p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{year}</p>
      <h3 className="mt-2 font-heading text-lg text-ink">{heading}</h3>
      <p className="mt-3 text-sm text-body">{copy}</p>
    </div>
  )

  if (prefersReducedMotion) {
    return card
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {card}
    </motion.div>
  )
}

const AdvisoryCard = ({ name, title, focus }: (typeof advisoryTeam)[number]): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  const card = (
    <article className="shadow-card/30 flex h-full flex-col gap-3 rounded-3xl border border-lines bg-paper/95 p-6">
      <div>
        <h3 className="font-heading text-lg text-ink">{name}</h3>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{title}</p>
      </div>
      <p className="text-sm text-body">{focus}</p>
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

const FounderBlock = (): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),320px] lg:items-center">
      <div className="space-y-4">
        <SectionHeader
          eyebrow="Founder story"
          title="“Skincare that respects the pace of your life.”"
          description="Vani’s journey from kitchen tinkerer to formulation scientist."
        />
        <p className="text-sm text-body">{founderNote.message}</p>
        <Button
          onClick={() => {
            window.location.assign('/ingredients')
          }}
        >
          Meet our ingredient lab
        </Button>
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-lines bg-paper shadow-card">
        <img src={founderNote.image} alt={founderNote.name} className="size-full object-cover" loading="lazy" />
        {!prefersReducedMotion ? (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0.2, scale: 0.95 }}
            animate={{ opacity: 0.6, scale: 1.05 }}
            transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
            className="pointer-events-none absolute -bottom-10 right-6 hidden size-40 rounded-full bg-primary/20 blur-3xl lg:block"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper via-paper/70 to-transparent p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{founderNote.role}</p>
          <h3 className="mt-2 font-heading text-xl text-ink">{founderNote.name}</h3>
        </div>
      </div>
    </div>
  )
}

const CommunityHighlight = ({ stat, label }: (typeof communityHighlights)[number]): ReactElement => {
  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6 text-primary shadow-inner">
      <p className="font-heading text-3xl text-primary">{stat}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-primary/80">{label}</p>
    </div>
  )
}

/**
 * About page weaving story, values, and community impact.
 */
const AboutRouteComponent = (): ReactElement => {
  return (
    <Fragment>
      <SEO
        title="About Varoganic — Rituals brewed slowly"
        description="A slow-beauty house blending Ayurvedic wisdom with dermatologist rigor. Explore our story, values, and community-powered Ritual Lab."
        path="/about"
      />
      <PageContainer>
        <PageHero
          eyebrow="Our story"
          title="Slow-brewed rituals, clinically tuned"
          description="Varoganic bridges Ayurvedic botanicals and modern derm science so your routine feels sensorial, intentional, and future-friendly."
          actions={[
            { label: 'Explore ingredients', href: '/ingredients' },
            { label: 'Join the Ritual Lab', href: '#community', variant: 'secondary' },
          ]}
          highlights={[
            { label: 'Founded', value: '2018, Udaipur' },
            { label: 'Team', value: '32 makers & storytellers' },
          ]}
          media={{
            src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=80',
            alt: 'Varoganic lab with botanicals and beakers',
          }}
        />

        <AnimatedSection>
          <SectionHeader
            eyebrow="Impact"
            title="Numbers we obsess over"
            description="Behind every formula are communities, soil samples, and hours in the lab — here’s a snapshot."
          />
          <StatGrid stats={brandStats} />
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Values"
            title="Principles that shape every drop"
            description="These are the filters every idea passes through before it reaches your shelf."
          />
          <AnimatedList items={brandValues} renderItem={(value) => <ValueCard {...value} />} />
        </AnimatedSection>

        <AnimatedSection variant="split">
          <FounderBlock />
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Timeline"
            title="From kitchen experiments to a conscious lab"
            description="Highlights from our slow-but-steady journey."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {milestones.map((milestone) => (
              <MilestoneCard key={milestone.year} {...milestone} />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            eyebrow="Advisory crew"
            title="Experts who keep us honest"
            description="An interdisciplinary council guiding safety, sourcing, and storytelling."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {advisoryTeam.map((member) => (
              <AdvisoryCard key={member.name} {...member} />
            ))}
          </div>
        </AnimatedSection>

        <div id="community">
          <AnimatedSection variant="frosted">
            <SectionHeader
              eyebrow="Community"
              title="The Ritual Lab"
              description="Our beta testers, refills-first loyalists, and skincare nerds who co-create every formula upgrade."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {communityHighlights.map((highlight) => (
                <CommunityHighlight key={highlight.stat} {...highlight} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  window.location.assign('mailto:ritual.lab@varoganic.com')
                }}
              >
                Apply to join
              </Button>
              <Button
                onClick={() => {
                  window.location.assign('/collections/new')
                }}
              >
                Shop latest drop
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </PageContainer>
    </Fragment>
  )
}

export default AboutRouteComponent
export const AboutRoute = AboutRouteComponent
