import { ChatIcon, PlayIcon } from '../../icons';
import type { ICategoryL2 } from '../../types';

export const new_new: ICategoryL2 = {
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
      icon: () => null, // not in use only for typescript warning
    },
  ],
};

export const sugar_play: ICategoryL2 = {
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
      icon: () => null, // not in use only for typescript warning
    },
  ],
};

export const offers: ICategoryL2 = {
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
    {
      id: 1,
      level: 3,
      label: '',
      path: '/offers',
      category: '',
      description: '',
      icon: () => null, // not in use only for typescript warning
    },
  ],
};

export const blogs: ICategoryL2 = {
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
    {
      id: 1,
      level: 3,
      path: '/blogs',
      label: '',
      category: '',
      description: '',
      icon: () => null, // not in use only for typescript warning
    },
  ],
};

export const SOCIAL_COMMUNITY = [
  { icon: PlayIcon, label: "Founder's Story: Watch Now", path: '/press-media#watch' },
  { icon: ChatIcon, label: 'Chat with our team', path: '/contact' },
];
