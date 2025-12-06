import { useEffect, useRef, useState, type ReactElement } from 'react'

import { Button } from '@/components/common/Button'
import { Chip } from '@/components/common/Chip'
import { getUniqueGoals, getUniqueSuits } from '@/data/products'
import { useFiltersStore } from '@/store/filters'
import { useUIStore } from '@/store/ui'

const SKIN_TYPES = getUniqueSuits().sort((a, b) => a.localeCompare(b))
const CONCERNS = getUniqueGoals().sort((a, b) => a.localeCompare(b))

/**
 * Mobile-first drawer for PLP filters.
 */
export const FiltersDrawer = (): ReactElement => {
  const { skinType, concern, setSkinType, setConcern, resetFilters } = useFiltersStore()
  const { isMenuOpen, toggleMenu, closeMenu } = useUIStore()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [closeMenu, isMenuOpen])

  if (!mounted) {
    return <div className="md:hidden" />
  }

  return (
    <div className="md:hidden">
      <Button variant="secondary" size="sm" onClick={toggleMenu}>
        Filters
      </Button>
      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/40 backdrop-blur-sm">
          <div
            ref={dialogRef}
            className="w-full rounded-t-3xl border border-lines bg-paper p-6 shadow-card"
            role="dialog"
            aria-modal="true"
          >
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">Filter products</h2>
              <Button variant="tertiary" size="sm" onClick={closeMenu}>
                Close
              </Button>
            </header>
            <div className="space-y-6">
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Skin type</h3>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      selected={skinType === type}
                      onClick={() => {
                        setSkinType(skinType === type ? null : type)
                      }}
                    />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Concern</h3>
                <div className="flex flex-wrap gap-2">
                  {CONCERNS.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      selected={concern === value}
                      onClick={() => {
                        setConcern(concern === value ? null : value)
                      }}
                    />
                  ))}
                </div>
              </section>
            </div>
            <footer className="mt-6 flex justify-between gap-3">
              <Button variant="tertiary" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button size="sm" onClick={closeMenu}>
                Apply
              </Button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  )
}
