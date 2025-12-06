import type { ReactElement } from 'react'

/**
 * Responsive width-constrained container component.
 */
export type ContainerProps = Record<string, never>

export const Container = (_props: ContainerProps): ReactElement | null => {
  void _props
  return null
}
