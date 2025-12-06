import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/cn'

type DrawerSide = 'left' | 'right' | 'bottom'

export type DrawerProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly title?: string
  readonly description?: string
  readonly children: ReactNode
  readonly side?: DrawerSide
  readonly className?: string
  readonly containerProps?: HTMLAttributes<HTMLDivElement>
  readonly initialFocusRef?: React.RefObject<HTMLElement>
}

const focusableSelectors = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[data-focusable="true"]',
]

/**
 * Accessible slide-in drawer for navigation, filters, or cart summaries.
 */
export const Drawer = ({
  open,
  onClose,
  title,
  description,
  children,
  side = 'right',
  className,
  containerProps,
  initialFocusRef,
}: DrawerProps): ReactElement | null => {
  const [mounted, setMounted] = useState(false)
  const portalNode = useMemo(() => {
    if (typeof document === 'undefined') {
      return null
    }
    const node = document.createElement('div')
    node.setAttribute('data-portal', 'drawer')
    return node
  }, [])
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedElementRef = useRef<Element | null>(null)
  const prefersReducedMotion = useReducedMotionSafe()

  useEffect(() => {
    if (!portalNode || typeof document === 'undefined') {
      return
    }
    document.body.appendChild(portalNode)
    setMounted(true)
    return () => {
      document.body.removeChild(portalNode)
    }
  }, [portalNode])

  useEffect(() => {
    if (!open || !drawerRef.current) {
      return
    }

    lastFocusedElementRef.current = document.activeElement

    const element = drawerRef.current
    const focusables = Array.from(element.querySelectorAll<HTMLElement>(focusableSelectors.join(',')))
    const initialFromProp = initialFocusRef ? initialFocusRef.current : null
    let initialTarget = initialFromProp
    if (!initialTarget && focusables.length > 0) {
      initialTarget = focusables[0]
    }
    if (initialTarget) {
      initialTarget.focus({ preventScroll: true })
    }

    const restoreScroll = disableScroll()

    return () => {
      restoreScroll()
      if (lastFocusedElementRef.current instanceof HTMLElement) {
        lastFocusedElementRef.current.focus({ preventScroll: true })
      }
      lastFocusedElementRef.current = null
    }
  }, [initialFocusRef, open])

  useEffect(() => {
    if (!open || !drawerRef.current) {
      return
    }

    const element = drawerRef.current

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusables = Array.from(element.querySelectorAll<HTMLElement>(focusableSelectors.join(',')))
        .filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1)

      if (focusables.length === 0) {
        event.preventDefault()
        element.focus()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose()
      }
    },
    [onClose],
  )

  if (!mounted || !portalNode || !open) {
    return null
  }

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[90] flex bg-ink/40 backdrop-blur-sm"
      style={{
        alignItems: side === 'bottom' ? 'flex-end' : 'stretch',
        justifyContent: side === 'left' ? 'flex-start' : side === 'right' ? 'flex-end' : 'center',
        animation: prefersReducedMotion ? undefined : 'modal-fade 180ms ease-out both',
      }}
      onMouseDown={handleOverlayClick}
    >
      <div
        {...containerProps}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        aria-describedby={description ? 'drawer-description' : undefined}
        tabIndex={-1}
        className={cn(
          'flex max-h-[95vh] w-full max-w-md flex-col overflow-y-auto border border-lines bg-paper shadow-card outline-none',
          side === 'bottom' ? 'rounded-t-3xl' : 'rounded-3xl',
          className,
        )}
        style={{
          width: side === 'bottom' ? 'min(640px, 100%)' : 'min(400px, 90vw)',
          animation: prefersReducedMotion
            ? undefined
            : `${animationNameForSide(side)} 200ms cubic-bezier(0.16, 1, 0.3, 1) both`,
        }}
      >
        {title || description ? (
          <div className="space-y-2 px-6 py-5">
            {title ? (
              <h2 id="drawer-title" className="font-heading text-h3 text-ink">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id="drawer-description" className="text-sm text-muted">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className={cn('flex-1 px-6 pb-8', title || description ? '' : 'pt-6')}>{children}</div>
      </div>
    </div>,
    portalNode,
  )
}

const disableScroll = (): (() => void) => {
  if (typeof document === 'undefined') {
    return () => undefined
  }

  const originalOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  return () => {
    document.body.style.overflow = originalOverflow
  }
}

const animationNameForSide = (side: DrawerSide): string => {
  switch (side) {
    case 'left':
      return 'drawer-slide-left'
    case 'right':
      return 'drawer-slide-right'
    case 'bottom':
    default:
      return 'drawer-slide-up'
  }
}
