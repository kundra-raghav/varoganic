import { Toaster } from 'sonner'

import type { ReactElement } from 'react'
import type { ToasterProps } from 'sonner'

export type ToastProviderProps = ToasterProps

/**
 * Sonner-based toast provider with Evergreen theming.
 *
 * @example
 * ```tsx
 * <ToastProvider />
 * ```
 */
export const ToastProvider = (props: ToastProviderProps): ReactElement => {
  return (
    <Toaster
      richColors
      position="top-right"
      theme="light"
      toastOptions={{
        className: 'border border-lines bg-paper text-body shadow-card font-sans',
        style: {
          backgroundColor: 'rgb(var(--color-paper))',
          color: 'rgb(var(--color-body))',
          borderColor: 'rgb(var(--color-lines))',
          boxShadow: 'var(--shadow-card)',
        },
      }}
      {...props}
    />
  )
}
