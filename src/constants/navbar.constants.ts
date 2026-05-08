export const TESTIMONIALS = [
  {
    content:
      'I absolutely love the range of products on this website! The quality is unmatched, and my skin has never felt better. I always get compliments!',
    name: 'Nageshwar Pawar',
    role: 'Founder',
    image: '/images/company/teams/male/Nageshwar-Pawar.webp',
  },
  {
    content:
      'Finding the perfect shade was so easy. The product descriptions and customer reviews helped me make the right choice. Fast delivery too!',
    name: 'Manjusha Magar',
    role: 'Co-Founder',
    image: '/images/company/teams/female/Manjusha-Magar.webp',
  },
  {
    content:
      'I love how the products feel on my skin. They are lightweight, long-lasting, and make me feel confident all day. Highly recommended!',
    name: 'Deepika Padukone',
    role: 'CEO',
    image: '/images/company/teams/female/Deepika-Padukone.webp',
  },
] as const;

export const NAVBAR_TOP_LAYER_DATA = [
  { text: 'Refer a Friend', icon: 'lucide:hand-coins', path: '/refer', private: true },
  { text: 'Gift Card', icon: 'ic:round-card-giftcard', path: '/offers' },
  { text: 'BQ Care', icon: 'hugeicons:customer-service', path: '/contact' },
  {
    text: 'Track Orders',
    icon: 'material-symbols:monitor-heart-outline-rounded',
    path: '/track',
    private: true,
  },
] as const;

export const DUMMY_FEEDBACKS = [
  [
    { text: 'Great variety of lipsticks! Loved the', type: 'silver' },
    { text: 'shades', type: 'accent' },
    { text: 'and', type: 'silver' },
    { text: 'textures. Long-lasting', type: 'accent' },
    { text: 'and comfortable. Perfect for every occasion. Highly recommended!', type: 'silver' },
  ],
  [
    { text: 'Amazing', type: 'silver' },
    { text: 'pigmentation', type: 'accent' },
    { text: 'and', type: 'silver' },
    { text: 'smooth application.', type: 'accent' },
    { text: 'Stays on for hours without drying out lips. Definitely a', type: 'silver' },
    { text: 'must-have!', type: 'accent' },
    { text: 'Long-lasting and', type: 'silver' },
    { text: 'comfortable.', type: 'accent' },
  ],
  [
    { text: 'Beautiful', type: 'silver' },
    { text: 'shades', type: 'accent' },
    { text: 'and great', type: 'silver' },
    { text: 'texture!', type: 'accent' },
    { text: 'Perfect', type: 'silver' },
    { text: 'matte', type: 'accent' },
    { text: 'finish without feeling heavy. Love the', type: 'silver' },
    { text: 'Long-lasting', type: 'accent' },
    { text: 'effect! Amazing quality and', type: 'silver' },
    { text: 'pigmentation.', type: 'accent' },
  ],
  [
    { text: 'Excellent', type: 'silver' },
    { text: 'color payoff!', type: 'accent' },
    { text: 'Super', type: 'silver' },
    { text: 'comfortable', type: 'accent' },
    { text: 'to wear all day. My', type: 'silver' },
    { text: 'go-to face', type: 'accent' },
    {
      text: 'for every event. Worth every penny! Absolutely stunning luxurious.',
      type: 'silver',
    },
  ],
  [
    { text: 'Lovely', type: 'silver' },
    { text: 'shades', type: 'accent' },
    { text: 'with a', type: 'silver' },
    { text: 'creamy texture.', type: 'accent' },
    { text: 'No', type: 'silver' },
    { text: 'smudging', type: 'accent' },
    {
      text: 'and lasts all day. Received so many compliments. Absolutely love them! Truly fantastic.',
      type: 'silver',
    },
  ],

  [
    { text: 'The', type: 'silver' },
    { text: 'colors', type: 'accent' },
    { text: 'are vibrant and bold. Great for all', type: 'silver' },
    { text: 'skin tones.', type: 'accent' },
    { text: 'Stays', type: 'silver' },
    { text: 'intact', type: 'accent' },
    { text: 'and flawless', type: 'silver' },
    { text: 'even after meals. Highly recommended! Truly amazing.', type: 'silver' },
  ],
  [
    { text: 'Impressive', type: 'silver' },
    { text: 'quality', type: 'accent' },
    { text: 'and', type: 'silver' },
    { text: 'shade range.', type: 'accent' },
    { text: 'Glides', type: 'silver' },
    { text: 'so', type: 'silver' },
    { text: 'smoothly', type: 'accent' },
    {
      text: 'and feels so lightweight. Absolutely perfect for both daily wear and special occasions!',
      type: 'silver',
    },
  ],
] as const;

/* ================================ FOR YOU START ================================ */

export const NEW = {
  label: 'Latest Trends',
  category: 'latest_trends',
  path: '',
  subCategories: [
    {
      path: '',
      label: 'New Arrivals',
      category: '',
      description: 'Discover new beauty arrivals for a fresh, trendy style.',
    },
  ],
} as const;

export const SUGAR_COLLECTION = {
  label: "Beauty's Collection",
  category: 'beauty_collection',
  path: '',
  subCategories: [
    {
      label: 'Special Collection',
      path: '',
      category: '',
      description: 'Shop beauty products top-rated & loved by enthusiasts.',
    },
  ],
} as const;

