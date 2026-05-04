import About from '@/components/layout/navbar/children/About';
import Collections from '@/components/layout/navbar/children/Collection';
import Eyes from '@/components/layout/navbar/children/Eyes';
import Face from '@/components/layout/navbar/children/Face';
import ForYou from '@/components/layout/navbar/children/ForYou';
import Lips from '@/components/layout/navbar/children/Lips';
import Skin from '@/components/layout/navbar/children/Skin';
import type { FC } from 'react';

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

/* ================================ SKIN START ================================ */

export const MOISTURIZERS = {
  id: 1,
  level: 2,
  label: 'Moisturizers',
  category: 'moisturizers',
  path: `/products/skin/moisturizers`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Night Cream',
      category: 'night_cream',
      path: `/products/skin/moisturizers/night_cream`,
      icon: 'solar:infinity-bold',
      description: 'Deeply hydrates and repairs tired skin while you sleep.',
    },
    {
      id: 2,
      level: 3,
      label: 'Eye Cream',
      category: 'eye_cream',
      path: `/products/skin/moisturizers/eye_cream`,
      icon: 'solar:infinity-bold',
      description: 'Reduces puffiness, dark circles, and fine lines quickly.',
    },
    {
      id: 3,
      level: 3,
      label: 'Serum',
      category: 'serum',
      path: `/products/skin/moisturizers/serum`,
      icon: 'solar:infinity-bold',
      description: 'Nourishes skin with essential vitamins for a radiant glow.',
    },
    {
      id: 4,
      level: 3,
      label: 'Skincare Kit',
      category: 'skincare_kit',
      path: `/products/skin/moisturizers/skincare_kit`,
      icon: 'solar:infinity-bold',
      description: 'Complete care sets for all skin types and beauty concerns.',
    },
  ],
} as const;

export const CLEANSING_AND_EXFOLIATION = {
  id: 2,
  level: 2,
  label: 'Cleansing & Exfoliation',
  category: 'cleansing_and_exfoliation',
  path: `/products/skin/cleansing_and_exfoliation`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Cleanser',
      category: 'cleanser',
      path: `/products/skin/cleansing_and_exfoliation/cleanser`,
      icon: 'solar:infinity-bold',
      description: 'Gently removes dirt, excess oil, and makeup for clean skin.',
    },
    {
      id: 2,
      level: 3,
      label: 'Face Wash',
      category: 'face_wash',
      path: `/products/skin/cleansing_and_exfoliation/face_wash`,
      icon: 'solar:infinity-bold',
      description: 'Refreshing daily wash for soft and healthy-looking skin tone.',
    },
    {
      id: 3,
      level: 3,
      label: 'Exfoliator & Scrub',
      category: 'exfoliator_and_scrub',
      path: `/products/skin/cleansing_and_exfoliation/exfoliator_and_scrub`,
      icon: 'solar:infinity-bold',
      description: 'Removes dead skin cells to reveal a fresh and smooth glow.',
    },
    {
      id: 4,
      level: 3,
      label: 'Sunscreen',
      category: 'sunscreen',
      path: `/products/skin/cleansing_and_exfoliation/sunscreen`,
      icon: 'solar:infinity-bold',
      description: 'Shields skin from harmful UV rays and sun damage daily.',
    },
  ],
} as const;

