import { useCallback, type FormEvent, type ReactElement } from 'react'

import { A11yNote } from '@/components/common/A11yNote'
import { cn } from '@/lib/cn'
import { notifyNewsletter } from '@/lib/toasts'

const footerColumns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/shop/all-products' },
      { label: 'New Arrivals', href: '/shop/new-arrivals' },
      { label: 'Gift Bundles', href: '/shop/gift-bundles' },
      { label: 'Ingredient Stories', href: '/ingredient-stories' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQs', href: '/help/faqs' },
      { label: 'Track Order', href: '/help/track-order' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Varoganic', href: '/about' },
      { label: 'Sourcing & Sustainability', href: '/about/sustainability' },
      { label: 'Press', href: '/press' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/policies/privacy' },
      { label: 'Terms of Service', href: '/policies/terms' },
      { label: 'Cookie Preferences', href: '/policies/cookies' },
      { label: 'Accessibility', href: '/policies/accessibility' },
    ],
  },
]

const iconProps = 'h-5 w-5'

type IconProps = { className?: string }

const InstagramIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
)

const YoutubeIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <path
      d="M21 8.5a2.5 2.5 0 0 0-1.75-2.38C17.5 5.5 12 5.5 12 5.5s-5.5 0-7.25.62A2.5 2.5 0 0 0 3 8.5c-.62 1.75-.62 5.43-.62 5.43s0 3.68.62 5.43a2.5 2.5 0 0 0 1.75 2.37C6.5 22 12 22 12 22s5.5 0 7.25-.62A2.5 2.5 0 0 0 21 19.36c.62-1.75.62-5.43.62-5.43S21.62 10.25 21 8.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M10 9.75 15 12l-5 2.25V9.75Z" fill="currentColor" />
  </svg>
)

const PinIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <path
      d="M12 3c-4.142 0-7.5 3.161-7.5 7.059 0 2.68 1.642 5.457 3.284 7.47 1.642 2.015 3.284 3.344 3.284 3.344s1.642-1.329 3.284-3.344c1.642-2.013 3.284-4.79 3.284-7.47C19.5 6.161 16.142 3 12 3Zm0 9.373a2.314 2.314 0 1 1 0-4.629 2.314 2.314 0 0 1 0 4.629Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
)

const WhatsAppIcon = ({ className }: IconProps): ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" className={cn(iconProps, className)}>
    <path
      d="m5 19.5 1.2-4.3a7.3 7.3 0 1 1 2.6 2.1l-3.8.2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 8.5c0 2 3 4.5 4 4.5s1.5-1 1.5-1.5S14 11 14 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)


const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
  { label: 'YouTube', href: 'https://youtube.com', icon: YoutubeIcon },
  { label: 'Pinterest', href: 'https://pinterest.com', icon: PinIcon },
]

const paymentIcons = ['visa', 'mastercard', 'amex', 'upi']

/**
 * Responsive footer with navigation, newsletter signup, trust band, and contact microcopy.
 */
export const Footer = (): ReactElement => {
  const handleNewsletterSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const email = data.get('email')
    if (typeof email === 'string' && email.length > 3) {
      notifyNewsletter(email)
    }
    form.reset()
  }, [])

  return (
    <footer className="mt-24 border-t border-lines bg-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12">
        <section
          className={cn(
            'rounded-2xl',
            'border border-lines',
            'bg-paper',
            'shadow-card/60',
            'p-8',
          )}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <h2 className="font-heading text-h3 text-ink">Stay rooted in the ritual</h2>
              <p className="mt-2 text-sm text-muted">
                Weekly micro-stories on ingredients, mindful skincare prompts, and early access to seasonal drops.
              </p>
            </div>
            <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center" onSubmit={handleNewsletterSubmit}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 rounded-full border border-lines bg-paper px-4 py-3 text-body placeholder:text-muted focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                Subscribe
              </button>
              <p className="text-xs text-muted">
                No spam, we promise. Opt-out anytime.
              </p>
              <A11yNote
                foreground="var(--color-muted)"
                background="var(--color-paper)"
                minimum={4.5}
                title="Newsletter copy contrast"
              >
                Small text should use the `body` token or a darker variant to maintain WCAG AA contrast.
              </A11yNote>
            </form>
          </div>
        </section>

        <section className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-heading text-sm uppercase tracking-wide text-muted">{column.title}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section
          className={cn(
            'grid gap-8 md:grid-cols-2 lg:grid-cols-3',
            'rounded-2xl',
            'border border-lines',
            'bg-paper',
            'shadow-card/50',
            'p-6',
          )}
        >
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink">Why people love us</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>30-day effortless returns &amp; prepaid pickup</li>
              <li>Cash on Delivery available across 15,000+ pincodes</li>
              <li>Live botanist support 9:00–21:00 IST (Mon–Sat)</li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink">Payment &amp; trust</p>
            <div className="flex flex-wrap gap-3 text-sm text-muted">
              {paymentIcons.map((icon) => (
                <span key={icon} className="inline-flex items-center rounded-full border border-lines px-3 py-2 uppercase">
                  {icon}
                </span>
              ))}
            </div>
            <a
              href="https://wa.me/91"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <WhatsAppIcon className="size-5" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink">Follow our slow stories</p>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-lines text-muted transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  aria-label={label}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-col justify-between gap-6 border-t border-lines pt-6 text-xs text-muted md:flex-row md:text-sm">
          <p>© {new Date().getFullYear()} Varoganic Store. Crafted with Evergreen care in Bengaluru.</p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:care@vorganic.shop" className="hover:text-primary">
              care@vorganic.shop
            </a>
            <span>+91 80 1234 5678</span>
            <span>GSTIN 29AAACV1234F1Z5</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