export const OFFERS = {
  label: 'Offers',
  category: 'offers',
  path: '/offers',
  subCategories: [
    {
      label: 'Offers & Discounts',
      path: '/offers',
      category: '',
      description: 'Grab discounts on premium cosmetics for a limited time.',
    },
  ],
} as const;

export const BLOGS = {
  label: 'Blogs',
  category: 'blogs',
  path: '/blogs',
  description: '',
  subCategories: [
    {
      label: 'Beauty Insights',
      path: '/blogs',
      category: '',
      description: 'Explore top beauty tips, trends, and skincare routines.',
    },
  ],
} as const;

export const FOR_YOU_VIDEOS_DATA = [
  {
    video: '/videos/company/values-culture/Get-Ready-With-BQ.mp4',
    thumbnail: '/videos/company/values-culture/Get-Ready-With-BQ.png',
  },
  {
    video: '/videos/company/values-culture/Get-Ready-With-BQ.mp4',
    thumbnail: '/videos/company/values-culture/Get-Ready-With-BQ.png',
  },
  {
    video: '/videos/company/values-culture/Get-Ready-With-BQ.mp4',
    thumbnail: '/videos/company/values-culture/Get-Ready-With-BQ.png',
  },
  {
    video: '/videos/company/values-culture/Get-Ready-With-BQ.mp4',
    thumbnail: '/videos/company/values-culture/Get-Ready-With-BQ.png',
  },
];

export const FOR_YOU = {
  label: 'For You',
  category: 'for_you',
  path: '',
  subCategories: [NEW, SUGAR_COLLECTION, OFFERS, BLOGS],
} as const;

/* ================================ FOR YOU END ================================ */

/* ================================ ABOUT START ================================ */

export const COMPANY = {
  label: 'Company',
  category: 'company',
  subCategories: [
    {
      label: 'About Us',
      category: 'about_us',
      path: '/about-us',
      description: 'Learn about our journey, mission, and values that define our brand.',
    },
    {
      label: 'Mission Vision Values',
      category: 'mission_vision_values',
      path: '/mission-vision',
      description: "Discover our purpose, vision, and values driving our company's success.",
    },
    {
      label: 'Team',
      category: 'team',
      path: '/teams',
      description: 'Meet our talented team committed to delivering excellence every day.',
    },
    {
      label: 'Contact Us',
      category: 'contact_us',
      path: '/contact',
      description: 'Get in touch with us for inquiries, support, or collaboration opportunities.',
    },
  ],
} as const;

export const PRESS = {
  label: 'Press',
  category: 'press',
  subCategories: [
    {
      label: 'Newsroom',
      category: 'newsroom',
      path: '/press-media',
      description: 'Stay updated with our latest news, events, and media announcements.',
    },
    {
      label: 'Awards',
      category: 'awards',
      path: '/awards',
      description: 'Explore the recognitions and awards we have received for excellence.',
    },
  ],
} as const;

export const CAREERS = {
  label: 'Careers',
  category: 'careers',
  subCategories: [
    {
      label: 'Values/Culture',
      category: 'values_culture',
      path: '/values-and-culture',
      description: 'Experience our vibrant culture driven by values of growth and innovation.',
    },
    {
      label: 'Openings',
      category: 'openings',
      path: '/careers',
      description: 'Discover exciting career opportunities and join our dynamic team today.',
    },
    {
      label: 'Retail/E-Commerce',
      category: 'retail_e_commerce',
      path: '/retail-and-e-commerce',
      description: 'Explore roles in retail and e-commerce driving our digital success.',
    },
  ],
} as const;

export const TRUST_CENTER = {
  label: 'Trust Center & Legal',
  category: 'trust_center_and_legal',
  subCategories: [
    {
      label: 'Compliance',
      category: 'compliance',
      path: '/cookie-policy',
      description: 'Understand our compliance standards ensuring trust and transparency.',
    },
    {
      label: 'Privacy/Policy',
      category: 'privacy_policy',
      path: '/privacy-policy',
      description: 'Learn about our privacy practices and data protection commitments.',
    },
    {
      label: 'Terms & Conditions',
      category: 'terms_and_conditions',
      path: '/terms-conditions',
      description: 'Review our terms and conditions for using our products and services.',
    },
  ],
} as const;

export const ABOUT = {
  label: 'About',
  category: 'about',
  path: '/about',
  subCategories: [COMPANY, CAREERS, PRESS, TRUST_CENTER],
} as const;

/* ================================ ABOUT END ================================ */

/* ================================ COLLECTIONS START ================================ */

const basePath = '/products/collections';

