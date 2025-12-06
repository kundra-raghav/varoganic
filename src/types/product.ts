/**
 * Shared product type definition.
 */
export type ProductLinks = {
  readonly amazon?: string
  readonly flipkart?: string
}

export type Ingredient = {
  readonly name: string
  readonly benefits: Array<string>
}

export type ProductDetails = {
  readonly tagline?: string
  readonly keyIngredients?: Array<Ingredient>
  readonly benefits?: Array<string>
  readonly howToUse?: Array<string>
  readonly whyChoose?: Array<string>
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
  readonly details?: ProductDetails
}

export type ProductCollection = {
  readonly id: string
  readonly title: string
  readonly products: Array<Product>
}
