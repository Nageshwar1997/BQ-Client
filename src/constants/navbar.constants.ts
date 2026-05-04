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

export const SOCIAL_COMMUNITY = [
  { icon: 'solar:play-linear', label: "Founder's Story: Watch Now", path: '/press-media#watch' },
  { icon: 'solar:chat-dots-linear', label: 'Chat with our team', path: '/contact' },
];

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
];

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

export const HIGHLIGHTED_CATEGORIES = {
  about: ['mission_vision_values', 'retail_e_commerce'],
  collections: ['best_of_sugar_pop', 'soap', 'serum', 'sugar_set'],
  eyes: [
    'kohl',
    'curl_lengthening_mascara',
    'liquid_eyeliner',
    'glitter_eyeshadow',
    'brow_pencil',
    'eye_combo',
  ],
  face: [
    'color_corrector',
    'compact',
    'makeup_remover',
    'matte_foundation',
    'cheek_stain',
    'sindoor',
    'compact_powder',
  ],
  lips: [
    'lip_gloss',
    'liquid_lipstick',
    'lip_tint_and_stain',
    'lipstick_fixer_and_remover',
    'lip_glitter',
    'lip_palette',
  ],
  skin: ['serum', 'sunscreen', 'aquaholic', 'face_pack'],
};

/* ================================ FOR YOU START ================================ */

export const NEW = {
  id: 1,
  level: 2,
  heading: 'Latest Trends',
  label: 'New Arrivals',
  category: 'new_arrivals',
  path: '/products/for_you/latest_trends',
  videoUrl:
    'https://res.cloudinary.com/dag2xvurz/video/upload/sp_auto/v1742719904/Beautinique/Home_Videos/1742719884229_SUGAR_Ace_of_Face_Dewy_Foundation_New_Launch_SUGAR_Cosmetics.m3u8',
  thumbnail:
    'https://res.cloudinary.com/drbhw0nwt/image/upload/v1742736104/Beautinique/Posters/1742736102775_3_Ace_of_Face_Foundation.webp',
  description: 'Discover new beauty arrivals for a fresh, trendy style.',
  subCategories: [
    {
      id: 1,
      level: 3,
      path: '/products/for_you/latest_trends/new_arrivals',
      label: '',
      category: '',
      description: '',
      icon: '',
    },
  ],
} as const;

export const SUGAR_PLAY = {
  id: 2,
  level: 2,
  heading: 'Best Sellers',
  label: 'Sugar Play',
  category: 'sugar_play',
  path: '/products/for_you/best_sellers',
  videoUrl:
    'https://res.cloudinary.com/dag2xvurz/video/upload/sp_auto/v1742127534/Beautinique/Home_Videos/1742127444038_1_Makeup_Reimagine.m3u8',
  thumbnail:
    'https://res.cloudinary.com/drbhw0nwt/image/upload/v1742736002/Beautinique/Posters/1742735999781_1_Makeup_Reimagine.webp',
  description: 'Shop beauty products top-rated & loved by enthusiasts.',
  subCategories: [
    {
      id: 1,
      level: 3,
      label: '',
      path: '/products/for_you/best_sellers/sugar_play',
      category: '',
      description: '',
      icon: '',
    },
  ],
} as const;

export const OFFERS = {
  id: 3,
  level: 2,
  heading: 'Exclusive Deals',
  label: 'Offers',
  category: 'offers',
  path: '/offers',
  videoUrl:
    'https://res.cloudinary.com/dag2xvurz/video/upload/sp_auto/v1742130156/Beautinique/Home_Videos/1742130132099_3_Glide_Peptide_SPF50_PA%2B%2B_Lip_Treatment_Must-Have_for_Daily_Protection.m3u8',
  thumbnail:
    'https://res.cloudinary.com/drbhw0nwt/image/upload/v1742736080/Beautinique/Posters/1742736077422_2_Glide_Peptide_Lip_Treatement.webp',
  description: 'Grab discounts on premium cosmetics for a limited time.',
  subCategories: [
    { id: 1, level: 3, label: '', path: '/offers', category: '', description: '', icon: '' },
  ],
} as const;

