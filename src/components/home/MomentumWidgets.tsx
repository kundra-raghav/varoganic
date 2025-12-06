import { motion } from 'framer-motion'
import { useMemo, type ReactElement } from 'react'

import { Button } from '@/components/common/Button'
import { useUIStore } from '@/store/ui'

const baseWidgets = [
  {
    id: 'handmade',
    kicker: 'Handcrafted with Love',
    headline: 'Made fresh in small batches',
    metric: '100% Handmade',
    body: 'Each soap and product is handcrafted with care, using traditional methods passed down through generations.',
    action: { label: 'Shop Soaps', href: '/shop?category=Soap' },
  },
  {
    id: 'natural',
    kicker: 'Pure & Natural',
    headline: 'No chemicals, no compromise',
    metric: 'Zero Parabens & Sulfates',
    body: 'Only natural ingredients from India\'s rich botanical heritage. No harsh chemicals, just pure goodness for your skin.',
    action: { label: 'See Ingredients', href: '/ingredients' },
  },
  {
    id: 'results',
    kicker: 'Proven Results',
    headline: 'Feel the difference in days',
    metric: '1000+ Happy Customers',
    body: 'Join thousands who\'ve experienced softer, glowing skin with our Ayurvedic formulas. Real ingredients, real results.',
    action: { label: 'Shop Now', href: '/shop' },
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
        <p className="text-xs font-semibold uppercase tracking-wide text-success">Why Choose Varoganic</p>
        <h2 className="font-heading text-h3 text-ink">Nature's Goodness, Handcrafted for You</h2>
        <p className="text-sm text-muted">
          Discover what makes our products special - pure ingredients, traditional craftsmanship, and real results.
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