export const NATURES_BLEND = {
  id: 3,
  level: 2,
  label: "Nature's Blend",
  category: 'natures_blend',
  path: `/products/skin/natures_blend`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Aquaholic',
      category: 'aquaholic',
      path: `/products/skin/natures_blend/aquaholic`,
      icon: 'solar:infinity-bold',
      description: 'Hydration-rich formulas to deeply quench dry, dull skin.',
    },
    {
      id: 2,
      level: 3,
      label: 'Coffee Culture',
      category: 'coffee_culture',
      path: `/products/skin/natures_blend/coffee_culture`,
      icon: 'solar:infinity-bold',
      description: 'Energizing coffee extracts for a firm, smooth, youthful feel.',
    },
    {
      id: 3,
      level: 3,
      label: 'Citrus Got Real',
      category: 'citrus_got_real',
      path: `/products/skin/natures_blend/citrus_got_real`,
      icon: 'solar:infinity-bold',
      description: 'Vitamin C boost for brighter, fresher, healthier-looking skin.',
    },
    {
      id: 4,
      level: 3,
      label: 'View All',
      category: 'view_all',
      path: `/products/skin/natures_blend/view_all`,
      icon: 'solar:infinity-bold',
      description: 'Explore all skincare essentials, perfectly tailored for you.',
    },
  ],
} as const;

export const FACE_MASK = {
  id: 4,
  level: 2,
  label: 'Face Mask',
  category: 'face_mask',
  path: `/products/skin/face_mask`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Sheet Mask',
      category: 'sheet_mask',
      path: `/products/skin/face_mask/sheet_mask`,
      icon: 'solar:infinity-bold',
      description: 'Instant hydration and glowing effect in just a few minutes.',
    },
    {
      id: 2,
      level: 3,
      label: 'Face Pack',
      category: 'face_pack',
      path: `/products/skin/face_mask/face_pack`,
      icon: 'solar:infinity-bold',
      description: 'Detox and refresh your skin naturally with herbal extracts.',
    },
    {
      id: 3,
      level: 3,
      label: 'View All',
      category: 'view_all',
      path: `/products/skin/face_mask/view_all`,
      icon: 'solar:infinity-bold',
      description: 'Browse all skincare must-haves for a flawless glowing look.',
    },
  ],
} as const;

export const SKIN = {
  id: 5,
  level: 1,
  label: 'Skin',
  category: 'skin',
  path: '/products/skin',
  subCategories: [MOISTURIZERS, CLEANSING_AND_EXFOLIATION, NATURES_BLEND, FACE_MASK],
} as const;

/* ================================ SKIN END ================================ */

/* ================================ FACE START ================================ */

export const FACE_MAKEUP = {
  id: 1,
  level: 2,
  label: 'Face Makeup',
  category: 'face_makeup',
  path: `/products/face/face_makeup`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Foundation',
      category: 'foundation',
      path: `/products/face/face_makeup/foundation`,
      icon: 'solar:infinity-bold',
      description: 'Provides coverage for a flawless base with a natural, smooth finish.',
    },
    {
      id: 2,
      level: 3,
      label: 'BB Cream',
      category: 'bb_cream',
      path: `/products/face/face_makeup/bb_cream`,
      icon: 'solar:infinity-bold',
      description: 'Lightweight formula that hydrates, evens skin tone, and protects skin.',
    },
    {
      id: 3,
      level: 3,
      label: 'Compact Powder',
      category: 'compact_powder',
      path: `/products/face/face_makeup/compact_powder`,
      icon: 'solar:infinity-bold',
      description: 'Sets makeup, reduces shine, and ensures a long-lasting matte finish.',
    },
    {
      id: 4,
      level: 3,
      label: 'Loose Powder',
      category: 'loose_powder',
      path: `/products/face/face_makeup/loose_powder`,
      icon: 'solar:infinity-bold',
      description: 'Finely milled powder for a smooth, shine-free finish that lasts all day.',
    },
    {
      id: 5,
      level: 3,
      label: 'Banana Powder',
      category: 'banana_powder',
      path: `/products/face/face_makeup/banana_powder`,
      icon: 'solar:infinity-bold',
      description: 'Brightens the complexion, reduces shine, and sets makeup beautifully.',
    },
    {
      id: 6,
      level: 3,
      label: 'SPF Foundation',
      category: 'spf_foundation',
      path: `/products/face/face_makeup/spf_foundation`,
      icon: 'solar:infinity-bold',
      description: 'Combines sun protection, coverage for a flawless, radiant look.',
    },
  ],
};

