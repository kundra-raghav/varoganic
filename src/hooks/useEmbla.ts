import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'

import type { EmblaOptionsType } from 'embla-carousel'

/**
 * Convenience hook for initializing Embla carousel instances.
 */
export const useEmbla = (options?: EmblaOptionsType): UseEmblaCarouselType => {
  return useEmblaCarousel(options)
}
