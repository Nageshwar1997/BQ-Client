export const ONBOARDING_POLL_INTERVAL_MS = 3000;
export const ONBOARDING_POLL_JITTER_MS = 600;

export const LOCATION_SUGGESTED_CITIES = [
  'Bengaluru',
  'Chennai',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Kolkata',
];

export const PROFESSION_SUGGESTIONS = [
  'Marketing',
  'Sales',
  'Design',
  'Product',
  '3D Design',
  'Development',
  'Founder',
];

export const CATEGORY_SUGGESTIONS = [
  'Fashion',
  'Cosmetics',
  'Furniture',
  'Others',
];

export const SUBCATEGORY_SUGGESTIONS: Record<string, string[]> = {
  Fashion: ['Top', 'Bottom', 'Dress (Top & Bottom)', 'Saree', 'Others'],
  Cosmetics: [
    'Lipstick',
    'Blush',
    'Foundation',
    'Eyebrow',
    'Eyeshadow',
    'Others',
  ],
};

export const REFERRAL_SOURCE_SUGGESTIONS = [
  'Shark Tank India',
  'LinkedIn',
  'Instagram',
  'X',
  'YouTube',
  'Friend',
  'Colleague',
];

export const BEAUTY_CATEGORY_OPTIONS = SUBCATEGORY_SUGGESTIONS.Cosmetics.filter(
  (category) => category !== 'Others'
);
export const FASHION_CATEGORY_OPTIONS = SUBCATEGORY_SUGGESTIONS.Fashion;

export const BRAND_KIT_CONFIRMED_KEY = 'onboarding_brandKitConfirmed';

export const BRAND_DNA_LOADING_TEXT = 'Building your brand DNA...';
export const FETCHING_PRODUCT_DETAILS_TEXT = 'Fetching your product details...';
export const CREATE_FIRST_PAGE_TEXT =
  'Let’s create your first Immersive Product Page';
export const MAKE_PAGE_IMMERSIVE_TEXT =
  'Now let’s make your product page immersive';
export const ONBOARDING_QUESTION_ANALYZE_BRAND =
  'Let’s understand your brand in 60 seconds\n\nDrop your website. We’ll learn your style automatically.';
export const ONBOARDING_QUESTION_BRAND_DNA_READY =
  'Brand kit saved successfully!';
export const ONBOARDING_QUESTION_BEAUTY_TRY_ON =
  'Choose a beauty category and paste a product link to begin.';
export const ONBOARDING_QUESTION_CLOTH_TRY_ON =
  'Upload your photo and a garment image to generate a try-on.';
export const ONBOARDING_QUESTION_PRODUCT_AD =
  'Paste a product page URL to generate a product ad experience.';
export const ONBOARDING_QUESTION_CREATION_PIPELINE =
  'Creating your immersive product page. This may take a moment.';
export const ONBOARDING_QUESTION_BRAND_ADVERTISEMENT =
  'Your brand-matched advertisement is ready.';
export const ONBOARDING_QUESTION_COMPLETE = 'Your onboarding is complete.';

export const BRAND_TRANSFORM_PRODUCT_TEXT =
  'Now, let’s transform one product \n\nPaste a product page URL to preview your first experience.\n\nYou can add product page links from your website, amazon, myntra, nykaa etc.';

export const BRAND_ONBOARDING_INTRO_CONTENT = {
  eyebrow: "Let's Build Your First",
  title: 'Immersive Product Experience',
  cta: 'Get Started',
  helperText: 'Skip for now',
} as const;

export const BRAND_ONBOARDING_INTRO_ITEMS = [
  {
    key: 'brand-dna',
    title: 'Brand DNA',
    description:
      'Define the visual core of your project. Set typography scales, color palettes,',
  },
  {
    key: 'immersive-product-page',
    title: 'Immersive Product Page',
    description:
      ' Build a cinematic product showcase. Import 3D assets, curate the narrative flow,',
  },
] as const;

export const INDIVIDUAL_ONBOARDING_INTRO_CONTENT = {
  eyebrow: 'Welcome to Commverse Studio',
  title: "Let's try 3 insanely cool things you can do here",
  cta: 'Get Started',
  helperText: 'Skip for now',
} as const;

export const INDIVIDUAL_ONBOARDING_INTRO_FEATURE_CARDS = [
  { title: 'Beauty Try-On', img: '/assets/images/assets1.webp' },
  { title: 'Cloth Try-On', img: '/assets/images/asset2.webp' },
  { title: 'Product Ad', img: '/assets/images/asset3.webp' },
] as const;
