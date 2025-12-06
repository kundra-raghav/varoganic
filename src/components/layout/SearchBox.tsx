import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from 'react'

import { PRODUCTS } from '@/data/products'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/cn'

const SUGGESTION_DELAY = 220

export type SearchSuggestion = {
  readonly id: string
  readonly label: string
  readonly href: string
  readonly subtitle?: string
  readonly type: 'product' | 'category' | 'content'
}

const buildSuggestionPool = (): Array<SearchSuggestion> => {
  const productResults: Array<SearchSuggestion> = PRODUCTS.map((product) => ({
    id: product.id,
    label: product.name,
    href: `/product?id=${product.id}`,
    subtitle: product.category,
    type: 'product',
  }))

  const categoryResults: Array<SearchSuggestion> = Array.from(new Set(PRODUCTS.map((product) => product.category))).map(
    (category) => ({
      id: `category-${category.toLowerCase()}`,
      label: `${category} rituals`,
      href: `/shop?concern=${encodeURIComponent(category)}`,
      subtitle: 'Curated category',
      type: 'category' as const,
    }),
  )

  const goalResults: Array<SearchSuggestion> = Array.from(new Set(PRODUCTS.flatMap((product) => product.goals))).map((goal) => ({
    id: `goal-${goal.toLowerCase().replace(/\s+/g, '-')}`,
    label: `${goal} insights`,
    href: `/shop?concern=${encodeURIComponent(goal)}`,
    subtitle: 'Goal-oriented guide',
    type: 'content' as const,
  }))

  return [...productResults, ...categoryResults, ...goalResults]
}

const SUGGESTION_POOL = buildSuggestionPool()

const fetchSuggestions = async (query: string): Promise<Array<SearchSuggestion>> => {
  if (!query) {
    return []
  }
  await new Promise((resolve) => setTimeout(resolve, SUGGESTION_DELAY))
  const normalized = query.toLowerCase()
  return SUGGESTION_POOL.filter((item) => item.label.toLowerCase().includes(normalized)).slice(0, 6)
}

export type SearchBoxProps = {
  readonly open: boolean
  readonly onClose: () => void
}

/**
 * Full-width search overlay with autosuggest listbox and keyboard interactions.
 */
export const SearchBox = ({ open, onClose }: SearchBoxProps): ReactElement | null => {
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<Array<SearchSuggestion>>([])
  const [loading, setLoading] = useState(false)
  const listboxId = useId()
  const isReducedMotion = useReducedMotionSafe()

  useEffect(() => {
    if (!open) {
      setSuggestions([])
      setQuery('')
      setActiveIndex(-1)
      return
    }

    const focusTimeout = window.setTimeout(() => {
      inputRef.current?.focus()
    }, isReducedMotion ? 0 : 80)

    return () => {
      window.clearTimeout(focusTimeout)
    }
  }, [isReducedMotion, open])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    let isCancelled = false
    setLoading(true)
    void fetchSuggestions(query).then((results) => {
      if (isCancelled) {
        return
      }
      setSuggestions(results)
      setActiveIndex(results.length ? 0 : -1)
      setLoading(false)
    })

    return () => {
      isCancelled = true
    }
  }, [query])

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }, [])

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (!suggestions.length) {
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((prev) => (prev + 1) % suggestions.length)
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
      }

      if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault()
        window.location.assign(suggestions[activeIndex]?.href)
      }
    },
    [activeIndex, suggestions],
  )

  const handleOutsideClick = useCallback(
    (event: MouseEvent): void => {
      if (!panelRef.current || panelRef.current.contains(event.target as Node)) {
        return
      }
      onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) {
      return
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
    }
  }, [handleOutsideClick, open])

  const groupedSuggestions = useMemo(() => {
    const groups: Record<SearchSuggestion['type'], Array<SearchSuggestion>> = {
      product: [],
      category: [],
      content: [],
    }

    suggestions.forEach((suggestion) => {
      groups[suggestion.type].push(suggestion)
    })

    return groups
  }, [suggestions])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-ink/40 backdrop-blur-sm">
      <div
        ref={panelRef}
        className={cn(
          'mt-16 w-[min(960px,92vw)] rounded-2xl border border-lines bg-paper shadow-card',
          isReducedMotion ? '' : 'transition-all duration-200 ease-out motion-safe:translate-y-[-8px]',
        )}
      >
        <div className="flex items-center gap-3 border-b border-lines px-6 py-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 text-muted"
            fill="none"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search products, rituals, or ingredients"
            className="w-full border-0 bg-transparent text-lg text-body placeholder:text-muted focus-visible:outline-none"
            role="combobox"
            aria-expanded={Boolean(suggestions.length)}
            aria-controls={listboxId}
            aria-autocomplete="list"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <span className="sr-only">Close search</span>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="max-h-[360px] overflow-y-auto px-6 py-4">
          {loading ? (
            <p className="text-sm text-muted">Searching…</p>
          ) : suggestions.length === 0 ? (
            <p className="text-sm text-muted">Try a different keyword or browse popular categories.</p>
          ) : (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Search suggestions"
              className="space-y-4"
            >
              {Object.entries(groupedSuggestions).map(([group, items]) =>
                items.length ? (
                  <li key={group} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">{labels[group as keyof typeof labels]}</p>
                    <ul className="space-y-1">
                      {items.map((suggestion) => {
                        const index = suggestions.findIndex((s) => s.id === suggestion.id)
                        const isActive = index === activeIndex
                        return (
                          <li key={suggestion.id}>
                            <a
                              href={suggestion.href}
                              role="option"
                              aria-selected={isActive}
                              className={cn(
                                'flex flex-col rounded-xl px-3 py-2 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5',
                              )}
                              onMouseEnter={() => {
                                setActiveIndex(index)
                              }}
                            >
                              <span className="font-medium">{suggestion.label}</span>
                              {suggestion.subtitle ? (
                                <span className="text-sm text-muted">{suggestion.subtitle}</span>
                              ) : null}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

const labels: Record<SearchSuggestion['type'], string> = {
  product: 'Products',
  category: 'Categories',
  content: 'Content',
}
