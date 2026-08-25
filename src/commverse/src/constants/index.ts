import { VITE_PUBLISH_BASE_URL } from '../env';
import type {
  TTryOn,
  CurrencyCode,
  Edition,
  FilterOption,
  Plan,
  PlanId,
  TEyeliner,
  TKajal,
  TLip,
  VariantField,
  VisualizerProps,
  THeaderVariant,
  TModules,
} from '../types';

export const toRad = (deg: number) => (deg * Math.PI) / 180;

export const HDRI_MAX_SIZE = 2 * 1024 * 1024;
export const MODEL_MAX_SIZE = 50 * 1024 * 1024;
export const TOTAL_MODEL_MAX_SIZE = 250 * 1024 * 1024;
export const IMAGE_FILE_TYPES = [
  '.jpeg',
  '.png',
  '.jpg',
  '.webp',
  '.ico',
  '.svg',
  '.gif',
];

export const defaultSettings: VisualizerProps = {
  modelFile: null,
  modelUrl: null,
  assetData: [],
  modelTransform: {
    scale: 1,
    rotation: { x: 0, y: 0, z: 0 },
    rotationAxis: { x: true, y: true, z: false },
    scalable: true,
    rotatable: true,
  },
  camera: {
    position: { x: 3, y: 2, z: 5 },
  },
  assetId: null,
  experienceId: null,
  shadowIntensity: 0.4,
  shadowSoftness: 0.6,
  arAnchor: 'floor',
  zoom: { min: 3, max: 10 },
  environment: {
    grounded: false,
    envHeight: 12,
    envRadius: 60,
    envScale: 20,
    presetName: 'Sky',
    envType: 'preset',
    customEnvUrl: null,
    customEnvName: null,
    envBgColor: '#f7f8fa',
    lightIntensity: 0.8,
  },
  ctaBtn: {
    enabled: false,
    position: 'top-right',
    btnColor: '#002dff',
    textColor: '#ffffff',
    offset: { x: 0, y: 0 },
    content: 'Add to Cart',
    url: '',
  },
  brandLogo: {
    enabled: false,
    logo: null,
    position: 'top-left',
    offset: { x: 0, y: 0 },
    opacity: 0.5,
    scale: 0.5,
  },
  menuPlacement: 'dock',
  textOnly: false,
  isImported: false,
  variants: [],
  editingEdition: null,
};

export const versaGenerationAiAdjectives = [
  'analyzing',
  'processing',
  'generating',
  'rendering',
];

export const tailwindPosMap: { [key: string]: string } = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'center-left': 'top-1/2 -translate-y-1/2 left-4',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-right': 'top-1/2 -translate-y-1/2 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

export const ENV_PRESETS = [
  { name: 'Minimal', url: '/assets/hdri/Minimal.hdr' },
  { name: 'Outdoor', url: '/assets/hdri/Road.hdr' },
  { name: 'Sky', url: '/assets/hdri/sky.hdr' },
  { name: 'Snow', url: '/assets/hdri/snow.hdr' },
];

export const COLOURS = [
  { name: 'Petal Blush', hexColor: '#F26A8D' },
  { name: 'Raspberry Kiss', hexColor: '#C72C6C' },
  { name: 'Dusty Rose', hexColor: '#B76E79' },

  { name: 'Berry Bloom', hexColor: '#9B2554' },
  { name: 'Plum Desire', hexColor: '#7D2E68' },
  { name: 'Velvet Burgundy', hexColor: '#6A1F32' },
  { name: 'Mulberry Magic', hexColor: '#8B1E3F' },

  { name: 'Classic Crimson', hexColor: '#AA0420' },
  { name: 'True Red', hexColor: '#C40018' },
  { name: 'Ruby Riot', hexColor: '#9E0B28' },

  { name: 'Midnight Maroon', hexColor: '#800000' },
  { name: 'Cocoa Charm', hexColor: '#5A130E' },
  { name: 'Deep Espresso', hexColor: '#4A1C1A' },
  { name: 'Chestnut Glow', hexColor: '#8B4A3B' },

  { name: 'Hot Fuchsia', hexColor: '#FF0066' },
];

export const POSSIBLE_TRYON_TYPES = {
  lipstick: ['matte', 'glossy', 'crayon', 'shimmer'] as TLip[],
  eyeliner: ['pattern1', 'pattern2', 'pattern3'] as TEyeliner[],
  kajal: ['pattern1', 'pattern2'] as TKajal[],
};

