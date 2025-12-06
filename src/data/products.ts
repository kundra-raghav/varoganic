import type { Product } from '@/types/product'

const RAW_PRODUCTS = [
  {
    id: 'soap-rose',
    name: 'Varoganic Rose Shower Soap',
    category: 'Soap',
    description:
      'Indulge in a refreshing, luxurious bath experience with Varoganic\'s Rose Shower Soap, handcrafted with real rose petals, nourishing rose oil, antioxidant-packed Vitamin E oil, hydrating olive oil, and purifying tea tree oil. Each soap bar is handmade with love and care to give your skin the soft, glowing, and healthy look it deserves.',
    suits: [],
    goals: [
      'Deep Moisturization',
      'Acne Reduction',
      'Skin Brightening',
      'Anti-Aging',
      'Reduces Redness',
      'Improves Skin Texture',
      'Natural Glow',
    ],
    image: 'https://i.ibb.co/My8Xx6X0/Main-Image.png',
    amazonLink: '',
    flipkartLink: 'https://www.flipkart.com/varoganic-rose-shower-soap-body-face-all-type-skin-100g/p/itm79ba428b2b58d?pid=SOPGZZD2H9VQFS6R&lid=LSTSOPGZZD2H9VQFS6RYH05N9&marketplace=FLIPKART&q=varoganic+rose+shower+soap&store=g9b%2F5nz%2Fb1b%2Fyug&srno=s_1_1&otracker=AS_Query_HistoryAutoSuggest_1_26_na_na_na&otracker1=AS_Query_HistoryAutoSuggest_1_26_na_na_na&fm=search-autosuggest&iid=b265f1a6-24b3-4671-b7b1-e6c21e007b4b.SOPGZZD2H9VQFS6R.SEARCH&ppt=sp&ppn=sp&ssid=xe2pephncg0000001765017150124&qH=32291af99d72feeb',
    details: {
      tagline: 'Handmade with Love, Purely Natural, Gentle on Skin',
      keyIngredients: [
        {
          name: 'Rose Petals',
          benefits: [
            'Naturally soothes and calms the skin',
            'Reduces redness and irritation',
            'Leaves a fresh floral feel',
          ],
        },
        {
          name: 'Rose Oil',
          benefits: [
            'Deeply hydrates and brightens skin',
            'Helps reduce fine lines and dryness',
            'Enhances skin elasticity and glow',
          ],
        },
        {
          name: 'Vitamin E Oil',
          benefits: [
            'Strong antioxidant that repairs damaged skin',
            'Protects skin from pollution and UV stress',
            'Makes skin smooth, soft, and youthful',
          ],
        },
        {
          name: 'Olive Oil',
          benefits: [
            'Provides long-lasting moisturization',
            'Heals dry, cracked, or rough skin',
            'Gentle enough for sensitive skin',
          ],
        },
        {
          name: 'Tea Tree Oil',
          benefits: [
            'Fights acne-causing bacteria',
            'Controls excess oil',
            'Keeps the skin clean, fresh, and healthy',
          ],
        },
      ],
      benefits: [
        'Deep cleans while moisturizing the skin',
        'Reduces acne, blemishes & skin irritation',
        'Enhances skin glow and natural softness',
        'Protects skin with natural antioxidants',
        'Improves skin texture with daily use',
        'Leaves a calming rose fragrance all day',
        'Suitable for all skin types',
      ],
      howToUse: [
        'Wet your skin with lukewarm water or normal water',
        'Rub the soap between your hands or directly onto your body and face',
        'Massage gently to create a rich, creamy lather',
        'Leave the lather on your skin for a few seconds for better absorption',
        'Rinse thoroughly and pat dry',
        'Use daily for best results',
      ],
      whyChoose: [
        'Handcrafted with love and care',
        'Made in small batches for purity & freshness',
        '100% natural, herbal ingredients',
        'Free from chemicals, sulfates & parabens',
        'Eco-friendly & skin-friendly',
      ],
    },
  },
  {
    id: 'soap-milky-kesar',
    name: 'Varoganic Kesar Milky Soap',
    category: 'Soap',
    description:
      'Give your skin the richness of ancient beauty secrets with Varoganic\'s Kesar Milky Soap — a luxurious blend of Kesar (Saffron), Camel Milk, Vitamin E & C Oils, Olive Oil, Kesar Flakes, and Sandalwood Oil. Each bar is handcrafted in small batches to maintain purity, freshness, and maximum skin benefits. This premium soap is not only a treat for your skin but also a perfect gift for someone special.',
    suits: [],
    goals: [
      'Skin Brightening',
      'Dark Spot Reduction',
      'Deep Moisturization',
      'Reduces Pigmentation',
      'Anti-Ageing',
      'Natural Glow',
      'Smooth Texture',
      'Soothes Irritation',
    ],
    image: 'https://i.ibb.co/67B4LfJ7/Milky-Kesar-Soap.png',
    amazonLink: '',
    flipkartLink: 'https://www.flipkart.com/varoganic-milky-kesar-body-face-soap-all-type-skin-100g/p/itm575b451b2a67d?pid=SOPGZZD2WHQNGPPJ&lid=LSTSOPGZZD2WHQNGPPJPBOOH1&marketplace=FLIPKART&hl_lid=&q=Varoganic+&store=search.flipkart.com&_refId=&_appId=WA',
    details: {
      tagline: 'Handmade with Love & Care | Luxurious Skin Brightening Soap',
      keyIngredients: [
        {
          name: 'Kesar (Saffron) Oil & Kesar Flakes',
          benefits: [
            'Naturally brightens and evens skin tone',
            'Adds a healthy golden glow',
            'Helps fade dark spots, pigmentation & blemishes',
            'Gives a luxurious, royal bathing experience',
          ],
        },
        {
          name: 'Camel Milk',
          benefits: [
            'Deep moisturization & intense nourishment',
            'Contains natural lactic acid for gentle exfoliation',
            'Leaves skin soft, smooth, and youthful',
            'Suitable for dry & sensitive skin',
          ],
        },
        {
          name: 'Vitamin E Oil',
          benefits: [
            'Repairs damaged skin cells',
            'Reduces dryness and improves elasticity',
            'Protects skin from pollution and sun stress',
          ],
        },
        {
          name: 'Vitamin C Oil',
          benefits: [
            'Supports collagen production',
            'Reduces dullness for brighter skin',
            'Fades dark spots and promotes an even complexion',
          ],
        },
        {
          name: 'Sandalwood Oil',
          benefits: [
            'Soothes irritated skin',
            'Controls acne & reduces skin inflammation',
            'Provides a calming, natural aroma',
          ],
        },
        {
          name: 'Olive Oil',
          benefits: [
            'Deep hydration and nourishment',
            'Prevents dryness and rough skin',
            'Gentle, natural cleansing',
          ],
        },
      ],
      benefits: [
        'Brightens skin and improves complexion',
        'Reduces dark spots, tanning & pigmentation',
        'Deep moisturization with camel milk & olive oil',
        'Enhances softness, glow, and smooth texture',
        'Soothes irritation and nourishes the skin',
        'Leaves a long-lasting natural fragrance',
        'Perfect for daily use on all skin types',
        'Handmade, chemical-free & gentle on skin',
      ],
      howToUse: [
        'Wet your body with lukewarm water or normal water',
        'Apply the soap directly or lather it in your hands',
        'Massage gently in circular motions',
        'Allow the creamy kesar-camel milk lather to sit for 20-30 seconds',
        'Rinse thoroughly and pat dry with a soft towel',
        'For best results, use daily',
      ],
      whyChoose: [
        'Made with love & care',
        '100% natural & chemical-free',
        'Small-batch, handcrafted soaps',
        'Premium Ayurvedic & herbal ingredients',
        'Skin-friendly and eco-friendly',
        'Authentic fragrance & long-lasting freshness',
        'Perfect gift for festivals, birthdays & special occasions',
      ],
    },
  },
  {
    id: 'soap-detan',
    name: 'Varoganic De-Tan Soap',
    category: 'Soap',
    description:
      'Reveal your natural glow with Varoganic\'s De-Tan Soap, a handcrafted blend of Multani Mitti, Chandan (Sandalwood), Amba Haldi, Vitamin E, Vitamin C, Almond Oil, and Tea Tree Oil. This powerful herbal soap targets tanning, dullness, and uneven skin tone — leaving your skin brighter, clearer, and refreshed. A perfect self-care indulgence and an ideal gift for someone special.',
    suits: [],
    goals: [
      'Tan Removal',
      'Skin Brightening',
      'Reduces Pigmentation',
      'Dark Spot Reduction',
      'Acne Reduction',
      'Deep Cleansing',
      'Controls Excess Oil',
      'Improves Skin Texture',
    ],
    image: 'https://i.ibb.co/Qv0n5RKt/de-tan-soap-1.png',
    amazonLink:
      'https://www.amazon.in/VAROGANIC-Removes-combination-Chandan-Handmade/dp/B0D3QGPV4L/ref=sr_1_4?crid=8ZYA2YE8DS97&dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=varoganic&nsdOptOutParam=true&qid=1758581105&s=beauty&sprefix=varogani%2Cbeauty%2C221&sr=1-4',
    flipkartLink: 'https://dl.flipkart.com/s/t5s42ZNNNN',
    details: {
      tagline: 'Handmade with Love & Care | Brightening • Clarifying • Refreshing',
      keyIngredients: [
        {
          name: 'Multani Mitti (Fuller\'s Earth)',
          benefits: [
            'Deeply cleanses and removes tan',
            'Extracts excess oil & impurities',
            'Tightens pores and improves skin texture',
          ],
        },
        {
          name: 'Chandan (Sandalwood)',
          benefits: [
            'Brightens dull, tanned skin',
            'Reduces blemishes and pigmentation',
            'Naturally cools and calms the skin',
          ],
        },
        {
          name: 'Amba Haldi (Wild Turmeric)',
          benefits: [
            'Fades tan, dark spots & discoloration',
            'Gives natural radiance',
            'Helps reduce acne & breakouts',
          ],
        },
        {
          name: 'Vitamin E Oil',
          benefits: [
            'Repairs damaged skin',
            'Moisturizes and softens',
            'Protects against sun & pollution damage',
          ],
        },
        {
          name: 'Vitamin C',
          benefits: [
            'Strong brightening agent',
            'Boosts collagen and reduces dullness',
            'Improves skin tone and clarity',
          ],
        },
        {
          name: 'Almond Oil',
          benefits: [
            'Deep moisturization',
            'Restores skin elasticity',
            'Makes skin smooth and glowing',
          ],
        },
        {
          name: 'Tea Tree Oil',
          benefits: [
            'Fights acne-causing bacteria',
            'Keeps pores clean & clear',
            'Reduces inflammation',
          ],
        },
      ],
      benefits: [
        'Removes tan and evens out skin tone',
        'Reduces pigmentation, dark spots & dullness',
        'Deep cleans pores without stripping moisture',
        'Brightens the skin with natural ingredients',
        'Controls excess oil and prevents acne',
        'Hydrates and nourishes the skin',
        'Suitable for all skin types',
        'Handmade, natural & safe for daily use',
      ],
      howToUse: [
        'Wet the skin with warm water',
        'Rub the soap between your hands or directly on the skin',
        'Massage gently in circular motions',
        'Leave on for 20-45 seconds for effective de-tan action',
        'Rinse thoroughly and pat dry',
        'Use daily or twice a day for best results',
      ],
      whyChoose: [
        'Made with love & care',
        '100% natural & chemical-free',
        'Small-batch handcrafted',
        'Rich in herbal & Ayurvedic ingredients',
        'Skin-friendly & eco-friendly',
        'Gentle, effective & refreshing',
        'Perfect for bridal/groom hampers & festive gifting',
      ],
    },
  },
  {
    id: 'soap-lemon-honey',
    name: 'Varoganic Honey Lemon Soap',
    category: 'Soap',
    description:
      'Refresh your skin naturally with Varoganic\'s Honey Lemon Soap, a handcrafted blend of pure honey, fresh lemon, neem leaves, tea tree oil, and olive oil. This energizing soap deeply cleanses, brightens the skin, and provides long-lasting freshness. A perfect pick for daily use and a thoughtful gift for someone special.',
    suits: [],
    goals: [
      'Skin Brightening',
      'Acne Reduction',
      'Dark Spot Reduction',
      'Deep Cleansing',
      'Controls Excess Oil',
      'Hydration',
      'Natural Glow',
      'Reduces Pigmentation',
    ],
    image: 'https://i.ibb.co/kshV5Ygx/lemon-soap.png',
    amazonLink: '',
    flipkartLink: 'https://www.flipkart.com/varoganic-herbal-glow-handmade-lemon-soap/p/itm1d59cc64974da?pid=SOPHGA9GHEJHFA2U&lid=LSTSOPHGA9GHEJHFA2UC5ASVX&marketplace=FLIPKART&hl_lid=&q=Varoganic+&store=search.flipkart.com&_refId=&_appId=WA',
    details: {
      tagline: 'Handmade with Love & Care | Refreshing • Brightening • Purifying',
      keyIngredients: [
        {
          name: 'Honey',
          benefits: [
            'Deeply moisturizes and nourishes the skin',
            'Locks in natural hydration',
            'Helps heal dry, rough, or dull skin',
            'Adds a natural glow',
          ],
        },
        {
          name: 'Lemon',
          benefits: [
            'Brightens skin tone and reduces dullness',
            'Helps lighten dark spots & pigmentation',
            'Controls excess oil and refreshes the skin',
          ],
        },
        {
          name: 'Neem Leaves',
          benefits: [
            'Strong antibacterial properties',
            'Controls acne, pimples & skin infections',
            'Soothes irritation and redness',
          ],
        },
        {
          name: 'Tea Tree Oil',
          benefits: [
            'Fights acne-causing bacteria',
            'Keeps skin clear and purified',
            'Reduces breakouts & prevents clogged pores',
          ],
        },
        {
          name: 'Olive Oil',
          benefits: [
            'Provides deep nourishment',
            'Softens and hydrates dry skin',
            'Gives a smooth, supple feel to the skin',
          ],
        },
      ],
      benefits: [
        'Brightens skin and reduces pigmentation',
        'Controls acne and excess oil production',
        'Deep cleansing with natural antibacterial ingredients',
        'Hydrates and softens the skin',
        'Leaves skin feeling fresh, smooth, and glowing',
        'Ideal for oily, combination & acne-prone skin',
        'Handmade, chemical-free & gentle for daily use',
      ],
      howToUse: [
        'Wet your body with lukewarm water or normal water',
        'Lather the soap in your hands or apply directly to skin',
        'Massage gently in circular motions',
        'Leave the lather for 20-30 seconds for best results',
        'Rinse thoroughly and pat dry',
        'Use daily for a fresh, glowing complexion',
      ],
      whyChoose: [
        'Made with love & care',
        '100% natural & herbal',
        'Chemical-free, sulfate-free, paraben-free',
        'Handcrafted in small batches',
        'Eco-friendly & skin-safe',
        'Inspired by traditional herbal skincare',
        'Perfect gift for festivals, birthdays & self-care hampers',
      ],
    },
  },
  {
    id: 'soap-neem',
    name: 'Varoganic Neem Soap',
    category: 'Soap',
    description:
      'Experience the power of ancient Ayurveda with Varoganic\'s Neem Soap, a handcrafted blend of neem leaves, pure neem oil, soothing camel milk, nourishing coconut oil, and antioxidant-rich Vitamin E oil. This refreshing herbal soap is specially crafted to purify, protect, and heal your skin naturally — perfect for daily use and a thoughtful gift for someone special.',
    suits: [],
    goals: [
      'Acne Reduction',
      'Controls Breakouts',
      'Deep Cleansing',
      'Reduces Inflammation',
      'Fights Bacteria',
      'Hydration',
      'Skin Purification',
      'Improves Clarity',
    ],
    image: 'https://i.ibb.co/7JNVwKkn/neem-soap.png',
    amazonLink: '',
    flipkartLink: 'https://www.flipkart.com/varoganic-neem-soap/p/itmd8df3ce1f67c7?pid=SOPHGCGFNPXYAEAN&lid=LSTSOPHGCGFNPXYAEANL1IUPJ&marketplace=FLIPKART&hl_lid=&q=Varoganic+&store=search.flipkart.com&_refId=&_appId=WA',
    details: {
      tagline: 'Handmade with Love & Care | Purifying Herbal Cleansing Bar',
      keyIngredients: [
        {
          name: 'Neem Leaves',
          benefits: [
            'Strong antibacterial & antifungal properties',
            'Controls acne, pimples, and skin infections',
            'Helps reduce itching, inflammation & redness',
          ],
        },
        {
          name: 'Neem Oil',
          benefits: [
            'Deeply cleans pores & removes impurities',
            'Controls excess oil production',
            'Helps lighten blemishes and acne scars',
          ],
        },
        {
          name: 'Vitamin E Oil',
          benefits: [
            'Repairs damaged skin cells',
            'Protects skin from dryness, pollution & sun stress',
            'Improves overall skin texture and smoothness',
          ],
        },
        {
          name: 'Coconut Oil',
          benefits: [
            'Deeply moisturizes and nourishes the skin',
            'Softens dry, rough, or flaky skin',
            'Promotes healing of irritated or cracked skin',
          ],
        },
        {
          name: 'Camel Milk',
          benefits: [
            'Rich in natural lactic acid for gentle exfoliation',
            'Hydrates and improves skin elasticity',
            'Leaves skin soft, healthy, and glowing',
          ],
        },
      ],
      benefits: [
        'Controls acne & reduces breakouts',
        'Fights bacteria and keeps skin clean & fresh',
        'Reduces itchiness, inflammation & skin irritation',
        'Deep cleans pores without stripping moisture',
        'Strengthens skin barrier & improves clarity',
        'Hydrates and softens with camel milk & coconut oil',
        'Perfect for oily, acne-prone & sensitive skin',
        'Handmade, natural & gentle for everyday use',
      ],
      howToUse: [
        'Wet your skin with warm water or normal water',
        'Rub the neem soap between your hands or directly on your body/face',
        'Massage in circular motions to form a soft, herbal lather',
        'Leave for 20-30 seconds to allow ingredients to work',
        'Rinse thoroughly and gently pat dry',
        'Use daily for best results',
      ],
      whyChoose: [
        'Made with love & care',
        '100% natural, herbal & chemical-free',
        'Crafted in small batches for freshness',
        'Suitable for all skin types',
        'Eco-friendly & skin-friendly',
        'Inspired by traditional Ayurvedic skincare',
        'Perfect gift for festivals, birthdays & wellness hampers',
      ],
    },
  },
  {
    id: 'gel-hydrating',
    name: 'Varoganic Skin Hydrating Gel',
    category: 'Gel',
    description:
      'Give your skin the love it deserves with Varoganic Skin Hydrating Gel, a lightweight yet deeply nourishing formula made with Rose, Hibiscus, Sandalwood Oil, Vitamin C Oil, Almond Oil, and a powerful blend of 20+ herbal extracts. This gentle gel hydrates, soothes, brightens, and refreshes your skin — keeping it healthy, glowing, and beautifully soft. Perfect for daily skincare and a thoughtful gift for someone special.',
    suits: [],
    goals: [
      'Deep Hydration',
      'Skin Brightening',
      'Reduces Pigmentation',
      'Soft Skin',
      'Improves Texture',
      'Reduces Redness',
      'Natural Glow',
      'Suitable for All Skin Types',
    ],
    image: 'https://m.media-amazon.com/images/I/51irLAhWC7L.jpg',
    amazonLink:
      'https://www.amazon.in/VarOrganics-Light-Hydrating-refreshing-Unisex/dp/B0D3PWGTPG/ref=sr_1_2?crid=8ZYA2YE8DS97&dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=varoganic&nsdOptOutParam=true&qid=1758581105&s=beauty&sprefix=varogani%2Cbeauty%2C221&sr=1-2',
    flipkartLink: 'https://dl.flipkart.com/dl/varoganic-skin-hydrating-gel-clean-refreshing-moisturizes-tones-adds-radiance/p/itm0844caba43b17?pid=MSCGZ7V496BHWBYQ&lid=LSTMSCGZ7V496BHWBYQPKDY8O&marketplace=FLIPKART&hl_lid=&q=Varoganic+&store=search.flipkart.com&_refId=&_appId=WA',
    details: {
      tagline: 'Handmade • Chemical-Free • Paraben-Free • Cruelty-Free | Deep Hydration | Glow Boosting | Nourishing Herbal Blend',
      keyIngredients: [
        {
          name: 'Rose',
          benefits: [
            'Hydrates and soothes the skin',
            'Reduces redness and irritation',
            'Adds a natural glow',
          ],
        },
        {
          name: 'Hibiscus',
          benefits: [
            'Rich in natural AHAs for gentle exfoliation',
            'Improves skin texture',
            'Boosts natural radiance',
          ],
        },
        {
          name: 'Sandalwood Oil',
          benefits: [
            'Calms and cools the skin',
            'Helps reduce pigmentation',
            'Evens out skin tone',
          ],
        },
        {
          name: 'Vitamin C Oil',
          benefits: [
            'Brightens dull skin',
            'Enhances collagen for smoothness',
            'Reduces dark spots',
          ],
        },
        {
          name: 'Almond Oil',
          benefits: [
            'Deeply moisturizes',
            'Softens and nourishes the skin',
            'Rich in vitamin E for youthful glow',
          ],
        },
        {
          name: '20+ Herbal Extracts',
          benefits: [
            'Improve hydration',
            'Soothe and protect the skin',
            'Support natural regeneration',
            'Provide multi-layer nourishment',
          ],
        },
      ],
      benefits: [
        'Deeply hydrates and moisturizes',
        'Brightens and refreshes the complexion',
        'Helps fade pigmentation & dark spots',
        'Smoothens rough and dry skin',
        'Controls redness and irritation',
        'Improves overall skin texture',
        'Absorbs quickly and feels light on the skin',
        'Suitable for all skin types',
      ],
      howToUse: [
        'Wash your face with a gentle cleanser',
        'Take a small amount of the hydrating gel',
        'Apply evenly on your face',
        'Massage gently until it fully absorbs',
        'Use twice daily — morning and night for best results',
        'Can be mixed with face oils for extra nourishment',
      ],
      whyChoose: [
        'Handmade with love & care',
        'Made using only natural ingredients',
        'Chemical-free & Paraben-free',
        'Cruelty-free',
        'Small-batch crafted for freshness',
        'Lightweight, non-greasy formula',
        'Perfect for skincare hampers & festive gifting',
      ],
    },
  },
  {
    id: 'pack-ubtan',
    name: 'Varoganic Skin Whitening & Tightening Face Pack & Scrub',
    category: 'Pack',
    description:
      'Experience youthful, radiant, and firmer-looking skin with Varoganic Skin Whitening & Tightening Face Pack & Scrub, a powerful blend of pure and natural ingredients. This handmade face pack is enriched with Rose, Chandan (Sandalwood), Rice Flour, Hibiscus, and Vitamin C, crafted to brighten the complexion, tighten the skin, reduce dullness, and give a refreshing natural glow. Perfect for weekly skincare rituals and a thoughtful gift for someone special.',
    suits: [],
    goals: [
      'Skin Brightening',
      'Tightens Pores',
      'Reduces Pigmentation',
      'Exfoliates Dead Skin',
      'Removes Tan',
      'Improves Texture',
      'Natural Glow',
      'Firmer Skin',
    ],
    image: 'https://m.media-amazon.com/images/I/41IEUQW6c0L.jpg',
    amazonLink:
      'https://www.amazon.in/Varoganic-Whitening-Tightening-Unisex-40gram/dp/B0D3QN7J9N/ref=sr_1_4?dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=VAROGANIC&nsdOptOutParam=true&qid=1758581149&sr=8-4',
    flipkartLink: 'https://dl.flipkart.com/s/tV06dxNNNN',
    details: {
      tagline: 'Handmade with Love & Care | Brightening • Firming • Natural Glow',
      keyIngredients: [
        {
          name: 'Rose',
          benefits: [
            'Brightens and soothes skin',
            'Reduces redness and irritation',
            'Enhances natural glow',
          ],
        },
        {
          name: 'Chandan (Sandalwood)',
          benefits: [
            'Tightens and firms the skin',
            'Reduces pigmentation & dark spots',
            'Provides cooling and calming benefits',
          ],
        },
        {
          name: 'Rice Flour',
          benefits: [
            'Natural exfoliator for dead skin removal',
            'Reduces tanning & evens out skin tone',
            'Helps tighten pores and improve texture',
          ],
        },
        {
          name: 'Hibiscus',
          benefits: [
            'Rich in natural AHAs for gentle exfoliation',
            'Boosts skin elasticity and firmness',
            'Promotes youthful, glowing skin',
          ],
        },
        {
          name: 'Vitamin C',
          benefits: [
            'Strong skin brightener',
            'Reduces dark spots & dullness',
            'Enhances collagen production for tighter skin',
          ],
        },
      ],
      benefits: [
        'Brightens skin & reduces pigmentation',
        'Tightens pores for firmer, younger-looking skin',
        'Exfoliates dead skin and removes tan',
        'Improves skin texture and softness',
        'Reduces dullness and promotes healthy radiance',
        'Helps fade marks, spots & discoloration',
        'Made with pure herbal ingredients',
        'Suitable for all skin types',
      ],
      howToUse: [
        'Take 1-2 teaspoons of the powder in a bowl',
        'Mix with rose water or milk to form a smooth paste',
        'Apply evenly on the face',
        'Gently massage for 2 minutes as a scrub',
        'Leave the pack to dry completely',
        'Wash off with normal water and pat dry',
        'Use 2-3 times a week for best results',
      ],
      whyChoose: [
        'Handmade with love & care',
        '100% natural ingredients',
        'Free from chemicals, parabens & sulfates',
        'Small-batch crafted for freshness',
        'Eco-friendly & skin-friendly',
        'Dual-action: scrub and pack',
        'Perfect for bridal hampers & festive gifting',
      ],
    },
  },
  {
    id: 'elixir-glow',
    name: 'Varoganic Pure Glow Face Elixir',
    category: 'Elixir',
    description:
      'Give your skin the luxury of nature with Varoganic Pure Glow Face Elixir, a deeply nourishing face oil crafted from powerful herbal extracts and premium natural oils. This radiant blend combines Tea Tree Oil, Sandalwood Oil, Licorice, Hibiscus Oil, Manjishtha, Kesar Flakes, and many other herbal oils to deliver glowing, even-toned, and healthy skin — naturally. Perfect for your everyday skincare ritual and a thoughtful gift for someone special.',
    suits: [],
    goals: [
      'Skin Brightening',
      'Reduces Pigmentation',
      'Acne Control',
      'Deep Hydration',
      'Even Skin Tone',
      'Anti-Aging',
      'Soft Skin',
      'Natural Glow',
    ],
    image: 'https://m.media-amazon.com/images/I/61HIPpnz8GL._SL1500_.jpg',
    amazonLink:
      'https://www.amazon.in/Varoganic-Anti-Aging-Brightening-Chemical-Free-Paraben-Free/dp/B0DFWZMGYF/ref=sr_1_6?dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=VAROGANIC&nsdOptOutParam=true&qid=1758581149&sr=8-6',
    flipkartLink: 'https://www.flipkart.com/search?q=varoganic+face+elixir',
    details: {
      tagline: 'Handmade with Love & Care | Brightening • Repairing • Clarifying',
      keyIngredients: [
        {
          name: 'Tea Tree Oil',
          benefits: [
            'Controls acne & prevents breakouts',
            'Purifies skin and reduces inflammation',
            'Keeps pores clean and unclogged',
          ],
        },
        {
          name: 'Sandalwood Oil',
          benefits: [
            'Brightens the complexion',
            'Reduces tan, spots & pigmentation',
            'Provides soothing, cooling benefits',
          ],
        },
        {
          name: 'Licorice (Mulethi) Extract',
          benefits: [
            'Natural skin brightener',
            'Reduces dark spots and discoloration',
            'Helps fade acne marks and pigmentation',
          ],
        },
        {
          name: 'Hibiscus Oil',
          benefits: [
            'Rich in antioxidants',
            'Improves skin firmness and elasticity',
            'Promotes youthful, glowing skin',
          ],
        },
        {
          name: 'Manjishtha (Indian Madder)',
          benefits: [
            'Helps even out skin tone',
            'Reduces blemishes and dullness',
            'Detoxifies and purifies skin naturally',
          ],
        },
        {
          name: 'Kesar (Saffron) Flakes',
          benefits: [
            'Enhances natural glow',
            'Helps lighten marks and pigmentation',
            'Luxurious nourishment for radiant skin',
          ],
        },
        {
          name: 'Blended Natural Oils & Herbs',
          benefits: [
            'Deep hydration and skin barrier protection',
            'Repair environmental damage',
            'Promote softness, smoothness & healthy radiance',
          ],
        },
      ],
      benefits: [
        'Brightens skin and improves natural glow',
        'Reduces pigmentation, tan & dark spots',
        'Controls acne and prevents breakouts',
        'Deeply hydrates without clogging pores',
        'Repairs damaged skin and evens skin tone',
        'Enhances skin texture and smoothness',
        'Supports anti-aging with powerful antioxidants',
        'Suitable for all skin types, especially dull, dry, and uneven skin',
      ],
      howToUse: [
        'Cleanse your face thoroughly',
        'Take 2-4 drops of the elixir onto your fingertips',
        'Gently massage onto face and neck in upward circular motions',
        'Use daily at night, or in the morning',
        'Mix a drop with your moisturizer for extra hydration',
        'Can be used alone or layered with other products',
      ],
      whyChoose: [
        'Handmade with love & care',
        '100% natural, chemical-free & safe',
        'Cruelty-free & eco-friendly',
        'Crafted in small batches for freshness',
        'Inspired by traditional Ayurvedic beauty secrets',
        'Non-greasy formula that absorbs quickly',
        'Perfect for bridal/groom hampers & festive gifting',
      ],
    },
  },
  {
    id: 'mist-rose',
    name: 'Varoganic Radiant Rose Water',
    category: 'Mist',
    description:
      'Give your skin a burst of freshness with Varoganic Radiant Rose Water, crafted from pure steam-distilled rose water blended with nourishing Vitamin E for extra hydration and glow. This gentle, aromatic mist revitalizes your skin instantly — leaving it soft, soothed, and naturally radiant. Perfect for daily skincare routines and a thoughtful gift for someone special.',
    suits: [],
    goals: [
      'Hydration',
      'Soft Skin',
      'Tightens Pores',
      'Reduces Redness',
      'Natural Glow',
      'Balances pH',
      'Soothes Irritation',
      'Makeup Prep',
    ],
    image: 'https://m.media-amazon.com/images/I/71vCvk1UVmL._SL1080_.jpg',
    amazonLink:
      'https://www.amazon.in/Varoganic-Radiant-chemical-extract-Product/dp/B0DFWX9K7H/ref=sr_1_5?dib=eyJ2IjoiMSJ9.FlVoEC01TZiBOjb343XDWkGWN-fyx0KKV5juLhKwi2Bj6xdVDP3tF9LveVg3R13jFDpQ1cJZapFxNIDevyYo8OjMvnETsnM6UbXnvRlgJacLojRGxihOjKPiTIAc9lpx.lMAXRlowKAezq_T2C-rVfO8Bnf3ldX2PQ2kSWVVezGM&dib_tag=se&keywords=VAROGANIC&nsdOptOutParam=true&qid=1758581149&sr=8-5',
    flipkartLink: 'https://dl.flipkart.com/s/g0PCTVuuuN',
    details: {
      tagline: 'Pure • Refreshing • Handmade with Love & Care',
      keyIngredients: [
        {
          name: 'Pure Rose Water',
          benefits: [
            'Refreshes and hydrates the skin instantly',
            'Tightens pores and tones the skin',
            'Reduces redness, irritation & inflammation',
            'Adds a natural glow and softness',
            'Helps balance skin pH levels',
          ],
        },
        {
          name: 'Vitamin E Blend',
          benefits: [
            'Nourishes and protects from dryness',
            'Provides antioxidant protection',
            'Enhances skin hydration and elasticity',
            'Promotes healthy, radiant skin',
          ],
        },
      ],
      benefits: [
        'Refreshes and hydrates the skin instantly',
        'Tightens pores and tones the skin',
        'Reduces redness, irritation & inflammation',
        'Adds a natural glow and softness',
        'Helps balance skin pH levels',
        'Vitamin E nourishes and protects from dryness',
        'Suitable for all skin types, even sensitive skin',
        'Can be used as toner, mist, or makeup prep spray',
      ],
      howToUse: [
        'As a Toner: Spray evenly on a clean face and let it absorb naturally',
        'As a Face Mist: Use anytime during the day to refresh and hydrate the skin',
        'As Makeup Prep: Mist before makeup for smooth application',
        'As Makeup Setting: Mist after makeup for a dewy finish',
        'For Hair: Lightly spray on hair to reduce frizz and add natural freshness',
        'Can be used multiple times throughout the day',
      ],
      whyChoose: [
        'Handmade with love & care',
        '100% natural and chemical-free',
        'No alcohol • No artificial fragrance',
        'Cruelty-free & eco-friendly',
        'Small-batch crafted for freshness',
        'Gentle, safe & effective',
        'Perfect for bridal skincare hampers & festive gifting',
      ],
    },
  },
  {
    id: 'shampoo-varo-herbs',
    name: 'Varoganic Varo Herbs Shampoo',
    category: 'Shampoo',
    description:
      'Give your hair the nourishment it truly deserves with Varoganic Varo Herbs Shampoo, a powerful Ayurvedic blend of Amla, Shikakai, Bhringraj, Brahmi, Jatamansi, Neem, Hibiscus, and 20+ herbal extracts. This natural formula gently cleanses the scalp, strengthens hair roots, improves texture, and promotes healthier, shinier, and more voluminous hair. For best results, pair it with Varoganic Kesh Vaidya Hair Oil.',
    suits: [],
    goals: [
      'Controls Dandruff',
      'Reduces Hair Fall',
      'Improves Hair Growth',
      'Tames Frizzy Hair',
      'Enhances Volume',
      'Adds Shine',
      'Strengthens Hair',
      'Chemical-Free',
    ],
    image: 'https://m.media-amazon.com/images/I/51irLAhWC7L.jpg',
    amazonLink: '',
    flipkartLink: 'https://www.flipkart.com/varoganic-shampoo1/p/itmd16bd65f65595?pid=SMPHBBBPA3AYKTNS&lid=LSTSMPHBBBPA3AYKTNS0G4ZV9&marketplace=FLIPKART&hl_lid=&q=Varoganic+&store=search.flipkart.com&_refId=&_appId=WA',
    details: {
      tagline: 'Handmade • Herbal • Chemical-Free • Made with Love & Care',
      keyIngredients: [
        {
          name: 'Amla',
          benefits: [
            'Strengthens hair roots',
            'Adds shine & reduces hair fall',
            'Prevents premature greying',
          ],
        },
        {
          name: 'Shikakai',
          benefits: [
            'Natural cleanser',
            'Reduces dryness and frizz',
            'Promotes soft, smooth hair',
          ],
        },
        {
          name: 'Bhringraj',
          benefits: [
            'Known as the "King of Herbs" for hair',
            'Boosts hair growth',
            'Reduces hair fall and thinning',
          ],
        },
        {
          name: 'Brahmi',
          benefits: [
            'Nourishes scalp',
            'Controls dandruff',
            'Improves hair thickness',
          ],
        },
        {
          name: 'Jatamansi',
          benefits: [
            'Strengthens hair follicles',
            'Helps reduce stress-related hair fall',
            'Promotes healthy growth',
          ],
        },
        {
          name: 'Neem',
          benefits: [
            'Powerful anti-dandruff herb',
            'Fights scalp infections',
            'Reduces irritation and itchiness',
          ],
        },
        {
          name: 'Hibiscus',
          benefits: [
            'Conditions and softens hair',
            'Enhances shine and volume',
            'Prevents breakage',
          ],
        },
        {
          name: '20+ Herbal Blend',
          benefits: [
            'Deep nourishment',
            'Improved texture and volume',
            'Supports strong, healthy, beautiful hair',
          ],
        },
      ],
      benefits: [
        'Controls dandruff with Neem & Brahmi',
        'Reduces hair fall with Bhringraj, Amla & Jatamansi',
        'Improves hair growth for faster, thicker, healthier hair',
        'Tames frizzy hair with Hibiscus & Shikakai',
        'Enhances hair texture & volume naturally',
        'Adds shine & softness with Hibiscus & Amla',
        'Strengthens from root to tip',
        'Suitable for all hair types, including damaged hair',
      ],
      howToUse: [
        'Pre-oil your scalp with Kesh Vaidya Hair Oil (5-6 hours or overnight)',
        'Take adequate amount of shampoo based on hair length',
        'Apply to scalp and hair, massage gently',
        'Leave shampoo for 1 minute in hair',
        'Rinse well using lukewarm or normal water',
        'Apply conditioner if needed',
      ],
      whyChoose: [
        'Handmade with Love – Not mass produced',
        '100% Natural & Chemical-Free',
        'Authentic Ayurvedic Formula',
        'Suitable for All Hair Types',
        'Boosts Hair Health from Root to Tip',
        'Perfect Pairing with Kesh Vaidya Hair Oil',
        'Ethically Made – Cruelty-free & eco-friendly',
      ],
    },
  },
  {
    id: 'oil-kesh-vaidya',
    name: 'Varoganic Kesh Vaidya Hair Oil',
    category: 'Oil',
    description:
      'Experience luxurious Ayurvedic nourishment with Varoganic Kesh Vaidya Hair Oil, a powerful blend of Olive Oil, Almond Oil, Hibiscus Oil, Lavender Oil, Coconut Oil, Flaxseed Oil, Neem Oil, and 25+ natural herbs including Amla, Bhringraj, and Jatamansi. This deeply nourishing oil strengthens hair from root to tip, promotes healthy growth, improves texture, and restores natural shine—without chemicals, artificial colours, or synthetic fragrances. For enhanced results, use it along with Varoganic Varo Herbs Shampoo.',
    suits: [],
    goals: [
      'Promotes Hair Growth',
      'Reduces Dandruff',
      'Improves Texture',
      'Increases Volume',
      'Controls Hair Fall',
      'Prevents Greying',
      'Nourishes Dry Hair',
      'Enhances Scalp Health',
    ],
    image: 'https://m.media-amazon.com/images/I/51irLAhWC7L.jpg',
    amazonLink: '',
    flipkartLink: 'https://www.flipkart.com/varoganic-kesh-vadya-hair-oil/p/itmc7f1be2591515?pid=HOLHY9FBBD4CX2FW&lid=LSTHOLHY9FBBD4CX2FWWJMWZ4&marketplace=FLIPKART&hl_lid=&q=Varoganic+&store=search.flipkart.com&_refId=&_appId=WA',
    details: {
      tagline: 'Handmade • Pure Herbal • Chemical-Free • Made with Love and Care',
      keyIngredients: [
        {
          name: 'Olive Oil',
          benefits: [
            'Deeply moisturizes hair',
            'Reduces breakage',
            'Adds shine and softness',
          ],
        },
        {
          name: 'Almond Oil',
          benefits: [
            'Rich in Vitamin E',
            'Strengthens roots',
            'Promotes thicker hair growth',
          ],
        },
        {
          name: 'Hibiscus Oil',
          benefits: [
            'Prevents breakage',
            'Improves hair texture',
            'Boosts natural shine',
          ],
        },
        {
          name: 'Lavender Oil',
          benefits: [
            'Calms the scalp',
            'Helps reduce hair fall',
            'Promotes relaxation',
          ],
        },
        {
          name: 'Coconut Oil',
          benefits: [
            'Deep conditioning',
            'Strengthens hair shaft',
            'Repairs damage and reduces frizz',
          ],
        },
        {
          name: 'Flaxseed Oil',
          benefits: [
            'Improves elasticity',
            'Adds smoothness',
            'Enhances hair volume',
          ],
        },
        {
          name: 'Neem Oil',
          benefits: [
            'Anti-dandruff and anti-fungal',
            'Reduces scalp infections',
            'Controls itchiness',
          ],
        },
        {
          name: 'Amla',
          benefits: [
            'Prevents premature greying',
            'Adds shine',
            'Boosts natural growth',
          ],
        },
        {
          name: 'Bhringraj',
          benefits: [
            'Known for stimulating hair growth',
            'Reduces hair thinning',
            'Strengthens follicles',
          ],
        },
        {
          name: 'Jatamansi',
          benefits: [
            'Reduces stress-related hair fall',
            'Boosts regeneration of new hair',
            'Strengthens roots',
          ],
        },
        {
          name: 'Blend of 20+ Herbs',
          benefits: [
            'Deeply nourishes scalp',
            'Improves volume',
            'Enhances texture and shine',
            'Promotes overall hair health',
          ],
        },
      ],
      benefits: [
        'Promotes faster and healthier hair growth',
        'Reduces dandruff & soothes itchy scalp',
        'Improves hair texture, softness & natural shine',
        'Increases volume and thickness',
        'Controls hair fall & strengthens hair roots',
        'Prevents premature greying',
        'Deeply nourishes dry, damaged and frizzy hair',
        'Calms scalp irritation and enhances scalp health',
      ],
      howToUse: [
        'Take a small amount of Kesh Vaidya Hair Oil',
        'Gently massage into scalp using fingertips for 5-7 minutes',
        'Leave it on for minimum 2 hours; overnight for best results',
        'Wash hair with Varo Herbs Shampoo for maximum benefits',
        'Use 2-3 times a week for visible improvement',
        'Regular use promotes long-term hair health',
      ],
      whyChoose: [
        '100% Natural Ingredients',
        'Handmade with Love & Care',
        'No Chemicals, Silicones, Parabens, Mineral Oils',
        'No Artificial Colour or Fragrance',
        'Natural Colour & Natural Aroma from Herbs',
        'Ayurvedic Formula Trusted for Generations',
        'Safe for all hair types—men, women & children',
      ],
    },
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
