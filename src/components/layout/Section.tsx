import type { ReactElement } from 'react'

/**
 * Semantic section wrapper with consistent spacing.
 */
export type SectionProps = Record<string, never>

export const Section = (_props: SectionProps): ReactElement | null => {
  void _props
  return null
}