export const TRADITIONAL_AND_ESSENTIALS = {
  id: 2,
  level: 2,
  label: 'Traditional & Essentials',
  category: 'traditional_and_essentials',
  path: `/products/face/traditional_and_essentials`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Sindoor',
      category: 'sindoor',
      path: `/products/face/traditional_and_essentials/sindoor`,
      icon: 'solar:infinity-bold',
      description: 'Symbolic powder for the hairline, enhancing traditional elegance.',
    },
  ],
};

export const CHEEKS_AND_GLOW = {
  id: 3,
  level: 2,
  label: 'Cheeks & Glow',
  category: 'cheeks_and_glow',
  path: `/products/face/cheeks_and_glow`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Highlighter',
      category: 'highlighter',
      path: `/products/face/cheeks_and_glow/highlighter`,
      icon: 'solar:infinity-bold',
      description: 'Adds a radiant, enhancing features with a luminous, dewy look.',
    },
    {
      id: 2,
      level: 3,
      label: 'Liquid Highlighter',
      category: 'liquid_highlighter',
      path: `/products/face/cheeks_and_glow/liquid_highlighter`,
      icon: 'solar:infinity-bold',
      description: 'Blendable liquid formula for a glowing, buildable, natural look.',
    },
    {
      id: 3,
      level: 3,
      label: 'Blush',
      category: 'blush',
      path: `/products/face/cheeks_and_glow/blush`,
      icon: 'solar:infinity-bold',
      description: 'Adds a pop of color to cheeks, creating a youthful, healthy look.',
    },
    {
      id: 4,
      level: 3,
      label: 'Cheek Stain',
      category: 'cheek_stain',
      path: `/products/face/cheeks_and_glow/cheek_stain`,
      icon: 'solar:infinity-bold',
      description: 'Long-lasting tint for a natural, flushed look that stays vibrant.',
    },
  ],
};

export const SETTING_AND_FINISHING = {
  id: 4,
  level: 2,
  label: 'Setting & Finishing',
  category: 'setting_and_finishing',
  path: `/products/face/setting_and_finishing`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Setting Spray',
      category: 'setting_spray',
      path: `/products/face/setting_and_finishing/setting_spray`,
      icon: 'solar:infinity-bold',
      description: 'Locks makeup for long wear, maintaining a fresh look without.',
    },
    {
      id: 2,
      level: 3,
      label: 'Compact',
      category: 'compact',
      path: `/products/face/setting_and_finishing/compact`,
      icon: 'solar:infinity-bold',
      description: 'Portable powder for touch-ups, controls shine, sets makeup place.',
    },
    {
      id: 3,
      level: 3,
      label: 'Fixer',
      category: 'fixer',
      path: `/products/face/setting_and_finishing/fixer`,
      icon: 'solar:infinity-bold',
      description: 'Enhances makeup longevity, ensuring a smudge-proof, flawless.',
    },
  ],
};

export const FOUNDATIONS_BY_FINISH = {
  id: 5,
  level: 2,
  label: 'Foundations by Finish',
  category: 'foundations_by_finish',
  path: `/products/face/foundations_by_finish`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Liquid Foundation',
      category: 'liquid_foundation',
      path: `/products/face/foundations_by_finish/liquid_foundation`,
      icon: 'solar:infinity-bold',
      description: 'Buildable coverage with a natural finish that blends seamlessly skin.',
    },
    {
      id: 2,
      level: 3,
      label: 'Matte Foundation',
      category: 'matte_foundation',
      path: `/products/face/foundations_by_finish/matte_foundation`,
      icon: 'solar:infinity-bold',
      description: 'Oil-absorbing formula for a shine-free, velvety matte look lasts.',
    },
    {
      id: 3,
      level: 3,
      label: 'Water Resistant Foundation',
      category: 'water_resistant_foundation',
      path: `/products/face/foundations_by_finish/water_resistant_foundation`,
      icon: 'solar:infinity-bold',
      description: 'Long-wearing, water-resistant foundation that stays flawless day.',
    },
    {
      id: 4,
      level: 3,
      label: 'High Coverage Foundation',
      category: 'high_coverage_foundation',
      path: `/products/face/foundations_by_finish/high_coverage_foundation`,
      icon: 'solar:infinity-bold',
      description: 'Conceals imperfections with full coverage, ensuring flawless look.',
    },
    {
      id: 5,
      level: 3,
      label: 'Stick Foundation',
      category: 'stick_foundation',
      path: `/products/face/foundations_by_finish/stick_foundation`,
      icon: 'solar:infinity-bold',
      description: 'Convenient stick format for easy application and buildable coverage.',
    },
  ],
};