export const BATH_AND_BODY = {
  label: 'Bath & Body',
  category: 'bath_and_body',
  path: `${basePath}/bath_and_body`,
  subCategories: [
    {
      label: 'Shower Gel',
      category: 'shower_gel',
      path: `${basePath}/bath_and_body/shower_gel`,
      description: 'Refreshing shower gel that cleanses and hydrates for soft skin.',
    },
    {
      label: 'Soap',
      category: 'soap',
      path: `${basePath}/bath_and_body/soap`,
      description: 'Gentle soap for daily cleansing, leaving skin fresh and nourished.',
    },
    {
      label: 'Body Lotion',
      category: 'body_lotion',
      path: `${basePath}/bath_and_body/body_lotion`,
      description: 'Moisturizing body lotion that keeps skin smooth and hydrated all day.',
    },
    {
      label: 'Body Spray',
      category: 'body_spray',
      path: `${basePath}/bath_and_body/body_spray`,
      description: 'Light body spray with a refreshing fragrance for all-day freshness.',
    },
    {
      label: 'Hand Wash',
      category: 'hand_wash',
      path: `${basePath}/bath_and_body/hand_wash`,
      description: 'Cleansing hand wash that leaves hands soft and hygienically clean.',
    },
    {
      label: 'Foot Cream',
      category: 'foot_cream',
      path: `${basePath}/bath_and_body/foot_cream`,
      description: 'Nourishing foot cream that soothes and softens tired, dry feet.',
    },
    {
      label: 'Hand Cream',
      category: 'hand_cream',
      path: `${basePath}/bath_and_body/hand_cream`,
      description: 'Hydrating hand cream for soft, smooth hands with lasting moisture.',
    },
  ],
} as const;

export const SUGAR_POP = {
  label: 'Sugar Pop',
  category: 'sugar_pop',
  path: `${basePath}/sugar_pop`,
  subCategories: [
    {
      label: 'Lips',
      category: 'lips',
      path: `${basePath}/sugar_pop/lips`,
      description: 'Lip products for bold, vibrant color and deep nourishing moisture.',
    },
    {
      label: 'Eyes',
      category: 'eyes',
      path: `${basePath}/sugar_pop/eyes`,
      description: 'Eye makeup essentials for creating stunning looks that last all day.',
    },
    {
      label: 'Face',
      category: 'face',
      path: `${basePath}/sugar_pop/face`,
      description: 'Face products to enhance complexion with flawless coverage.',
    },
    {
      label: 'Nails',
      category: 'nails',
      path: `${basePath}/sugar_pop/nails`,
      description: 'Vibrant nail colors and effective treatments for stylish, healthy nails.',
    },
    {
      label: 'Skincare',
      category: 'skincare',
      path: `${basePath}/sugar_pop/skincare`,
      description: 'Skincare essentials for a radiant, nourished, and clear complexion.',
    },
    {
      label: 'Body Care',
      category: 'body_care',
      path: `${basePath}/sugar_pop/body_care`,
      description: 'Body care products for soft, smooth skin with lasting hydration.',
    },
    {
      label: 'Best of Sugar Pop',
      category: 'best_of_sugar_pop',
      path: `${basePath}/sugar_pop/best_of_sugar_pop`,
      description: 'Top-rated Sugar Pop products loved for their quality and results.',
    },
  ],
} as const;

export const HAIR_CARE = {
  label: 'Hair Care',
  category: 'hair_care',
  path: `${basePath}/hair_care`,
  subCategories: [
    {
      label: 'Shampoo',
      category: 'shampoo',
      path: `${basePath}/hair_care/shampoo`,
      description: 'Cleansing shampoo that effectively revitalizes hair for healthy shine.',
    },
    {
      label: 'Conditioner',
      category: 'conditioner',
      path: `${basePath}/hair_care/conditioner`,
      description: 'Nourishing conditioner that detangles and softens hair beautifully.',
    },
    {
      label: 'Hair Oil',
      category: 'hair_oil',
      path: `${basePath}/hair_care/hair_oil`,
      description: 'Hair oil that deeply nourishes hair for strong, shiny, healthy hair.',
    },
    {
      label: 'Serum',
      category: 'serum',
      path: `${basePath}/hair_care/serum`,
      description: 'Lightweight hair serum for frizz control and a silky, smooth finish.',
    },
    {
      label: 'Hair Mask',
      category: 'hair_mask',
      path: `${basePath}/hair_care/hair_mask`,
      description: 'Deep conditioning hair mask for intense repair and hydration.',
    },
    {
      label: 'Combo',
      category: 'combo',
      path: `${basePath}/hair_care/combo`,
      description: 'Value packs of hair care products for a complete hair routine.',
    },
  ],
} as const;

export const GIFTING = {
  label: 'Gifting',
  category: 'gifting',
  path: `${basePath}/gifting`,
  subCategories: [
    {
      label: 'Lipstick Set',
      category: 'lipstick_set',
      path: `${basePath}/gifting/lipstick_set`,
      description: 'Beautiful lipstick sets perfect for gifting on any special occasion.',
    },
    {
      label: 'Sugar Merch',
      category: 'sugar_merch',
      path: `${basePath}/gifting/sugar_merch`,
      description: 'Trendy Sugar-branded merchandise for fans and beauty lovers.',
    },
    {
      label: 'Value Set',
      category: 'value_set',
      path: `${basePath}/gifting/value_set`,
      description: 'Curated value sets for a complete beauty experience and savings.',
    },
    {
      label: 'Makeup Kit',
      category: 'makeup_kit',
      path: `${basePath}/gifting/makeup_kit`,
      description: 'Comprehensive makeup kits with essentials for a flawless look.',
    },
    {
      label: 'Corporate Gifting',
      category: 'corporate_gifting',
      path: `${basePath}/gifting/corporate_gifting`,
      description: 'Elegant corporate gifts to leave a lasting impression with style.',
    },
    {
      label: 'Sugar Set',
      category: 'sugar_set',
      path: `${basePath}/gifting/sugar_set`,
      description: 'Exclusive Sugar sets curated for beauty enthusiasts and gifting.',
    },
  ],
} as const;

