import { ProductCard } from '@/components/commerce/ProductCard'

import type { Product } from '@/types/product'
import type { ReactElement } from 'react'

export type ProductGridProps = {
  readonly products: Array<Product>
  readonly lastViewedId?: string | null
}

/**
 * Responsive grid layout for PLP products.
 */
export const ProductGrid = ({ products, lastViewedId }: ProductGridProps): ReactElement => {
  return (
    <section aria-live="polite">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} lastViewedId={lastViewedId} />
        ))}
      </div>
    </section>
  )
}
