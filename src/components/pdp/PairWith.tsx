import { ProductCard } from '@/components/commerce/ProductCard'

import type { Product } from '@/types/product'
import type { ReactElement } from 'react'

export type PairWithProps = {
  readonly products: Array<Product>
  readonly lastViewedId?: string | null
}

/**
 * Cross-sell module recommending complementary products.
 */
export const PairWith = ({ products, lastViewedId }: PairWithProps): ReactElement => {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-h3 text-ink">Pair with</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} lastViewedId={lastViewedId} />
        ))}
      </div>
    </section>
  )
}
