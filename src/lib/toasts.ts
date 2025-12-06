import { toast } from 'sonner'

export type WishlistToastPayload = {
  readonly productName: string
  readonly saved: boolean
}

/**
 * Fires a success toast when a product is added to cart. Use for primary add to
 * cart flows so messaging remains consistent.
 */
export const notifyAddToCart = (productName: string, quantity = 1): void => {
  toast.success('Added to cart', {
    description: `${String(quantity)} × ${productName} is now in your bag.`,
  })
}

/**
 * Announcement for wishlist toggles.
 */
export const notifyWishlist = ({ productName, saved }: WishlistToastPayload): void => {
  if (saved) {
    toast.success('Wishlist saved', {
      description: `${productName} will be waiting for you.`,
    })
  } else {
    toast('Removed from wishlist', {
      description: `${productName} was removed from your saved items.`,
    })
  }
}

/**
 * Newsletter subscription confirmation toast.
 */
export const notifyNewsletter = (email: string): void => {
  toast.success("You're in!", {
    description: `We'll send gentle rituals to ${email} soon.`,
  })
}
