import {
  AboutUsIcon,
  AwardsIcon,
  ComplianceIcon,
  ContactUsIcon,
  MissionVisionValuesIcon,
  NewsRoomIcon,
  OpeningsIcon,
  PrivacyPolicyIcon,
  RetailECommerceIcon,
  TeamIcon,
  TermsAndConditionsIcon,
  ValuesAndCultureIcon,
} from '@/Icons';
import type { ICategoryL2 } from '@/Types/Common.type';

export const company: ICategoryL2 = {
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
      icon: AboutUsIcon,
      description: 'Learn about our journey, mission, and values that define our brand.',
    },
    {
      id: 2,
      level: 3,
      label: 'Mission Vision Values',
      category: 'mission_vision_values',
      path: '/mission-vision',
      icon: MissionVisionValuesIcon,
      description: "Discover our purpose, vision, and values driving our company's success.",
    },
    {
      id: 3,
      level: 3,
      label: 'Team',
      category: 'team',
      path: '/teams',
      icon: TeamIcon,
      description: 'Meet our talented team committed to delivering excellence every day.',
    },
    {
      id: 4,
      level: 3,
      label: 'Contact Us',
      category: 'contact_us',
      path: '/contact',
      icon: ContactUsIcon,
      description: 'Get in touch with us for inquiries, support, or collaboration opportunities.',
    },
  ],
};

export const press: ICategoryL2 = {
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
      icon: NewsRoomIcon,
      description: 'Stay updated with our latest news, events, and media announcements.',
    },
    {
      id: 2,
      level: 3,
      label: 'Awards',
      category: 'awards',
      path: '/awards',
      icon: AwardsIcon,
      description: 'Explore the recognitions and awards we have received for excellence.',
    },
  ],
};

export const careers: ICategoryL2 = {
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
      icon: ValuesAndCultureIcon,
      description: 'Experience our vibrant culture driven by values of growth and innovation.',
    },
    {
      id: 2,
      level: 3,
      label: 'Openings',
      category: 'openings',
      path: '/careers',
      icon: OpeningsIcon,
      description: 'Discover exciting career opportunities and join our dynamic team today.',
    },
    {
      id: 3,
      level: 3,
      label: 'Retail/E-Commerce',
      category: 'retail_e_commerce',
      path: '/retail-and-e-commerce',
      icon: RetailECommerceIcon,
      description: 'Explore roles in retail and e-commerce driving our digital success.',
    },
  ],
};

export const trust_center: ICategoryL2 = {
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
      icon: ComplianceIcon,
      description: 'Understand our compliance standards ensuring trust and transparency.',
    },
    {
      id: 2,
      level: 3,
      label: 'Privacy/Policy',
      category: 'privacy_policy',
      path: '/privacy-policy',
      icon: PrivacyPolicyIcon,
      description: 'Learn about our privacy practices and data protection commitments.',
    },
    {
      id: 3,
      level: 3,
      label: 'Terms & Conditions',
      category: 'terms_and_conditions',
      path: '/terms-conditions',
      icon: TermsAndConditionsIcon,
      description: 'Review our terms and conditions for using our products and services.',
    },
  ],
};

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
];