export const BLOGS = {
  id: 4,
  level: 2,
  heading: 'Beauty Insights',
  label: 'Blogs',
  category: 'blogs',
  path: '/blogs',
  videoUrl: '/videos/company/values-culture/Get-Ready-With-BQ.mp4',
  thumbnail: '/images/navbar/blogs.png',
  description: 'Explore top beauty tips, trends, & skincare routines.',
  subCategories: [
    { id: 1, level: 3, path: '/blogs', label: '', category: '', description: '', icon: '' },
  ],
};

export const FOR_YOU = {
  id: 1,
  level: 1,
  label: 'For You',
  category: 'for_you',
  path: '/products/for_you',
  subCategories: [NEW, SUGAR_PLAY, OFFERS, BLOGS],
} as const;

/* ================================ FOR YOU END ================================ */

/* ================================ ABOUT START ================================ */

export const COMPANY = {
  id: 1,
  level: 2,
  label: 'Company',
  category: 'company',
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'About Us',
      category: 'about_us',
      path: '/about-us',
      icon: 'solar:infinity-bold',
      description: 'Learn about our journey, mission, and values that define our brand.',
    },
    {
      id: 2,
      level: 3,
      label: 'Mission Vision Values',
      category: 'mission_vision_values',
      path: '/mission-vision',
      icon: 'solar:infinity-bold',
      description: "Discover our purpose, vision, and values driving our company's success.",
    },
    {
      id: 3,
      level: 3,
      label: 'Team',
      category: 'team',
      path: '/teams',
      icon: 'solar:infinity-bold',
      description: 'Meet our talented team committed to delivering excellence every day.',
    },
    {
      id: 4,
      level: 3,
      label: 'Contact Us',
      category: 'contact_us',
      path: '/contact',
      icon: 'solar:infinity-bold',
      description: 'Get in touch with us for inquiries, support, or collaboration opportunities.',
    },
  ],
} as const;

export const PRESS = {
  id: 2,
  level: 2,
  label: 'Press',
  category: 'press',
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Newsroom',
      category: 'newsroom',
      path: '/press-media',
      icon: 'solar:infinity-bold',
      description: 'Stay updated with our latest news, events, and media announcements.',
    },
    {
      id: 2,
      level: 3,
      label: 'Awards',
      category: 'awards',
      path: '/awards',
      icon: 'solar:infinity-bold',
      description: 'Explore the recognitions and awards we have received for excellence.',
    },
  ],
} as const;

export const CAREERS = {
  id: 3,
  level: 2,
  label: 'Careers',
  category: 'careers',
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Values/Culture',
      category: 'values_culture',
      path: '/values-and-culture',
      icon: 'solar:infinity-bold',
      description: 'Experience our vibrant culture driven by values of growth and innovation.',
    },
    {
      id: 2,
      level: 3,
      label: 'Openings',
      category: 'openings',
      path: '/careers',
      icon: 'solar:infinity-bold',
      description: 'Discover exciting career opportunities and join our dynamic team today.',
    },
    {
      id: 3,
      level: 3,
      label: 'Retail/E-Commerce',
      category: 'retail_e_commerce',
      path: '/retail-and-e-commerce',
      icon: 'solar:infinity-bold',
      description: 'Explore roles in retail and e-commerce driving our digital success.',
    },
  ],
} as const;

export const TRUST_CENTER = {
  id: 4,
  level: 2,
  label: 'Trust Center & Legal',
  category: 'trust_center_and_legal',
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Compliance',
      category: 'compliance',
      path: '/cookie-policy',
      icon: 'solar:infinity-bold',
      description: 'Understand our compliance standards ensuring trust and transparency.',
    },
    {
      id: 2,
      level: 3,
      label: 'Privacy/Policy',
      category: 'privacy_policy',
      path: '/privacy-policy',
      icon: 'solar:infinity-bold',
      description: 'Learn about our privacy practices and data protection commitments.',
    },
    {
      id: 3,
      level: 3,
      label: 'Terms & Conditions',
      category: 'terms_and_conditions',
      path: '/terms-conditions',
      icon: 'solar:infinity-bold',
      description: 'Review our terms and conditions for using our products and services.',
    },
  ],
} as const;

export const ABOUT = {
  id: 7,
  level: 1,
  label: 'About',
  category: 'about',
  path: '/about',
  subCategories: [COMPANY, CAREERS, PRESS, TRUST_CENTER],
} as const;

/* ================================ ABOUT END ================================ */

/* ================================ COLLECTIONS START ================================ */

const basePath = '/products/collections';

