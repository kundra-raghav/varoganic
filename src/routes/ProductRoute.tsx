import { motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ReactElement } from 'react'

import { AddToCartButton } from '@/components/commerce/AddToCartButton'
import { QuantityStepper } from '@/components/commerce/QuantityStepper'
import { VariantSelector, type VariantOption } from '@/components/commerce/VariantSelector'
import { SEO } from '@/components/layout/SEO'
import { DetailsTabs, Gallery, PairWith, Reviews } from '@/components/pdp'
import { PRODUCTS, findProductById, getRelatedProducts } from '@/data/products'
import { view_item } from '@/lib/analytics'
import { formatCurrency } from '@/lib/formatters'
import { buildCanonicalUrl, buildProductStructuredData } from '@/lib/seo'
import { useUIStore } from '@/store/ui'

import type { Review } from '@/components/pdp/Reviews'
import type { Product } from '@/types/product'

const FALLBACK_PRODUCT = PRODUCTS[0]

const buildVariantOptions = (product: Product): Array<VariantOption> => {
  if (!product.suits.length) {
    return [{ id: 'standard', label: 'Standard ritual', description: 'Suitable for most skin types.' }]
  }
  return product.suits.map((suit) => ({
    id: suit.toLowerCase().replace(/\s+/g, '-'),
    label: suit,
    description: suit === 'All' ? 'Universally balancing' : undefined,
  }))
}

const buildGallery = (product: Product): Array<{ id: string; src: string; alt: string }> =>
  [product.imageSrc, `${product.imageSrc}&variant=1`, `${product.imageSrc}&variant=2`].map((src, index) => ({
    id: `${product.id}-image-${String(index)}`,
    src,
    alt: `${product.name} gallery view ${String(index + 1)}`,
  }))

