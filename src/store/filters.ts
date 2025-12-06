import { create } from 'zustand'

export type FilterState = {
  readonly skinType: string | null
  readonly concern: string | null
  readonly sort: 'featured' | 'price-asc' | 'price-desc' | 'newest'
  readonly setSkinType: (value: string | null) => void
  readonly setConcern: (value: string | null) => void
  readonly setSort: (value: FilterState['sort']) => void
  readonly resetFilters: () => void
}

const syncUrl = (nextState: Partial<FilterState>): void => {
  const url = new URL(window.location.href)
  if ('skinType' in nextState) {
    if (nextState.skinType) {
      url.searchParams.set('skin', nextState.skinType)
    } else {
      url.searchParams.delete('skin')
    }
  }
  if ('concern' in nextState) {
    if (nextState.concern) {
      url.searchParams.set('concern', nextState.concern)
    } else {
      url.searchParams.delete('concern')
    }
  }
  if ('sort' in nextState) {
    const sortValue = nextState.sort
    if (typeof sortValue !== 'undefined' && sortValue !== 'featured') {
      url.searchParams.set('sort', sortValue)
    } else {
      url.searchParams.delete('sort')
    }
  }
  window.history.replaceState({}, '', url.toString())
}

const parseSort = (value: string | null): FilterState['sort'] => {
  if (value === 'price-asc' || value === 'price-desc' || value === 'newest') {
    return value
  }
  return 'featured'
}

export const useFiltersStore = create<FilterState>((set) => {
  const searchParams = new URLSearchParams(window.location.search)
  return {
    skinType: searchParams.get('skin'),
    concern: searchParams.get('concern'),
    sort: parseSort(searchParams.get('sort')),
  setSkinType: (value) => {
    syncUrl({ skinType: value })
    set({ skinType: value })
  },
  setConcern: (value) => {
    syncUrl({ concern: value })
    set({ concern: value })
  },
  setSort: (value) => {
    syncUrl({ sort: value })
    set({ sort: value })
  },
  resetFilters: () => {
    syncUrl({ skinType: null, concern: null, sort: 'featured' })
    set({ skinType: null, concern: null, sort: 'featured' })
  },
}
})