export const BATH_AND_BODY = {
  id: 1,
  level: 2,
  label: 'Bath & Body',
  category: 'bath_and_body',
  path: `${basePath}/bath_and_body`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Shower Gel',
      category: 'shower_gel',
      icon: 'solar:infinity-bold',
      path: `${basePath}/bath_and_body/shower_gel`,
      description: 'Refreshing shower gel that cleanses and hydrates for soft skin.',
    },
    {
      id: 2,
      level: 3,
      label: 'Soap',
      category: 'soap',
      path: `${basePath}/bath_and_body/soap`,
      icon: 'solar:infinity-bold',
      description: 'Gentle soap for daily cleansing, leaving skin fresh and nourished.',
    },
    {
      id: 3,
      level: 3,
      label: 'Body Lotion',
      category: 'body_lotion',
      path: `${basePath}/bath_and_body/body_lotion`,
      icon: 'solar:infinity-bold',
      description: 'Moisturizing body lotion that keeps skin smooth and hydrated all day.',
    },
    {
      id: 4,
      level: 3,
      label: 'Body Spray',
      category: 'body_spray',
      path: `${basePath}/bath_and_body/body_spray`,
      icon: 'solar:infinity-bold',
      description: 'Light body spray with a refreshing fragrance for all-day freshness.',
    },
    {
      id: 5,
      level: 3,
      label: 'Hand Wash',
      category: 'hand_wash',
      path: `${basePath}/bath_and_body/hand_wash`,
      icon: 'solar:infinity-bold',
      description: 'Cleansing hand wash that leaves hands soft and hygienically clean.',
    },
    {
      id: 6,
      level: 3,
      label: 'Foot Cream',
      category: 'foot_cream',
      path: `${basePath}/bath_and_body/foot_cream`,
      icon: 'solar:infinity-bold',
      description: 'Nourishing foot cream that soothes and softens tired, dry feet.',
    },
    {
      id: 7,
      level: 3,
      label: 'Hand Cream',
      category: 'hand_cream',
      path: `${basePath}/bath_and_body/hand_cream`,
      icon: 'solar:infinity-bold',
      description: 'Hydrating hand cream for soft, smooth hands with lasting moisture.',
    },
  ],
} as const;

export const SUGAR_POP = {
  id: 2,
  level: 2,
  label: 'Sugar Pop',
  category: 'sugar_pop',
  path: `${basePath}/sugar_pop`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Lips',
      category: 'lips',
      path: `${basePath}/sugar_pop/lips`,
      icon: 'solar:infinity-bold',
      description: 'Lip products for bold, vibrant color and deep nourishing moisture.',
    },
    {
      id: 2,
      level: 3,
      label: 'Eyes',
      category: 'eyes',
      path: `${basePath}/sugar_pop/eyes`,
      icon: 'solar:infinity-bold',
      description: 'Eye makeup essentials for creating stunning looks that last all day.',
    },
    {
      id: 3,
      level: 3,
      label: 'Face',
      category: 'face',
      path: `${basePath}/sugar_pop/face`,
      icon: 'solar:infinity-bold',
      description: 'Face products to enhance complexion with flawless coverage.',
    },
    {
      id: 4,
      level: 3,
      label: 'Nails',
      category: 'nails',
      path: `${basePath}/sugar_pop/nails`,
      icon: 'solar:infinity-bold',
      description: 'Vibrant nail colors and effective treatments for stylish, healthy nails.',
    },
    {
      id: 5,
      level: 3,
      label: 'Skincare',
      category: 'skincare',
      path: `${basePath}/sugar_pop/skincare`,
      icon: 'solar:infinity-bold',
      description: 'Skincare essentials for a radiant, nourished, and clear complexion.',
    },
    {
      id: 6,
      level: 3,
      label: 'Body Care',
      category: 'body_care',
      path: `${basePath}/sugar_pop/body_care`,
      icon: 'solar:infinity-bold',
      description: 'Body care products for soft, smooth skin with lasting hydration.',
    },
    {
      id: 7,
      level: 3,
      label: 'Best of Sugar Pop',
      category: 'best_of_sugar_pop',
      path: `${basePath}/sugar_pop/best_of_sugar_pop`,
      icon: 'solar:infinity-bold',
      description: 'Top-rated Sugar Pop products loved for their quality and results.',
    },
  ],
} as const;