export const SUPPORTED_TRYON_CATEGORIES: TTryOn[] = [
  'Blush',
  'Foundation',
  'Eyeliner',
  'Eyeshadow',
  'Eyebrow',
  'Kajal',
  'Lipstick',
];

export const defaultEdition = (withColor = false): Edition => ({
  name: '',
  imageUrl: '',
  color: withColor ? '#000000' : '',
  visible: true,
  modelUrl: null,
  modelId: null,
  modelFile: null,
  modelTransform: {
    scale: 1,
    rotation: { x: 0, y: 0, z: 0 },
  },
});

export const defaultVariant = (): VariantField => ({
  selectedType: 'colour',
  customType: '',
  activeTabId: 'pipette',
  editions: [defaultEdition(true)],
});

export const VARIANT_DROPDOWN_OPTIONS: FilterOption[] = [
  { id: 'colour', label: 'Colour', value: 'colour', default: true },
  { id: 'texture', label: 'Texture', value: 'texture' },
  { id: 'size', label: 'Size', value: 'size' },
  { id: 'other', label: 'Other', value: 'other' },
];

// settings

export const EXPERIENCE_DOMAIN = '.' + VITE_PUBLISH_BASE_URL;

export const MODULE_MAP: Record<string, string> = {
  '3d_visualizer': '3d-visualizer',
  ar_experience: 'ar-experience',
  '3d_configurator': 'configurator',
  fashion_tryon: 'fashion-try-on',
  beauty_tryon: 'beauty-try-on',
  immersive_store: 'storefront',
};

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    subtitle:
      'Explore immersive XR commerce and product experiences completely free.',
    monthlyPrice: '0',
    yearlyPrice: '0',
    priceMeta: 'Forever',
    cardHeight: 'xl:h-fit',
    ctaLabel: 'Subscribed',
    ctaStyle: 'neutral',
    showAllowanceField: false,
    allowance: {
      values: ['100 monthly credits'],
      allowSelection: false,
    },
    featureHeading: 'Features:',
    modules: [
      {
        label: 'Versa AI',
        icon: 'solar:stars-linear',
        colorClass: 'text-[#2553F8]',
      },
      {
        label: '3D Visualizer',
        icon: 'lucide:rotate-3d',
        colorClass: 'text-module-3d-viz',
      },
      {
        label: 'AR Studio',
        icon: 'solar:object-scan-linear',
        colorClass: 'text-module-ar',
      },
      {
        label: '3D Configurator',
        icon: 'solar:tuning-square-2-linear',
        colorClass: 'text-module-configurator',
      },
      {
        label: 'Virtual Try-On',
        icon: 'solar:face-scan-square-linear',
        colorClass: 'text-module-tryon',
      },

      {
        label: 'Immersive Storefront',
        icon: 'solar:shop-linear',
        colorClass: 'text-module-storefront',
      },
      {
        label: 'AI Creative Studio',
        icon: 'solar:wallpaper-linear',
        colorClass: 'text-module-social',
      },
    ],
    checklist: [
      '100 Monthly Credits',
      'Up to 2 Products',
      'Up to 4 3D Assets',
      'Up to 5 VersaAI (Fast) Generation',
      'Up to 1 Experience per Module',
      'Up to 1 Published Experience Per Module',
      'Commverse Branded Publish Link',
      '50 MB 3D Model Upload Limit',
      'AI Social Creative Generation (10)',
      'AI Video Ad Generation (5)',
      'Single Brand Kit',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Growth-driven creators and small brands looking to scale',
    monthlyPrice: '19',
    yearlyPrice: '190',
    priceMeta: 'Per month',
    cardHeight: 'xl:h-fit',
    ctaLabel: 'Upgrade',
    ctaStyle: 'neutral',
    allowance: {
      values: [
        '500 credits / month',
        '1000 credits / month',
        '2000 credits / month',
        '4000 credits / month',
        '8000 credits / month',
      ],
      allowSelection: true,
    },
    featureHeading: 'All Feature In Free,plus:',
    checklist: [
      'Up to 10 Products',
      'Up to 20 3D Assets',
      'Up to 100 VersaAI (Fast + Turbo) Generation',
      'Advanced VersaAI Features',
      'Downloadable 3D Models',
      'Up to 5 Experiences Per Module',
      'Up to 5 Published Experiences Per Module',
      'AI Social Creative Generation (200)',
      'AI Video Ad Generation (100)',
      'Credit Top-Ups Available',
      'Multiple Brand Kits',
    ],
    modules: [],
  },
  {
    id: 'business',
    name: 'Business',
    subtitle:
      'Growing brands and agencies managing multiple products and campaigns',
    monthlyPrice: '99',
    yearlyPrice: '990',
    priceMeta: 'Per month',
    cardHeight: 'xl:h-fit',
    ctaLabel: 'Upgrade',
    ctaStyle: 'brand',
    featured: true,
    badgeLabel: 'Most Value',
    allowance: {
      values: [
        '2000 credits / month',
        '4000 credits / month',
        '8000 credits / month',
        '16000 credits / month',
        '24000 credits / month',
      ],
      allowSelection: true,
    },
    featureHeading: 'All Feature In Pro,plus:',
    checklist: [
      'Up to 40 Products',
      'Up to 80 3D Assets',
      'Up to 400 VersaAI (Fast + Turbo + Ultra) Generation',
      'Up to 20 Experience per Module',
      'Up to 20 Published Experiences Per Module',
      'AI Social Creative Generation (800)',
      'AI Video Ad Generation (400)',
      'Up to 50 Try-On SKUs',
    ],
    modules: [],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle:
      'Large brands and organizations requiring advanced workflows and integrations',
    monthlyPrice: 'Custom',
    yearlyPrice: 'Custom',
    cardHeight: 'xl:h-fit',
    ctaLabel: 'Book a Demo',
    ctaStyle: 'neutral',
    allowance: {
      values: ['Custom'],
      allowSelection: false,
    },
    featureHeading: 'All Feature In Business,plus:',
    checklist: [
      'Custom Credits',
      'Custom Product Limits',
      'Custom 3D Asset Limits',
      'Custom Number of Experiences',
      'Custom Module Plans',
      'Custom VersaAI Generation Limits',
      'Advanced Analytics',
      'Custom Dashboards',
      'Dedicated Support',
      'Custom Integrations',
      'Multiple Brand Kits',
      'Custom Publishing Limits',
    ],
    modules: [],
  },
];

