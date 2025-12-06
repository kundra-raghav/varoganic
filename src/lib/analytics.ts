type AnalyticsItemInput = {
  readonly id: string
  readonly name: string
  readonly category?: string
  readonly variant?: string
  readonly price: number
  readonly quantity?: number
  readonly index?: number
}

type ViewItemEvent = {
  readonly item: AnalyticsItemInput
  readonly currency?: string
}

type AddToCartEvent = {
  readonly item: AnalyticsItemInput
  readonly currency?: string
}

type BeginCheckoutEvent = {
  readonly items: Array<AnalyticsItemInput>
  readonly value: number
  readonly currency?: string
  readonly coupon?: string
}

type PurchaseEvent = {
  readonly items: Array<AnalyticsItemInput>
  readonly transactionId: string
  readonly value: number
  readonly currency?: string
  readonly tax?: number
  readonly shipping?: number
  readonly coupon?: string
}

type AnalyticsItem = {
  readonly item_id: string
  readonly item_name: string
  readonly item_category?: string
  readonly item_variant?: string
  readonly price: number
  readonly quantity?: number
  readonly index?: number
}

const DEFAULT_CURRENCY = 'INR'
const DEBUG_STORAGE_KEY = 'varoganic:analytics-debug'
const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID ?? ''

let debugFlag: boolean | null = null
let initialized = false

const resolveDebugPreference = (): boolean => {
  if (debugFlag !== null) {
    return debugFlag
  }
  if (typeof window === 'undefined') {
    return false
  }
  try {
    const stored = window.localStorage.getItem(DEBUG_STORAGE_KEY)
    if (stored === 'true') {
      debugFlag = true
      return true
    }
    if (stored === 'false') {
      debugFlag = false
      return false
    }
  } catch (error) {
    void error
  }
  debugFlag = import.meta.env.MODE !== 'production'
  return debugFlag
}

export const setAnalyticsDebug = (enabled: boolean): void => {
  debugFlag = enabled
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(DEBUG_STORAGE_KEY, String(enabled))
    } catch (error) {
      void error
    }
    if (typeof window.gtag === 'function' && MEASUREMENT_ID) {
      window.gtag('config', MEASUREMENT_ID, {
        send_page_view: false,
        debug_mode: enabled,
      })
    }
  }
}

const logEvent = (eventName: string, payload: Record<string, unknown>): void => {
  if (resolveDebugPreference()) {
    console.info(`[analytics:${eventName}]`, payload)
  }
}

const dispatchEvent = (eventName: string, eventPayload: Record<string, unknown>): void => {
  const debugEnabled = resolveDebugPreference()
  const payload = debugEnabled ? { ...eventPayload, debug_mode: true } : eventPayload

  if (typeof window !== 'undefined') {
    const withDataLayer = window as unknown as { dataLayer?: Array<unknown>; gtag?: (...args: Array<unknown>) => void }
    withDataLayer.dataLayer = withDataLayer.dataLayer ?? []
    withDataLayer.dataLayer.push({ event: eventName, ...payload })
    if (typeof withDataLayer.gtag === 'function') {
      withDataLayer.gtag('event', eventName, payload)
    }
  }

  logEvent(eventName, eventPayload)
}

const toAnalyticsItem = (item: AnalyticsItemInput): AnalyticsItem => ({
  item_id: item.id,
  item_name: item.name,
  item_category: item.category,
  item_variant: item.variant,
  price: Number(item.price.toFixed(2)),
  quantity: item.quantity,
  index: item.index,
})

export const view_item = ({ item, currency }: ViewItemEvent): void => {
  dispatchEvent('view_item', {
    currency: currency ?? DEFAULT_CURRENCY,
    value: Number(item.price.toFixed(2)),
    items: [toAnalyticsItem(item)],
  })
}

export const add_to_cart = ({ item, currency }: AddToCartEvent): void => {
  dispatchEvent('add_to_cart', {
    currency: currency ?? DEFAULT_CURRENCY,
    value: Number((item.price * (item.quantity ?? 1)).toFixed(2)),
    items: [toAnalyticsItem(item)],
  })
}

export const begin_checkout = ({ items, value, currency, coupon }: BeginCheckoutEvent): void => {
  dispatchEvent('begin_checkout', {
    currency: currency ?? DEFAULT_CURRENCY,
    value: Number(value.toFixed(2)),
    coupon,
    items: items.map(toAnalyticsItem),
  })
}

export const purchase = ({ items, transactionId, value, currency, tax, shipping, coupon }: PurchaseEvent): void => {
  dispatchEvent('purchase', {
    transaction_id: transactionId,
    currency: currency ?? DEFAULT_CURRENCY,
    value: Number(value.toFixed(2)),
    tax: typeof tax === 'number' ? Number(tax.toFixed(2)) : undefined,
    shipping: typeof shipping === 'number' ? Number(shipping.toFixed(2)) : undefined,
    coupon,
    items: items.map(toAnalyticsItem),
  })
}

export const trackPageView = (path?: string): void => {
  if (typeof window === 'undefined') {
    return
  }

  const pagePath = path ?? window.location.pathname + window.location.search
  const origin = window.location.origin ?? ''
  const payload = {
    page_title: typeof document !== 'undefined' ? document.title : undefined,
    page_location: `${origin}${pagePath}`,
    page_path: pagePath,
  }

  dispatchEvent('page_view', payload)
}

export const initAnalytics = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined' || initialized || !MEASUREMENT_ID) {
    return
  }

  const win = window as unknown as {
    dataLayer?: Array<unknown>
    gtag?: (...args: Array<unknown>) => void
    VaroganicAnalytics?: { setDebug: (value: boolean) => void }
  }

  win.dataLayer = win.dataLayer ?? []

  if (typeof win.gtag !== 'function') {
    win.gtag = (...args: Array<unknown>) => {
      win.dataLayer!.push(args)
    }
  }

  const existingScript = document.querySelector<HTMLScriptElement>('script[data-ga4-loader="true"]')
  if (!existingScript) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    script.setAttribute('data-ga4-loader', 'true')
    document.head.appendChild(script)
  }

  win.gtag('js', new Date())
  win.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    debug_mode: resolveDebugPreference(),
  })

  win.VaroganicAnalytics = {
    setDebug: setAnalyticsDebug,
  }

  initialized = true
}

export const isAnalyticsConfigured = (): boolean => Boolean(MEASUREMENT_ID)

if (typeof window !== 'undefined') {
  ;(window as unknown as { VaroganicAnalytics?: { setDebug: (value: boolean) => void } }).VaroganicAnalytics = {
    setDebug: setAnalyticsDebug,
  }
}

declare global {
  interface Window {
    dataLayer?: Array<unknown>
    gtag?: (...args: Array<unknown>) => void
    VaroganicAnalytics?: { setDebug: (value: boolean) => void }
  }
  interface ImportMetaEnv {
    readonly VITE_GA4_MEASUREMENT_ID?: string
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
