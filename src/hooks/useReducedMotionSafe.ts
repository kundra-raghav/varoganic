import { useEffect, useState } from 'react'

/**
 * Returns `true` when the user prefers reduced motion while remaining SSR safe.
 * Defaults to `true` during SSR to avoid jarring animations on first paint.
 */
export const useReducedMotionSafe = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return true
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = (): void => {
      setPrefersReducedMotion(media.matches)
    }

    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => {
      media.removeEventListener('change', updatePreference)
    }
  }, [])

  return prefersReducedMotion
}