export const PLAN_IDS: PlanId[] = PLANS.map((plan) => plan.id);

export const CURRENCY_OPTIONS: CurrencyCode[] = ['INR', 'USD', 'GBP', 'EUR'];

export const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  GBP: '£',
  EUR: '€',
};

export const getInitialAllowances = (): Record<string, string> => {
  return PLANS.reduce<Record<string, string>>((acc, plan) => {
    if (plan.allowance?.allowSelection && plan.allowance.values.length > 0) {
      acc[plan.id] = plan.allowance.values[0];
    }

    return acc;
  }, {});
};

export const moduleMap: Record<
  TModules,
  THeaderVariant | 'beauty-try-on' | 'fashion-try-on'
> = {
  '3d_visualizer': '3d-visualizer',
  ar_experience: 'ar-experience',
  '3d_configurator': 'configurator',
  fashion_tryon: 'fashion-try-on',
  beauty_tryon: 'beauty-try-on',
  immersive_store: 'storefront',
};

export const FASHION_DEFAULT_MODELS = [
  {
    value:
      'experiences/uploads/69a812802f65739b471f73f6/1773107091568-male1.webp',
  },
  {
    value:
      'experiences/uploads/69a812802f65739b471f73f6/1773107091569-female1.webp',
  },
  {
    value:
      'experiences/uploads/69a812802f65739b471f73f6/1773107091569-male2.webp',
  },
  {
    value:
      'experiences/uploads/69a812802f65739b471f73f6/1773107091569-female2.webp',
  },
  {
    value:
      'experiences/uploads/69a812802f65739b471f73f6/1773107190622-male3.webp',
  },
  {
    value:
      'experiences/uploads/69a812802f65739b471f73f6/1773107190623-female3.webp',
  },
];

export const COSMETIC_MODEL_IMAGES = [
  '/assets/images/try-on/models/1.webp',
  '/assets/images/try-on/models/2.webp',
  '/assets/images/try-on/models/3.webp',
  '/assets/images/try-on/models/4.webp',
  '/assets/images/try-on/models/5.webp',
  '/assets/images/try-on/models/6.webp',
];
