import type { Product } from '@/types/product'

const RAW_PRODUCTS = [
  {
    id: 'soap-rose',
    name: 'Varoganic Rose Shower Soap',
    category: 'Soap',
    description:
      'Soothing and hydrating soap crafted with fresh rose petals, Vitamin E, olive oil, tea tree oil, aloe vera, and glycerine.',
    suits: ['Dry', 'Sensitive', 'Normal'],
    goals: ['Soft Skin', 'Hydration', 'Acne Reduction'],
    image: 'https://i.ibb.co/My8Xx6X0/Main-Image.png',
    amazonLink: '',
    flipkartLink: '',
  },
  {
    id: 'soap-milky-kesar',
    name: 'Varoganic Milky Kesar Soap',
    category: 'Soap',
    description:
      'Camel milk, sandalwood, kesar oil & flakes blend with aloe and vitamins for radiance, blemish control, and anti-ageing support.',
    suits: ['Dry', 'Normal', 'Combination', 'Sensitive'],
    goals: ['Fair Skin', 'Dark Spot Reduction', 'Soft Skin', 'Anti-Ageing'],
    image: 'https://i.ibb.co/67B4LfJ7/Milky-Kesar-Soap.png',
    amazonLink: '',
    flipkartLink: '',
  },
  {
    id: 'soap-detan',
    name: 'Varoganic Detan Soap',
    category: 'Soap',
    description:
      'Multani mitti, chandan, amba haldi, coffee, and vitamins brighten, deep cleanse, and soothe acne-prone skin.',
    suits: ['Oily', 'Combination', 'Normal'],
    goals: ['Tan Removal', 'Acne Reduction', 'Skin Brightening'],
    image: 'https://i.ibb.co/Qv0n5RKt/de-tan-soap-1.png',
    amazonLink:
      'https://www.amazon.in/VAROGANIC-Removes-combination-Chandan-Handmade/dp/B0D3QGPV4L/ref=sr_1_4?crid=8ZYA2YE8DS97&dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=varoganic&nsdOptOutParam=true&qid=1758581105&s=beauty&sprefix=varogani%2Cbeauty%2C221&sr=1-4',
    flipkartLink: '',
  },
  {
    id: 'soap-lemon-honey',
    name: 'Varoganic Lemon Honey Soap',
    category: 'Soap',
    description:
      'Honey, lemon vitamin C, tea tree, neem and brightening oils moisturise, clarify acne, and even tone.',
    suits: ['Oily', 'Combination', 'Normal'],
    goals: ['Skin Brightening', 'Acne Reduction', 'Dark Spot Reduction'],
    image: 'https://i.ibb.co/kshV5Ygx/lemon-soap.png',
    amazonLink: '',
    flipkartLink: '',
  },
  {
    id: 'soap-neem',
    name: 'Varoganic Neem Shower Soap',
    category: 'Soap',
    description:
      'Neem oil and leaves with coconut oil, Vitamin E, and acne-focused essential oils for deep cleansing and balance.',
    suits: ['Oily', 'Combination', 'Normal', 'Sensitive'],
    goals: ['Acne Reduction', 'Skin Cleansing'],
    image: 'https://i.ibb.co/7JNVwKkn/neem-soap.png',
    amazonLink: '',
    flipkartLink: '',
  },
  {
    id: 'gel-hydrating',
    name: 'Varoganic Skin Hydrating Gel',
    category: 'Gel',
    description:
      'Rose, hibiscus, kesar, vitamins C/E, and tea tree deliver lightweight hydration, calm acne, and revive dull skin.',
    suits: ['Oily', 'Combination', 'Normal', 'Dry'],
    goals: ['Acne Reduction', 'Soft Skin', 'Hydration', 'Remove Dullness'],
    image: 'https://m.media-amazon.com/images/I/51irLAhWC7L.jpg',
    amazonLink:
      'https://www.amazon.in/VarOrganics-Light-Hydrating-refreshing-Unisex/dp/B0D3PWGTPG/ref=sr_1_2?crid=8ZYA2YE8DS97&dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=varoganic&nsdOptOutParam=true&qid=1758581105&s=beauty&sprefix=varogani%2Cbeauty%2C221&sr=1-2',
    flipkartLink: '',
  },
  {
    id: 'pack-ubtan',
    name: 'Varoganic Whitening & Tightening Face Pack + Scrub',
    category: 'Pack',
    description:
      'Glow-boosting ubtan with saffron, turmeric, orange and licorice for brightening, pore refining, and deep nourishment.',
    suits: ['All', 'Normal', 'Combination', 'Oily', 'Dry'],
    goals: ['Dark Spot Reduction', 'Fair Skin', 'Skin Brightening', 'Soft Skin'],
    image: 'https://m.media-amazon.com/images/I/41IEUQW6c0L.jpg',
    amazonLink:
      'https://www.amazon.in/Varoganic-Whitening-Tightening-Unisex-40gram/dp/B0D3QN7J9N/ref=sr_1_4?dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=VAROGANIC&nsdOptOutParam=true&qid=1758581149&sr=8-4',
    flipkartLink: '',
  },
  {
    id: 'elixir-glow',
    name: 'Varoganic Pure Glow Face Elixir',
    category: 'Elixir',
    description:
      'Non-greasy, 100% organic elixir that brightens, evens tone, and nourishes all skin types deeply.',
    suits: ['All', 'Normal', 'Combination', 'Oily', 'Dry', 'Sensitive'],
    goals: ['Soft Skin', 'Hydration', 'Skin Brightening'],
    image: 'https://m.media-amazon.com/images/I/61HIPpnz8GL._SL1500_.jpg',
    amazonLink:
      'https://www.amazon.in/Varoganic-Anti-Aging-Brightening-Chemical-Free-Paraben-Free/dp/B0DFWZMGYF/ref=sr_1_6?dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=VAROGANIC&nsdOptOutParam=true&qid=1758581149&sr=8-6',
    flipkartLink: '',
  },
  {
    id: 'mist-rose',
    name: 'Varoganic Radiant Rose Water Mist',
    category: 'Mist',
    description:
      '100% pure rose water infused with Vitamin E to hydrate, tone, soothe, and nourish every skin type.',
    suits: ['All', 'Normal', 'Combination', 'Oily', 'Dry', 'Sensitive'],
    goals: ['Hydration', 'Soft Skin'],
    image: 'https://m.media-amazon.com/images/I/71vCvk1UVmL._SL1080_.jpg',
    amazonLink:
      'https://www.amazon.in/Varoganic-Radiant-chemical-extract-Product/dp/B0DFWX9K7H/ref=sr_1_5?dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=VAROGANIC&nsdOptOutParam=true&qid=1758581149&sr=8-5',
    flipkartLink: '',
  },
] as const

