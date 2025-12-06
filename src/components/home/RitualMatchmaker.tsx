import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState, type ReactElement } from 'react'

import { Button } from '@/components/common/Button'
import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { PRODUCTS } from '@/data/products'
import { useUIStore } from '@/store/ui'

import type { Product } from '@/types/product'

const QUESTIONS = [
  {
    id: 'skin',
    title: 'How does your skin feel today?',
    options: [
      { value: 'dry', label: 'Dry & thirsty', helper: 'Craves cushioning hydration' },
      { value: 'oily', label: 'Oily & acne-prone', helper: 'Needs detox without stripping' },
      { value: 'combo', label: 'Combination', helper: 'T-zone shine, cheek dryness' },
      { value: 'sensitive', label: 'Reactive', helper: 'Prefers gentle botanical soothers' },
    ],
  },
  {
    id: 'intent',
    title: 'Pick the ritual mood',
    options: [
      { value: 'glow', label: 'Radiant glow', helper: 'Lit-from-within luminosity in 2 weeks' },
      { value: 'calm', label: 'Soothe & repair', helper: 'Barrier resilience for stressed skin' },
      { value: 'clarity', label: 'Deep detox', helper: 'Banishing dullness, refining pores' },
    ],
  },
  {
    id: 'texture',
    title: 'What texture delights you most?',
    options: [
      { value: 'bar', label: 'Artisanal cleansing bar', helper: 'Clay-rich suds with zero sulphates' },
      { value: 'serum', label: 'Lightweight elixir', helper: 'Fast-absorbing dew for AM + PM' },
      { value: 'mist', label: 'Botanical face mist', helper: 'Instant zen between meetings' },
    ],
  },
] as const

type QuizAnswers = {
  skin?: (typeof QUESTIONS)[number]['options'][number]['value']
  intent?: (typeof QUESTIONS)[number]['options'][number]['value']
  texture?: (typeof QUESTIONS)[number]['options'][number]['value']
}

const toTitle = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined
  }
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const resolveProduct = (answers: QuizAnswers): Product => {
  const skinTitle = toTitle(answers.skin)
  const preferenceOrder = [
    { match: { texture: 'bar', intent: 'clarity' }, productId: 'soap-detan' },
    { match: { texture: 'bar', intent: 'calm' }, productId: 'soap-neem' },
    { match: { texture: 'bar', intent: 'glow' }, productId: 'soap-milky-kesar' },
    { match: { texture: 'serum', intent: 'glow' }, productId: 'elixir-glow' },
    { match: { texture: 'serum', intent: 'calm' }, productId: 'gel-hydrating' },
    { match: { texture: 'mist', intent: 'calm' }, productId: 'mist-rose' },
    { match: { texture: 'serum', intent: 'clarity' }, productId: 'gel-hydrating' },
  ] as const

  for (const entry of preferenceOrder) {
    if (
      (!answers.texture || entry.match.texture === answers.texture) &&
      (!answers.intent || entry.match.intent === answers.intent)
    ) {
      const product = PRODUCTS.find((candidate) => candidate.id === entry.productId)
      if (product && (!skinTitle || product.suits.includes(skinTitle))) {
        return product
      }
    }
  }

  if (skinTitle) {
    const suitMatch = PRODUCTS.find((product) => product.suits.includes(skinTitle))
    if (suitMatch) {
      return suitMatch
    }
  }

  return PRODUCTS[0]
}

/**
 * Three-step ritual quiz guiding shoppers to a handcrafted recommendation.
 */
