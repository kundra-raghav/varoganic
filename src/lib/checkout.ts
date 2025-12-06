const SHIPROCKET_SCRIPT_SRC = 'https://cdn.shiprocket.in/checkout.js'

type ShiprocketCheckout = {
  addToCart: (event: unknown, token: string, options: { fallbackUrl: string }) => void
}

let shiprocketPromise: Promise<void> | null = null

const loadScript = (): Promise<void> => {
  if (shiprocketPromise) {
    return shiprocketPromise
  }

  shiprocketPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SHIPROCKET_SCRIPT_SRC
    script.async = true
    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      reject(new Error('Failed to load Shiprocket checkout'))
    }
    document.body.appendChild(script)
  })

  return shiprocketPromise
}

export type CheckoutResponse = {
  readonly token: string
}

export const requestCheckoutToken = async (): Promise<CheckoutResponse> => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 600)
  })
  return { token: `token-${String(Date.now())}` }
}

export const launchCheckout = async (event: unknown, token: string, fallbackUrl: string): Promise<void> => {
  await loadScript()

  if (window.HeadlessCheckout?.addToCart) {
    window.HeadlessCheckout.addToCart(event, token, { fallbackUrl })
  } else {
    window.location.assign(fallbackUrl)
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    HeadlessCheckout?: ShiprocketCheckout
  }
}
