import { useState, type ReactElement, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { Button } from './Button'
import { Drawer, type DrawerProps } from './Drawer'

export type BottomSheetProps = Omit<DrawerProps, 'side'> & {
  readonly footer?: ReactNode
}

/**
 * Mobile-friendly bottom sheet built on top of the Drawer primitive.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <>
 *   <Button onClick={() => setOpen(true)}>Show promo</Button>
 *   <BottomSheet open={open} onClose={() => setOpen(false)} title="Festival drops">
 *     Limited-time ayurvedic bundles just for mobile shoppers.
 *   </BottomSheet>
 * </>
 * ```
 */
export const BottomSheet = ({ className, footer, children, ...props }: BottomSheetProps): ReactElement => {
  return (
    <Drawer
      side="bottom"
      className={cn('w-full rounded-t-3xl px-6 pb-6 pt-4 sm:max-w-lg', className)}
      {...props}
    >
      <div className="space-y-4">
        {children}
        {footer ? <div className="border-t border-lines pt-4 text-sm text-muted">{footer}</div> : null}
      </div>
    </Drawer>
  )
}

/**
 * Lightweight example used in documentation sandboxes.
 */
export const BottomSheetExample = (): ReactElement => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="secondary"
        onClick={() => {
          setOpen(true)
        }}
      >
        Peek marketplace perks
      </Button>
      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        title="Exclusive mobile bundle"
        description="Only on handhelds"
        footer="Dismiss to keep browsing — we respect your flow."
      >
        <div className="space-y-3 text-sm text-body">
          <p>
            Nab the Varoganic mini ritual trio for ₹699 when you checkout from your phone. Includes cleansing powder,
            serum concentrate, and barrier balm.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              window.location.assign('/collections/mobile-perks')
            }}
          >
            Shop the mobile offer
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}
