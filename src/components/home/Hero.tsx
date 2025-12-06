import { motion } from 'framer-motion'
import { useMemo, type ReactElement } from 'react'

import { Button } from '@/components/common/Button'
import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { useUIStore } from '@/store/ui'

export type HeroAction = {
  readonly label: string
  readonly href: string
}

export type HeroProps = {
  readonly eyebrow?: string
  readonly headline: string
  readonly subcopy: string
  readonly primaryCta: HeroAction
  readonly secondaryCta: HeroAction
  readonly media: {
    readonly src: string
    readonly alt: string
  }
  readonly productHighlight?: {
    readonly description: string
    readonly metrics: Array<{ title: string; value: string }>
  }
}

/**
 * Homepage hero storytelling block with seasonal accents.
 */
export const Hero = ({ eyebrow, headline, subcopy, primaryCta, secondaryCta, media, productHighlight }: HeroProps): ReactElement => {
  const reducedMotion = useUIStore((state) => state.reducedMotion)
  const heroAnchors = useMemo(
    () => [
      { label: '100% Natural', accent: 'Pure' },
      { label: 'Handmade Fresh', accent: 'Daily' },
      { label: 'Chemical-Free', accent: 'Safe' },
    ],
    [],
  )

  return (
    <motion.section
      className="group relative overflow-hidden rounded-3xl border border-lines bg-paper shadow-card"
      initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-32 size-56 rounded-full bg-primary/10 blur-3xl"
        initial={reducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: [0.25, 0.45], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' } }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-16 size-64 rounded-full bg-accent/15 blur-3xl"
        initial={reducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={reducedMotion ? undefined : { opacity: [0.2, 0.45], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' } }}
      />
      <div className="grid gap-8 px-6 py-12 md:grid-cols-2 md:px-10 md:py-16">
        <div className="flex flex-col justify-center gap-6">
          {eyebrow ? <span className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</span> : null}
          <motion.h1
            className="font-heading text-h1 text-ink"
            initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          >
            {headline}
          </motion.h1>
          <motion.p
            className="max-w-xl text-lg text-muted"
            initial={reducedMotion ? undefined : { opacity: 0, y: 14 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.55, ease: 'easeOut' } }}
          >
            {subcopy}
          </motion.p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => {
                window.location.assign(primaryCta.href)
              }}
            >
              {primaryCta.label}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                window.location.assign(secondaryCta.href)
              }}
            >
              {secondaryCta.label}
            </Button>
          </div>
          <div className="grid gap-3 pt-4 text-left text-sm text-muted sm:grid-cols-2 lg:grid-cols-3">
            {heroAnchors.map((item) => (
              <motion.div
                key={item.label}
                className="rounded-2xl border border-lines bg-paper/80 px-4 py-3 shadow-card"
                initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.45, ease: 'easeOut' } }}
                whileHover={reducedMotion ? undefined : { y: -6, scale: 1.02 }}              >
                <span className="text-xs font-semibold uppercase tracking-wide text-success">{item.accent}</span>
                <p className="mt-1 text-sm text-ink">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <figure className="flex flex-col gap-5">
          <motion.div
            className="overflow-hidden rounded-3xl border border-lines/60"
            initial={reducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
            animate={reducedMotion ? undefined : { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
          >
            <ResponsiveImage
              src={media.src}
              alt={media.alt}
              width={960}
              height={1200}
              srcWidths={[480, 720, 960, 1280]}
              sizes="(min-width: 1024px) 480px, 100vw"
              priority
              className="aspect-[4/5] w-full object-cover"
              aspectRatio="4 / 5"
            />
          </motion.div>
          {productHighlight ? (
            <motion.div
              className="rounded-3xl border border-lines bg-paper p-5 text-left shadow-card"
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.4, ease: 'easeOut' } }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Why Choose This</p>
              <p className="mt-2 text-sm text-ink">
                {productHighlight.description}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {productHighlight.metrics.map((metric) => (
                  <div key={metric.title} className="rounded-xl border border-lines/70 bg-paper px-3 py-2 text-center">
                    <span className="block text-sm font-semibold text-primary">{metric.value}</span>
                    <span className="text-[11px] uppercase tracking-wide text-muted">{metric.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </figure>
      </div>
    </motion.section>
  )
}