export const COLLECTIONS = {
  label: 'Collections',
  category: 'collections',
  path: '/products/collections',
  subCategories: [BATH_AND_BODY, SUGAR_POP, HAIR_CARE, GIFTING],
} as const;

/* ================================ COLLECTIONS START ================================ */

/* ================================ SKIN START ================================ */

export const MOISTURIZERS = {
  label: 'Moisturizers',
  category: 'moisturizers',
  path: `/products/skin/moisturizers`,
  subCategories: [
    {
      label: 'Night Cream',
      category: 'night_cream',
      path: `/products/skin/moisturizers/night_cream`,
      description: 'Deeply hydrates and repairs tired skin while you sleep.',
    },
    {
      label: 'Eye Cream',
      category: 'eye_cream',
      path: `/products/skin/moisturizers/eye_cream`,
      description: 'Reduces puffiness, dark circles, and fine lines quickly.',
    },
    {
      label: 'Serum',
      category: 'serum',
      path: `/products/skin/moisturizers/serum`,
      description: 'Nourishes skin with essential vitamins for a radiant glow.',
    },
    {
      label: 'Skincare Kit',
      category: 'skincare_kit',
      path: `/products/skin/moisturizers/skincare_kit`,
      description: 'Complete care sets for all skin types and beauty concerns.',
    },
  ],
} as const;

export const CLEANSING_AND_EXFOLIATION = {
  label: 'Cleansing & Exfoliation',
  category: 'cleansing_and_exfoliation',
  path: `/products/skin/cleansing_and_exfoliation`,
  subCategories: [
    {
      label: 'Cleanser',
      category: 'cleanser',
      path: `/products/skin/cleansing_and_exfoliation/cleanser`,
      description: 'Gently removes dirt, excess oil, and makeup for clean skin.',
    },
    {
      label: 'Face Wash',
      category: 'face_wash',
      path: `/products/skin/cleansing_and_exfoliation/face_wash`,
      description: 'Refreshing daily wash for soft and healthy-looking skin tone.',
    },
    {
      label: 'Exfoliator & Scrub',
      category: 'exfoliator_and_scrub',
      path: `/products/skin/cleansing_and_exfoliation/exfoliator_and_scrub`,
      description: 'Removes dead skin cells to reveal a fresh and smooth glow.',
    },
    {
      label: 'Sunscreen',
      category: 'sunscreen',
      path: `/products/skin/cleansing_and_exfoliation/sunscreen`,
      description: 'Shields skin from harmful UV rays and sun damage daily.',
    },
  ],
} as const;

export const NATURES_BLEND = {
  label: "Nature's Blend",
  category: 'natures_blend',
  path: `/products/skin/natures_blend`,
  subCategories: [
    {
      label: 'Aquaholic',
      category: 'aquaholic',
      path: `/products/skin/natures_blend/aquaholic`,
      description: 'Hydration-rich formulas to deeply quench dry, dull skin.',
    },
    {
      label: 'Coffee Culture',
      category: 'coffee_culture',
      path: `/products/skin/natures_blend/coffee_culture`,
      description: 'Energizing coffee extracts for a firm, smooth, youthful feel.',
    },
    {
      label: 'Citrus Got Real',
      category: 'citrus_got_real',
      path: `/products/skin/natures_blend/citrus_got_real`,
      description: 'Vitamin C boost for brighter, fresher, healthier-looking skin.',
    },
  ],
} as const;

export const FACE_MASK = {
  label: 'Face Mask',
  category: 'face_mask',
  path: `/products/skin/face_mask`,
  subCategories: [
    {
      label: 'Sheet Mask',
      category: 'sheet_mask',
      path: `/products/skin/face_mask/sheet_mask`,
      description: 'Instant hydration and glowing effect in just a few minutes.',
    },
    {
      label: 'Face Pack',
      category: 'face_pack',
      path: `/products/skin/face_mask/face_pack`,
      description: 'Detox and refresh your skin naturally with herbal extracts.',
    },
  ],
} as const;

export const SKIN = {
  label: 'Skin',
  category: 'skin',
  path: '/products/skin',
  subCategories: [MOISTURIZERS, CLEANSING_AND_EXFOLIATION, NATURES_BLEND, FACE_MASK],
} as const;

/* ================================ SKIN END ================================ */

/* ================================ FACE START ================================ */

