import { useEffect, useRef, useState, type ReactElement } from 'react'

import { cn } from '@/lib/cn'

const iconProps = 'h-6 w-6'

type IconProps = { className?: string }

const HomeIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <path
      d="M4 10.4 12 4l8 6.4V20a1 1 0 0 1-1 1h-4.5V14h-5V21H5a1 1 0 0 1-1-1v-9.6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ShopIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <path
      d="M4 7h16l-1.5 11.2a1 1 0 0 1-1 .8H6.5a1 1 0 0 1-1-.8L4 7Zm3-3h10l1 3H6l1-3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

const SearchIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <path
      d="M11 5a6 6 0 1 1-4.243 10.243L4.5 17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CartIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <path
      d="M4 6h2l2.6 9.7a1 1 0 0 0 .97.73H17a1 1 0 0 0 .98-.804L19 9H7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="20" r="1" fill="currentColor" />
    <circle cx="17" cy="20" r="1" fill="currentColor" />
  </svg>
)

const UserIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.2 0-7 1.9-7 4v1h14v-1c0-2.12-2.8-4-7-4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

const MoreIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <path
      d="M12 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
      fill="currentColor"
    />
  </svg>
)


const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'Shop', href: '/shop', icon: ShopIcon },
  { label: 'Search', href: '#search', icon: SearchIcon },
  { label: 'Cart', href: '/cart', icon: CartIcon, badge: 2 },
]

const OVERFLOW_ITEMS = [{ label: 'Profile', href: '/account', icon: UserIcon }]

/**
 * Mobile bottom navigation bar with overflow menu for profile.
 */
export const MobileBottomNav = (): ReactElement => {
  const [overflowOpen, setOverflowOpen] = useState(false)
  const overflowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!overflowOpen) {
      return
    }

    const handlePointer = (event: MouseEvent): void => {
      if (!overflowRef.current || overflowRef.current.contains(event.target as Node)) {
        return
      }
      setOverflowOpen(false)
    }

    document.addEventListener('pointerdown', handlePointer)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
    }
  }, [overflowOpen])

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-lines bg-paper/95 backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-xl items-center justify-between px-6 py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon, badge }) => (
          <a
            key={label}
            href={href}
            className="relative inline-flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <Icon className="size-6" aria-hidden="true" />
            <span>{label}</span>
            {badge ? (
              <span className="absolute -right-1 top-1 inline-flex min-w-5 justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {badge}
              </span>
            ) : null}
          </a>
        ))}
        <div className="relative" ref={overflowRef}>
          <button
            type="button"
            className="inline-flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            aria-haspopup="true"
            aria-expanded={overflowOpen}
            onClick={() => {
              setOverflowOpen((prev) => !prev)
            }}
          >
            <MoreIcon className="size-6" aria-hidden="true" />
            <span>More</span>
          </button>
          {overflowOpen ? (
            <div className="absolute bottom-12 right-0 w-40 rounded-xl border border-lines bg-paper p-2 shadow-card">
              {OVERFLOW_ITEMS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-2 rounded-lg p-2 text-sm text-body transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
