import { useCallback, useMemo } from 'react'

type QueryParamsApi = {
  readonly get: (key: string) => string | null
  readonly set: (key: string, value: string | null) => void
}

/**
 * Manages URL search params in a typed fashion.
 */
export const useQueryParams = (): QueryParamsApi => {
  const searchParams = useMemo(
    () => new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search),
    [],
  )

  const setParam = useCallback((key: string, value: string | null) => {
    if (typeof window === 'undefined') {
      return
    }

    const params = new URLSearchParams(window.location.search)

    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    const next = `${window.location.pathname}?${params.toString()}`.replace(/[?]$/, '')
    window.history.replaceState({}, '', next)
  }, [])

  return {
    get: (key: string) => searchParams.get(key),
    set: setParam,
  }
}