export const FACE_MAKEUP = {
  label: 'Face Makeup',
  category: 'face_makeup',
  path: `/products/face/face_makeup`,
  subCategories: [
    {
      label: 'Foundation',
      category: 'foundation',
      path: `/products/face/face_makeup/foundation`,
      description: 'Provides coverage for a flawless base with a natural, smooth finish.',
    },
    {
      label: 'BB Cream',
      category: 'bb_cream',
      path: `/products/face/face_makeup/bb_cream`,
      description: 'Lightweight formula that hydrates, evens skin tone, and protects skin.',
    },
    {
      label: 'Compact Powder',
      category: 'compact_powder',
      path: `/products/face/face_makeup/compact_powder`,
      description: 'Sets makeup, reduces shine, and ensures a long-lasting matte finish.',
    },
    {
      label: 'Loose Powder',
      category: 'loose_powder',
      path: `/products/face/face_makeup/loose_powder`,
      description: 'Finely milled powder for a smooth, shine-free finish that lasts all day.',
    },
    {
      label: 'Banana Powder',
      category: 'banana_powder',
      path: `/products/face/face_makeup/banana_powder`,
      description: 'Brightens the complexion, reduces shine, and sets makeup beautifully.',
    },
    {
      label: 'SPF Foundation',
      category: 'spf_foundation',
      path: `/products/face/face_makeup/spf_foundation`,
      description: 'Combines sun protection, coverage for a flawless, radiant look.',
    },
  ],
} as const;

export const TRADITIONAL_AND_ESSENTIALS = {
  label: 'Traditional & Essentials',
  category: 'traditional_and_essentials',
  path: `/products/face/traditional_and_essentials`,
  subCategories: [
    {
      label: 'Sindoor',
      category: 'sindoor',
      path: `/products/face/traditional_and_essentials/sindoor`,
      description: 'Symbolic powder for the hairline, enhancing traditional elegance.',
    },
  ],
} as const;

export const CHEEKS_AND_GLOW = {
  label: 'Cheeks & Glow',
  category: 'cheeks_and_glow',
  path: `/products/face/cheeks_and_glow`,
  subCategories: [
    {
      label: 'Highlighter',
      category: 'highlighter',
      path: `/products/face/cheeks_and_glow/highlighter`,
      description: 'Adds a radiant, enhancing features with a luminous, dewy look.',
    },
    {
      label: 'Liquid Highlighter',
      category: 'liquid_highlighter',
      path: `/products/face/cheeks_and_glow/liquid_highlighter`,
      description: 'Blendable liquid formula for a glowing, buildable, natural look.',
    },
    {
      label: 'Blush',
      category: 'blush',
      path: `/products/face/cheeks_and_glow/blush`,
      description: 'Adds a pop of color to cheeks, creating a youthful, healthy look.',
    },
    {
      label: 'Cheek Stain',
      category: 'cheek_stain',
      path: `/products/face/cheeks_and_glow/cheek_stain`,
      description: 'Long-lasting tint for a natural, flushed look that stays vibrant.',
    },
  ],
} as const;

export const SETTING_AND_FINISHING = {
  label: 'Setting & Finishing',
  category: 'setting_and_finishing',
  path: `/products/face/setting_and_finishing`,
  subCategories: [
    {
      label: 'Setting Spray',
      category: 'setting_spray',
      path: `/products/face/setting_and_finishing/setting_spray`,
      description: 'Locks makeup for long wear, maintaining a fresh look without.',
    },
    {
      label: 'Compact',
      category: 'compact',
      path: `/products/face/setting_and_finishing/compact`,
      description: 'Portable powder for touch-ups, controls shine, sets makeup place.',
    },
    {
      label: 'Fixer',
      category: 'fixer',
      path: `/products/face/setting_and_finishing/fixer`,
      description: 'Enhances makeup longevity, ensuring a smudge-proof, flawless.',
    },
  ],
} as const;

export const FOUNDATIONS_BY_FINISH = {
  label: 'Foundations by Finish',
  category: 'foundations_by_finish',
  path: `/products/face/foundations_by_finish`,
  subCategories: [
    {
      label: 'Liquid Foundation',
      category: 'liquid_foundation',
      path: `/products/face/foundations_by_finish/liquid_foundation`,
      description: 'Buildable coverage with a natural finish that blends seamlessly skin.',
    },
    {
      label: 'Matte Foundation',
      category: 'matte_foundation',
      path: `/products/face/foundations_by_finish/matte_foundation`,
      description: 'Oil-absorbing formula for a shine-free, velvety matte look lasts.',
    },
    {
      label: 'Water Resistant Foundation',
      category: 'water_resistant_foundation',
      path: `/products/face/foundations_by_finish/water_resistant_foundation`,
      description: 'Long-wearing, water-resistant foundation that stays flawless day.',
    },
    {
      label: 'High Coverage Foundation',
      category: 'high_coverage_foundation',
      path: `/products/face/foundations_by_finish/high_coverage_foundation`,
      description: 'Conceals imperfections with full coverage, ensuring flawless look.',
    },
    {
      label: 'Stick Foundation',
      category: 'stick_foundation',
      path: `/products/face/foundations_by_finish/stick_foundation`,
      description: 'Convenient stick format for easy application and buildable coverage.',
    },
  ],
} as const;

export const FOUNDATIONS_BY_SKIN_TYPE = {
  label: 'Foundations by Skin Type',
  category: 'foundations_by_skin_type',
  path: `/products/face/foundations_by_skin_type`,
  subCategories: [
    {
      label: 'Best for Dry Skin',
      category: 'best_for_dry_skin',
      path: `/products/face/foundations_by_skin_type/best_for_dry_skin`,
      description: 'Hydrating formula that nourishes and enhances radiance for dry skin.',
    },
    {
      label: 'Best for Oily Skin',
      category: 'best_for_oily_skin',
      path: `/products/face/foundations_by_skin_type/best_for_oily_skin`,
      description: 'Oil-controlling foundation that reduces shine, prevents breakouts.',
    },
  ],
} as const;

