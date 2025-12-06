import { useMemo, useState, type ReactElement } from 'react'

import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

export type BeforeAfterProps = {
  readonly beforeSrc: string
  readonly afterSrc: string
  readonly alt: string
  readonly disclaimer: string
}

/**
 * Before/after comparison slider with keyboard-accessible control.
 */
export const BeforeAfter = ({ beforeSrc, afterSrc, alt, disclaimer }: BeforeAfterProps): ReactElement => {
  const [sliderValue, setSliderValue] = useState(50)
  const prefersReducedMotion = useReducedMotionSafe()

  const sliderPercent = useMemo(() => `${String(sliderValue)}%`, [sliderValue])
  const clipPath = useMemo(() => `polygon(0 0, ${sliderPercent} 0, ${sliderPercent} 100%, 0 100%)`, [sliderPercent])

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="font-heading text-h3 text-ink">Results that stay rooted in care</h2>
        <p className="text-sm text-muted">Slide to explore 6-week transformations with guided rituals.</p>
      </div>
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-lines bg-paper shadow-card">
        <div className="relative h-[22rem] w-full md:h-[26rem]">
          <ResponsiveImage
            src={afterSrc}
            alt={alt}
            width={960}
            height={960}
            srcWidths={[640, 960, 1280]}
            sizes="(min-width: 1024px) 640px, 100vw"
            priority
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath, transition: prefersReducedMotion ? undefined : 'clip-path 180ms ease-out' }}
          >
            <ResponsiveImage
              src={beforeSrc}
              alt={alt}
              width={960}
              height={960}
              srcWidths={[640, 960, 1280]}
              sizes="(min-width: 1024px) 640px, 100vw"
              priority
              className="size-full object-cover"
              style={{ objectPosition: 'center' }}
            />
          </div>
          <div className="pointer-events-none absolute inset-y-0" style={{ left: sliderPercent }}>
            <div className="relative ml-[-3px] h-full w-[6px] rounded-full bg-paper/80">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                {sliderValue}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-6 py-4">
          <label htmlFor="before-after-slider" className="flex items-center justify-between text-sm font-medium text-ink">
            <span>Slide to compare</span>
            <span className="text-muted">{disclaimer}</span>
          </label>
          <input
            id="before-after-slider"
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(event) => {
              setSliderValue(Number(event.target.value))
            }}
            className="accent-primary"
          />
        </div>
      </div>
    </section>
  )
}