export const FOUNDATIONS_BY_SKIN_TYPE = {
  id: 6,
  level: 2,
  label: 'Foundations by Skin Type',
  category: 'foundations_by_skin_type',
  path: `/products/face/foundations_by_skin_type`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Best for Dry Skin',
      category: 'best_for_dry_skin',
      path: `/products/face/foundations_by_skin_type/best_for_dry_skin`,
      icon: 'solar:infinity-bold',
      description: 'Hydrating formula that nourishes and enhances radiance for dry skin.',
    },
    {
      id: 2,
      level: 3,
      label: 'Best for Oily Skin',
      category: 'best_for_oily_skin',
      path: `/products/face/foundations_by_skin_type/best_for_oily_skin`,
      icon: 'solar:infinity-bold',
      description: 'Oil-controlling foundation that reduces shine, prevents breakouts.',
    },
  ],
};

export const PRIMERS_AND_REMOVERS = {
  id: 7,
  level: 2,
  label: 'Primers & Removers',
  category: 'primers_and_removers',
  path: `/products/face/primers_and_removers`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Makeup Remover',
      category: 'makeup_remover',
      path: `/products/face/primers_and_removers/makeup_remover`,
      icon: 'solar:infinity-bold',
      description: 'Gently removes makeup while hydrating and refreshing the skin.',
    },
    {
      id: 2,
      level: 3,
      label: 'Primer',
      category: 'primer',
      path: `/products/face/primers_and_removers/primer`,
      icon: 'solar:infinity-bold',
      description: 'Prepares skin, creating a smooth base for long-lasting makeup.',
    },
  ],
};

export const BRONZERS_AND_CONTOURS = {
  id: 8,
  level: 2,
  label: 'Bronzers & Contours',
  category: 'bronzers_and_contours',
  path: `/products/face/bronzers_and_contours`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Bronzer',
      category: 'bronzer',
      path: `/products/face/bronzers_and_contours/bronzer`,
      icon: 'solar:infinity-bold',
      description: 'Adds warmth and a sun-kissed glow for a radiant complexion.',
    },
    {
      id: 2,
      level: 3,
      label: 'Contour',
      category: 'contour',
      path: `/products/face/bronzers_and_contours/contour`,
      icon: 'solar:infinity-bold',
      description: 'Defines features with shadows, enhancing structure and depth.',
    },
  ],
};

export const CONCEALERS_AND_CORRECTORS = {
  id: 9,
  level: 2,
  label: 'Concealers & Correctors',
  category: 'concealers_and_correctors',
  path: `/products/face/concealers_and_correctors`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Color Concealer',
      category: 'color_concealer',
      path: `/products/face/concealers_and_correctors/color_concealer`,
      icon: 'solar:infinity-bold',
      description: 'It covers flaws with precision, delivering a flawless, airbrushed.',
    },
    {
      id: 2,
      level: 3,
      label: 'Color Corrector',
      category: 'color_corrector',
      path: `/products/face/concealers_and_correctors/color_corrector`,
      icon: 'solar:infinity-bold',
      description: 'Neutralizes discoloration, balancing skin tone for a radiant finish.',
    },
  ],
};