export const PRIMERS_AND_REMOVERS = {
  label: 'Primers & Removers',
  category: 'primers_and_removers',
  path: `/products/face/primers_and_removers`,
  subCategories: [
    {
      label: 'Makeup Remover',
      category: 'makeup_remover',
      path: `/products/face/primers_and_removers/makeup_remover`,
      description: 'Gently removes makeup while hydrating and refreshing the skin.',
    },
    {
      label: 'Primer',
      category: 'primer',
      path: `/products/face/primers_and_removers/primer`,
      description: 'Prepares skin, creating a smooth base for long-lasting makeup.',
    },
  ],
} as const;

export const BRONZERS_AND_CONTOURS = {
  label: 'Bronzers & Contours',
  category: 'bronzers_and_contours',
  path: `/products/face/bronzers_and_contours`,
  subCategories: [
    {
      label: 'Bronzer',
      category: 'bronzer',
      path: `/products/face/bronzers_and_contours/bronzer`,
      description: 'Adds warmth and a sun-kissed glow for a radiant complexion.',
    },
    {
      label: 'Contour',
      category: 'contour',
      path: `/products/face/bronzers_and_contours/contour`,
      description: 'Defines features with shadows, enhancing structure and depth.',
    },
  ],
} as const;

export const CONCEALERS_AND_CORRECTORS = {
  label: 'Concealers & Correctors',
  category: 'concealers_and_correctors',
  path: `/products/face/concealers_and_correctors`,
  subCategories: [
    {
      label: 'Color Concealer',
      category: 'color_concealer',
      path: `/products/face/concealers_and_correctors/color_concealer`,
      description: 'It covers flaws with precision, delivering a flawless, airbrushed.',
    },
    {
      label: 'Color Corrector',
      category: 'color_corrector',
      path: `/products/face/concealers_and_correctors/color_corrector`,
      description: 'Neutralizes discoloration, balancing skin tone for a radiant finish.',
    },
  ],
} as const;

export const FACE = {
  label: 'Face',
  category: 'face',
  path: '/products/face',
  subCategories: [
    FACE_MAKEUP,
    TRADITIONAL_AND_ESSENTIALS,
    CHEEKS_AND_GLOW,
    SETTING_AND_FINISHING,
    PRIMERS_AND_REMOVERS,
    BRONZERS_AND_CONTOURS,
    CONCEALERS_AND_CORRECTORS,
    FOUNDATIONS_BY_SKIN_TYPE,
    FOUNDATIONS_BY_FINISH,
  ],
} as const;

/* ================================ FACE END ================================ */

/* ================================ EYES START ================================ */

export const KOHL_AND_KAJAL = {
  label: 'Kohl & Kajal',
  category: 'kohl_and_kajal',
  path: `/products/eyes/kohl_and_kajal`,
  subCategories: [
    {
      label: 'Kohl',
      category: 'kohl',
      path: `/products/eyes/kohl_and_kajal/kohl`,
      description: 'Intensely pigmented kohls for bold, long-lasting eye definition all day.',
    },
    {
      label: 'Kajal',
      category: 'kajal',
      path: `/products/eyes/kohl_and_kajal/kajal`,
      description: 'Smooth kajals for a dramatic look, perfect for waterline application.',
    },
    {
      label: 'Smudge Proof Kajal',
      category: 'smudge_proof_kajal',
      path: `/products/eyes/kohl_and_kajal/smudge_proof_kajal`,
      description: 'Long-lasting, smudge-proof kajal for sharp, defined eyes all day long.',
    },
  ],
} as const;

export const MASCARAS = {
  label: 'Mascaras',
  category: 'mascaras',
  path: `/products/eyes/mascaras`,
  subCategories: [
    {
      label: 'Volumizing Mascara',
      category: 'volumizing_mascara',
      path: `/products/eyes/mascaras/volumizing_mascara`,
      description: 'Boosts lash volume for a fuller, more dramatic look with each coat.',
    },
    {
      label: 'Curl Lengthening Mascara',
      category: 'curl_lengthening_mascara',
      path: `/products/eyes/mascaras/curl_lengthening_mascara`,
      description: 'Lifts and curls lashes for a wide-eyed look with added length and volume.',
    },
    {
      label: 'Waterproof Mascara',
      category: 'waterproof_mascara',
      path: `/products/eyes/mascaras/waterproof_mascara`,
      description: 'Water-resistant formula for long-lasting wear without smudging or flaking.',
    },
  ],
} as const;

export const EYELINERS = {
  label: 'Eyeliners',
  category: 'eyeliners',
  path: `/products/eyes/eyeliners`,
  subCategories: [
    {
      label: 'Liquid Eyeliner',
      category: 'liquid_eyeliner',
      path: `/products/eyes/eyeliners/liquid_eyeliner`,
      description: 'Precision tip for sharp lines, perfect for bold cat-eye or winged looks.',
    },
    {
      label: 'Gel Eyeliner',
      category: 'gel_eyeliner',
      path: `/products/eyes/eyeliners/gel_eyeliner`,
      description: 'Creamy, blendable gel eyeliner for versatile looks, from bold to subtle.',
    },
    {
      label: 'Pen Eyeliner',
      category: 'pen_eyeliner',
      path: `/products/eyes/eyeliners/pen_eyeliner`,
      description: 'Easy-to-use pen for precise lines, ideal for beginners and quick touch-ups.',
    },
  ],
} as const;

