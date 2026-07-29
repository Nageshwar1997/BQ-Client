import type { TCategoryHierarchy, TCategoryHierarchyNode, TLevel2 } from '@/types/api.type';

import { ROUTES } from './routes.constants';

const { PROFILE, SERVICES } = ROUTES;

export const TESTIMONIALS = [
  {
    content:
      'I absolutely love the range of products on this website! The quality is unmatched, and my skin has never felt better. I always get compliments!',
    name: 'Nageshwar Pawar',
    role: 'Founder',
    image: '/images/logo/BQ_gradient_logo.webp',
  },
  {
    content:
      'Finding the perfect shade was so easy. The product descriptions and customer reviews helped me make the right choice. Fast delivery too!',
    name: 'Manjusha Magar',
    role: 'Co-Founder',
    image: '/images/logo/BQ_gradient_logo.webp',
  },
  {
    content:
      'I love how the products feel on my skin. They are lightweight, long-lasting, and make me feel confident all day. Highly recommended!',
    name: 'Deepika Padukone',
    role: 'CEO',
    image: '/images/logo/BQ_gradient_logo.webp',
  },
] as const;

export const NAVBAR_TOP_LAYER_DATA = [
  {
    text: 'Refer a Friend',
    icon: 'lucide:hand-coins',
    path: `/${PROFILE.BASE}/${PROFILE.REFER_A_FRIEND}`,
    private: true,
  },
  { text: 'Gift Card', icon: 'ic:round-card-giftcard', path: '/offers' },
  { text: 'BQ Care', icon: 'hugeicons:customer-service', path: `/${SERVICES.CONTACT}` },
  {
    text: 'Track Orders',
    icon: 'material-symbols:monitor-heart-outline-rounded',
    path: `/${PROFILE.BASE}/${PROFILE.ORDERS}/${PROFILE.ORDER_TRACK}`,
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

export const NEW: TCategoryHierarchyNode<TLevel2> = {
  _id: 'latest_trends',
  name: 'Latest Trends',
  slug: 'latest-trends',
  level: 2,
  parent: 'for_you',
  subcategories: [
    {
      _id: 'new_arrivals',
      name: 'New Arrivals',
      slug: 'new-arrivals',
      level: 3,
      parent: 'new',
      description: 'Discover new beauty arrivals for a fresh, trendy style.',
    },
  ] as const,
} as const;

export const SUGAR_COLLECTION: TCategoryHierarchyNode<TLevel2> = {
  _id: 'sugar_collection',
  name: "Beauty's Collection",
  slug: 'beauty-collection',
  level: 2,
  parent: 'for_you',
  subcategories: [
    {
      _id: 'special_collection',
      name: 'Special Collection',
      level: 3,
      parent: 'sugar_collection',
      slug: 'special-collection',
      description: 'Shop beauty products top-rated & loved by enthusiasts.',
    },
  ],
} as const;

export const OFFERS: TCategoryHierarchyNode<TLevel2> = {
  _id: 'offers',
  name: 'Offers',
  slug: 'offers',
  level: 2,
  parent: 'for_you',
  subcategories: [
    {
      _id: 'offers_and_discounts',
      name: 'Offers & Discounts',
      slug: 'offers-and-discounts',
      level: 3,
      parent: 'offers',
      description: 'Grab discounts on premium cosmetics for a limited time.',
    },
  ],
} as const;

export const BLOGS: TCategoryHierarchyNode<TLevel2> = {
  _id: 'blogs',
  name: 'Blogs',
  slug: 'blogs',
  level: 2,
  parent: 'for_you',
  subcategories: [
    {
      _id: 'beauty_insights',
      name: 'Beauty Insights',
      slug: 'beauty-insights',
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
] as const;

export const FOR_YOU: TCategoryHierarchy = {
  _id: 'for_you',
  name: 'For You',
  slug: 'for-you',
  level: 1,
  subcategories: [NEW, SUGAR_COLLECTION, OFFERS, BLOGS],
} as const;

/* ================================ FOR YOU END ================================ */

/* ================================ ABOUT START ================================ */

export const COMPANY: TCategoryHierarchyNode<TLevel2> = {
  _id: 'company',
  name: 'Company',
  slug: 'company',
  level: 2,
  parent: 'about',
  subcategories: [
    {
      _id: 'about_us',
      name: 'About Us',
      slug: 'about-us',
      level: 3,
      parent: 'company',
      description: 'Learn about our journey, mission, and values that define our brand.',
    },
    {
      _id: 'mission_vision_values',
      name: 'Mission Vision Values',
      slug: 'mission-vision-values',
      level: 3,
      parent: 'company',
      description: "Discover our purpose, vision, and values driving our company's success.",
    },
    {
      _id: 'team',
      name: 'Team',
      slug: 'team',
      level: 3,
      parent: 'company',
      description: 'Meet our talented team committed to delivering excellence every day.',
    },
    {
      _id: 'contact_us',
      name: 'Contact Us',
      slug: 'contact_us',
      level: 3,
      parent: 'company',
      description: 'Get in touch with us for inquiries, support, or collaboration opportunities.',
    },
  ],
} as const;

export const PRESS: TCategoryHierarchyNode<TLevel2> = {
  _id: 'press',
  name: 'Press',
  slug: 'press',
  level: 2,
  parent: 'about',
  subcategories: [
    {
      _id: 'newsroom',
      name: 'Newsroom',
      slug: 'newsroom',
      level: 3,
      parent: 'press',
      description: 'Stay updated with our latest news, events, and media announcements.',
    },
    {
      _id: 'awards',
      name: 'Awards',
      slug: 'awards',
      level: 3,
      parent: 'press',
      description: 'Explore the recognitions and awards we have received for excellence.',
    },
  ],
} as const;

export const CAREERS: TCategoryHierarchyNode<TLevel2> = {
  _id: 'careers',
  name: 'Careers',
  slug: 'careers',
  level: 2,
  parent: 'about',
  subcategories: [
    {
      _id: 'values_culture',
      name: 'Values/Culture',
      slug: 'values-culture',
      level: 3,
      parent: 'careers',
      description: 'Experience our vibrant culture driven by values of growth and innovation.',
    },
    {
      _id: 'openings',
      name: 'Openings',
      slug: 'openings',
      level: 3,
      parent: 'careers',
      description: 'Discover exciting career opportunities and join our dynamic team today.',
    },
    {
      _id: 'retail_e_commerce',
      name: 'Retail/E-Commerce',
      slug: 'retail-e-commerce',
      level: 3,
      parent: 'careers',
      description: 'Explore roles in retail and e-commerce driving our digital success.',
    },
  ],
} as const;

export const TRUST_CENTER: TCategoryHierarchyNode<TLevel2> = {
  _id: 'trust_center_and_legal',
  name: 'Trust Center & Legal',
  slug: 'trust-center-and-legal',
  level: 2,
  parent: 'about',
  subcategories: [
    {
      _id: 'compliance',
      name: 'Compliance',
      slug: 'compliance',
      level: 3,
      parent: 'trust_center_and_legal',
      description: 'Understand our compliance standards ensuring trust and transparency.',
    },
    {
      _id: 'privacy_policy',
      name: 'Privacy/Policy',
      slug: 'privacy-policy',
      level: 3,
      parent: 'trust_center_and_legal',
      description: 'Learn about our privacy practices and data protection commitments.',
    },
    {
      _id: 'terms_and_conditions',
      name: 'Terms & Conditions',
      slug: 'terms-and-conditions',
      level: 3,
      parent: 'trust_center_and_legal',
      description: 'Review our terms and conditions for using our products and services.',
    },
  ],
} as const;

export const ABOUT: TCategoryHierarchy = {
  _id: 'about',
  name: 'About',
  slug: 'about',
  level: 1,
  subcategories: [COMPANY, CAREERS, PRESS, TRUST_CENTER],
} as const;

/* ================================ ABOUT END ================================ */