export const FACE = {
  id: 4,
  level: 1,
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
};

/* ================================ FACE END ================================ */

/* ================================ EYES START ================================ */

export const KOHL_AND_KAJAL = {
  id: 1,
  level: 2,
  label: 'Kohl & Kajal',
  category: 'kohl_and_kajal',
  path: `/products/eyes/kohl_and_kajal`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Kohl',
      category: 'kohl',
      path: `/products/eyes/kohl_and_kajal/kohl`,
      icon: 'solar:infinity-bold',
      description: 'Intensely pigmented kohls for bold, long-lasting eye definition all day.',
    },
    {
      id: 2,
      level: 3,
      label: 'Kajal',
      category: 'kajal',
      path: `/products/eyes/kohl_and_kajal/kajal`,
      icon: 'solar:infinity-bold',
      description: 'Smooth kajals for a dramatic look, perfect for waterline application.',
    },
    {
      id: 3,
      level: 3,
      label: 'Smudge Proof Kajal',
      category: 'smudge_proof_kajal',
      path: `/products/eyes/kohl_and_kajal/smudge_proof_kajal`,
      icon: 'solar:infinity-bold',
      description: 'Long-lasting, smudge-proof kajal for sharp, defined eyes all day long.',
    },
  ],
};

export const MASCARAS = {
  id: 2,
  level: 2,
  label: 'Mascaras',
  category: 'mascaras',
  path: `/products/eyes/mascaras`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Volumizing Mascara',
      category: 'volumizing_mascara',
      path: `/products/eyes/mascaras/volumizing_mascara`,
      icon: 'solar:infinity-bold',
      description: 'Boosts lash volume for a fuller, more dramatic look with each coat.',
    },
    {
      id: 2,
      level: 3,
      label: 'Curl Lengthening Mascara',
      category: 'curl_lengthening_mascara',
      path: `/products/eyes/mascaras/curl_lengthening_mascara`,
      icon: 'solar:infinity-bold',
      description: 'Lifts and curls lashes for a wide-eyed look with added length and volume.',
    },
    {
      id: 3,
      level: 3,
      label: 'Waterproof Mascara',
      category: 'waterproof_mascara',
      path: `/products/eyes/mascaras/waterproof_mascara`,
      icon: 'solar:infinity-bold',
      description: 'Water-resistant formula for long-lasting wear without smudging or flaking.',
    },
  ],
};

export const EYELINERS = {
  id: 3,
  level: 2,
  label: 'Eyeliners',
  category: 'eyeliners',
  path: `/products/eyes/eyeliners`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Liquid Eyeliner',
      category: 'liquid_eyeliner',
      path: `/products/eyes/eyeliners/liquid_eyeliner`,
      icon: 'solar:infinity-bold',
      description: 'Precision tip for sharp lines, perfect for bold cat-eye or winged looks.',
    },
    {
      id: 2,
      level: 3,
      label: 'Gel Eyeliner',
      category: 'gel_eyeliner',
      path: `/products/eyes/eyeliners/gel_eyeliner`,
      icon: 'solar:infinity-bold',
      description: 'Creamy, blendable gel eyeliner for versatile looks, from bold to subtle.',
    },
    {
      id: 3,
      level: 3,
      label: 'Pen Eyeliner',
      category: 'pen_eyeliner',
      path: `/products/eyes/eyeliners/pen_eyeliner`,
      icon: 'solar:infinity-bold',
      description: 'Easy-to-use pen for precise lines, ideal for beginners and quick touch-ups.',
    },
  ],
};

