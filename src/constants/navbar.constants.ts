import type { ICategory, TCategory } from '@/types/api.type';

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

export const NEW: TCategory<2> = {
  _id: 'latest_trends',
  name: 'Latest Trends',
  slug: 'latest_trends',
  level: 2,
  parent: 'for_you',
  subcategories: [
    {
      _id: 'new_arrivals',
      name: 'New Arrivals',
      slug: 'new_arrivals',
      level: 3,
      parent: 'new',
      description: 'Discover new beauty arrivals for a fresh, trendy style.',
    },
  ],
} as const;

export const SUGAR_COLLECTION: TCategory<2> = {
  _id: 'sugar_collection',
  name: "Beauty's Collection",
  slug: 'beauty_collection',
  level: 2,
  parent: 'for_you',
  subcategories: [
    {
      _id: 'special_collection',
      name: 'Special Collection',
      level: 3,
      parent: 'sugar_collection',
      slug: 'special_collection',
      description: 'Shop beauty products top-rated & loved by enthusiasts.',
    },
  ],
} as const;

export const OFFERS: TCategory<2> = {
  _id: 'offers',
  name: 'Offers',
  slug: 'offers',
  level: 2,
  parent: 'for_you',
  subcategories: [
    {
      _id: 'offers_and_discounts',
      name: 'Offers & Discounts',
      slug: 'offers_and_discounts',
      level: 3,
      parent: 'offers',
      description: 'Grab discounts on premium cosmetics for a limited time.',
    },
  ],
} as const;

