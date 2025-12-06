/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/common/Button'
// Temporarily commented out - customers shop on Flipkart
// import { add_to_cart } from '@/lib/analytics'
import { cn } from '@/lib/cn'
// import { notifyAddToCart } from '@/lib/toasts'
// import { useCartStore } from '@/store/cart'
// import { useUIStore } from '@/store/ui'

import type { Product } from '@/types/product'
import type { ReactElement } from 'react'

export type AddToCartButtonProps = {
  readonly product: Product
  readonly quantity?: number
  readonly variantId?: string
  readonly label?: string
  readonly className?: string
  readonly variant?: 'primary' | 'secondary' | 'tertiary'
  readonly size?: 'sm' | 'md' | 'lg'
}

/**
 * Add-to-cart trigger integrating with cart slice.
 */
export const AddToCartButton = ({
  product: _product,
  quantity: _quantity = 1,
  label = 'Add to cart',
  variantId: _variantId,
  className,
  variant = 'primary',
  size = 'md',
}: AddToCartButtonProps): ReactElement => {
  const [isAdding] = useState(false)
  const [showSparkle] = useState(false)
  // Temporarily commented out - customers shop on Flipkart
  // const addItem = useCartStore((state) => state.addItem)
  // const openMiniCart = useUIStore((state) => state.openMiniCart)
  // const reducedMotion = useUIStore((state) => state.reducedMotion)
  const reducedMotion = false
  const timeouts = useRef<Array<number>>([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => {
        window.clearTimeout(id)
      })
      timeouts.current = []
    }
  }, [])

  // Temporarily commented out - customers shop on Flipkart
  // const schedule = (callback: () => void, delay: number): void => {
  //   const id = window.setTimeout(() => {
  //     callback()
  //     timeouts.current = timeouts.current.filter((storedId) => storedId !== id)
  //   }, delay)
  //   timeouts.current.push(id)
  // }

  const handleClick = (): void => {
    // Temporarily disabled - customers shop on Flipkart
    // Cart functionality commented out
    /* if (isAdding) {
      return
    }

    setIsAdding(true)
    addItem(product, quantity)
    notifyAddToCart(product.name, quantity)
    add_to_cart({
      item: {
        id: product.id,
        name: product.name,
        category: product.category,
        variant: variantId,
        price: product.price,
        quantity,
      },
    })
    openMiniCart()

    if (!reducedMotion) {
      setShowSparkle(true)
      schedule(() => {
        setShowSparkle(false)
      }, 700)
      schedule(() => {
        setIsAdding(false)
      }, 220)
    } else {
      setIsAdding(false)
    } */
  }

  return (
    <Button onClick={handleClick} loading={isAdding} variant={variant} size={size} className={cn('relative w-full overflow-hidden', className)}>
      <span className="relative z-10">{isAdding ? 'Added' : label}</span>
      <AnimatePresence>
        {showSparkle && !reducedMotion ? (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', stiffness: 240, damping: 18 },
            }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
          >
            <span className="absolute size-14 rounded-full bg-accent/20 blur-md" />
            <span className="absolute size-3 rounded-full bg-primary" style={{ transform: 'translate(-16px, -10px)' }} />
            <span className="absolute size-2 rounded-full bg-accent" style={{ transform: 'translate(14px, -8px)' }} />
            <span className="absolute size-1.5 rounded-full bg-primary/60" style={{ transform: 'translate(6px, 12px)' }} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </Button>
  )
}
