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

export const NAVBAR_CATEGORIES_DATA = [
  FOR_YOU,
  //   lips,
  // eyes,
  // face,
  // skin,
  //   collections,
  ABOUT,
];
