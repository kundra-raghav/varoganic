import type { ReactElement } from 'react'

/**
 * Individual cart line item with quantity and actions.
 */
export type CartLineProps = Record<string, never>

export const CartLine = (_props: CartLineProps): ReactElement | null => {
  void _props
  return null
}
