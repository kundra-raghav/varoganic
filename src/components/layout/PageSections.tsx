import { motion } from 'framer-motion'
import { Fragment, type ReactElement, type ReactNode } from 'react'

import { Button, type ButtonProps } from '@/components/common/Button'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/cn'

export type HeroAction = {
  readonly label: string
  readonly href: string
  readonly variant?: ButtonProps['variant']
}

export type HeroHighlight = {
  readonly label: string
  readonly value: string
}

export type PageHeroMedia = {
  readonly src: string
  readonly alt: string
}

export type PageHeroProps = {
  readonly eyebrow?: string
  readonly title: string
  readonly description: string
  readonly actions?: Array<HeroAction>
  readonly highlights?: Array<HeroHighlight>
  readonly media?: PageHeroMedia
}

export type SectionHeaderProps = {
  readonly eyebrow?: string
  readonly title: string
  readonly description?: string
  readonly align?: 'left' | 'center'
  readonly kicker?: ReactNode
}

export type AnimatedSectionVariant = 'card' | 'plain' | 'split' | 'frosted'

export type AnimatedSectionProps = {
  readonly children: ReactNode
  readonly delay?: number
  readonly variant?: AnimatedSectionVariant
  readonly className?: string
}

export const PageContainer = ({ children, className }: { readonly children: ReactNode; readonly className?: string }): ReactElement => {
  return <div className={cn('mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12', className)}>{children}</div>
}

export const PageHero = ({ eyebrow, title, description, actions, highlights, media }: PageHeroProps): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  const content = (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr),340px] lg:items-center">
      <div className="space-y-6">
        {eyebrow ? <p className="text-sm uppercase tracking-[0.2em] text-muted">{eyebrow}</p> : null}
        <h1 className="font-heading text-h1 leading-tight text-ink">{title}</h1>
        <p className="max-w-2xl text-base text-body">{description}</p>
        {actions && actions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Button
                key={action.href}
                variant={action.variant ?? 'primary'}
                onClick={() => {
                  window.location.assign(action.href)
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
        {highlights && highlights.length > 0 ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary shadow-inner"
              >
                <dt className="text-xs uppercase tracking-wide text-primary/70">{highlight.label}</dt>
                <dd className="mt-1 text-lg font-semibold text-primary">{highlight.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {media ? (
        <div className="relative overflow-hidden rounded-3xl border border-lines bg-paper shadow-card">
          <img src={media.src} alt={media.alt} className="size-full object-cover" loading="lazy" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper/30 via-transparent to-transparent" />
        </div>
      ) : null}
    </div>
  )

  if (prefersReducedMotion) {
    return (
      <section className="overflow-hidden rounded-3xl border border-lines bg-paper bg-confetti px-6 py-10 shadow-card md:px-12">
        {content}
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="overflow-hidden rounded-3xl border border-lines bg-paper bg-confetti px-6 py-10 shadow-card md:px-12"
    >
      {content}
    </motion.section>
  )
}

export const SectionHeader = ({ eyebrow, title, description, align = 'left', kicker }: SectionHeaderProps): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left'
  const headerContent = (
    <Fragment>
      {kicker}
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">{eyebrow}</span>
      ) : null}
      <h2 className="font-heading text-h2 text-ink">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-muted">{description}</p> : null}
    </Fragment>
  )

  if (prefersReducedMotion) {
    return <div className={cn('flex flex-col gap-3', alignment)}>{headerContent}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('flex flex-col gap-3', alignment)}
    >
      {headerContent}
    </motion.div>
  )
}

const variantClassNames: Record<AnimatedSectionVariant, string> = {
  card: 'rounded-3xl border border-lines bg-paper p-8 shadow-card/40',
  plain: 'space-y-6',
  split: 'grid gap-8 rounded-3xl border border-lines bg-paper p-8 shadow-card/50 lg:grid-cols-2',
  frosted: 'rounded-3xl border border-primary/20 bg-primary/10 p-8 shadow-xl backdrop-blur-sm ring-1 ring-primary/10',
}

export const AnimatedSection = ({ children, delay = 0, variant = 'card', className }: AnimatedSectionProps): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()
  const baseClasses = cn(variantClassNames[variant], className)

  if (prefersReducedMotion) {
    return <section className={baseClasses}>{children}</section>
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: 'easeOut', delay }}
      className={baseClasses}
    >
      {children}
    </motion.section>
  )
}

export type Stat = {
  readonly label: string
  readonly value: string
  readonly description?: string
}

export const StatGrid = ({ stats }: { readonly stats: Array<Stat> }): ReactElement => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-left text-primary shadow-inner"
        >
          <p className="text-xs uppercase tracking-wide text-primary/60">{stat.label}</p>
          <p className="mt-2 font-heading text-3xl text-primary">{stat.value}</p>
          {stat.description ? <p className="mt-1 text-xs text-primary/80">{stat.description}</p> : null}
        </div>
      ))}
    </div>
  )
}

export type AnimatedListProps<TItem> = {
  readonly items: Array<TItem>
  readonly renderItem: (item: TItem, index: number) => ReactNode
}

export const AnimatedList = <TItem,>({ items, renderItem }: AnimatedListProps<TItem>): ReactElement => {
  const prefersReducedMotion = useReducedMotionSafe()

  if (prefersReducedMotion) {
    return <div className="grid gap-4 md:grid-cols-2">{items.map((item, index) => renderItem(item, index))}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  )
}
