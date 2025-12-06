import type { ReactElement } from 'react'

/**
 * Accessible tooltip wrapper with Evergreen surface styling.
 */
export type TooltipProps = Record<string, never>

export const Tooltip = (_props: TooltipProps): ReactElement | null => {
  void _props
  return null
}
