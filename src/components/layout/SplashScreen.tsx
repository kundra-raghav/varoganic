import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, type ReactElement } from 'react'

import { useUIStore } from '@/store/ui'

export type SplashScreenProps = {
  readonly visible: boolean
}

const highlights = ['100% botanical', 'Hand-poured weekly', 'Paraben & cruelty free']

export const SplashScreen = ({ visible }: SplashScreenProps): ReactElement => {
  const reducedMotion = useUIStore((state) => state.reducedMotion)
  const wordVariants = useMemo(
    () =>
      highlights.map((phrase, index) => ({
        phrase,
        delay: 0.4 + index * 0.25,
      })),
    [],
  )

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="varoganic-splash"
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-12 bg-paper px-6 text-center text-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative flex flex-col items-center gap-4"
            initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <div className="absolute -top-20 size-32 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
            <span className="rounded-full border border-lines/50 bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Varoganic Rituals
            </span>
            <motion.h1
              className="font-heading text-4xl text-ink md:text-5xl"
              initial={reducedMotion ? undefined : { letterSpacing: '0.2em', opacity: 0 }}
              animate={reducedMotion ? undefined : { letterSpacing: '0.02em', opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
            >
              Handcrafted. Honest. Holistic.
            </motion.h1>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted">
              {wordVariants.map((item) => (
                <motion.span
                  key={item.phrase}
                  className="inline-flex items-center gap-2 rounded-full border border-lines bg-paper px-4 py-2"
                  initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={reducedMotion ? undefined : { delay: item.delay, duration: 0.45, ease: 'easeOut' }}
                >
                  <span className="text-primary">•</span>
                  {item.phrase}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <div className="relative h-1.5 w-56 overflow-hidden rounded-full border border-lines bg-paper">
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              initial={{ width: '12%' }}
              animate={{ width: ['18%', '55%', '100%'], transition: { duration: 1.4, ease: 'easeInOut' } }}
            />
          </div>
          <p className="max-w-md text-sm text-muted">
            Fresh botanicals are being sealed for you. Zero parabens, zero fillers—just slow-crafted goodness ready to ship.
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
