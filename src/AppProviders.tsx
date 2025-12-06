import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactElement, type ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'

import { ToastProvider } from '@/components/common/Toast'

/**
 * Central provider composition for app-wide context including React Query, Helmet, and toast UI.
 */
export type AppProvidersProps = {
  readonly children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps): ReactElement => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  )

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastProvider closeButton position="top-center" />
      </QueryClientProvider>
    </HelmetProvider>
  )
}