const basePriceForCategory = (category: string): number => (category.toLowerCase() === 'soap' ? 250 : 400)

const enrichProduct = (raw: (typeof RAW_PRODUCTS)[number], index: number): Product => {
  const price = basePriceForCategory(raw.category)
  const mrp = Math.round(price * 1.2)
  const rating = Math.min(5, 4.4 + (index % 3) * 0.2)
  const reviewCount = 120 + index * 17
  const amazon = raw.amazonLink.trim() || undefined
  const flipkart = raw.flipkartLink.trim() || undefined

  return {
    id: raw.id,
    name: raw.name,
    category: raw.category,
    description: raw.description,
    suits: [...raw.suits],
    goals: [...raw.goals],
    price,
    mrp,
    rating,
    reviewCount,
    imageSrc: raw.image,
    imageAlt: `${raw.name} hero image`,
    badges: raw.category === 'Soap' ? ['Handmade'] : undefined,
    links: amazon || flipkart ? { amazon, flipkart } : undefined,
  }
}

export const PRODUCTS: Array<Product> = RAW_PRODUCTS.map(enrichProduct)

export const findProductById = (id: string): Product | undefined => PRODUCTS.find((product) => product.id === id)

export const getRelatedProducts = (product: Product, limit = 3): Array<Product> =>
  PRODUCTS.filter((candidate) => candidate.id !== product.id && candidate.category === product.category).slice(0, limit)

export const getBestSellers = (limit = 4): Array<Product> => PRODUCTS.slice(0, limit)

export const getUniqueSuits = (): Array<string> => {
  const suits = new Set<string>()
  PRODUCTS.forEach((product) => {
    product.suits.forEach((suit) => suits.add(suit))
  })
  return Array.from(suits)
}

export const getUniqueGoals = (): Array<string> => {
  const goals = new Set<string>()
  PRODUCTS.forEach((product) => {
    product.goals.forEach((goal) => goals.add(goal))
  })
  return Array.from(goals)
}