export const BLOGS: TCategory<2> = {
  _id: 'blogs',
  name: 'Blogs',
  slug: 'blogs',
  level: 2,
  parent: 'for_you',
  subcategories: [
    {
      _id: 'beauty_insights',
      name: 'Beauty Insights',
      slug: 'beauty_insights',
      level: 3,
      parent: 'blogs',
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

export const FOR_YOU: ICategory = {
  _id: 'for_you',
  name: 'For You',
  slug: 'for_you',
  level: 1,
  subcategories: [NEW, SUGAR_COLLECTION, OFFERS, BLOGS],
} as const;

/* ================================ FOR YOU END ================================ */

/* ================================ ABOUT START ================================ */

export const COMPANY = {
  name: 'Company',
  slug: 'company',
  subcategories: [
    {
      name: 'About Us',
      slug: 'about_us',
      path: '/about-us',
      description: 'Learn about our journey, mission, and values that define our brand.',
    },
    {
      name: 'Mission Vision Values',
      slug: 'mission_vision_values',
      path: '/mission-vision',
      description: "Discover our purpose, vision, and values driving our company's success.",
    },
    {
      name: 'Team',
      slug: 'team',
      path: '/teams',
      description: 'Meet our talented team committed to delivering excellence every day.',
    },
    {
      name: 'Contact Us',
      slug: 'contact_us',
      path: '/contact',
      description: 'Get in touch with us for inquiries, support, or collaboration opportunities.',
    },
  ],
} as const;

export const PRESS = {
  name: 'Press',
  slug: 'press',
  subcategories: [
    {
      name: 'Newsroom',
      slug: 'newsroom',
      path: '/press-media',
      description: 'Stay updated with our latest news, events, and media announcements.',
    },
    {
      name: 'Awards',
      slug: 'awards',
      path: '/awards',
      description: 'Explore the recognitions and awards we have received for excellence.',
    },
  ],
} as const;

export const CAREERS = {
  name: 'Careers',
  slug: 'careers',
  subcategories: [
    {
      name: 'Values/Culture',
      slug: 'values_culture',
      path: '/values-and-culture',
      description: 'Experience our vibrant culture driven by values of growth and innovation.',
    },
    {
      name: 'Openings',
      slug: 'openings',
      path: '/careers',
      description: 'Discover exciting career opportunities and join our dynamic team today.',
    },
    {
      name: 'Retail/E-Commerce',
      slug: 'retail_e_commerce',
      path: '/retail-and-e-commerce',
      description: 'Explore roles in retail and e-commerce driving our digital success.',
    },
  ],
} as const;

export const TRUST_CENTER = {
  name: 'Trust Center & Legal',
  slug: 'trust_center_and_legal',
  subcategories: [
    {
      name: 'Compliance',
      slug: 'compliance',
      path: '/cookie-policy',
      description: 'Understand our compliance standards ensuring trust and transparency.',
    },
    {
      name: 'Privacy/Policy',
      slug: 'privacy_policy',
      path: '/privacy-policy',
      description: 'Learn about our privacy practices and data protection commitments.',
    },
    {
      name: 'Terms & Conditions',
      slug: 'terms_and_conditions',
      path: '/terms-conditions',
      description: 'Review our terms and conditions for using our products and services.',
    },
  ],
} as const;

export const ABOUT = {
  name: 'About',
  slug: 'about',
  path: '/about',
  subcategories: [COMPANY, CAREERS, PRESS, TRUST_CENTER],
} as const;

/* ================================ ABOUT END ================================ */

/* ================================ COLLECTIONS START ================================ */

const basePath = '/products/collections';

export const BATH_AND_BODY = {
  name: 'Bath & Body',
  slug: 'bath_and_body',
  path: `${basePath}/bath_and_body`,
  subcategories: [
    {
      name: 'Shower Gel',
      slug: 'shower_gel',
      path: `${basePath}/bath_and_body/shower_gel`,
      description: 'Refreshing shower gel that cleanses and hydrates for soft skin.',
    },
    {
      name: 'Soap',
      slug: 'soap',
      path: `${basePath}/bath_and_body/soap`,
      description: 'Gentle soap for daily cleansing, leaving skin fresh and nourished.',
    },
    {
      name: 'Body Lotion',
      slug: 'body_lotion',
      path: `${basePath}/bath_and_body/body_lotion`,
      description: 'Moisturizing body lotion that keeps skin smooth and hydrated all day.',
    },
    {
      name: 'Body Spray',
      slug: 'body_spray',
      path: `${basePath}/bath_and_body/body_spray`,
      description: 'Light body spray with a refreshing fragrance for all-day freshness.',
    },
    {
      name: 'Hand Wash',
      slug: 'hand_wash',
      path: `${basePath}/bath_and_body/hand_wash`,
      description: 'Cleansing hand wash that leaves hands soft and hygienically clean.',
    },
    {
      name: 'Foot Cream',
      slug: 'foot_cream',
      path: `${basePath}/bath_and_body/foot_cream`,
      description: 'Nourishing foot cream that soothes and softens tired, dry feet.',
    },
    {
      name: 'Hand Cream',
      slug: 'hand_cream',
      path: `${basePath}/bath_and_body/hand_cream`,
      description: 'Hydrating hand cream for soft, smooth hands with lasting moisture.',
    },
  ],
} as const;

export const SUGAR_POP = {
  name: 'Sugar Pop',
  slug: 'sugar_pop',
  path: `${basePath}/sugar_pop`,
  subcategories: [
    {
      name: 'Lips',
      slug: 'lips',
      path: `${basePath}/sugar_pop/lips`,
      description: 'Lip products for bold, vibrant color and deep nourishing moisture.',
    },
    {
      name: 'Eyes',
      slug: 'eyes',
      path: `${basePath}/sugar_pop/eyes`,
      description: 'Eye makeup essentials for creating stunning looks that last all day.',
    },
    {
      name: 'Face',
      slug: 'face',
      path: `${basePath}/sugar_pop/face`,
      description: 'Face products to enhance complexion with flawless coverage.',
    },
    {
      name: 'Nails',
      slug: 'nails',
      path: `${basePath}/sugar_pop/nails`,
      description: 'Vibrant nail colors and effective treatments for stylish, healthy nails.',
    },
    {
      name: 'Skincare',
      slug: 'skincare',
      path: `${basePath}/sugar_pop/skincare`,
      description: 'Skincare essentials for a radiant, nourished, and clear complexion.',
    },
    {
      name: 'Body Care',
      slug: 'body_care',
      path: `${basePath}/sugar_pop/body_care`,
      description: 'Body care products for soft, smooth skin with lasting hydration.',
    },
    {
      name: 'Best of Sugar Pop',
      slug: 'best_of_sugar_pop',
      path: `${basePath}/sugar_pop/best_of_sugar_pop`,
      description: 'Top-rated Sugar Pop products loved for their quality and results.',
    },
  ],
} as const;

export const HAIR_CARE = {
  name: 'Hair Care',
  slug: 'hair_care',
  path: `${basePath}/hair_care`,
  subcategories: [
    {
      name: 'Shampoo',
      slug: 'shampoo',
      path: `${basePath}/hair_care/shampoo`,
      description: 'Cleansing shampoo that effectively revitalizes hair for healthy shine.',
    },
    {
      name: 'Conditioner',
      slug: 'conditioner',
      path: `${basePath}/hair_care/conditioner`,
      description: 'Nourishing conditioner that detangles and softens hair beautifully.',
    },
    {
      name: 'Hair Oil',
      slug: 'hair_oil',
      path: `${basePath}/hair_care/hair_oil`,
      description: 'Hair oil that deeply nourishes hair for strong, shiny, healthy hair.',
    },
    {
      name: 'Serum',
      slug: 'serum',
      path: `${basePath}/hair_care/serum`,
      description: 'Lightweight hair serum for frizz control and a silky, smooth finish.',
    },
    {
      name: 'Hair Mask',
      slug: 'hair_mask',
      path: `${basePath}/hair_care/hair_mask`,
      description: 'Deep conditioning hair mask for intense repair and hydration.',
    },
    {
      name: 'Combo',
      slug: 'combo',
      path: `${basePath}/hair_care/combo`,
      description: 'Value packs of hair care products for a complete hair routine.',
    },
  ],
} as const;

export const GIFTING = {
  name: 'Gifting',
  slug: 'gifting',
  path: `${basePath}/gifting`,
  subcategories: [
    {
      name: 'Lipstick Set',
      slug: 'lipstick_set',
      path: `${basePath}/gifting/lipstick_set`,
      description: 'Beautiful lipstick sets perfect for gifting on any special occasion.',
    },
    {
      name: 'Sugar Merch',
      slug: 'sugar_merch',
      path: `${basePath}/gifting/sugar_merch`,
      description: 'Trendy Sugar-branded merchandise for fans and beauty lovers.',
    },
    {
      name: 'Value Set',
      slug: 'value_set',
      path: `${basePath}/gifting/value_set`,
      description: 'Curated value sets for a complete beauty experience and savings.',
    },
    {
      name: 'Makeup Kit',
      slug: 'makeup_kit',
      path: `${basePath}/gifting/makeup_kit`,
      description: 'Comprehensive makeup kits with essentials for a flawless look.',
    },
    {
      name: 'Corporate Gifting',
      slug: 'corporate_gifting',
      path: `${basePath}/gifting/corporate_gifting`,
      description: 'Elegant corporate gifts to leave a lasting impression with style.',
    },
    {
      name: 'Sugar Set',
      slug: 'sugar_set',
      path: `${basePath}/gifting/sugar_set`,
      description: 'Exclusive Sugar sets curated for beauty enthusiasts and gifting.',
    },
  ],
} as const;

export const COLLECTIONS = {
  name: 'Collections',
  slug: 'collections',
  path: '/products/collections',
  subcategories: [BATH_AND_BODY, SUGAR_POP, HAIR_CARE, GIFTING],
} as const;

/* ================================ COLLECTIONS START ================================ */

/* ================================ SKIN START ================================ */

export const MOISTURIZERS = {
  name: 'Moisturizers',
  slug: 'moisturizers',
  path: `/products/skin/moisturizers`,
  subcategories: [
    {
      name: 'Night Cream',
      slug: 'night_cream',
      path: `/products/skin/moisturizers/night_cream`,
      description: 'Deeply hydrates and repairs tired skin while you sleep.',
    },
    {
      name: 'Eye Cream',
      slug: 'eye_cream',
      path: `/products/skin/moisturizers/eye_cream`,
      description: 'Reduces puffiness, dark circles, and fine lines quickly.',
    },
    {
      name: 'Serum',
      slug: 'serum',
      path: `/products/skin/moisturizers/serum`,
      description: 'Nourishes skin with essential vitamins for a radiant glow.',
    },
    {
      name: 'Skincare Kit',
      slug: 'skincare_kit',
      path: `/products/skin/moisturizers/skincare_kit`,
      description: 'Complete care sets for all skin types and beauty concerns.',
    },
  ],
} as const;

export const CLEANSING_AND_EXFOLIATION = {
  name: 'Cleansing & Exfoliation',
  slug: 'cleansing_and_exfoliation',
  path: `/products/skin/cleansing_and_exfoliation`,
  subcategories: [
    {
      name: 'Cleanser',
      slug: 'cleanser',
      path: `/products/skin/cleansing_and_exfoliation/cleanser`,
      description: 'Gently removes dirt, excess oil, and makeup for clean skin.',
    },
    {
      name: 'Face Wash',
      slug: 'face_wash',
      path: `/products/skin/cleansing_and_exfoliation/face_wash`,
      description: 'Refreshing daily wash for soft and healthy-looking skin tone.',
    },
    {
      name: 'Exfoliator & Scrub',
      slug: 'exfoliator_and_scrub',
      path: `/products/skin/cleansing_and_exfoliation/exfoliator_and_scrub`,
      description: 'Removes dead skin cells to reveal a fresh and smooth glow.',
    },
    {
      name: 'Sunscreen',
      slug: 'sunscreen',
      path: `/products/skin/cleansing_and_exfoliation/sunscreen`,
      description: 'Shields skin from harmful UV rays and sun damage daily.',
    },
  ],
} as const;

export const NATURES_BLEND = {
  name: "Nature's Blend",
  slug: 'natures_blend',
  path: `/products/skin/natures_blend`,
  subcategories: [
    {
      name: 'Aquaholic',
      slug: 'aquaholic',
      path: `/products/skin/natures_blend/aquaholic`,
      description: 'Hydration-rich formulas to deeply quench dry, dull skin.',
    },
    {
      name: 'Coffee Culture',
      slug: 'coffee_culture',
      path: `/products/skin/natures_blend/coffee_culture`,
      description: 'Energizing coffee extracts for a firm, smooth, youthful feel.',
    },
    {
      name: 'Citrus Got Real',
      slug: 'citrus_got_real',
      path: `/products/skin/natures_blend/citrus_got_real`,
      description: 'Vitamin C boost for brighter, fresher, healthier-looking skin.',
    },
  ],
} as const;

export const FACE_MASK = {
  name: 'Face Mask',
  slug: 'face_mask',
  path: `/products/skin/face_mask`,
  subcategories: [
    {
      name: 'Sheet Mask',
      slug: 'sheet_mask',
      path: `/products/skin/face_mask/sheet_mask`,
      description: 'Instant hydration and glowing effect in just a few minutes.',
    },
    {
      name: 'Face Pack',
      slug: 'face_pack',
      path: `/products/skin/face_mask/face_pack`,
      description: 'Detox and refresh your skin naturally with herbal extracts.',
    },
  ],
} as const;

export const SKIN = {
  name: 'Skin',
  slug: 'skin',
  path: '/products/skin',
  subcategories: [MOISTURIZERS, CLEANSING_AND_EXFOLIATION, NATURES_BLEND, FACE_MASK],
} as const;

/* ================================ SKIN END ================================ */

/* ================================ FACE START ================================ */

export const FACE_MAKEUP = {
  name: 'Face Makeup',
  slug: 'face_makeup',
  path: `/products/face/face_makeup`,
  subcategories: [
    {
      name: 'Foundation',
      slug: 'foundation',
      path: `/products/face/face_makeup/foundation`,
      description: 'Provides coverage for a flawless base with a natural, smooth finish.',
    },
    {
      name: 'BB Cream',
      slug: 'bb_cream',
      path: `/products/face/face_makeup/bb_cream`,
      description: 'Lightweight formula that hydrates, evens skin tone, and protects skin.',
    },
    {
      name: 'Compact Powder',
      slug: 'compact_powder',
      path: `/products/face/face_makeup/compact_powder`,
      description: 'Sets makeup, reduces shine, and ensures a long-lasting matte finish.',
    },
    {
      name: 'Loose Powder',
      slug: 'loose_powder',
      path: `/products/face/face_makeup/loose_powder`,
      description: 'Finely milled powder for a smooth, shine-free finish that lasts all day.',
    },
    {
      name: 'Banana Powder',
      slug: 'banana_powder',
      path: `/products/face/face_makeup/banana_powder`,
      description: 'Brightens the complexion, reduces shine, and sets makeup beautifully.',
    },
    {
      name: 'SPF Foundation',
      slug: 'spf_foundation',
      path: `/products/face/face_makeup/spf_foundation`,
      description: 'Combines sun protection, coverage for a flawless, radiant look.',
    },
  ],
} as const;

export const TRADITIONAL_AND_ESSENTIALS = {
  name: 'Traditional & Essentials',
  slug: 'traditional_and_essentials',
  path: `/products/face/traditional_and_essentials`,
  subcategories: [
    {
      name: 'Sindoor',
      slug: 'sindoor',
      path: `/products/face/traditional_and_essentials/sindoor`,
      description: 'Symbolic powder for the hairline, enhancing traditional elegance.',
    },
  ],
} as const;

export const CHEEKS_AND_GLOW = {
  name: 'Cheeks & Glow',
  slug: 'cheeks_and_glow',
  path: `/products/face/cheeks_and_glow`,
  subcategories: [
    {
      name: 'Highlighter',
      slug: 'highlighter',
      path: `/products/face/cheeks_and_glow/highlighter`,
      description: 'Adds a radiant, enhancing features with a luminous, dewy look.',
    },
    {
      name: 'Liquid Highlighter',
      slug: 'liquid_highlighter',
      path: `/products/face/cheeks_and_glow/liquid_highlighter`,
      description: 'Blendable liquid formula for a glowing, buildable, natural look.',
    },
    {
      name: 'Blush',
      slug: 'blush',
      path: `/products/face/cheeks_and_glow/blush`,
      description: 'Adds a pop of color to cheeks, creating a youthful, healthy look.',
    },
    {
      name: 'Cheek Stain',
      slug: 'cheek_stain',
      path: `/products/face/cheeks_and_glow/cheek_stain`,
      description: 'Long-lasting tint for a natural, flushed look that stays vibrant.',
    },
  ],
} as const;

export const SETTING_AND_FINISHING = {
  name: 'Setting & Finishing',
  slug: 'setting_and_finishing',
  path: `/products/face/setting_and_finishing`,
  subcategories: [
    {
      name: 'Setting Spray',
      slug: 'setting_spray',
      path: `/products/face/setting_and_finishing/setting_spray`,
      description: 'Locks makeup for long wear, maintaining a fresh look without.',
    },
    {
      name: 'Compact',
      slug: 'compact',
      path: `/products/face/setting_and_finishing/compact`,
      description: 'Portable powder for touch-ups, controls shine, sets makeup place.',
    },
    {
      name: 'Fixer',
      slug: 'fixer',
      path: `/products/face/setting_and_finishing/fixer`,
      description: 'Enhances makeup longevity, ensuring a smudge-proof, flawless.',
    },
  ],
} as const;

export const FOUNDATIONS_BY_FINISH = {
  name: 'Foundations by Finish',
  slug: 'foundations_by_finish',
  path: `/products/face/foundations_by_finish`,
  subcategories: [
    {
      name: 'Liquid Foundation',
      slug: 'liquid_foundation',
      path: `/products/face/foundations_by_finish/liquid_foundation`,
      description: 'Buildable coverage with a natural finish that blends seamlessly skin.',
    },
    {
      name: 'Matte Foundation',
      slug: 'matte_foundation',
      path: `/products/face/foundations_by_finish/matte_foundation`,
      description: 'Oil-absorbing formula for a shine-free, velvety matte look lasts.',
    },
    {
      name: 'Water Resistant Foundation',
      slug: 'water_resistant_foundation',
      path: `/products/face/foundations_by_finish/water_resistant_foundation`,
      description: 'Long-wearing, water-resistant foundation that stays flawless day.',
    },
    {
      name: 'High Coverage Foundation',
      slug: 'high_coverage_foundation',
      path: `/products/face/foundations_by_finish/high_coverage_foundation`,
      description: 'Conceals imperfections with full coverage, ensuring flawless look.',
    },
    {
      name: 'Stick Foundation',
      slug: 'stick_foundation',
      path: `/products/face/foundations_by_finish/stick_foundation`,
      description: 'Convenient stick format for easy application and buildable coverage.',
    },
  ],
} as const;

export const FOUNDATIONS_BY_SKIN_TYPE = {
  name: 'Foundations by Skin Type',
  slug: 'foundations_by_skin_type',
  path: `/products/face/foundations_by_skin_type`,
  subcategories: [
    {
      name: 'Best for Dry Skin',
      slug: 'best_for_dry_skin',
      path: `/products/face/foundations_by_skin_type/best_for_dry_skin`,
      description: 'Hydrating formula that nourishes and enhances radiance for dry skin.',
    },
    {
      name: 'Best for Oily Skin',
      slug: 'best_for_oily_skin',
      path: `/products/face/foundations_by_skin_type/best_for_oily_skin`,
      description: 'Oil-controlling foundation that reduces shine, prevents breakouts.',
    },
  ],
} as const;

export const PRIMERS_AND_REMOVERS = {
  name: 'Primers & Removers',
  slug: 'primers_and_removers',
  path: `/products/face/primers_and_removers`,
  subcategories: [
    {
      name: 'Makeup Remover',
      slug: 'makeup_remover',
      path: `/products/face/primers_and_removers/makeup_remover`,
      description: 'Gently removes makeup while hydrating and refreshing the skin.',
    },
    {
      name: 'Primer',
      slug: 'primer',
      path: `/products/face/primers_and_removers/primer`,
      description: 'Prepares skin, creating a smooth base for long-lasting makeup.',
    },
  ],
} as const;

export const BRONZERS_AND_CONTOURS = {
  name: 'Bronzers & Contours',
  slug: 'bronzers_and_contours',
  path: `/products/face/bronzers_and_contours`,
  subcategories: [
    {
      name: 'Bronzer',
      slug: 'bronzer',
      path: `/products/face/bronzers_and_contours/bronzer`,
      description: 'Adds warmth and a sun-kissed glow for a radiant complexion.',
    },
    {
      name: 'Contour',
      slug: 'contour',
      path: `/products/face/bronzers_and_contours/contour`,
      description: 'Defines features with shadows, enhancing structure and depth.',
    },
  ],
} as const;

export const CONCEALERS_AND_CORRECTORS = {
  name: 'Concealers & Correctors',
  slug: 'concealers_and_correctors',
  path: `/products/face/concealers_and_correctors`,
  subcategories: [
    {
      name: 'Color Concealer',
      slug: 'color_concealer',
      path: `/products/face/concealers_and_correctors/color_concealer`,
      description: 'It covers flaws with precision, delivering a flawless, airbrushed.',
    },
    {
      name: 'Color Corrector',
      slug: 'color_corrector',
      path: `/products/face/concealers_and_correctors/color_corrector`,
      description: 'Neutralizes discoloration, balancing skin tone for a radiant finish.',
    },
  ],
} as const;

export const FACE = {
  name: 'Face',
  slug: 'face',
  path: '/products/face',
  subcategories: [
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
  name: 'Kohl & Kajal',
  slug: 'kohl_and_kajal',
  path: `/products/eyes/kohl_and_kajal`,
  subcategories: [
    {
      name: 'Kohl',
      slug: 'kohl',
      path: `/products/eyes/kohl_and_kajal/kohl`,
      description: 'Intensely pigmented kohls for bold, long-lasting eye definition all day.',
    },
    {
      name: 'Kajal',
      slug: 'kajal',
      path: `/products/eyes/kohl_and_kajal/kajal`,
      description: 'Smooth kajals for a dramatic look, perfect for waterline application.',
    },
    {
      name: 'Smudge Proof Kajal',
      slug: 'smudge_proof_kajal',
      path: `/products/eyes/kohl_and_kajal/smudge_proof_kajal`,
      description: 'Long-lasting, smudge-proof kajal for sharp, defined eyes all day long.',
    },
  ],
} as const;

export const MASCARAS = {
  name: 'Mascaras',
  slug: 'mascaras',
  path: `/products/eyes/mascaras`,
  subcategories: [
    {
      name: 'Volumizing Mascara',
      slug: 'volumizing_mascara',
      path: `/products/eyes/mascaras/volumizing_mascara`,
      description: 'Boosts lash volume for a fuller, more dramatic look with each coat.',
    },
    {
      name: 'Curl Lengthening Mascara',
      slug: 'curl_lengthening_mascara',
      path: `/products/eyes/mascaras/curl_lengthening_mascara`,
      description: 'Lifts and curls lashes for a wide-eyed look with added length and volume.',
    },
    {
      name: 'Waterproof Mascara',
      slug: 'waterproof_mascara',
      path: `/products/eyes/mascaras/waterproof_mascara`,
      description: 'Water-resistant formula for long-lasting wear without smudging or flaking.',
    },
  ],
} as const;

export const EYELINERS = {
  name: 'Eyeliners',
  slug: 'eyeliners',
  path: `/products/eyes/eyeliners`,
  subcategories: [
    {
      name: 'Liquid Eyeliner',
      slug: 'liquid_eyeliner',
      path: `/products/eyes/eyeliners/liquid_eyeliner`,
      description: 'Precision tip for sharp lines, perfect for bold cat-eye or winged looks.',
    },
    {
      name: 'Gel Eyeliner',
      slug: 'gel_eyeliner',
      path: `/products/eyes/eyeliners/gel_eyeliner`,
      description: 'Creamy, blendable gel eyeliner for versatile looks, from bold to subtle.',
    },
    {
      name: 'Pen Eyeliner',
      slug: 'pen_eyeliner',
      path: `/products/eyes/eyeliners/pen_eyeliner`,
      description: 'Easy-to-use pen for precise lines, ideal for beginners and quick touch-ups.',
    },
  ],
} as const;

export const EYESHADOW = {
  name: 'Eyeshadow',
  slug: 'eyeshadow',
  path: `/products/eyes/eyeshadow`,
  subcategories: [
    {
      name: 'Eyeshadow Palette',
      slug: 'eyeshadow_palette',
      path: `/products/eyes/eyeshadow/eyeshadow_palette`,
      description: 'Versatile palettes with coordinated shades for endless eye makeup looks.',
    },
    {
      name: 'Liquid Eyeshadow',
      slug: 'liquid_eyeshadow',
      path: `/products/eyes/eyeshadow/liquid_eyeshadow`,
      description: 'High-pigment liquid shadows for easy application and long-lasting shimmer.',
    },
    {
      name: 'Glitter Eyeshadow',
      slug: 'glitter_eyeshadow',
      path: `/products/eyes/eyeshadow/glitter_eyeshadow`,
      description: 'Sparkling glitter shadows for a bold, glamorous look on special occasions.',
    },
  ],
} as const;

export const EYEBROWS = {
  name: 'Eyebrows',
  slug: 'eyebrows',
  path: `/products/eyes/eyebrows`,
  subcategories: [
    {
      name: 'Brow Definer',
      slug: 'brow_definer',
      path: `/products/eyes/eyebrows/brow_definer`,
      description: 'Defines brows with precision for a well-groomed and polished appearance.',
    },
    {
      name: 'Brow Pencil',
      slug: 'brow_pencil',
      path: `/products/eyes/eyebrows/brow_pencil`,
      description: 'Easy-to-use pencil for filling and shaping brows with natural-looking color.',
    },
    {
      name: 'Brow Gel',
      slug: 'brow_gel',
      path: `/products/eyes/eyebrows/brow_gel`,
      description: 'Sets and tames brows, providing a long-lasting hold with a natural finish.',
    },
  ],
} as const;

export const EYE_VALUE_SET = {
  name: 'Eye Value Set',
  slug: 'eye_value_set',
  path: `/products/eyes/eye_value_set`,
  subcategories: [
    {
      name: 'Eyelashes',
      slug: 'eyelashes',
      path: `/products/eyes/eye_value_set/eyelashes`,
      description: 'Enhance your eyes with faux lashes for added volume and captivating charm.',
    },
    {
      name: 'Eye Gift Set',
      slug: 'eye_gift_set',
      path: `/products/eyes/eye_value_set/eye_gift_set`,
      description: "Perfect gift sets featuring popular eye products for makeup lovers' delight.",
    },
    {
      name: 'Eye Combo',
      slug: 'eye_combo',
      path: `/products/eyes/eye_value_set/eye_combo`,
      description: 'Convenient sets with eye essentials for a complete, coordinated eye look.',
    },
  ],
} as const;

export const EYES = {
  name: 'Eyes',
  slug: 'eyes',
  path: '/products/eyes',
  subcategories: [KOHL_AND_KAJAL, MASCARAS, EYELINERS, EYESHADOW, EYEBROWS, EYE_VALUE_SET],
} as const;

/* ================================ EYES END ================================ */

/* ================================ LIPS START ================================ */

export const FINISH_TYPES = {
  name: 'Finish Types',
  slug: 'finish_types',
  path: `/products/lips/finish_types`,
  subcategories: [
    {
      name: 'Matte Lipstick',
      slug: 'matte_lipstick',
      path: `/products/lips/finish_types/matte_lipstick`,
      description: 'Velvety matte finish with long-lasting, intense color payoff everywhere.',
    },
    {
      name: 'Satin Lipstick',
      slug: 'satin_lipstick',
      path: `/products/lips/finish_types/satin_lipstick`,
      description: 'Smooth, creamy texture with a luminous, semi-matte finish always.',
    },
    {
      name: 'Hi-Shine Lipstick',
      slug: 'hi_shine_lipstick',
      path: `/products/lips/finish_types/hi_shine_lipstick`,
      description: 'Glossy finish for a shiny, luscious look with rich pigment beautifully.',
    },
    {
      name: 'Lip Gloss',
      slug: 'lip_gloss',
      path: `/products/lips/finish_types/lip_gloss`,
      description: 'Sheer to medium coverage with a high-shine, glossy finish flawlessly.',
    },
  ],
} as const;

export const LIPSTICK_FORMS = {
  name: 'Lipstick Forms',
  slug: 'lipstick_forms',
  path: `/products/lips/lipstick_forms`,
  subcategories: [
    {
      name: 'Liquid Lipstick',
      slug: 'liquid_lipstick',
      path: `/products/lips/lipstick_forms/liquid_lipstick`,
      description: 'Rich, long-lasting color with a lightweight, matte finish beautifully.',
    },
    {
      name: 'Powder Lipstick',
      slug: 'powder_lipstick',
      path: `/products/lips/lipstick_forms/powder_lipstick`,
      description: 'Weightless powder formula with a soft-focus, matte effect perfectly.',
    },
    {
      name: 'Crayon Lipstick',
      slug: 'crayon_lipstick',
      path: `/products/lips/lipstick_forms/crayon_lipstick`,
      description: 'Easy-to-apply crayon for precise lines and bold color payoff smoothly.',
    },
    {
      name: 'Bullet Lipstick',
      slug: 'bullet_lipstick',
      path: `/products/lips/lipstick_forms/bullet_lipstick`,
      description: 'Classic bullet shape with smooth, creamy, full-coverage color always.',
    },
  ],
} as const;

export const LONG_LASTING_LIPSTICKS = {
  name: 'Long-Lasting Lipsticks',
  slug: 'long_lasting_lipsticks',
  path: `/products/lips/long_lasting_lipsticks`,
  subcategories: [
    {
      name: 'Transfer Proof Lipstick',
      slug: 'transfer_proof_lipstick',
      path: `/products/lips/long_lasting_lipsticks/transfer_proof_lipstick`,
      description: 'Stays put all day without smudging or fading for long-lasting wear.',
    },
    {
      name: 'Water Proof Lipstick',
      slug: 'water_proof_lipstick',
      path: `/products/lips/long_lasting_lipsticks/water_proof_lipstick`,
      description: 'Resistant to water and sweat, ensuring color stays vibrant always.',
    },
    {
      name: 'Lip Tint & Stain',
      slug: 'lip_tint_and_stain',
      path: `/products/lips/long_lasting_lipsticks/lip_tint_and_stain`,
      description: 'Lightweight tint with a natural finish that lasts for hours smoothly.',
    },
    {
      name: 'Smudge Proof',
      slug: 'smudge_proof_lipstick',
      path: `/products/lips/long_lasting_lipsticks/smudge_proof_lipstick`,
      description: 'No smudging or transferring, providing a flawless look perfectly.',
    },
  ],
} as const;

export const LIP_CARE = {
  name: 'Lip Care',
  slug: 'lip_care',
  path: `/products/lips/lip_care`,
  subcategories: [
    {
      name: 'Lip Primer & Scrub',
      slug: 'lip_primer_and_scrub',
      path: `/products/lips/lip_care/lip_primer_and_scrub`,
      description: 'Preps lips for smooth application and enhances color beautifully.',
    },
    {
      name: 'Lipstick Fixer & Remover',
      slug: 'lipstick_fixer_and_remover',
      path: `/products/lips/lip_care/lipstick_fixer_and_remover`,
      description: 'Ensures long wear and easy removal without residue effortlessly.',
    },
    {
      name: 'Lip Balm',
      slug: 'lip_balm',
      path: `/products/lips/lip_care/lip_balm`,
      description: 'Deeply hydrates and protects lips from dryness and cracking.',
    },
    {
      name: 'Tinted Lip Balm',
      slug: 'tinted_lip_balm',
      path: `/products/lips/lip_care/tinted_lip_balm`,
      description: 'Hydration with a hint of color for a natural, radiant look daily.',
    },
  ],
} as const;

export const LIP_ENHANCERS_AND_OTHER = {
  name: 'Lip Enhancers & Other',
  slug: 'lip_enhancers_and_other',
  path: `/products/lips/lip_enhancers_and_other`,
  subcategories: [
    {
      name: 'Lip Liner',
      slug: 'lip_liner',
      path: `/products/lips/lip_enhancers_and_other/lip_liner`,
      description: 'Defines lips with precision, shaping and preventing feathering daily.',
    },
    {
      name: 'Lip Glitter',
      slug: 'lip_glitter',
      path: `/products/lips/lip_enhancers_and_other/lip_glitter`,
      description: 'Adds sparkle and shine for a glamorous, bold look on special occasions.',
    },
  ],
} as const;

export const LIPSTICK_SETS_AND_COMBOS = {
  name: 'Lipstick Set & Combo',
  slug: 'lipstick_set_and_combo',
  path: `/products/lips/lipstick_set_and_combo`,
  subcategories: [
    {
      name: 'Lipstick Set',
      slug: 'lipstick_set',
      path: `/products/lips/lipstick_set_and_combo/lipstick_set`,
      description: 'Multiple shades in one set for versatile, everyday looks beautifully.',
    },
    {
      name: 'Lipstick Combo',
      slug: 'lipstick_combo',
      path: `/products/lips/lipstick_set_and_combo/lipstick_combo`,
      description: 'Perfectly paired lip products for a complete, cohesive look always.',
    },
    {
      name: 'Lip Palette',
      slug: 'lip_palette',
      path: `/products/lips/lipstick_set_and_combo/lip_palette`,
      description: 'Versatile palette with various shades for creative, bold looks daily.',
    },
  ],
} as const;

export const LIPS = {
  name: 'Lips',
  slug: 'lips',
  path: '/products/lips',
  subcategories: [
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
