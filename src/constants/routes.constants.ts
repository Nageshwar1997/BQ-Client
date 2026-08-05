export const ROUTES = {
  HOME: '/',
  AWARDS: 'awards',
  COMPANY: {
    ABOUT_US: 'about-us',
    TEAM: 'team',
    MISSION_VISION_VALUES: 'mission-vision-values',
    PARTNER_WITH_US: 'partner-with-us',
    CAREERS: 'careers',
    VALUES_CULTURE: 'values-culture',
    RETAIL_ECOMMERCE: 'retail-e-commerce',
    SUSTAINABILITY: 'sustainability',
    ETHICS: 'ethics',
    PRESS_MEDIA: 'press-media',
    NEWSROOM: 'newsroom',
  },
  SERVICES: {
    CONTACT: 'contact',
    HELP_CENTER_FAQ: 'help-center-faq',
    SHIPPING_INFO: 'shipping-info',
  },
  QUICK_LINKS: {
    STORE_LOCATOR: 'store-locator',
  },
  AUTH: {
    BASE: 'auth',
    LOGIN: 'login',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgot-password',
    OAUTH: 'oauth',
  },
  CATEGORIES: { BASE: 'categories' },
  DISCOVER: {
    NEW_ARRIVALS: 'new-arrivals',
    SPECIAL_COLLECTION: 'special-collection',
    OFFERS_AND_DISCOUNTS: 'offers-and-discounts',
    BLOGS: 'blogs',
  },
  PRODUCTS: {
    BASE: 'products',
    PRODUCT: { BASE: 'product', SLUG: ':slug' },
    CATEGORY_L1_SLUG: ':l1_slug',
    CATEGORY_L2_SLUG: ':l2_slug',
    CATEGORY_L3_SLUG: ':l3_slug',
  },
  LEGAL: {
    ACCESSIBILITY: 'accessibility',
    DISCLAIMER: 'disclaimer',
    TERMS_CONDITIONS: 'terms-conditions',
    COOKIE_POLICY: 'cookie-policy',
    PRIVACY_POLICY: 'privacy-policy',
    COMPLIANCE: 'compliance',
  },
  PROFILE: {
    BASE: 'profile',
    BECOME_SELLER: 'become-seller',
    ORDERS: 'orders',
    ORDER_RETURN_REFUND: 'return-refund',
    ORDER_TRACK: 'track',
    ADDRESSES: 'addresses',
    WISHLIST: 'wishlist',
    REVIEWS: 'reviews',
    REFER_A_FRIEND: 'refer-a-friend',
    GIFT_CARDS: 'gift-cards',
    NOTIFICATIONS: 'notifications',
    UPDATE_PASSWORD: 'update-password',
  },
} as const;

// Path segments that gate a route behind `middleware: [authenticate]` in routes/index.tsx.
// Used to detect "user is currently on a page they can no longer access" (e.g. right after logout).
export const PRIVATE_ROUTE_PREFIXES = [ROUTES.PROFILE.BASE] as const;
