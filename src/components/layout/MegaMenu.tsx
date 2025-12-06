import { useEffect, useId, useMemo, useRef, useState, type ReactElement } from 'react'

import { ResponsiveImage } from '@/components/layout/ResponsiveImage'
import { cn } from '@/lib/cn'

export type MegaMenuCategory = {
  readonly name: string
  readonly href: string
  readonly description?: string
  readonly thumbnail?: string
}

export type MegaMenuSection = {
  readonly title: string
  readonly items: Array<MegaMenuCategory>
}

export type MegaMenuProps = {
  readonly sections: Array<MegaMenuSection>
  readonly open: boolean
  readonly onClose: () => void
  readonly anchorRef: React.RefObject<HTMLButtonElement>
}

/**
 * Accessible mega-menu panel with multi-column layout and focus containment.
 */
export const MegaMenu = ({ sections, open, onClose, anchorRef }: MegaMenuProps): ReactElement | null => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const firstFocusableRef = useRef<HTMLAnchorElement | null>(null)
  const lastFocusableRef = useRef<HTMLAnchorElement | null>(null)
  const descriptionId = useId()
  const [isFocusBound, setIsFocusBound] = useState(false)

  const content = useMemo(() => sections.flatMap((section) => section.items), [sections])

  useEffect(() => {
    if (!open) {
      setIsFocusBound(false)
      return
    }

    const focusables = containerRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]')
    if (focusables && focusables.length > 0) {
      firstFocusableRef.current = focusables[0]
      lastFocusableRef.current = focusables[focusables.length - 1]
      focusables[0].focus()
      setIsFocusBound(true)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        anchorRef.current?.focus()
      }

      if (event.key === 'Tab' && isFocusBound) {
        const focusables = containerRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]')
        if (!focusables || focusables.length === 0) {
          return
        }
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [anchorRef, isFocusBound, onClose, open])

  if (!open) {
    return null
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-describedby={descriptionId}
      className="absolute left-1/2 top-full z-30 mt-4 w-[min(72rem,90vw)] -translate-x-1/2 overflow-hidden rounded-2xl border border-lines bg-paper shadow-card"
    >
      <div id={descriptionId} className="sr-only">
        Shop categories and featured collections
      </div>
      <div className="grid gap-8 px-8 py-6 md:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-4">
            <div>
              <h3 className="font-heading text-sm uppercase tracking-wider text-muted">{section.title}</h3>
            </div>
            <ul className="space-y-3">
              {section.items.map((item) => {
                const isFirstColumnLink = content[0]?.href === item.href
                const isLastColumnLink = content[content.length - 1]?.href === item.href
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      ref={(node) => {
                        if (isFirstColumnLink) {
                          firstFocusableRef.current = node ?? null
                        }
                        if (isLastColumnLink) {
                          lastFocusableRef.current = node ?? null
                        }
                      }}
                      className={cn(
                        'group flex gap-4 rounded-xl p-3 transition-colors motion-reduce:transition-none hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                      )}
                    >
                      {item.thumbnail ? (
                        <span className="size-12 overflow-hidden rounded-lg">
                          <ResponsiveImage
                            src={item.thumbnail}
                            alt={item.name}
                            width={120}
                            height={120}
                            srcWidths={[90, 120, 160]}
                            sizes="48px"
                            className="size-full object-cover"
                            aspectRatio="1 / 1"
                          />
                        </span>
                      ) : null}
                      <span className="flex flex-1 flex-col">
                        <span className="font-medium text-ink">{item.name}</span>
                        {item.description ? (
                          <span className="text-sm text-muted">{item.description}</span>
                        ) : null}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
