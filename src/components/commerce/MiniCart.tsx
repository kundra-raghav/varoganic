import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'

import { QuantityStepper } from '@/components/commerce/QuantityStepper'
import { Button } from '@/components/common/Button'
import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { formatCurrency } from '@/lib/formatters'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'

const MINICART_PORTAL_ID = 'mini-cart-portal'

const ensurePortal = (): HTMLElement => {
  const existing = document.getElementById(MINICART_PORTAL_ID)
  if (existing) {
    return existing
  }
  const node = document.createElement('div')
  node.id = MINICART_PORTAL_ID
  document.body.appendChild(node)
  return node
}

/**
 * Mini cart flyout summarizing cart items.
 */
export const MiniCart = (): ReactElement | null => {
  const { items, updateQuantity, removeItem, subtotal, savings } = useCartStore()
  const { isMiniCartOpen, closeMiniCart, reducedMotion } = useUIStore()
  const portalNode = useMemo(() => ensurePortal(), [])
  const totalFormatted = formatCurrency(subtotal(), 'INR')
  const savingsFormatted = formatCurrency(savings(), 'INR')
  const dialogRef = useRef<HTMLDivElement>(null)
  const [initialised, setInitialised] = useState(false)

  useEffect(() => {
    setInitialised(true)
  }, [])

  useEffect(() => {
    if (!isMiniCartOpen) {
      return
    }

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
    )
    const firstFocusable = focusable?.[0]
    const lastFocusable = focusable ? focusable[focusable.length - 1] : undefined
    firstFocusable?.focus()

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMiniCart()
      }

      if (event.key === 'Tab' && focusable && focusable.length > 0) {
        if (event.shiftKey && document.activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable?.focus()
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [closeMiniCart, isMiniCartOpen])

  if (!isMiniCartOpen || !initialised) {
    return null
  }

  const content = (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm">
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="flex size-full max-w-md flex-col border-l border-lines bg-paper shadow-card"
        style={reducedMotion ? undefined : { transition: 'transform 180ms ease-out' }}
      >
        <header className="flex items-center justify-between border-b border-lines px-6 py-4">
          <h2 className="text-base font-semibold text-ink">Your cart</h2>
          <Button size="sm" variant="tertiary" onClick={closeMiniCart}>
            Close
          </Button>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted">Your cart is waiting for a ritual.</p>
          ) : (
            items.map((item) => (
              <article key={item.id} className="flex gap-4">
                <ResponsiveImage
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={240}
                  height={240}
                  srcWidths={[160, 240, 320]}
                  sizes="96px"
                  className="size-24 rounded-xl object-cover"
                  aspectRatio="1 / 1"
                />
                <div className="flex flex-1 flex-col gap-2 text-sm text-body">
                  <div>
                    <h3 className="font-semibold text-ink">{item.name}</h3>
                    <p className="text-muted">{formatCurrency(item.price, 'INR')}</p>
                  </div>
                  <QuantityStepper
                    value={item.quantity}
                    min={1}
                    max={10}
                    onChange={(value) => {
                      updateQuantity(item.id, value)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.id)
                    }}
                    className="self-start text-xs text-muted underline"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        <footer className="space-y-3 border-t border-lines px-6 py-4 text-sm">
          <div className="flex justify-between text-muted">
            <span>Savings</span>
            <span>₹{savingsFormatted}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ink">
            <span>Subtotal</span>
            <span>₹{totalFormatted}</span>
          </div>
          <Button
            onClick={() => {
              window.location.assign('/cart')
            }}
            className="w-full"
          >
            Review cart
          </Button>
        </footer>
      </aside>
    </div>
  )

  return createPortal(content, portalNode)
}