export const RitualMatchmaker = (): ReactElement => {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const reducedMotion = useUIStore((state) => state.reducedMotion)
  const intentDescriptors: Record<string, string> = useMemo(
    () => ({
      glow: 'ritual radiance',
      calm: 'soothing repair',
      clarity: 'clarifying reset',
    }),
    [],
  )

  const activeQuestion = QUESTIONS[stepIndex]
  const isCompleted = stepIndex >= QUESTIONS.length
  const recommendedProduct = useMemo(() => resolveProduct(answers), [answers])
  const moodSummary = answers.intent ? intentDescriptors[answers.intent] ?? 'balanced care' : 'balanced care'

  const handleSelect = (value: string): void => {
    const question = QUESTIONS[stepIndex]
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
    if (stepIndex < QUESTIONS.length - 1) {
      setStepIndex((prev) => prev + 1)
    } else {
      setStepIndex(QUESTIONS.length)
    }
  }

  const resetQuiz = (): void => {
    setAnswers({})
    setStepIndex(0)
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-lines bg-paper px-6 py-10 shadow-card md:px-12">
      <motion.div
        className="pointer-events-none absolute -right-20 top-10 size-56 rounded-full bg-primary/10 blur-3xl"
        initial={reducedMotion ? undefined : { opacity: 0.2, scale: 0.8 }}
        animate={reducedMotion ? undefined : { opacity: [0.2, 0.5, 0.3], scale: [0.8, 1.05, 0.9], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
      />
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-success">Botanical ritual finder</p>
            <h2 className="font-heading text-h3 text-ink">Let’s handpick the formula your skin will love</h2>
            <p className="text-sm text-muted">
              Answer three intuitive prompts to meet the handcrafted blend that matches your mood, texture cravings, and skin behaviour. No algorithms—just our formulator’s playbook.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted">
            <span className="rounded-full border border-lines bg-paper px-3 py-1">Zero parabens</span>
            <span className="rounded-full border border-lines bg-paper px-3 py-1">Cold-pressed botanicals</span>
            <span className="rounded-full border border-lines bg-paper px-3 py-1">Ayurvedic ratios</span>
          </div>
          <div className="rounded-2xl border border-lines bg-paper/80 p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Step {isCompleted ? QUESTIONS.length : stepIndex + 1} of {QUESTIONS.length}
            </p>
            <AnimatePresence mode="wait">
              {!isCompleted ? (
                <motion.div
                  key={activeQuestion.id}
                  initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
                  transition={reducedMotion ? undefined : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-semibold text-ink">{activeQuestion.title}</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {activeQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleSelect(option.value)
                        }}
                        className="rounded-2xl border border-lines bg-paper p-4 text-left text-sm text-ink transition-transform hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                      >
                        <span className="font-semibold text-primary">{option.label}</span>
                        <p className="mt-1 text-xs text-muted">{option.helper}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={reducedMotion ? undefined : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-ink">Your ritual soulmate is ready</h3>
                  <p className="text-sm text-muted">
                    {recommendedProduct.name} is our most-loved match for {toTitle(answers.skin)?.toLowerCase() ?? 'versatile'} skin craving {moodSummary}. Expect zero synthetics, fast results, and a glow that feels like home.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => {
                        window.location.assign(`/product?id=${recommendedProduct.id}`)
                      }}
                    >
                      View ritual
                    </Button>
                    <Button variant="secondary" onClick={resetQuiz}>
                      Restart quiz
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.div
          className="space-y-4 rounded-3xl border border-lines bg-paper p-6 shadow-card"
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Artisan spotlight</p>
          <div className="overflow-hidden rounded-2xl border border-lines/70">
            <ResponsiveImage
              src={recommendedProduct.imageSrc}
              alt={recommendedProduct.imageAlt}
              width={720}
              height={900}
              srcWidths={[360, 540, 720]}
              sizes="(min-width: 1024px) 320px, 80vw"
              className="aspect-[4/5] w-full object-cover"
              aspectRatio="4 / 5"
            />
          </div>
          <div className="space-y-2 text-sm text-muted">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">{recommendedProduct.name}</span>
              <span className="rounded-full border border-success/60 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                {recommendedProduct.category}
              </span>
            </div>
            <p>
              Crafted with {recommendedProduct.suits.join(', ')} skin in mind. Every batch cures for 72 hours to maximise botanical potency and keep preservatives off the table.
            </p>
            <ul className="grid gap-2 text-xs">
              {recommendedProduct.goals.slice(0, 3).map((goal) => (
                <li key={goal} className="inline-flex items-center gap-2 rounded-full border border-lines px-3 py-1">
                  <span className="text-primary">✶</span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
