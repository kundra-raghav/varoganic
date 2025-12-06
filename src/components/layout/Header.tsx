import { Search, ShoppingBag, UserRound } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  type MouseEvent,
  type ReactElement,
} from 'react'

import { PRODUCTS } from '@/data/products'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cn } from '@/lib/cn'
import { useCartStore } from '@/store/cart'

import { MegaMenu, type MegaMenuSection } from './MegaMenu'
import { SearchBox } from './SearchBox'

const navLinks = [
  { label: 'New', href: '/collections/new' },
  { label: 'Bundles', href: '/collections/bundles' },
  { label: 'Ingredients', href: '/ingredients' },
  { label: 'About', href: '/about' },
]

const categoryLabels: Record<string, string> = {
  Soap: 'Artisan Cleansing Bars',
  Gel: 'Treatment Gels',
  Pack: 'Masks & Scrubs',
  Elixir: 'Elixirs & Oils',
  Mist: 'Hydration Mists',
}

const formatProductDescription = (goals: Array<string>): string => {
  if (goals.length === 0) {
    return 'Botanical blend for everyday rituals'
  }
  const summary = goals.slice(0, 2).join(' • ')
  return summary
}

const buildSection = (title: string, products: Array<typeof PRODUCTS[number]>): MegaMenuSection => ({
  title,
  items: products.map((product) => ({
    name: product.name,
    href: `/product?id=${product.id}`,
    description: formatProductDescription(product.goals),
    thumbnail: product.imageSrc,
  })),
})

const soapProducts = PRODUCTS.filter((product) => product.category === 'Soap')
const treatmentProducts = PRODUCTS.filter((product) => product.category === 'Gel' || product.category === 'Pack' || product.category === 'Elixir')
const mistProducts = PRODUCTS.filter((product) => product.category === 'Mist')

const megaMenuSections = [
  buildSection(categoryLabels.Soap, soapProducts),
  buildSection('Treatment Concentrates', treatmentProducts),
  {
    title: 'Hydration & Ritual Extras',
    items: [
      ...mistProducts.map((product) => ({
        name: product.name,
        href: `/product?id=${product.id}`,
        description: formatProductDescription(product.goals),
        thumbnail: product.imageSrc,
      })),
      {
        name: 'Fresh Drops',
        href: '/collections/new',
        description: 'Explore the latest small-batch launches',
      },
      {
        name: 'Curated Bundles',
        href: '/collections/bundles',
        description: 'Ready-made stacks to streamline your ritual',
      },
    ],
  },
]

/**
 * Sticky header with mega menu, search overlay, and shrink-on-scroll behavior.
 */
export const Header = (): ReactElement => {
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shrink, setShrink] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const prefersReducedMotion = useReducedMotionSafe()

  const { items } = useCartStore(); // Get items from cart store
  const cartTotalQuantity = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]); // Calculate total quantity

  useEffect(() => {
    const handleScroll = (): void => {
      const shouldShrink = window.scrollY > 16
      setShrink((prev) => (prev === shouldShrink ? prev : shouldShrink))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const closeMegaMenu = useCallback(() => {
    setMegaOpen(false)
  }, [])

  useEffect(() => {
    if (!megaOpen) {
      return
    }

    const handlePointer = (event: PointerEvent): void => {
      if (anchorRef.current?.contains(event.target as Node)) {
        return
      }
      const menu = document.querySelector('[role="dialog"]')
      if (menu?.contains(event.target as Node)) {
        return
      }
      closeMegaMenu()
    }

    document.addEventListener('pointerdown', handlePointer)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
    }
  }, [closeMegaMenu, megaOpen])

  const handleShopClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault()
    setMegaOpen((prev) => !prev)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-lines/70 bg-paper/95 backdrop-blur-md transition-all',
        prefersReducedMotion ? '' : 'duration-200 ease-out',
        shrink ? 'shadow-sm' : 'shadow-none',
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-6xl items-center gap-4 px-4 transition-all',
          prefersReducedMotion ? '' : 'duration-200 ease-out',
          shrink ? 'py-3' : 'py-5',
        )}
      >
        <div className="flex flex-1 items-center gap-4">
          <a href="/" className="flex items-center gap-3 text-ink" aria-label="Varoganic home">
            <img
              src="https://i.ibb.co/TMw2R0xT/logo.png"
              alt="Varoganic logo"
              className="size-12 rounded-full border border-lines/60 bg-paper object-cover shadow-sm md:size-14"
              width={120}
              height={120}
              loading="lazy"
            />
          </a>
        </div>

        {!isMobile ? (
          <nav aria-label="Primary" className="flex flex-1 justify-center">
            <ul className="flex items-center gap-6 text-sm font-medium text-body">
              <li>
                <button
                  ref={anchorRef}
                  type="button"
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                  onClick={handleShopClick}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  Shop
                  <svg
                    viewBox="0 0 16 16"
                    className={cn(
                      'size-4 transition-transform',
                      megaOpen && !prefersReducedMotion ? 'rotate-180' : 'rotate-0',
                    )}
                    aria-hidden="true"
                  >
                    <path d="M4 6.5 8 10l4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="rounded-full px-3 py-2 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="flex flex-1 items-center justify-end gap-3 text-sm font-medium text-body">
          {!isMobile ? (
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-full border border-lines px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <Search className="size-4" aria-hidden="true" />
              Search
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true)
              }}
              className="rounded-full p-2 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <span className="sr-only">Open search</span>
              <Search className="size-5" aria-hidden="true" />
            </button>
          )}
          {!isMobile ? (
            <a
              href="/account"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <UserRound className="size-4" aria-hidden="true" />
              Account
            </a>
          ) : null}
          <a
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {cartTotalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-w-[1.5rem] justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {cartTotalQuantity}
              </span>
            )}
          </a>
        </div>
      </div>
      <MegaMenu sections={megaMenuSections} open={megaOpen} onClose={closeMegaMenu} anchorRef={anchorRef} />
      <SearchBox
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false)
        }}
      />
    </header>
  )
}