export const EYESHADOW = {
  label: 'Eyeshadow',
  category: 'eyeshadow',
  path: `/products/eyes/eyeshadow`,
  subCategories: [
    {
      label: 'Eyeshadow Palette',
      category: 'eyeshadow_palette',
      path: `/products/eyes/eyeshadow/eyeshadow_palette`,
      description: 'Versatile palettes with coordinated shades for endless eye makeup looks.',
    },
    {
      label: 'Liquid Eyeshadow',
      category: 'liquid_eyeshadow',
      path: `/products/eyes/eyeshadow/liquid_eyeshadow`,
      description: 'High-pigment liquid shadows for easy application and long-lasting shimmer.',
    },
    {
      label: 'Glitter Eyeshadow',
      category: 'glitter_eyeshadow',
      path: `/products/eyes/eyeshadow/glitter_eyeshadow`,
      description: 'Sparkling glitter shadows for a bold, glamorous look on special occasions.',
    },
  ],
} as const;

export const EYEBROWS = {
  label: 'Eyebrows',
  category: 'eyebrows',
  path: `/products/eyes/eyebrows`,
  subCategories: [
    {
      label: 'Brow Definer',
      category: 'brow_definer',
      path: `/products/eyes/eyebrows/brow_definer`,
      description: 'Defines brows with precision for a well-groomed and polished appearance.',
    },
    {
      label: 'Brow Pencil',
      category: 'brow_pencil',
      path: `/products/eyes/eyebrows/brow_pencil`,
      description: 'Easy-to-use pencil for filling and shaping brows with natural-looking color.',
    },
    {
      label: 'Brow Gel',
      category: 'brow_gel',
      path: `/products/eyes/eyebrows/brow_gel`,
      description: 'Sets and tames brows, providing a long-lasting hold with a natural finish.',
    },
  ],
} as const;

export const EYE_VALUE_SET = {
  label: 'Eye Value Set',
  category: 'eye_value_set',
  path: `/products/eyes/eye_value_set`,
  subCategories: [
    {
      label: 'Eyelashes',
      category: 'eyelashes',
      path: `/products/eyes/eye_value_set/eyelashes`,
      description: 'Enhance your eyes with faux lashes for added volume and captivating charm.',
    },
    {
      label: 'Eye Gift Set',
      category: 'eye_gift_set',
      path: `/products/eyes/eye_value_set/eye_gift_set`,
      description: "Perfect gift sets featuring popular eye products for makeup lovers' delight.",
    },
    {
      label: 'Eye Combo',
      category: 'eye_combo',
      path: `/products/eyes/eye_value_set/eye_combo`,
      description: 'Convenient sets with eye essentials for a complete, coordinated eye look.',
    },
  ],
} as const;

export const EYES = {
  label: 'Eyes',
  category: 'eyes',
  path: '/products/eyes',
  subCategories: [KOHL_AND_KAJAL, MASCARAS, EYELINERS, EYESHADOW, EYEBROWS, EYE_VALUE_SET],
} as const;

/* ================================ EYES END ================================ */

/* ================================ LIPS START ================================ */

export const FINISH_TYPES = {
  label: 'Finish Types',
  category: 'finish_types',
  path: `/products/lips/finish_types`,
  subCategories: [
    {
      label: 'Matte Lipstick',
      category: 'matte_lipstick',
      path: `/products/lips/finish_types/matte_lipstick`,
      description: 'Velvety matte finish with long-lasting, intense color payoff everywhere.',
    },
    {
      label: 'Satin Lipstick',
      category: 'satin_lipstick',
      path: `/products/lips/finish_types/satin_lipstick`,
      description: 'Smooth, creamy texture with a luminous, semi-matte finish always.',
    },
    {
      label: 'Hi-Shine Lipstick',
      category: 'hi_shine_lipstick',
      path: `/products/lips/finish_types/hi_shine_lipstick`,
      description: 'Glossy finish for a shiny, luscious look with rich pigment beautifully.',
    },
    {
      label: 'Lip Gloss',
      category: 'lip_gloss',
      path: `/products/lips/finish_types/lip_gloss`,
      description: 'Sheer to medium coverage with a high-shine, glossy finish flawlessly.',
    },
  ],
} as const;

export const LIPSTICK_FORMS = {
  label: 'Lipstick Forms',
  category: 'lipstick_forms',
  path: `/products/lips/lipstick_forms`,
  subCategories: [
    {
      label: 'Liquid Lipstick',
      category: 'liquid_lipstick',
      path: `/products/lips/lipstick_forms/liquid_lipstick`,
      description: 'Rich, long-lasting color with a lightweight, matte finish beautifully.',
    },
    {
      label: 'Powder Lipstick',
      category: 'powder_lipstick',
      path: `/products/lips/lipstick_forms/powder_lipstick`,
      description: 'Weightless powder formula with a soft-focus, matte effect perfectly.',
    },
    {
      label: 'Crayon Lipstick',
      category: 'crayon_lipstick',
      path: `/products/lips/lipstick_forms/crayon_lipstick`,
      description: 'Easy-to-apply crayon for precise lines and bold color payoff smoothly.',
    },
    {
      label: 'Bullet Lipstick',
      category: 'bullet_lipstick',
      path: `/products/lips/lipstick_forms/bullet_lipstick`,
      description: 'Classic bullet shape with smooth, creamy, full-coverage color always.',
    },
  ],
} as const;

