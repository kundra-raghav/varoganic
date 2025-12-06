import { useEffect, useState } from 'react'

/**
 * Subscribes to a media query string and reports match status.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const media = window.matchMedia(query)
    const update = (): void => {
      setMatches(media.matches)
    }

    update()
    media.addEventListener('change', update)

    return (): void => {
      media.removeEventListener('change', update)
    }
  }, [query])

  return matches
}
