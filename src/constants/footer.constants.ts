import { ROUTES } from './common.constants';

const { COMPANY, LEGAL, PRODUCTS, PROFILE, QUICK_LINKS, SERVICES } = ROUTES;

export const FOOTER_CATEGORIES = [
  {
    title: 'Company',
    options: [
      { title: 'About Us', path: `/${COMPANY.ABOUT_US}` },
      { title: 'Partner With Us', path: `/${COMPANY.PARTNER_WITH_US}` },
      { title: 'Careers', path: `/${COMPANY.CAREERS}` },
      { title: 'Sustainability', path: `/${COMPANY.SUSTAINABILITY}` },
      { title: 'Ethics', path: `/${COMPANY.ETHICS}` },
      { title: 'Press/Media', path: `/${COMPANY.PRESS_MEDIA}` },
    ],
  },
  {
    title: 'Quick Links',
    options: [
      { title: 'My Account', path: `/${PROFILE.BASE}`, private: true },
      { title: 'Order History', path: `/${PROFILE.BASE}/${PROFILE.ORDERS}`, private: true },
      { title: 'Wishlist', path: `/${PROFILE.BASE}/${PROFILE.WISHLIST}`, private: true },
      {
        title: 'Refer a Friend',
        path: `/${PROFILE.BASE}/${PROFILE.REFER_A_FRIEND}`,
        private: true,
      },
      { title: 'Store Locator', path: `/${QUICK_LINKS.STORE_LOCATOR}` },
      {
        title: 'Become a Seller',
        path: `/${QUICK_LINKS.BECOME_SELLER}`,
        private: true,
      },
    ],
  },
  {
    title: 'Products',
    options: [
      { title: 'For You', path: `/${PRODUCTS.BASE}` },
      { title: 'Lip Care', path: `/${PRODUCTS.BASE}` },
      { title: 'Special Collection', path: `/${PRODUCTS.BASE}` },
      { title: 'Face Care', path: `/${PRODUCTS.BASE}` },
      { title: 'Skin Care', path: `/${PRODUCTS.BASE}` },
      { title: 'Eye Care', path: `/${PRODUCTS.BASE}` },
    ],
  },
  {
    title: 'Services',
    options: [
      { title: 'Contact Us', path: `/${SERVICES.CONTACT}` },
      { title: 'Help Center/FAQ', path: `/${SERVICES.HELP_CENTER_FAQ}` },
      { title: 'Shipping Info', path: `/${SERVICES.SHIPPING_INFO}` },
      {
        title: 'Returns & Refunds',
        path: `/${PROFILE.BASE}/${PROFILE.ORDERS}/${PROFILE.ORDER_RETURN_REFUND}`,
        private: true,
      },
      {
        title: 'Track My Orders',
        path: `/${PROFILE.BASE}/${PROFILE.ORDERS}/${PROFILE.ORDER_TRACK}`,
        private: true,
      },
    ],
  },
  {
    title: 'Legal & Policies',
    options: [
      { title: 'Privacy Policy', path: `/${LEGAL.PRIVACY_POLICY}` },
      { title: 'Cookie Policy', path: `/${LEGAL.COOKIE_POLICY}` },
      { title: 'Terms & Conditions', path: `/${LEGAL.TERMS_CONDITIONS}` },
      { title: 'Disclaimer', path: `/${LEGAL.DISCLAIMER}` },
      { title: 'Accessibility', path: `/${LEGAL.ACCESSIBILITY}` },
    ],
  },
];

export const SOCIAL_MEDIA_LINKS = [
  {
    id: 1,
    icon: 'logos:youtube-icon',
    url: 'https://www.youtube.com/@nageshpawar1997',
  },
  {
    id: 2,
    icon: 'skill-icons:instagram',
    url: 'https://www.instagram.com/aspiring_web_developer',
  },
  {
    id: 3,
    icon: 'devicon:linkedin',
    url: 'https://www.linkedin.com/in/nageshwar-pawar-a25041289',
  },
  {
    id: 4,
    icon: 'logos:facebook',
    url: 'https://www.facebook.com/nageshwar1997',
  },
  {
    id: 5,
    icon: 'icon-park:github',
    url: 'https://github.com/nageshwar1997',
    className: '[&>g>path]:fill-primary!',
  },
  {
    id: 6,
    icon: 'logos:whatsapp-icon',
    url: 'https://wa.me/+919730870409',
  },
];

export const FOOTER_AWARDS = [
  { name: 'Forbes', key: 'Forbes' },
  { name: 'Talent Award', key: 'TalentAward' },
];
