import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Product } from '@/types/product'

export type CartItem = {
  readonly id: string
  readonly name: string
  readonly price: number
  readonly mrp: number
  readonly imageSrc: string
  readonly imageAlt: string
  readonly quantity: number
}

export type CartState = {
  readonly items: Array<CartItem>
  readonly lastAddedId: string | null
  readonly isLoading: boolean
  readonly addItem: (product: Product, quantity?: number) => void
  readonly updateQuantity: (productId: string, quantity: number) => void
  readonly removeItem: (productId: string) => void
  readonly clearCart: () => void
  readonly setLoading: (loading: boolean) => void
  readonly subtotal: () => number
  readonly savings: () => number
}

const dispatchCartEvent = (eventName: string, detail: Record<string, unknown>): void => {
  window.dispatchEvent(new CustomEvent(eventName, { detail }))
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAddedId: null,
      isLoading: false,
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id)
          const updatedItems = existing
            ? state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              )
            : [
                ...state.items,
                {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  mrp: product.mrp,
                  imageSrc: product.imageSrc,
                  imageAlt: product.imageAlt,
                  quantity,
                },
              ]

          queueMicrotask(() => {
            dispatchCartEvent('cart:item-added', { id: product.id, quantity })
          })

          return { items: updatedItems, lastAddedId: product.id }
        })
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) => (item.id === productId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        }))
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== productId) }))
      },
      clearCart: () => {
        set({ items: [], lastAddedId: null })
      },
      setLoading: (loading) => set({ isLoading: loading }),
      subtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
      },
      savings: () => {
        return get().items.reduce((acc, item) => acc + (item.mrp - item.price) * item.quantity, 0)
      },
    }),
    {
      name: 'varoganic-cart',
    },
  ),
)
