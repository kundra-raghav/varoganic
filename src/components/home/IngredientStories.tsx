import { useState, type ReactElement } from 'react'

import { ResponsiveImage } from '@/components/layout/ResponsiveImage'

export type IngredientStory = {
  readonly id: string
  readonly name: string
  readonly summary: string
  readonly benefits: Array<string>
  readonly imageSrc: string
  readonly imageAlt: string
}

export type IngredientStoriesProps = {
  readonly stories: Array<IngredientStory>
}

/**
 * Interactive flip cards that reveal ingredient benefits.
 */
export const IngredientStories = ({ stories }: IngredientStoriesProps): ReactElement => {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="font-heading text-h3 text-ink">Ingredient stories</h2>
        <p className="text-sm text-muted">Tap to reveal what each hero botanical brings to your ritual.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {stories.map((story) => {
          const isActive = activeId === story.id
          return (
            <button
              key={story.id}
              type="button"
              className="group relative overflow-hidden rounded-2xl border border-lines bg-paper text-left shadow-card transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper motion-safe:hover:-translate-y-1"
              onClick={() => {
                setActiveId((prev) => (prev === story.id ? null : story.id))
              }}
            >
              <div className="h-48 w-full overflow-hidden">
                <ResponsiveImage
                  src={story.imageSrc}
                  alt={story.imageAlt}
                  width={480}
                  height={480}
                  srcWidths={[320, 480, 640]}
                  sizes="(min-width: 1024px) 300px, 90vw"
                  className="size-full object-cover"
                  aspectRatio="1 / 1"
                />
              </div>
              <div className="p-4">
                <h3 className="font-heading text-lg text-ink">{story.name}</h3>
                <p className="text-sm text-muted">{story.summary}</p>
                {isActive ? (
                  <ul className="mt-4 space-y-2 text-sm text-body">
                    {story.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 inline-flex size-2 rounded-full bg-primary" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