export const EYESHADOW = {
  id: 4,
  level: 2,
  label: 'Eyeshadow',
  category: 'eyeshadow',
  path: `/products/eyes/eyeshadow`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Eyeshadow Palette',
      category: 'eyeshadow_palette',
      path: `/products/eyes/eyeshadow/eyeshadow_palette`,
      icon: 'solar:infinity-bold',
      description: 'Versatile palettes with coordinated shades for endless eye makeup looks.',
    },
    {
      id: 2,
      level: 3,
      label: 'Liquid Eyeshadow',
      category: 'liquid_eyeshadow',
      path: `/products/eyes/eyeshadow/liquid_eyeshadow`,
      icon: 'solar:infinity-bold',
      description: 'High-pigment liquid shadows for easy application and long-lasting shimmer.',
    },
    {
      id: 3,
      level: 3,
      label: 'Glitter Eyeshadow',
      category: 'glitter_eyeshadow',
      path: `/products/eyes/eyeshadow/glitter_eyeshadow`,
      icon: 'solar:infinity-bold',
      description: 'Sparkling glitter shadows for a bold, glamorous look on special occasions.',
    },
  ],
};

export const EYEBROWS = {
  id: 5,
  level: 2,
  label: 'Eyebrows',
  category: 'eyebrows',
  path: `/products/eyes/eyebrows`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Brow Definer',
      category: 'brow_definer',
      path: `/products/eyes/eyebrows/brow_definer`,
      icon: 'solar:infinity-bold',
      description: 'Defines brows with precision for a well-groomed and polished appearance.',
    },
    {
      id: 2,
      level: 3,
      label: 'Brow Pencil',
      category: 'brow_pencil',
      path: `/products/eyes/eyebrows/brow_pencil`,
      icon: 'solar:infinity-bold',
      description: 'Easy-to-use pencil for filling and shaping brows with natural-looking color.',
    },
    {
      id: 3,
      level: 3,
      label: 'Brow Gel',
      category: 'brow_gel',
      path: `/products/eyes/eyebrows/brow_gel`,
      icon: 'solar:infinity-bold',
      description: 'Sets and tames brows, providing a long-lasting hold with a natural finish.',
    },
  ],
};

export const EYE_VALUE_SET = {
  id: 6,
  level: 2,
  label: 'Eye Value Set',
  category: 'eye_value_set',
  path: `/products/eyes/eye_value_set`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Eyelashes',
      category: 'eyelashes',
      path: `/products/eyes/eye_value_set/eyelashes`,
      icon: 'solar:infinity-bold',
      description: 'Enhance your eyes with faux lashes for added volume and captivating charm.',
    },
    {
      id: 2,
      level: 3,
      label: 'Eye Gift Set',
      category: 'eye_gift_set',
      path: `/products/eyes/eye_value_set/eye_gift_set`,
      icon: 'solar:infinity-bold',
      description: "Perfect gift sets featuring popular eye products for makeup lovers' delight.",
    },
    {
      id: 3,
      level: 3,
      label: 'Eye Combo',
      category: 'eye_combo',
      path: `/products/eyes/eye_value_set/eye_combo`,
      icon: 'solar:infinity-bold',
      description: 'Convenient sets with eye essentials for a complete, coordinated eye look.',
    },
  ],
};

export const EYES = {
  id: 3,
  level: 1,
  label: 'Eyes',
  category: 'eyes',
  path: '/products/eyes',
  subCategories: [KOHL_AND_KAJAL, MASCARAS, EYELINERS, EYESHADOW, EYEBROWS, EYE_VALUE_SET],
};

/* ================================ EYES END ================================ */

/* ================================ LIPS START ================================ */

