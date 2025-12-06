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

export type ModalSize = 'sm' | 'md' | 'lg'

export type ModalProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly title?: string
  readonly description?: string
  readonly size?: ModalSize
  readonly initialFocusRef?: React.RefObject<HTMLElement>
  readonly children: ReactNode
  readonly className?: string
  readonly containerProps?: HTMLAttributes<HTMLDivElement>
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
 * Accessible modal dialog shell with focus trapping and reduced-motion support.
 */
export const Modal = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  initialFocusRef,
  children,
  className,
  containerProps,
}: ModalProps): ReactElement | null => {
  const [mounted, setMounted] = useState(false)
  const portalNode = useMemo(() => {
    if (typeof document === 'undefined') {
      return null
    }
    const node = document.createElement('div')
    node.setAttribute('data-portal', 'modal')
    return node
  }, [])

  const dialogRef = useRef<HTMLDivElement | null>(null)
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
    if (!open || !dialogRef.current) {
      return
    }

    const element = dialogRef.current

    lastFocusedElementRef.current = document.activeElement

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
    if (!open || !dialogRef.current) {
      return
    }

    const element = dialogRef.current

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

  const sizeClassName = sizeClassNames[size]

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm"
      style={prefersReducedMotion ? undefined : { animation: 'modal-fade 180ms ease-out both' }}
      onMouseDown={handleOverlayClick}
    >
      <div
        {...containerProps}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className={cn(
          'max-h-[85vh] overflow-y-auto rounded-3xl border border-lines bg-paper p-6 shadow-card outline-none transition-transform',
          sizeClassName,
          className,
        )}
        style={prefersReducedMotion ? undefined : { animation: 'modal-scale 200ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        {title ? (
          <h2 id="modal-title" className="font-heading text-h3 text-ink">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p id="modal-description" className="mt-2 text-sm text-muted">
            {description}
          </p>
        ) : null}
        <div className={cn(title || description ? 'mt-4' : '')}>{children}</div>
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

const sizeClassNames: Record<ModalSize, string> = {
  sm: 'w-[min(28rem,90vw)]',
  md: 'w-[min(38rem,90vw)]',
  lg: 'w-[min(52rem,90vw)]',
}
