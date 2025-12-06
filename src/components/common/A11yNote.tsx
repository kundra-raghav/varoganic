import { useEffect, useState, type ReactElement, type ReactNode } from 'react'

import { getContrastRatio } from '@/lib/a11y'

export type A11yNoteProps = {
  readonly foreground: string
  readonly background: string
  readonly minimum?: number
  readonly children?: ReactNode
  readonly title?: string
}

const DEFAULT_MESSAGE = 'Colour pairing falls below the target contrast ratio.'

/**
 * Development-only helper that surfaces contrast issues for quickly testing
 * design token combinations. Intended to be rendered near the component using
 * the colour pairing so the warning is easy to spot during implementation.
 */
export const A11yNote = ({
  foreground,
  background,
  minimum = 4.5,
  children,
  title = 'Accessibility note',
}: A11yNoteProps): ReactElement | null => {
  const [ratio, setRatio] = useState<number | null>(null)
  const [evaluated, setEvaluated] = useState(false)

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return
    }

    setRatio(getContrastRatio(foreground, background))
    setEvaluated(true)
  }, [background, foreground])

  if (!import.meta.env.DEV || !evaluated) {
    return null
  }

  if (ratio === null) {
    return (
      <aside className="mt-2 rounded-md border border-warning/60 bg-warning/10 px-3 py-2 text-xs text-warning">
        <strong className="mr-1 font-semibold">{title}:</strong>
        Unable to evaluate contrast for the provided colour tokens. Ensure they resolve to RGB or HEX values.
      </aside>
    )
  }

  if (ratio >= minimum) {
    return null
  }

  const message =
    children ?? `${DEFAULT_MESSAGE} Foreground vs background ratio is ${ratio.toFixed(2)}:1 (target ${String(minimum)}:1).`

  return (
    <aside className="mt-2 rounded-md border border-warning/60 bg-warning/10 px-3 py-2 text-xs text-warning">
      <strong className="mr-1 font-semibold">{title}:</strong>
      {message}
    </aside>
  )
}
