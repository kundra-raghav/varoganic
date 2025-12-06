import { notifyNewsletter } from '@/lib/toasts'

import type { FormEvent, ReactElement } from 'react'

/**
 * Inline newsletter capture for the home page.
 */
export const NewsletterInline = (): ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const email = data.get('email')
    if (typeof email === 'string') {
      notifyNewsletter(email)
    }
    form.reset()
  }

  return (
    <section className="rounded-3xl border border-lines bg-paper px-6 py-8 shadow-card">
      <form className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between" onSubmit={handleSubmit}>
        <div>
          <h3 className="font-heading text-h3 text-ink">Nourish your inbox</h3>
          <p className="text-sm text-muted">Two-minute rituals and seasonal launches. Zero spam.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:max-w-xl">
          <label htmlFor="newsletter-inline-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-inline-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-lines bg-paper px-4 py-3 text-body placeholder:text-muted focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Join now
          </button>
        </div>
      </form>
    </section>
  )
}
