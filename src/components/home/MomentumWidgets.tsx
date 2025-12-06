import { motion } from 'framer-motion'
import { useMemo, type ReactElement } from 'react'

import { Button } from '@/components/common/Button'
import { useUIStore } from '@/store/ui'

const baseWidgets = [
  {
    id: 'scarcity',
    kicker: 'Micro-batch tracker',
    headline: 'Today’s rose soaps curing right now',
    metric: '42 trays left',
    body: 'Hand-poured rose bars cure for 48 hours, then head straight to dispatch. Reserve yours before this micro-batch closes.',
    action: { label: 'Reserve my bar', href: '/shop?category=Soap' },
  },
  {
    id: 'social-proof',
    kicker: 'Community glow meter',
    headline: '9 of 10 seekers felt calmer skin in 14 days',
    metric: '4,328 glow diaries',
    body: 'Every review is dermatologist-verified and photo-free, so the calm you see is the calm you get.',
    action: { label: 'Read diaries', href: '/shop?concern=Hydration' },
  },
  {
    id: 'purity',
    kicker: 'Ingredient integrity',
    headline: '0% parabens, 0% phthalates, 100% traceable botanicals',
    metric: 'Lab reports live',
    body: 'Tap into sourcing stories and lab certificates for every ingredient—pure, traceable, and planet kind.',
    action: { label: 'Explore sourcing', href: '/shop?concern=Soft%20Skin' },
  },
] as const

/**
 * Animated persuasion widgets reinforcing scarcity, social proof, and purity cues.
 */
export const MomentumWidgets = (): ReactElement => {
  const reducedMotion = useUIStore((state) => state.reducedMotion)
  const widgets = useMemo(() => baseWidgets, [])

  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-success">Why rituals sell out</p>
        <h2 className="font-heading text-h3 text-ink">Psychology-backed nudges that keep your cart committed</h2>
        <p className="text-sm text-muted">
          We combine honest scarcity, community-backed proof, and ingredient transparency so you never second-guess checking out.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {widgets.map((widget, index) => (
          <motion.article
            key={widget.id}
            className="group relative overflow-hidden rounded-3xl border border-lines bg-paper p-6 shadow-card"
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={reducedMotion ? undefined : { delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reducedMotion ? undefined : { y: -6, scale: 1.01 }}
          >
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 top-6 size-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
              initial={reducedMotion ? undefined : { opacity: 0.2, scale: 0.8 }}
              animate={reducedMotion ? undefined : { opacity: 0.35, scale: [0.85, 1.05, 0.9], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
            />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{widget.kicker}</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{widget.headline}</h3>
            <p className="mt-2 text-sm text-primary">{widget.metric}</p>
            <p className="mt-3 text-sm text-muted">{widget.body}</p>
            <Button
              variant="tertiary"
              className="mt-5 inline-flex items-center gap-2 text-primary"
              onClick={() => {
                window.location.assign(widget.action.href)
              }}
            >
              {widget.action.label}
              <span aria-hidden="true">→</span>
            </Button>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