export const FINISH_TYPES = {
  id: 1,
  level: 2,
  label: 'Finish Types',
  category: 'finish_types',
  path: `/products/lips/finish_types`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Matte Lipstick',
      category: 'matte_lipstick',
      path: `/products/lips/finish_types/matte_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'Velvety matte finish with long-lasting, intense color payoff everywhere.',
    },
    {
      id: 2,
      level: 3,
      label: 'Satin Lipstick',
      category: 'satin_lipstick',
      path: `/products/lips/finish_types/satin_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'Smooth, creamy texture with a luminous, semi-matte finish always.',
    },
    {
      id: 3,
      level: 3,
      label: 'Hi-Shine Lipstick',
      category: 'hi_shine_lipstick',
      path: `/products/lips/finish_types/hi_shine_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'Glossy finish for a shiny, luscious look with rich pigment beautifully.',
    },
    {
      id: 4,
      level: 3,
      label: 'Lip Gloss',
      category: 'lip_gloss',
      path: `/products/lips/finish_types/lip_gloss`,
      icon: 'solar:infinity-bold',
      description: 'Sheer to medium coverage with a high-shine, glossy finish flawlessly.',
    },
  ],
};

export const LIPSTICK_FORMS = {
  id: 2,
  level: 2,
  label: 'Lipstick Forms',
  category: 'lipstick_forms',
  path: `/products/lips/lipstick_forms`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Liquid Lipstick',
      category: 'liquid_lipstick',
      path: `/products/lips/lipstick_forms/liquid_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'Rich, long-lasting color with a lightweight, matte finish beautifully.',
    },
    {
      id: 2,
      level: 3,
      label: 'Powder Lipstick',
      category: 'powder_lipstick',
      path: `/products/lips/lipstick_forms/powder_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'Weightless powder formula with a soft-focus, matte effect perfectly.',
    },
    {
      id: 3,
      level: 3,
      label: 'Crayon Lipstick',
      category: 'crayon_lipstick',
      path: `/products/lips/lipstick_forms/crayon_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'Easy-to-apply crayon for precise lines and bold color payoff smoothly.',
    },
    {
      id: 4,
      level: 3,
      label: 'Bullet Lipstick',
      category: 'bullet_lipstick',
      path: `/products/lips/lipstick_forms/bullet_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'Classic bullet shape with smooth, creamy, full-coverage color always.',
    },
  ],
};

export const LONG_LASTING_LIPSTICKS = {
  id: 3,
  level: 2,
  label: 'Long-Lasting Lipsticks',
  category: 'long_lasting_lipsticks',
  path: `/products/lips/long_lasting_lipsticks`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Transfer Proof Lipstick',
      category: 'transfer_proof_lipstick',
      path: `/products/lips/long_lasting_lipsticks/transfer_proof_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'Stays put all day without smudging or fading for long-lasting wear.',
    },
    {
      id: 2,
      level: 3,
      label: 'Water Proof Lipstick',
      category: 'water_proof_lipstick',
      path: `/products/lips/long_lasting_lipsticks/water_proof_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'Resistant to water and sweat, ensuring color stays vibrant always.',
    },
    {
      id: 3,
      level: 3,
      label: 'Lip Tint & Stain',
      category: 'lip_tint_and_stain',
      path: `/products/lips/long_lasting_lipsticks/lip_tint_and_stain`,
      icon: 'solar:infinity-bold',
      description: 'Lightweight tint with a natural finish that lasts for hours smoothly.',
    },
    {
      id: 4,
      level: 3,
      label: 'Smudge Proof',
      category: 'smudge_proof_lipstick',
      path: `/products/lips/long_lasting_lipsticks/smudge_proof_lipstick`,
      icon: 'solar:infinity-bold',
      description: 'No smudging or transferring, providing a flawless look perfectly.',
    },
  ],
};

export const LIP_CARE = {
  id: 4,
  level: 2,
  label: 'Lip Care',
  category: 'lip_care',
  path: `/products/lips/lip_care`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Lip Primer & Scrub',
      category: 'lip_primer_and_scrub',
      path: `/products/lips/lip_care/lip_primer_and_scrub`,
      icon: 'solar:infinity-bold',
      description: 'Preps lips for smooth application and enhances color beautifully.',
    },
    {
      id: 2,
      level: 3,
      label: 'Lipstick Fixer & Remover',
      category: 'lipstick_fixer_and_remover',
      path: `/products/lips/lip_care/lipstick_fixer_and_remover`,
      icon: 'solar:infinity-bold',
      description: 'Ensures long wear and easy removal without residue effortlessly.',
    },
    {
      id: 3,
      level: 3,
      label: 'Lip Balm',
      category: 'lip_balm',
      path: `/products/lips/lip_care/lip_balm`,
      icon: 'solar:infinity-bold',
      description: 'Deeply hydrates and protects lips from dryness and cracking.',
    },
    {
      id: 4,
      level: 3,
      label: 'Tinted Lip Balm',
      category: 'tinted_lip_balm',
      path: `/products/lips/lip_care/tinted_lip_balm`,
      icon: 'solar:infinity-bold',
      description: 'Hydration with a hint of color for a natural, radiant look daily.',
    },
  ],
};

export const LIP_ENHANCERS_AND_OTHER = {
  id: 5,
  level: 2,
  label: 'Lip Enhancers & Other',
  category: 'lip_enhancers_and_other',
  path: `/products/lips/lip_enhancers_and_other`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Lip Liner',
      category: 'lip_liner',
      path: `/products/lips/lip_enhancers_and_other/lip_liner`,
      icon: 'solar:infinity-bold',
      description: 'Defines lips with precision, shaping and preventing feathering daily.',
    },
    {
      id: 2,
      level: 3,
      label: 'Lip Glitter',
      category: 'lip_glitter',
      path: `/products/lips/lip_enhancers_and_other/lip_glitter`,
      icon: 'solar:infinity-bold',
      description: 'Adds sparkle and shine for a glamorous, bold look on special occasions.',
    },
    {
      id: 3,
      level: 3,
      label: 'View All',
      category: 'view_all',
      path: `/products/lips/lip_enhancers_and_other/view_all`,
      icon: 'solar:infinity-bold',
      description: 'Explore the complete range of lip products for every need beautifully.',
    },
  ],
};

export const LIPSTICK_SETS_AND_COMBOS = {
  id: 6,
  level: 2,
  label: 'Lipstick Set & Combo',
  category: 'lipstick_set_and_combo',
  path: `/products/lips/lipstick_set_and_combo`,
  subCategories: [
    {
      id: 1,
      level: 3,
      label: 'Lipstick Set',
      category: 'lipstick_set',
      path: `/products/lips/lipstick_set_and_combo/lipstick_set`,
      icon: 'solar:infinity-bold',
      description: 'Multiple shades in one set for versatile, everyday looks beautifully.',
    },
    {
      id: 2,
      level: 3,
      label: 'Lipstick Combo',
      category: 'lipstick_combo',
      path: `/products/lips/lipstick_set_and_combo/lipstick_combo`,
      icon: 'solar:infinity-bold',
      description: 'Perfectly paired lip products for a complete, cohesive look always.',
    },
    {
      id: 3,
      level: 3,
      label: 'Lip Palette',
      category: 'lip_palette',
      path: `/products/lips/lipstick_set_and_combo/lip_palette`,
      icon: 'solar:infinity-bold',
      description: 'Versatile palette with various shades for creative, bold looks daily.',
    },
  ],
};

export const LIPS = {
  id: 2,
  level: 1,
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
};

/* ================================ LIPS END ================================ */

export const NAVBAR_CATEGORIES_DATA = [FOR_YOU, LIPS, EYES, FACE, SKIN, COLLECTIONS, ABOUT];

export const COMPONENT_MAP: Record<(typeof NAVBAR_CATEGORIES_DATA)[number]['category'], FC> = {
  [FOR_YOU.category]: ForYou,
  [SKIN.category]: Skin,
  [FACE.category]: Face,
  [EYES.category]: Eyes,
  [LIPS.category]: Lips,
  [COLLECTIONS.category]: Collections,
  [ABOUT.category]: About,
} as const;
