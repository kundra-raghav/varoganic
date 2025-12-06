/**
 * Shared product type definition.
 */
export type ProductLinks = {
  readonly amazon?: string
  readonly flipkart?: string
}

export type Product = {
  readonly id: string
  readonly name: string
  readonly category: string
  readonly description: string
  readonly suits: Array<string>
  readonly goals: Array<string>
  readonly price: number
  readonly mrp: number
  readonly rating: number
  readonly reviewCount: number
  readonly imageSrc: string
  readonly imageAlt: string
  readonly badges?: Array<string>
  readonly links?: ProductLinks
}

export type ProductCollection = {
  readonly id: string
  readonly title: string
  readonly products: Array<Product>
}
