const DEFAULT_TIMEOUT = 8000

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const withTimeout = async <T>(promise: Promise<T>, timeout = DEFAULT_TIMEOUT): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new ApiError('Request timed out'))
    }, timeout)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (typeof timer !== 'undefined') {
      clearTimeout(timer)
    }
  }
}

const handleResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    throw new ApiError('Request failed', response.status)
  }
  return response.json()
}

const baseFetch = async (input: RequestInfo, init?: RequestInit): Promise<unknown> => {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  if (init?.headers) {
    const incoming = new Headers(init.headers)
    incoming.forEach((value, key) => {
      headers.set(key, value)
    })
  }

  const fetchPromise = fetch(input, { ...init, headers }).then((response) => handleResponse(response))
  return withTimeout(fetchPromise)
}

export const api = {
  getProducts: async (): Promise<Array<unknown>> => {
    const response = await baseFetch('/api/products')
    return response as Array<unknown>
  },
  getProduct: async (id: string): Promise<unknown> => {
    const response = await baseFetch(`/api/products/${id}`)
    return response
  },
  getCollections: async (): Promise<Array<unknown>> => {
    const response = await baseFetch('/api/collections')
    return response as Array<unknown>
  },
  estimateCart: async (payload: unknown): Promise<unknown> => {
    const response = await baseFetch('/api/cart/estimate', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return response
  },
}