export const LONG_LASTING_LIPSTICKS = {
  label: 'Long-Lasting Lipsticks',
  category: 'long_lasting_lipsticks',
  path: `/products/lips/long_lasting_lipsticks`,
  subCategories: [
    {
      label: 'Transfer Proof Lipstick',
      category: 'transfer_proof_lipstick',
      path: `/products/lips/long_lasting_lipsticks/transfer_proof_lipstick`,
      description: 'Stays put all day without smudging or fading for long-lasting wear.',
    },
    {
      label: 'Water Proof Lipstick',
      category: 'water_proof_lipstick',
      path: `/products/lips/long_lasting_lipsticks/water_proof_lipstick`,
      description: 'Resistant to water and sweat, ensuring color stays vibrant always.',
    },
    {
      label: 'Lip Tint & Stain',
      category: 'lip_tint_and_stain',
      path: `/products/lips/long_lasting_lipsticks/lip_tint_and_stain`,
      description: 'Lightweight tint with a natural finish that lasts for hours smoothly.',
    },
    {
      label: 'Smudge Proof',
      category: 'smudge_proof_lipstick',
      path: `/products/lips/long_lasting_lipsticks/smudge_proof_lipstick`,
      description: 'No smudging or transferring, providing a flawless look perfectly.',
    },
  ],
} as const;

export const LIP_CARE = {
  label: 'Lip Care',
  category: 'lip_care',
  path: `/products/lips/lip_care`,
  subCategories: [
    {
      label: 'Lip Primer & Scrub',
      category: 'lip_primer_and_scrub',
      path: `/products/lips/lip_care/lip_primer_and_scrub`,
      description: 'Preps lips for smooth application and enhances color beautifully.',
    },
    {
      label: 'Lipstick Fixer & Remover',
      category: 'lipstick_fixer_and_remover',
      path: `/products/lips/lip_care/lipstick_fixer_and_remover`,
      description: 'Ensures long wear and easy removal without residue effortlessly.',
    },
    {
      label: 'Lip Balm',
      category: 'lip_balm',
      path: `/products/lips/lip_care/lip_balm`,
      description: 'Deeply hydrates and protects lips from dryness and cracking.',
    },
    {
      label: 'Tinted Lip Balm',
      category: 'tinted_lip_balm',
      path: `/products/lips/lip_care/tinted_lip_balm`,
      description: 'Hydration with a hint of color for a natural, radiant look daily.',
    },
  ],
} as const;

export const LIP_ENHANCERS_AND_OTHER = {
  label: 'Lip Enhancers & Other',
  category: 'lip_enhancers_and_other',
  path: `/products/lips/lip_enhancers_and_other`,
  subCategories: [
    {
      label: 'Lip Liner',
      category: 'lip_liner',
      path: `/products/lips/lip_enhancers_and_other/lip_liner`,
      description: 'Defines lips with precision, shaping and preventing feathering daily.',
    },
    {
      label: 'Lip Glitter',
      category: 'lip_glitter',
      path: `/products/lips/lip_enhancers_and_other/lip_glitter`,
      description: 'Adds sparkle and shine for a glamorous, bold look on special occasions.',
    },
  ],
} as const;

export const LIPSTICK_SETS_AND_COMBOS = {
  label: 'Lipstick Set & Combo',
  category: 'lipstick_set_and_combo',
  path: `/products/lips/lipstick_set_and_combo`,
  subCategories: [
    {
      label: 'Lipstick Set',
      category: 'lipstick_set',
      path: `/products/lips/lipstick_set_and_combo/lipstick_set`,
      description: 'Multiple shades in one set for versatile, everyday looks beautifully.',
    },
    {
      label: 'Lipstick Combo',
      category: 'lipstick_combo',
      path: `/products/lips/lipstick_set_and_combo/lipstick_combo`,
      description: 'Perfectly paired lip products for a complete, cohesive look always.',
    },
    {
      label: 'Lip Palette',
      category: 'lip_palette',
      path: `/products/lips/lipstick_set_and_combo/lip_palette`,
      description: 'Versatile palette with various shades for creative, bold looks daily.',
    },
  ],
} as const;

export const LIPS = {
  label: 'Lips',
  category: 'lips',
  path: '/products/lips',
  subCategories: [
    FINISH_TYPES,
    LIPSTICK_FORMS,
    LONG_LASTING_LIPSTICKS,
    LIP_CARE,
    LIP_ENHANCERS_AND_OTHER,
    LIPSTICK_SETS_AND_COMBOS,
  ],
} as const;

/* ================================ LIPS END ================================ */

export const NAVBAR_CATEGORIES_DATA = [
  FOR_YOU,
  LIPS,
  EYES,
  FACE,
  SKIN,
  COLLECTIONS,
  ABOUT,
] as const;
