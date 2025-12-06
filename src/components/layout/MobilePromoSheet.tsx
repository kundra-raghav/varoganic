import { useCallback, useEffect, useState, type ReactElement } from 'react'

import { BottomSheet } from '@/components/common/BottomSheet'
import { Button } from '@/components/common/Button'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

const FIRST_VISIT_KEY = 'varoganic:first-visit'
const DISMISS_KEY = 'varoganic:mobile-promo-dismissed'

const isMobileViewport = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(max-width: 768px)').matches
}

/**
 * Mobile-specific promotional sheet that honours Google interstitial guidance
 * by avoiding the first page view and only appearing after soft engagement.
 */
export const MobilePromoSheet = (): ReactElement | null => {
  const prefersReducedMotion = useReducedMotionSafe()
  const [open, setOpen] = useState(false)
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    if (!isMobileViewport()) {
      return
    }

    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (dismissed) {
      return
    }

    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY)
    if (!firstVisit) {
      localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString())
      return
    }

    setEligible(true)
  }, [])

  useEffect(() => {
    if (!eligible) {
      return
    }

    let hasTriggered = false

    const show = (): void => {
      if (hasTriggered) {
        return
      }
      hasTriggered = true
      setOpen(true)
    }

    const handleScroll = (): void => {
      if (window.scrollY > 320) {
        show()
        window.removeEventListener('scroll', handleScroll)
      }
    }

    const delay = prefersReducedMotion ? 0 : 6000
    const timer = window.setTimeout(show, delay)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [eligible, prefersReducedMotion])

  const handleClose = useCallback(() => {
    setOpen(false)
    localStorage.setItem(DISMISS_KEY, new Date().toISOString())
  }, [])

  if (!eligible) {
    return null
  }

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      title="Mobile glow bundle"
      description="Special ritual for handheld shoppers"
      footer="We\'ll only show this once per device to keep things mindful."
    >
      <div className="space-y-4 text-sm text-body">
        <p>
          Build a ritual with our travel-sized cleanser, serum, and night balm for ₹699. Complimentary eco-pouch and
          shipping included.
        </p>
        <Button
          size="sm"
          onClick={() => {
            window.location.assign('/collections/mobile-ritual-bundle')
          }}
        >
          Explore the mobile bundle
        </Button>
        <Button
          variant="tertiary"
          size="sm"
          onClick={handleClose}
        >
          Maybe later
        </Button>
      </div>
    </BottomSheet>
  )
}