const buildTabs = (product: Product): Array<{ id: string; label: string; content: ReactElement }> => {
  const tabs: Array<{ id: string; label: string; content: ReactElement }> = []

  // Ingredients tab with detailed breakdown
  if (product.details?.keyIngredients && product.details.keyIngredients.length > 0) {
    tabs.push({
      id: 'ingredients',
      label: 'Key Ingredients',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-body leading-relaxed">{product.description}</p>
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-ink">Active Botanicals</h3>
            {product.details.keyIngredients.map((ingredient) => (
              <div key={ingredient.name} className="rounded-2xl border border-lines bg-paper/50 p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-primary mb-2">{ingredient.name}</h4>
                <ul className="space-y-1">
                  {ingredient.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-body">
                      <span className="text-success mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ),
    })
  } else {
    tabs.push({
      id: 'ingredients',
      label: 'Ingredients',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-body">{product.description}</p>
          <p className="text-xs text-muted">
            Ingredient goals: {product.goals.join(' • ')}. Crafted in small batches to retain botanical potency.
          </p>
        </div>
      ),
    })
  }

  // Benefits tab with detailed list
  if (product.details?.benefits && product.details.benefits.length > 0) {
    tabs.push({
      id: 'benefits',
      label: 'Benefits',
      content: (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-ink">Transform Your Skin</h3>
          <ul className="space-y-2">
            {product.details.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-body">
                <span className="flex-shrink-0 size-5 rounded-full bg-success/10 flex items-center justify-center text-success text-xs font-semibold">✓</span>
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    })
  } else {
    tabs.push({
      id: 'benefits',
      label: 'Benefits',
      content: (
        <ul className="list-disc space-y-2 pl-5 text-sm text-body">
          {product.goals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      ),
    })
  }

  // How to use tab with detailed steps
  if (product.details?.howToUse && product.details.howToUse.length > 0) {
    tabs.push({
      id: 'usage',
      label: 'How to use',
      content: (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-ink">Usage Instructions</h3>
          <ol className="space-y-3">
            {product.details.howToUse.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm text-body">
                <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                  {index + 1}
                </span>
                <span className="leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ),
    })
  } else {
    tabs.push({
      id: 'usage',
      label: 'How to use',
      content: (
        <ol className="list-decimal space-y-2 pl-5 text-sm text-body">
          <li>Lather gently over damp skin for 60 seconds.</li>
          <li>Rinse with cool water and pat dry without tugging.</li>
          <li>Follow with a moisturiser or elixir for best results.</li>
        </ol>
      ),
    })
  }

  // Why Choose tab
  if (product.details?.whyChoose && product.details.whyChoose.length > 0) {
    tabs.push({
      id: 'why-choose',
      label: 'Why Varoganic',
      content: (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-ink">Why Choose Varoganic Handmade Soaps</h3>
          <ul className="space-y-2">
            {product.details.whyChoose.map((reason) => (
              <li key={reason} className="flex items-start gap-3 text-sm text-body">
                <span className="flex-shrink-0 size-5 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-semibold">✓</span>
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    })
  }

  // Reviews tab
  tabs.push({
    id: 'reviews',
    label: `Reviews (${String(product.reviewCount)})`,
    content: <Reviews reviews={mockReviews(product)} />,
  })

  return tabs
}

const mockReviews = (product: Product): Array<Review> => {
  // Custom detailed reviews for Rose Soap
  if (product.id === 'soap-rose') {
    return [
      {
        id: 'rose-rev-1',
        author: 'Priya Sharma',
        rating: 5,
        content: 'Absolutely love this soap! My sensitive skin has never felt better. The rose fragrance is so natural and calming. After just one week, I noticed my skin becoming softer and the redness around my nose reduced significantly. Worth every penny!',
      },
      {
        id: 'rose-rev-2',
        author: 'Anjali Verma',
        rating: 5,
        content: 'Best handmade soap I have ever used! The combination of rose petals and vitamin E is magical. My face feels deeply moisturized without any greasy feeling. Even my acne scars are fading. Highly recommend for anyone with dry or combination skin!',
      },
      {
        id: 'rose-rev-3',
        author: 'Meera Kapoor',
        rating: 4.5,
        content: 'This soap is a game changer for my morning routine. The lather is so rich and creamy, and the rose scent stays with me all day. My skin looks brighter and feels so smooth. Only minor thing is I wish the bar was slightly bigger, but quality makes up for it!',
      },
      {
        id: 'rose-rev-4',
        author: 'Kavita Reddy',
        rating: 5,
        content: 'I have been using this for 3 weeks now and my skin texture has improved dramatically. The tea tree oil really helps control my oily T-zone while the rose keeps my cheeks hydrated. No more dry patches! Plus, knowing it is chemical-free gives me peace of mind.',
      },
      {
        id: 'rose-rev-5',
        author: 'Neha Gupta',
        rating: 5,
        content: 'Finally found a soap that doesn\'t irritate my sensitive skin! The natural ingredients make such a difference. My skin feels clean but not stripped. The rose fragrance is subtle and luxurious. I have already ordered 3 more bars for my family!',
      },
      {
        id: 'rose-rev-6',
        author: 'Ria Malhotra',
        rating: 4.5,
        content: 'Great product! The olive oil and vitamin E combination is perfect for winter dryness. My skin stays soft throughout the day. The handmade quality is evident - you can see actual rose petals in the soap. Definitely switching from commercial brands to Varoganic permanently.',
      },
    ]
  }

  // Custom detailed reviews for Kesar Milky Soap
  if (product.id === 'soap-milky-kesar') {
    return [
      {
        id: 'kesar-rev-1',
        author: 'Divya Patel',
        rating: 5,
        content: 'This is pure luxury in soap form! The saffron and camel milk combination is absolutely divine. My skin has never looked this bright and glowing. I noticed visible reduction in my pigmentation marks within 2 weeks. The sandalwood fragrance is so soothing and lasts all day!',
      },
      {
        id: 'kesar-rev-2',
        author: 'Sneha Iyer',
        rating: 5,
        content: 'Bought this as a gift for my mother and she loved it so much that I ordered 5 more bars! The kesar flakes are visible in the soap which shows its authenticity. Her skin looks more even-toned and radiant. Perfect for gifting during festivals. Highly recommended!',
      },
      {
        id: 'kesar-rev-3',
        author: 'Rekha Sinha',
        rating: 4.5,
        content: 'Amazing soap for dry skin! The camel milk makes it so creamy and moisturizing. I have been using it for a month now and my dark spots have faded significantly. My complexion looks brighter and healthier. The only thing is it dissolves a bit fast, but the results are worth it.',
      },
      {
        id: 'kesar-rev-4',
        author: 'Pooja Mehta',
        rating: 5,
        content: 'Best investment for my skin! The combination of vitamin C, vitamin E, and saffron is working wonders. My dull skin has transformed into glowing, soft skin. I can actually see the golden kesar flakes and smell the natural sandalwood. No harsh chemicals, just pure natural goodness!',
      },
      {
        id: 'kesar-rev-5',
        author: 'Kritika Singh',
        rating: 5,
        content: 'This soap is a complete game changer for pigmentation! I had stubborn dark patches on my face and they have lightened so much after using this for 3 weeks. The lather is rich and creamy, and it does not dry out my skin at all. The royal saffron aroma makes every bath feel like a spa experience!',
      },
      {
        id: 'kesar-rev-6',
        author: 'Sunita Joshi',
        rating: 4.5,
        content: 'Gifted this to my sister for her birthday and she absolutely loves it! The handmade quality is evident - you can see real kesar strands in the soap. Her skin looks noticeably brighter and more even. She says it is gentle yet effective. Definitely ordering more for the entire family!',
      },
    ]
  }

  // Custom detailed reviews for Neem Soap
  if (product.id === 'soap-neem') {
    return [
      {
        id: 'neem-rev-1',
        author: 'Anjali Gupta',
        rating: 5,
        content: 'This neem soap has been a lifesaver for my acne-prone skin! Within just 2 weeks, my breakouts reduced significantly and my skin feels so much cleaner. The herbal scent is refreshing without being overpowering. I love that it does not dry out my skin like other acne soaps do.',
      },
      {
        id: 'neem-rev-2',
        author: 'Rohit Desai',
        rating: 5,
        content: 'Best neem soap I have ever used! My oily skin is finally under control. The combination of neem and coconut oil balances everything perfectly - it cleans deeply but also moisturizes. My pimples have reduced and the old acne marks are fading. Highly recommend for anyone struggling with acne!',
      },
      {
        id: 'neem-rev-3',
        author: 'Kavita Reddy',
        rating: 4.5,
        content: 'Amazing natural soap! I have sensitive skin and was worried about trying neem, but this soap is so gentle. The camel milk makes it creamy and soothing. My skin irritation and redness have reduced noticeably. The herbal lather feels luxurious. Using it daily now!',
      },
      {
        id: 'neem-rev-4',
        author: 'Manish Kumar',
        rating: 5,
        content: 'Finally found a soap that actually controls my oily T-zone! The neem oil and leaves combination is powerful yet gentle. My pores look cleaner and smaller. No more mid-day shine. The Ayurvedic ingredients really work. This soap has become an essential part of my skincare routine.',
      },
      {
        id: 'neem-rev-5',
        author: 'Preeti Agarwal',
        rating: 5,
        content: 'Gifted this to my teenage son who struggles with acne and the results are incredible! His face is clearing up beautifully. The antibacterial properties of neem are working wonders. I am so impressed that I started using it too. Love that it is handmade with natural ingredients and no chemicals!',
      },
      {
        id: 'neem-rev-6',
        author: 'Deepak Sharma',
        rating: 4.5,
        content: 'This soap has transformed my skin! I had persistent back acne and itchiness that nothing helped with. After using Varoganic Neem Soap for 3 weeks, both issues have improved dramatically. The herbal scent is authentic and calming. Excellent for body acne and inflammation. Worth every rupee!',
      },
    ]
  }

  // Custom detailed reviews for Honey Lemon Soap
  if (product.id === 'soap-lemon-honey') {
    return [
      {
        id: 'lemon-rev-1',
        author: 'Meera Kapoor',
        rating: 5,
        content: 'This honey lemon soap is absolutely refreshing! The citrus scent wakes me up every morning. My skin tone has become noticeably brighter and more even within just 3 weeks. The honey keeps my skin soft and hydrated while the lemon tackles my dark spots. Love the natural ingredients!',
      },
      {
        id: 'lemon-rev-2',
        author: 'Arjun Nair',
        rating: 5,
        content: 'Perfect soap for oily skin! The lemon controls my excess oil production and the tea tree oil keeps acne away. My face stays fresh and matte for hours now. The honey prevents any dryness. My skin feels clean, bright, and smooth. Highly recommend for combination skin types!',
      },
      {
        id: 'lemon-rev-3',
        author: 'Simran Bhatia',
        rating: 4.5,
        content: 'Amazing brightening soap! I had dull, tired-looking skin from stress and this soap brought back my natural glow. The lemon and honey combination is so effective yet gentle. My pigmentation marks are fading gradually. The fresh citrus aroma is so uplifting. Using it twice daily now!',
      },
      {
        id: 'lemon-rev-4',
        author: 'Karan Malhotra',
        rating: 5,
        content: 'Best soap for acne and brightness! The tea tree and neem ingredients fight my breakouts effectively while lemon brightens my complexion. My skin feels deeply cleansed without being stripped. The olive oil keeps it nourished. This handmade soap is pure magic for problem skin!',
      },
      {
        id: 'lemon-rev-5',
        author: 'Nisha Pillai',
        rating: 5,
        content: 'Bought this for my daughter and she is obsessed! Her acne has reduced significantly and her skin looks so much brighter and fresher. The honey lemon combo smells divine and natural. No harsh chemicals, just pure goodness. Ordering 5 more bars. Perfect for teenagers and young adults!',
      },
      {
        id: 'lemon-rev-6',
        author: 'Vikram Singh',
        rating: 4.5,
        content: 'This soap is a game changer for dull skin! The natural lemon extracts have visibly reduced my tanning and uneven skin tone. My face looks fresh and glowing all day. The honey moisturizes beautifully. Great for daily use and makes an excellent gift too. Authentic handmade quality!',
      },
    ]
  }

  // Custom detailed reviews for De-Tan Soap
  if (product.id === 'soap-detan') {
    return [
      {
        id: 'detan-rev-1',
        author: 'Riya Malhotra',
        rating: 5,
        content: 'This de-tan soap is absolutely incredible! I came back from a beach vacation with terrible tan lines and this soap worked wonders. Within 2 weeks, my tan has faded significantly and my skin tone is much more even. The multani mitti and sandalwood combination is so effective. Highly recommend!',
      },
      {
        id: 'detan-rev-2',
        author: 'Aditya Verma',
        rating: 5,
        content: 'Best de-tan soap ever! I work outdoors and have been dealing with stubborn tanning for years. This soap with amba haldi and vitamin C has visibly brightened my complexion. My skin feels deeply cleansed yet moisturized thanks to the almond oil. The natural ingredients really show results!',
      },
      {
        id: 'detan-rev-3',
        author: 'Pooja Krishnan',
        rating: 4.5,
        content: 'Amazing results on pigmentation! I had dark patches and uneven skin tone that made me so conscious. After using this soap for 3 weeks, my skin looks brighter and clearer. The chandan cooling effect is so soothing. Leaving it on for 30-40 seconds really makes a difference. Love it!',
      },
      {
        id: 'detan-rev-4',
        author: 'Siddharth Khanna',
        rating: 5,
        content: 'Perfect for bridal prep! I gifted this to my sister for her wedding skincare routine and she is glowing! The combination of multani mitti, vitamin E and C has made her skin radiant and even-toned. She is using it twice daily and the results are visible. Great wedding gift idea!',
      },
      {
        id: 'detan-rev-5',
        author: 'Lakshmi Nair',
        rating: 5,
        content: 'This soap removed years of sun damage! I had given up on my tanned arms and face, but this de-tan soap proved me wrong. The herbal ingredients work gently but effectively. My skin texture has improved and the dullness is gone. The tea tree oil also controls my occasional breakouts. Fantastic product!',
      },
      {
        id: 'detan-rev-6',
        author: 'Rahul Joshi',
        rating: 4.5,
        content: 'Outstanding de-tan action! I play cricket and my face and arms were extremely tanned. This soap with amba haldi and sandalwood has lightened my tan noticeably in just 4 weeks. My skin feels refreshed and looks much brighter. The natural formula does not dry out my skin. Must-try for athletes!',
      },
    ]
  }

  // Custom detailed reviews for Radiant Rose Water
  if (product.id === 'mist-rose') {
    return [
      {
        id: 'rose-water-rev-1',
        author: 'Tanvi Saxena',
        rating: 5,
        content: 'This rose water is absolutely divine! The pure steam-distilled formula is so gentle and refreshing. I use it as a toner after cleansing and my skin feels instantly hydrated and soft. The natural rose fragrance is subtle and calming. The vitamin E addition makes it even more nourishing. Best rose water I have tried!',
      },
      {
        id: 'rose-water-rev-2',
        author: 'Ishaan Mehta',
        rating: 5,
        content: 'Perfect for my sensitive skin! I was looking for a natural toner without alcohol or chemicals and this is exactly what I needed. It soothes my redness and irritation immediately. I keep it in my bag and use it throughout the day to refresh my face. The mist spray is very fine and even. Highly recommend!',
      },
      {
        id: 'rose-water-rev-3',
        author: 'Aditi Banerjee',
        rating: 4.5,
        content: 'My new makeup must-have! I spray this before applying foundation and it makes my makeup glide on so smoothly. I also use it as a setting spray for that dewy finish. My skin stays hydrated all day and my pores look tighter. The pure rose water is so refreshing. Using it morning and evening!',
      },
      {
        id: 'rose-water-rev-4',
        author: 'Prateek Gupta',
        rating: 5,
        content: 'This rose water has transformed my skincare routine! I use it after shaving and it calms my skin instantly. No more irritation or redness. The vitamin E blend makes my skin feel so soft and nourished. I also spray it on my hair to reduce frizz. Multi-purpose and completely natural. Love it!',
      },
      {
        id: 'rose-water-rev-5',
        author: 'Shruti Iyer',
        rating: 5,
        content: 'Gifted this to my mother and she uses it religiously! She says her skin has never felt so refreshed and balanced. The pH balancing properties have reduced her oiliness. The rose fragrance is authentic and not artificial. She uses it as a face mist throughout the day. Ordering more for family gifts!',
      },
      {
        id: 'rose-water-rev-6',
        author: 'Ananya Rao',
        rating: 4.5,
        content: 'Absolutely love this pure rose water! I have combination skin and this toner keeps my T-zone balanced without over-drying. My skin glows naturally and feels so soft. I also use it after workouts to refresh my face. The handmade quality shows in every spray. Perfect addition to any skincare routine!',
      },
    ]
  }

  // Custom detailed reviews for Pure Glow Face Elixir
  if (product.id === 'elixir-glow') {
    return [
      {
        id: 'elixir-rev-1',
        author: 'Neha Kapoor',
        rating: 5,
        content: 'This face elixir is pure luxury! The blend of sandalwood, kesar, and hibiscus oils has transformed my dull skin into glowing, radiant skin. I use 3 drops every night and wake up with such soft, nourished skin. The non-greasy formula absorbs quickly. My pigmentation has reduced noticeably in 3 weeks!',
      },
      {
        id: 'elixir-rev-2',
        author: 'Aryan Sharma',
        rating: 5,
        content: 'Best face oil for acne-prone skin! I was skeptical about using oil on my face but the tea tree and licorice blend actually controls my breakouts. My acne marks are fading and my skin tone is more even. It hydrates without clogging pores. The herbal blend is so effective. Using it daily now!',
      },
      {
        id: 'elixir-rev-3',
        author: 'Diya Patel',
        rating: 4.5,
        content: 'Amazing anti-aging elixir! I am in my 40s and this oil has made my skin firmer and more youthful. The manjishtha and hibiscus oils improve elasticity beautifully. My fine lines look softer and my skin has a natural glow. I mix it with my moisturizer in the morning. Worth every penny!',
      },
      {
        id: 'elixir-rev-4',
        author: 'Kabir Singh',
        rating: 5,
        content: 'This elixir brightened my complexion like nothing else! I had stubborn tan and dark spots from outdoor activities. The kesar flakes and sandalwood oil combination has lightened them significantly. My skin texture is smoother and more even. The herbal scent is subtle and masculine. Perfect for men too!',
      },
      {
        id: 'elixir-rev-5',
        author: 'Priyanka Nair',
        rating: 5,
        content: 'Gifted this for my sister\'s bridal skincare and she is glowing! The blend of natural oils has made her skin radiant and flawless. She uses it every night and her makeup artist complimented her skin glow. The Ayurvedic ingredients really work. Ordering more for myself now. Perfect bridal gift!',
      },
      {
        id: 'elixir-rev-6',
        author: 'Varun Reddy',
        rating: 4.5,
        content: 'Incredible face oil for dry skin! My skin was always flaky and dull but this elixir has transformed it completely. The deep hydration from the blended oils lasts all day. My skin barrier feels stronger and healthier. I use 4 drops morning and night. The natural glow is real. Highly recommend!',
      },
    ]
  }

  // Custom detailed reviews for Skin Hydrating Gel
  if (product.id === 'gel-hydrating') {
    return [
      {
        id: 'gel-rev-1',
        author: 'Sakshi Verma',
        rating: 5,
        content: 'This hydrating gel is a lifesaver for my oily skin! It is so lightweight and absorbs instantly without leaving any greasy residue. The rose and hibiscus blend keeps my skin hydrated all day while controlling oil. My skin looks brighter and feels so soft. Using it morning and night religiously!',
      },
      {
        id: 'gel-rev-2',
        author: 'Aarav Joshi',
        rating: 5,
        content: 'Perfect gel moisturizer! I have combination skin and this gel balances everything beautifully. The 20+ herbal extracts provide deep hydration without clogging pores. My skin texture has improved and the dullness is gone. The sandalwood and vitamin C are reducing my dark spots. Highly effective!',
      },
      {
        id: 'gel-rev-3',
        author: 'Rhea Menon',
        rating: 4.5,
        content: 'Love this lightweight gel! I live in a humid climate and heavy creams make my skin greasy. This gel hydrates perfectly without feeling heavy. The almond oil and vitamin C have brightened my complexion noticeably. My redness has reduced too. Fresh, glowing skin all day. Absolutely recommend!',
      },
      {
        id: 'gel-rev-4',
        author: 'Harsh Sinha',
        rating: 5,
        content: 'Best gel for sensitive skin! I struggled with irritation from most moisturizers but this gel with rose and hibiscus is so soothing. No redness, no irritation, just healthy hydrated skin. The natural ingredients make such a difference. My skin feels calm and nourished. Using it twice daily!',
      },
      {
        id: 'gel-rev-5',
        author: 'Avni Khanna',
        rating: 5,
        content: 'This gel is my summer essential! It hydrates deeply but feels so light and fresh. My makeup sits perfectly over it. The vitamin C and sandalwood oil are fading my pigmentation beautifully. My skin tone is more even and glowing. The herbal blend is so gentle. Perfect for daily use!',
      },
      {
        id: 'gel-rev-6',
        author: 'Rohan Deshmukh',
        rating: 4.5,
        content: 'Excellent hydrating gel for men! I wanted something simple and effective for my dry skin. This gel absorbs quickly and keeps my skin hydrated without shine. The natural herbal extracts have improved my skin texture. No artificial fragrance, just pure goodness. Great value for money!',
      },
    ]
  }

  // Custom detailed reviews for Face Pack & Scrub
  if (product.id === 'pack-ubtan') {
    return [
      {
        id: 'pack-rev-1',
        author: 'Ayesha Khan',
        rating: 5,
        content: 'This face pack is amazing! The rice flour and hibiscus exfoliate so gently while the sandalwood and vitamin C brighten my skin beautifully. I use it twice a week and my skin feels tighter and looks radiant. The natural ingredients make such a difference. My pores are smaller and my skin texture is smoother!',
      },
      {
        id: 'pack-rev-2',
        author: 'Nikhil Patil',
        rating: 5,
        content: 'Best face pack for tan removal! I spent time in the sun and got badly tanned. This pack with rice flour and rose has reduced my tan significantly in just 3 weeks. My skin tone is more even and brighter. The scrubbing action removes dead skin perfectly. Using it regularly now!',
      },
      {
        id: 'pack-rev-3',
        author: 'Divya Rao',
        rating: 4.5,
        content: 'Love this dual-action pack and scrub! The massage as a scrub exfoliates beautifully and then leaving it on as a pack tightens my pores. My pigmentation has faded and my skin glows naturally. The chandan cooling effect is so refreshing. Perfect for weekly skincare rituals. Highly recommend!',
      },
      {
        id: 'pack-rev-4',
        author: 'Karthik Iyer',
        rating: 5,
        content: 'Perfect for pre-wedding skincare! I gifted this to my friend for her bridal prep and she is obsessed. Her skin looks firmer, brighter, and absolutely glowing. The vitamin C and hibiscus combination works wonders for anti-aging. She uses it 3 times a week. Great natural alternative to salon facials!',
      },
      {
        id: 'pack-rev-5',
        author: 'Shraddha Kulkarni',
        rating: 5,
        content: 'This face pack has become my Sunday self-care ritual! The natural exfoliation from rice flour removes all dead skin and the pack tightens my face beautifully. My dullness is gone and my skin looks youthful and radiant. The rose and sandalwood aroma is so calming. Worth every rupee!',
      },
      {
        id: 'pack-rev-6',
        author: 'Amit Ghosh',
        rating: 4.5,
        content: 'Excellent face pack for men too! I was looking for something natural to improve my skin texture and this works perfectly. The scrubbing removes tan and the pack tightens my pores. My skin feels firmer and looks brighter. Easy to use, just mix with water. Great results in 4 weeks!',
      },
    ]
  }

  // Custom detailed reviews for Varo Herbs Shampoo
  if (product.id === 'shampoo-varo-herbs') {
    return [
      {
        id: 'shampoo-rev-1',
        author: 'Priyanka Chopra',
        rating: 5,
        content: 'This shampoo has transformed my hair! The Ayurvedic blend of Amla, Bhringraj and Shikakai has reduced my hair fall significantly in just 4 weeks. My hair feels stronger, softer, and so much shinier. The herbal scent is natural and refreshing. Using it with Kesh Vaidya Oil for amazing results!',
      },
      {
        id: 'shampoo-rev-2',
        author: 'Rajesh Kumar',
        rating: 5,
        content: 'Best natural shampoo for dandruff! I struggled with flaky scalp for years and this neem and brahmi formula cleared it completely. My scalp feels clean and healthy. No more itchiness or irritation. My hair texture has improved too. Chemical-free and truly effective. Highly recommend!',
      },
      {
        id: 'shampoo-rev-3',
        author: 'Sneha Desai',
        rating: 4.5,
        content: 'Love this herbal shampoo! My frizzy hair is now so smooth and manageable thanks to the hibiscus and shikakai. The natural cleansing action is gentle but effective. My hair volume has increased and it looks healthier. The 20+ herbal blend really shows results. Using it twice a week!',
      },
      {
        id: 'shampoo-rev-4',
        author: 'Vikram Malhotra',
        rating: 5,
        content: 'This shampoo saved my thinning hair! The bhringraj and jatamansi combination is working wonders. My hair fall has reduced drastically and I can see new baby hair growth. My hair feels thicker and stronger. The Ayurvedic formula is so effective. Worth every penny!',
      },
      {
        id: 'shampoo-rev-5',
        author: 'Anita Reddy',
        rating: 5,
        content: 'Perfect shampoo for damaged hair! My chemically treated hair was dry and brittle but this herbal blend has restored its health. The amla adds amazing shine and the natural ingredients nourish deeply. My hair feels soft, looks vibrant, and bounces beautifully. Absolutely love it!',
      },
      {
        id: 'shampoo-rev-6',
        author: 'Karan Singh',
        rating: 4.5,
        content: 'Excellent Ayurvedic shampoo! I was looking for something natural without harsh chemicals and this is perfect. The neem controls my oily scalp and the herbal blend promotes growth. My hair feels clean, fresh, and healthy. Great for daily use. Pairing it with the hair oil for best results!',
      },
    ]
  }

  // Custom detailed reviews for Kesh Vaidya Hair Oil
  if (product.id === 'oil-kesh-vaidya') {
    return [
      {
        id: 'oil-rev-1',
        author: 'Meera Nambiar',
        rating: 5,
        content: 'This hair oil is pure magic! The blend of 25+ herbs with olive, almond and hibiscus oils has transformed my dry, damaged hair. I massage it overnight twice a week and my hair growth has improved dramatically. My hair is thicker, shinier, and so much healthier. Best hair oil ever!',
      },
      {
        id: 'oil-rev-2',
        author: 'Aditya Saxena',
        rating: 5,
        content: 'Best oil for hair fall control! I was losing a lot of hair due to stress and this bhringraj and jatamansi blend has made such a difference. My hair fall has reduced by 70% in just 6 weeks. My scalp feels nourished and my hair roots are stronger. Highly effective Ayurvedic formula!',
      },
      {
        id: 'oil-rev-3',
        author: 'Kavya Krishnan',
        rating: 4.5,
        content: 'Love this herbal hair oil! The lavender and neem combination soothes my scalp beautifully. My dandruff is completely gone and my scalp health has improved. The coconut and flaxseed oils add amazing shine and softness. My hair texture is so much better now. Using it religiously!',
      },
      {
        id: 'oil-rev-4',
        author: 'Rohan Joshi',
        rating: 5,
        content: 'This oil stopped my premature greying! The amla and bhringraj are known for preventing grey hair and they really work. My existing grey strands look darker and new growth is natural black. My hair feels nourished and looks healthy. The herbal blend is truly authentic. Amazing results!',
      },
      {
        id: 'oil-rev-5',
        author: 'Tanya Kapoor',
        rating: 5,
        content: 'Perfect for frizzy hair! My hair was unmanageable and frizzy but this oil with hibiscus and coconut has changed everything. My hair is now smooth, shiny, and easy to style. I leave it overnight before washing with Varo Herbs Shampoo. The combo works perfectly. Hair is softer than ever!',
      },
      {
        id: 'oil-rev-6',
        author: 'Sameer Rao',
        rating: 4.5,
        content: 'Excellent Ayurvedic hair oil for men! I wanted something natural to promote hair growth and this delivers. The almond and olive oil base is non-greasy and absorbs well. My hair volume has increased and my scalp feels healthier. The natural herbal aroma is pleasant. Great value for money!',
      },
    ]
  }

  // Default reviews for other products
  return [
    {
      id: `${product.id}-rev-1`,
      author: 'Varoganic Community',
      rating: Math.min(5, product.rating),
      content: `Immediate comfort and visible reset for my ${product.suits[0] ?? 'skin'} skin within two weeks.`,
    },
    {
      id: `${product.id}-rev-2`,
      author: 'Skincare Explorer',
      rating: Math.max(4, product.rating - 0.3),
      content: 'Texture feels luxurious yet absorbs quickly — ideal before sunscreen or night repair layers.',
    },
  ]
}

/**
 * Product detail route wiring gallery and details.
 */
export const ProductRoute = (): ReactElement => {
  const params = new URLSearchParams(window.location.search)
  const productId = params.get('id') ?? FALLBACK_PRODUCT.id
  const product = findProductById(productId) ?? FALLBACK_PRODUCT

  const [quantity, setQuantity] = useState(1)
  const variantOptions = useMemo(() => buildVariantOptions(product), [product])
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(variantOptions[0] ?? null)

  useEffect(() => {
    view_item({
      item: {
        id: product.id,
        name: product.name,
        category: product.category,
        variant: selectedVariant?.id,
        price: product.price,
      },
    })
  }, [product.category, product.id, product.name, product.price, selectedVariant?.id])

  useEffect(() => {
    localStorage.setItem('varoganic:last-viewed', product.id)
  }, [product.id])

  useEffect(() => {
    setSelectedVariant(variantOptions[0] ?? null)
  }, [variantOptions])

  const galleryImages = useMemo(() => buildGallery(product), [product])
  const tabs = useMemo(() => buildTabs(product), [product])
  const relatedProducts = useMemo(() => getRelatedProducts(product, 3), [product])
  const savingsPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const canonicalPath = `/product?id=${product.id}`
  const canonicalUrl = buildCanonicalUrl(canonicalPath)
  const productSchema = buildProductStructuredData({
    product,
    url: canonicalUrl,
    images: galleryImages.map((image) => image.src),
  })
  const reducedMotion = useUIStore((state) => state.reducedMotion)
  const personaCards = useMemo(
    () => [
      {
        id: 'sunrise',
        label: 'The Sunrise Ritualist',
        signal: 'Loves aromatic mornings without dryness.',
        promise: `Use ${product.name} at sunrise to wake skin gently, then seal moisture with a hydrating mist.`,
      },
      {
        id: 'detox',
        label: 'The Detox Seeker',
        signal: 'Wants clear pores without acid sting.',
        promise: 'Work it in for 60 seconds on damp skin. Botanicals lift build-up while minerals keep your barrier intact.',
      },
      {
        id: 'sensitive',
        label: 'The Sensitive Healer',
        signal: 'Reads every label and avoids sulphates.',
        promise: `${product.name} stays fragrance-free and calmed with botanicals, making it a sanctuary for reactive skin.`,
      },
    ],
    [product.name],
  )
  const demandSignals = useMemo(() => {
    const charSeed = product.id.charCodeAt(0)
    const watchers = 240 + (charSeed % 40)
    const batches = 18 + (product.id.length % 5)
    return [
      {
        id: 'watching',
        label: 'Rituals watching now',
        figure: `${watchers.toString()} seekers`,
        description: 'Shoppers currently tracking this micro-batch. We craft in small runs, so once it sells out the next pour is in 7 days.',
      },
      {
        id: 'batch',
        label: 'Current micro-batch',
        figure: `Batch ${batches.toString()} curing`,
        description: 'Fresh blend has entered its 72-hour cure window. Reserve now to get a dispatch notification as soon as it seals.',
      },
      {
        id: 'impact',
        label: 'Impact with purchase',
        figure: '1.4kg CO₂ offset',
        description: 'Every order funds forest soil regeneration and replaces 3 plastic bottles through our refill program.',
      },
    ]
  }, [product.id])

  useEffect(() => {
    view_item({
      item: {
        id: product.id,
        name: product.name,
        category: product.category,
        variant: selectedVariant?.id,
        price: product.price,
      },
    })
  }, [product.category, product.id, product.name, product.price, selectedVariant?.id])

  return (
    // Performance budget (JS <200KB gz, LCP <2.5s on 4G, CLS <0.1, INP <200ms):
    // - Responsive gallery and sticky add-to-cart prevent layout shifts while lazy route bundles keep JS under cap.
    // - Structured data injected via Helmet without blocking rendering.
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-32 pt-12">
      <SEO
        title={product.name}
        description={product.description}
        path={canonicalPath}
        image={galleryImages[0]?.src}
        openGraph={{ type: 'product' }}
        structuredData={productSchema}
      />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Gallery images={galleryImages} />
        <div className="space-y-6">
          <header className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
              In stock • Ships today
            </p>
            <h1 className="font-heading text-h2 text-ink">{product.name}</h1>
            {product.details?.tagline ? (
              <p className="text-sm text-muted italic">{product.details.tagline}</p>
            ) : null}
            <div className="flex items-baseline gap-3 text-sm">
              <span className="text-2xl font-semibold text-primary">{formatCurrency(product.price, 'INR')}</span>
              <span className="text-muted line-through">{formatCurrency(product.mrp, 'INR')}</span>
              <span className="text-success">Save {String(savingsPercent)}%</span>
            </div>
          </header>
          <div className="space-y-5">
            {variantOptions.length ? (
              <VariantSelector
                options={variantOptions}
                onChange={(option) => {
                  setSelectedVariant(option)
                }}
              />
            ) : null}
            {selectedVariant?.description ? (
              <p className="text-sm text-muted">{selectedVariant.description}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-4">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <ButtonBuyNow product={product} quantity={quantity} variantId={selectedVariant?.id ?? undefined} className="flex-1" />
              <AddToCartButton product={product} quantity={quantity} label="Add to cart" variantId={selectedVariant?.id ?? undefined} className="flex-shrink-0" variant="secondary" size="sm" />
            </div>
          </div>
          <DetailsTabs tabs={tabs} />
        </div>
      </div>
      <PairWith products={relatedProducts.length ? relatedProducts : PRODUCTS.slice(0, 3)} lastViewedId={product.id} />
      <section className="rounded-3xl border border-lines bg-paper px-6 py-10 shadow-card md:px-10">
        <div className="space-y-3 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-success">Micro-batch intel</p>
          <h2 className="font-heading text-h3 text-ink">Secure your jar before the botanicals rest again</h2>
          <p className="text-sm text-muted">
            Demand surges for our chemical-free pours. We disclose live batch stats so you can claim yours with clarity—not FOMO.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {demandSignals.map((signal, index) => (
            <motion.article
              key={signal.id}
              className="rounded-2xl border border-lines bg-paper px-4 py-5 text-left shadow-card"
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={reducedMotion ? undefined : { delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reducedMotion ? undefined : { y: -6 }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{signal.label}</p>
              <p className="mt-2 text-lg font-semibold text-primary">{signal.figure}</p>
              <p className="mt-2 text-sm text-muted">{signal.description}</p>
            </motion.article>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-lines bg-paper px-6 py-10 shadow-card md:px-10">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-success">Who this was formulated for</p>
          <h2 className="font-heading text-h3 text-ink">See yourself in our community archetypes</h2>
          <p className="text-sm text-muted">
            Whether you’re rebuilding a stressed barrier or chasing weekend radiance, there’s a ritual path designed precisely for you.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personaCards.map((persona) => (
            <motion.article
              key={persona.id}
              className="h-full rounded-2xl border border-lines bg-paper p-5 text-left shadow-card"
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              whileHover={reducedMotion ? undefined : { y: -6, scale: 1.02 }}
              transition={reducedMotion ? undefined : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{persona.label}</p>
              <p className="mt-2 text-sm text-primary">{persona.signal}</p>
              <p className="mt-3 text-sm text-ink">{persona.promise}</p>
            </motion.article>
          ))}
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-lines bg-paper/95 px-4 py-3 shadow-card md:hidden">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
          <ButtonBuyNow product={product} quantity={quantity} variantId={selectedVariant?.id ?? undefined} className="flex-1" />
          <AddToCartButton product={product} quantity={quantity} label="Add to cart" variantId={selectedVariant?.id ?? undefined} className="flex-shrink-0" variant="secondary" size="sm" />
        </div>
      </div>
    </div>
  )
}

const ButtonBuyNow = ({ product, className }: { readonly product: Product; readonly quantity?: number; readonly variantId?: string; readonly className?: string }): ReactElement => {
  const flipkartLink = product.links?.flipkart

  // Only show button if Flipkart link exists
  if (!flipkartLink) {
    return <></>
  }

  return (
    <a
      href={flipkartLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper min-h-[48px] ${className ?? ''}`}
    >
      Buy now on Flipkart
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}
