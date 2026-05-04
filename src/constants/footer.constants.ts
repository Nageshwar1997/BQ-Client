export const FOOTER_CATEGORIES = [
  {
    title: 'Company',
    options: [
      { title: 'About Us', path: 'about-us' },
      { title: 'Partner With Us', path: 'partner-with-us' },
      { title: 'Careers', path: 'careers' },
      { title: 'Sustainability', path: 'sustainability' },
      { title: 'Ethics', path: 'ethics' },
      { title: 'Press/Media', path: 'press-media' },
    ],
  },
  {
    title: 'Quick Links',
    options: [
      { title: 'My Account', path: 'account', private: true },
      { title: 'Order History', path: 'orders', private: true },
      { title: 'Wishlist', path: 'wishlist', private: true },
      { title: 'Refer a Friend', path: 'refer', private: true },
      { title: 'Store Locator', path: 'store-locator' },
      {
        title: 'Become a Seller',
        path: 'become-seller',
        private: true,
      },
    ],
  },
  {
    title: 'Products',
    options: [
      { title: 'For You', path: 'products/for_you' },
      { title: 'Lip Care', path: 'products/lips' },
      { title: 'Special Collection', path: 'products/collections' },
      { title: 'Face Care', path: 'products/face' },
      { title: 'Skin Care', path: 'products/skin' },
      { title: 'Eye Care', path: 'products/eyes' },
    ],
  },
  {
    title: 'Services',
    options: [
      { title: 'Contact Us', path: 'contact' },
      { title: 'Help Center/FAQ', path: 'help-center-faq' },
      { title: 'Shipping Info', path: 'shipping-info' },
      {
        title: 'Returns & Refunds',
        path: 'orders/return-refund',
        private: true,
      },
      { title: 'Track My Orders', path: 'orders/track', private: true },
    ],
  },
  {
    title: 'Legal & Policies',
    options: [
      { title: 'Privacy Policy', path: 'privacy-policy' },
      { title: 'Cookie Policy', path: 'cookie-policy' },
      { title: 'Terms & Conditions', path: 'terms-conditions' },
      { title: 'Disclaimer', path: 'disclaimer' },
      { title: 'Accessibility', path: 'accessibility' },
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