export const HAIR_CARE = {
  id: 3,
  level: 2,
  label: 'Hair Care',
  category: 'hair_care',
  path: `${basePath}/hair_care`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Shampoo',
      category: 'shampoo',
      path: `${basePath}/hair_care/shampoo`,
      icon: 'solar:infinity-bold',
      description: 'Cleansing shampoo that effectively revitalizes hair for healthy shine.',
    },
    {
      id: 2,
      level: 3,
      label: 'Conditioner',
      category: 'conditioner',
      path: `${basePath}/hair_care/conditioner`,
      icon: 'solar:infinity-bold',
      description: 'Nourishing conditioner that detangles and softens hair beautifully.',
    },
    {
      id: 3,
      level: 3,
      label: 'Hair Oil',
      category: 'hair_oil',
      path: `${basePath}/hair_care/hair_oil`,
      icon: 'solar:infinity-bold',
      description: 'Hair oil that deeply nourishes hair for strong, shiny, healthy hair.',
    },
    {
      id: 4,
      level: 3,
      label: 'Serum',
      category: 'serum',
      path: `${basePath}/hair_care/serum`,
      icon: 'solar:infinity-bold',
      description: 'Lightweight hair serum for frizz control and a silky, smooth finish.',
    },
    {
      id: 5,
      level: 3,
      label: 'Hair Mask',
      category: 'hair_mask',
      path: `${basePath}/hair_care/hair_mask`,
      icon: 'solar:infinity-bold',
      description: 'Deep conditioning hair mask for intense repair and hydration.',
    },
    {
      id: 6,
      level: 3,
      label: 'Combo',
      category: 'combo',
      path: `${basePath}/hair_care/combo`,
      icon: 'solar:infinity-bold',
      description: 'Value packs of hair care products for a complete hair routine.',
    },
    {
      id: 7,
      level: 3,
      label: 'View All',
      category: 'view_all',
      path: `${basePath}/hair_care/view_all`,
      icon: 'solar:infinity-bold',
      description: 'Browse all hair care products for your perfect hair solution.',
    },
  ],
} as const;

export const GIFTING = {
  id: 4,
  level: 2,
  label: 'Gifting',
  category: 'gifting',
  path: `${basePath}/gifting`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Lipstick Set',
      category: 'lipstick_set',
      path: `${basePath}/gifting/lipstick_set`,
      icon: 'solar:infinity-bold',
      description: 'Beautiful lipstick sets perfect for gifting on any special occasion.',
    },
    {
      id: 2,
      level: 3,
      label: 'Sugar Merch',
      category: 'sugar_merch',
      path: `${basePath}/gifting/sugar_merch`,
      icon: 'solar:infinity-bold',
      description: 'Trendy Sugar-branded merchandise for fans and beauty lovers.',
    },
    {
      id: 3,
      level: 3,
      label: 'Value Set',
      category: 'value_set',
      path: `${basePath}/gifting/value_set`,
      icon: 'solar:infinity-bold',
      description: 'Curated value sets for a complete beauty experience and savings.',
    },
    {
      id: 4,
      level: 3,
      label: 'Makeup Kit',
      category: 'makeup_kit',
      path: `${basePath}/gifting/makeup_kit`,
      icon: 'solar:infinity-bold',
      description: 'Comprehensive makeup kits with essentials for a flawless look.',
    },
    {
      id: 5,
      level: 3,
      label: 'Corporate Gifting',
      category: 'corporate_gifting',
      path: `${basePath}/gifting/corporate_gifting`,
      icon: 'solar:infinity-bold',
      description: 'Elegant corporate gifts to leave a lasting impression with style.',
    },
    {
      id: 6,
      level: 3,
      label: 'Sugar Set',
      category: 'sugar_set',
      path: `${basePath}/gifting/sugar_set`,
      icon: 'solar:infinity-bold',
      description: 'Exclusive Sugar sets curated for beauty enthusiasts and gifting.',
    },
  ],
} as const;

export const COLLECTIONS = {
  id: 6,
  level: 1,
  label: 'Collections',
  category: 'collections',
  path: '/products/collections',
  subCategories: [BATH_AND_BODY, SUGAR_POP, HAIR_CARE, GIFTING],
} as const;

/* ================================ COLLECTIONS START ================================ */

export const NAVBAR_CATEGORIES_DATA = [
  FOR_YOU,
  //   lips,
  // eyes,
  // face,
  // skin,
  COLLECTIONS,
  ABOUT,
];
