import { Icon } from '@iconify/react';
import {
  Rotate3DIcon,
  VersaAIGradientFillIcon,
  VersaAIGradientOutline,
  VersaAITextLogo,
} from '../icons';
import { nanoid } from 'nanoid';
import type { ProductData } from '../components/ProductListItem';
import type {
  DecimationTarget,
  Experience,
  MenuItemProps,
  FilterOption,
  ModuleData,
  SidebarItem,
  TabData,
  TextureSize,
} from '../types';

export const productListDummyData: ProductData[] = [
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200',
    name: 'Traditional Tribal Designer Wooden Stool',
    category: 'Furniture',
    price: 4199,
    originalPrice: 8199,
    discountPercent: 50,
    modules: [
      { variant: '3d-visualizer', count: 2 },
      { variant: 'ar-experience', count: 1 },
      { variant: 'video', count: 3 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    name: 'Classic Minimalist Wristwatch Silver Edition',
    category: 'Accessories',
    price: 2999,
    originalPrice: 5999,
    discountPercent: 50,
    modules: [
      { variant: '3d-visualizer', count: 1 },
      { variant: 'virtual-try-on', count: 2 },
      { variant: 'social', count: 4 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
    name: 'Ultra Boost Running Shoes Red Colorway',
    category: 'Footwear',
    price: 7499,
    originalPrice: 12999,
    discountPercent: 42,
    modules: [
      { variant: 'ar-experience', count: 3 },
      { variant: 'virtual-try-on', count: 1 },
      { variant: 'configurator', count: 2 },
      { variant: 'video-ad', count: 1 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200',
    name: 'Premium Leather Crossbody Bag Tan Brown',
    category: 'Bags',
    price: 3499,
    originalPrice: 6999,
    discountPercent: 50,
    modules: [
      { variant: '3d-visualizer', count: 2 },
      { variant: 'ar-experience', count: 2 },
      { variant: 'social', count: 1 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=200',
    name: 'Handcrafted Ceramic Vase Set of 3',
    category: 'Home Decor',
    price: 1899,
    originalPrice: 3499,
    discountPercent: 46,
    modules: [
      { variant: '3d-visualizer', count: 4 },
      { variant: 'video', count: 2 },
      { variant: 'storefront', count: 1 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200',
    name: 'Aviator Polarized Sunglasses Gold Frame',
    category: 'Eyewear',
    price: 1299,
    originalPrice: 2499,
    discountPercent: 48,
    modules: [
      { variant: 'virtual-try-on', count: 3 },
      { variant: 'ar-experience', count: 1 },
      { variant: 'configurator', count: 5 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200',
    name: 'Vintage Instant Film Camera Retro White',
    category: 'Electronics',
    price: 5499,
    originalPrice: 8999,
    discountPercent: 39,
    modules: [
      { variant: '3d-visualizer', count: 1 },
      { variant: 'video', count: 2 },
      { variant: 'video-ad', count: 3 },
      { variant: 'social', count: 2 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200',
    name: 'Organic Cotton Oversized Hoodie Charcoal',
    category: 'Apparel',
    price: 1999,
    originalPrice: 3999,
    discountPercent: 50,
    modules: [
      { variant: 'virtual-try-on', count: 2 },
      { variant: 'configurator', count: 1 },
      { variant: 'social', count: 3 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=200',
    name: 'Premium Leather Sneakers White Minimal',
    category: 'Footwear',
    price: 6499,
    originalPrice: 9999,
    discountPercent: 35,
    modules: [
      { variant: '3d-visualizer', count: 3 },
      { variant: 'ar-experience', count: 2 },
      { variant: 'virtual-try-on', count: 1 },
      { variant: 'storefront', count: 2 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
  {
    id: nanoid(),
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200',
    name: 'Scented Soy Candle Set Lavender & Vanilla',
    category: 'Home Decor',
    price: 899,
    originalPrice: 1599,
    discountPercent: 44,
    modules: [
      { variant: 'video', count: 1 },
      { variant: 'social', count: 2 },
      { variant: 'video-ad', count: 1 },
    ],
    description:
      'Handcrafted stool with intricate detailing — doubles as seating or side décor.',
  },
];

export const tabsDummyData: TabData[] = [
  { id: 1, title: 'All' },
  { id: 2, title: 'Standalone Experiences' },
  { id: 3, title: 'Product Experiences', subscriptionType: 'premium' },
  { id: 4, title: 'Generated 3D Assets' },
];

export const modulesDummyData = [
  {
    id: 1,
    icon: <Rotate3DIcon className="text-module-3d-viz size-6" />,
    title: '3D Visualizer',
    color: 'module-3d-viz',
  },
  {
    id: 2,
    icon: (
      <Icon
        icon="solar:object-scan-linear"
        width={24}
        height={24}
        className="text-module-ar"
      />
    ),
    title: 'AR Experience',
    color: 'module-ar',
  },
  {
    id: 3,
    icon: (
      <Icon
        icon="solar:tuning-square-2-linear"
        width={24}
        height={24}
        className="text-module-configurator"
      />
    ),
    title: 'Configurator',
    color: 'module-configurator',
  },
  {
    id: 4,
    icon: (
      <Icon
        icon="solar:shop-linear"
        width={24}
        height={24}
        className="text-module-storefront"
      />
    ),
    title: 'Virtual Store',
    color: 'module-storefront',
  },
  {
    id: 5,
    icon: (
      <Icon
        icon="solar:video-library-linear"
        width={24}
        height={24}
        className="text-module-video"
      />
    ),
    title: 'Video Ad',
    color: 'module-video',
  },
  {
    id: 6,
    icon: (
      <Icon
        icon="solar:wallpaper-linear"
        width={24}
        height={24}
        className="text-module-social"
      />
    ),
    title: 'Social Creative',
    color: 'module-social',
  },
];

export const countModulesDummyData: TabData[] = [
  {
    id: 1,
    leftIcon: <Rotate3DIcon className="text-module-3d-viz size-6" />,
    // rightIcon: <Rotate3DIcon className="text-module-3d-viz size-6" />,
    // title: '3D Visualizer',
    color: 'module-3d-viz',
    // count: 0,
    subscriptionType: 'premium',
    disabled: true,
  },
  {
    id: 2,
    leftIcon: (
      <Icon
        icon="solar:object-scan-linear"
        width={24}
        height={24}
        className="text-module-ar"
      />
    ),
    rightIcon: (
      <Icon
        icon="solar:object-scan-linear"
        width={24}
        height={24}
        className="text-module-ar"
      />
    ),
    disabled: true,

    title: 'AR Experience',
    color: 'module-ar',
    count: 5,
    subscriptionType: 'enterprise',
  },
  {
    id: 3,
    rightIcon: (
      <Icon
        icon="solar:tuning-square-2-linear"
        width={24}
        height={24}
        className="text-module-configurator"
      />
    ),
    title: 'Configurator',
    color: 'module-configurator',
    count: 2,
  },
  {
    id: 4,
    leftIcon: (
      <Icon
        icon="solar:shop-linear"
        width={24}
        height={24}
        className="text-module-storefront"
      />
    ),
    title: 'Virtual Store',
    color: 'module-storefront',
    count: 8,
  },
  {
    id: 5,
    leftIcon: (
      <Icon
        icon="solar:video-library-linear"
        width={24}
        height={24}
        className="text-module-video"
      />
    ),
    rightIcon: (
      <Icon
        icon="solar:video-library-linear"
        width={24}
        height={24}
        className="text-module-video"
      />
    ),
    title: 'Video Ad',
    color: 'module-video',
    count: 3,
  },
];

export const ctaCards = [
  {
    title: 'Product Inventory',
    description: 'Create interactive 3D viewers',
    buttonText: 'Add a New Product',
    buttonIcon: 'solar:add-square-linear',
    buttonVariant: 'secondary' as const,
    showArrow: true,
    path: '/product-inventory',
  },
  {
    title: '3D Asset Library',
    description: 'Create interactive 3D viewers',
    buttonText: 'Upload a 3D Model',
    buttonIcon: 'solar:upload-minimalistic-linear',
    buttonVariant: 'secondary' as const,
    path: '/3d-asset-library',
  },
  {
    title: 'Versa AI',
    description: 'Image-to-3D',
    buttonText: 'Generate a 3D Model',
    buttonVariant: 'gradient' as const,
    isGradientCard: true,
    path: '/versa-ai',
  },
];
// TODO: update the path accordingly to the routes
export const sidebarItems: SidebarItem[] = [
  {
    id: nanoid(),
    title: 'Home',
    icon: 'solar:widget-outline',
    path: '/dashboard',
  },
  // {
  //   id: nanoid(),
  //   title: 'Create',
  //   icon: <CreateIcon className="size-5!" />,
  //   fillIcon: <CreateFillIcon className="fill-neutral-gray-900 size-5!" />,
  //   path: '/dashboard',
  // },
  {
    id: nanoid(),
    title: '3D Library',
    icon: 'solar:library-outline',
    path: '/3d-asset-library',
  },
  {
    id: nanoid(),
    title: 'Product Inventory',
    icon: 'solar:box-minimalistic-linear',
    path: '/product-inventory',
  },
  {
    id: nanoid(),
    title: 'Analytics - Coming Soon',
    icon: 'solar:chart-outline',
    path: '',
  },
  {
    id: nanoid(),
    title: 'Versa AI',
    icon: <VersaAIGradientOutline className="size-5!" />,
    fillIcon: <VersaAIGradientFillIcon className="size-5!" />,
    path: '/versa-ai',
  },
  // {
  //   id: nanoid(),
  //   title: 'Notifications',
  //   icon: 'solar:bell-outline',
  //   path: '/notifications',
  // },
  {
    id: nanoid(),
    title: 'Settings',
    icon: 'solar:settings-minimalistic-linear',
    path: '/settings',
  },
  // {
  //   id: nanoid(),
  //   title: 'Support',
  //   icon: 'solar:info-circle-outline',
  //   path: '/support',
  // },
];

export const creations = [
  {
    title: 'PDP 3D 360-degree',
    tag: '3D Visualizer',
    image: 'https://via.placeholder.com/300',
  },
  {
    title: 'AR Experience Linkedin',
    tag: 'AR Experience',
    image: 'https://via.placeholder.com/300',
  },
  {
    title: 'Configurator for Website',
    tag: 'Configurator',
    image: 'https://via.placeholder.com/300',
  },
  {
    title: 'Modern Plant Pot',
    tag: 'Decor',
    image: 'https://via.placeholder.com/300',
  },
];

export const sectionData = [
  {
    title: '3D Visualizer',
    icon: <Rotate3DIcon className="text-module-3d-viz size-6" />,
    className: 'bg-gradient-3d-viz text-module-3d-viz',
    variant: '3d-visualizer' as const,
  },
  {
    title: 'AR Experience',
    icon: 'solar:object-scan-linear',
    className: 'bg-gradient-ar text-module-ar',
    variant: 'ar-experience' as const,
  },
  {
    title: 'Configurator',
    icon: 'solar:tuning-square-2-linear',
    className: 'bg-gradient-configurator text-module-configurator',
    variant: 'configurator' as const,
  },
  {
    title: 'Virtual Try-On',
    icon: 'solar:face-scan-square-linear',
    className: 'bg-gradient-tryon text-module-tryon',
    variant: 'virtual-try-on' as const,
  },
  {
    title: 'Social Creative',
    icon: 'solar:wallpaper-linear',
    className: 'bg-gradient-social text-module-social',
    variant: 'social' as const,
  },
  {
    title: 'Video Ad',
    icon: 'solar:video-library-linear',
    className: 'bg-gradient-video text-module-video',
    variant: 'video-ad',
  },
  {
    title: 'Virtual Store',
    icon: 'solar:shop-linear',
    className: 'bg-gradient-storefront text-module-storefront',
    variant: 'storefront',
  },
];

export const modelTypeData: TabData[] = [
  {
    id: 'fast',
    title: 'Fast',
  },
  {
    id: 'turbo',
    title: 'Turbo',
    subscriptionType: 'premium',
  },
  {
    id: 'large',
    title: 'Ultra',
    subscriptionType: 'enterprise',
  },
];

export const SINGLE_PROMPT_SUGGESTIONS = [
  'Generate a wooden chair with a simple modern design.',
  'Adorable astronaut character, big glossy helmet visor, orange accented space suit, soft rounded design, realistic shading, stylized 3D toy character, floating pose',
  'cute ceramic coffee cup, rounded ceramic mug, soft pastel colors, smooth glossy material, slightly chunky proportions, minimal design',
] as const;

export const MULTIVIEW_PROMPT_SUGGESTIONS = [
  {
    prompt:
      'A walnut dining chair with a padded beige seat, shown in front, side, and angled views.',
    images: [
      '/assets/images/versa-ai/preset/chair1.webp',
      '/assets/images/versa-ai/preset/chair2.webp',
      '/assets/images/versa-ai/preset/chair3.webp',
    ],
  },
  {
    prompt:
      'A dusty teal chenille fabric 3-seater sofa shown in front, side, angled, and rear views.',
    images: [
      '/assets/images/versa-ai/preset/multi_blue_sofa_1.webp',
      '/assets/images/versa-ai/preset/multi_blue_sofa_2.webp',
      '/assets/images/versa-ai/preset/multi_blue_sofa_3.webp',
    ],
  },
  {
    prompt:
      'An orange and black toy astronaut figure with a dark visor helmet, shown in front, side, and rear views.',
    images: [
      '/assets/images/versa-ai/preset/orangeguy_1.webp',
      '/assets/images/versa-ai/preset/orangeguy_2.webp',
      '/assets/images/versa-ai/preset/orangeguy_3.webp',
    ],
  },
] as const;

export const TEXTURES_DATA: {
  [key in '2K' | '3K' | '4K']: TabData & { id: TextureSize };
} = {
  '2K': { id: '2048', title: '2K' },
  '3K': { id: '3072', title: '3K', subscriptionType: 'enterprise' },
  '4K': { id: '4096', title: '4K', subscriptionType: 'enterprise' },
};

export const TRI_TARGET_DATA: {
  [key in '100k' | '50k' | '20k' | '10k']: TabData & { id: DecimationTarget };
} = {
  '100k': { id: '100000', title: '100k' },
  '50k': { id: '50000', title: '50k' },
  '20k': { id: '20000', title: '20k', subscriptionType: 'enterprise' },
  '10k': { id: '10000', title: '10k', subscriptionType: 'enterprise' },
};

export const modulesData: ModuleData[] = [
  {
    id: nanoid(),
    path: 'dashboard/3d-visualizer',
    title: '3D Visualizer',
    desc: 'Create interactive 3D viewers',
    icon: 'lucide:rotate-3d',
    bgImage: '/assets/images/dashboard-bg/3d-visualizer.png',
    className:
      'bg-gradient-3d-viz hover:border-module-3d-viz text-module-3d-viz [&>div>h3]:group-hover:text-module-3d-viz',
    selectedClassName:
      'bg-gradient-3d-viz border-module-3d-viz text-module-3d-viz shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-3d-viz [&>div>p]:text-neutral-gray-900',
  },
  {
    id: nanoid(),
    path: 'dashboard/ar-experience',
    title: 'AR Experience',
    desc: 'Marker-based and markerless AR',
    icon: 'solar:object-scan-linear',
    bgImage: '/assets/images/dashboard-bg/ar-experience.png',
    className:
      'bg-gradient-ar hover:border-module-ar text-module-ar [&>div>h3]:group-hover:text-module-ar',
    selectedClassName:
      'bg-gradient-ar border-module-ar text-module-ar shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-ar [&>div>p]:text-neutral-gray-900',
  },
  {
    id: nanoid(),
    path: 'dashboard/virtual-try-on',
    title: 'Virtual Try-On',
    desc: 'Bring products into the real world',
    icon: 'solar:face-scan-square-linear',
    bgImage: '/assets/images/dashboard-bg/virtual-tryon.png',
    className:
      'bg-gradient-tryon hover:border-module-tryon text-module-tryon [&>div>h3]:group-hover:text-module-tryon',
    selectedClassName:
      'bg-gradient-tryon border-module-tryon text-module-tryon shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-tryon [&>div>p]:text-neutral-gray-900',
  },
  {
    id: nanoid(),
    path: 'dashboard/configurator',
    title: 'Configurator',
    desc: 'Create configurator with product variations',
    icon: 'solar:tuning-square-2-linear',
    bgImage: '/assets/images/dashboard-bg/3d-configurator.png',
    className:
      'bg-gradient-configurator hover:border-module-configurator text-module-configurator [&>div>h3]:group-hover:text-module-configurator',
    selectedClassName:
      'bg-gradient-configurator border-module-configurator text-module-configurator shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-configurator [&>div>p]:text-neutral-gray-900',
  },
  {
    id: nanoid(),
    path: '/dashboard/immersive-store',
    title: 'Virtual Store',
    desc: 'Create virtual stores & place your products',
    // desc: 'Coming Soon!',
    icon: 'solar:shop-linear',
    bgImage: '/assets/images/dashboard-bg/immersive-store.png',
    className:
      'bg-gradient-storefront hover:border-module-storefront text-module-storefront [&>div>h3]:group-hover:text-module-storefront',
    selectedClassName:
      'bg-gradient-storefront border-module-storefront text-module-storefront shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-storefront [&>div>p]:text-neutral-gray-900',
  },
  {
    id: nanoid(),
    title: 'AI Content',
    path: '/ai-creative-studio',
    desc: 'Generate dynamic social media creatives',
    icon: 'solar:magic-stick-3-linear',
    bgImage: '/assets/images/dashboard-bg/ai-content.png',
    className:
      'bg-gradient-social hover:border-module-social text-module-social [&>div>h3]:group-hover:text-module-social',
    selectedClassName:
      'bg-gradient-social border-module-social text-module-social shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-social [&>div>p]:text-neutral-gray-900',
  },
];

export const assetModuleData: ModuleData[] = [
  {
    id: nanoid(),
    path: '/3d-visualizer',
    title: '3D Visualizer',
    desc: 'Create interactive 3D viewers',
    icon: 'lucide:rotate-3d',
    className:
      'bg-gradient-3d-viz hover:border-module-3d-viz text-module-3d-viz [&>div>h3]:group-hover:text-module-3d-viz',
    selectedClassName:
      'bg-gradient-3d-viz border-module-3d-viz text-module-3d-viz shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-3d-viz [&>div>p]:text-neutral-gray-900',
  },
  {
    id: nanoid(),
    path: '/ar-experience',
    title: 'AR Experience',
    desc: 'Marker-based and markerless AR',
    icon: 'solar:object-scan-linear',
    className:
      'bg-gradient-ar hover:border-module-ar text-module-ar [&>div>h3]:group-hover:text-module-ar',
    selectedClassName:
      'bg-gradient-ar border-module-ar text-module-ar shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-ar [&>div>p]:text-neutral-gray-900',
  },

  {
    id: nanoid(),
    path: '/configurator',
    title: 'Configurator',
    desc: 'Create configurator with product variations',
    icon: 'solar:tuning-square-2-linear',
    className:
      'bg-gradient-configurator hover:border-module-configurator text-module-configurator [&>div>h3]:group-hover:text-module-configurator',
    selectedClassName:
      'bg-gradient-configurator border-module-configurator text-module-configurator shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-configurator [&>div>p]:text-neutral-gray-900',
  },
  {
    id: nanoid(),
    path: '/virtual-store',
    title: 'Virtual Store',
    // desc: 'Create virtual stores & place your products',
    desc: 'Coming Soon!',
    icon: 'solar:shop-linear',
    className:
      'bg-gradient-storefront hover:border-module-storefront text-module-storefront [&>div>h3]:group-hover:text-module-storefront',
    selectedClassName:
      'bg-gradient-storefront border-module-storefront text-module-storefront shadow-[0_0_16px_0_rgba(46,156,255,0.2)] [&>div>h3]:text-module-storefront [&>div>p]:text-neutral-gray-900',
  },
];

export const loaderScreenData = [
  {
    title: '3D Visualizer',
    icon: <Rotate3DIcon className="text-module-3d-viz size-6" />,
    className: 'bg-gradient-3d-viz text-module-3d-viz',
    variant: '3d-visualizer' as const,
  },
  {
    title: 'AR Experience',
    icon: 'solar:object-scan-linear',
    className: 'bg-gradient-ar text-module-ar',
    variant: 'ar-experience' as const,
  },
  {
    title: 'Configurator',
    icon: 'solar:tuning-square-2-linear',
    className: 'bg-gradient-configurator text-module-configurator',
    variant: 'configurator' as const,
  },
  {
    title: 'Virtual Try-On',
    icon: 'solar:face-scan-square-linear',
    className: 'bg-gradient-tryon text-module-tryon',
    variant: 'virtual-try-on' as const,
  },
  {
    title: 'Video',
    icon: 'solar:video-library-linear',
    className: 'bg-gradient-video text-module-video',
    variant: 'video' as const,
  },
  {
    title: 'Social Creative',
    icon: 'solar:wallpaper-linear',
    className: 'bg-gradient-social text-module-social',
    variant: 'social' as const,
  },
  {
    title: 'Video Ad',
    icon: 'solar:video-library-linear',
    className: 'bg-gradient-video text-module-video',
    variant: 'video-ad',
  },
  {
    title: 'Virtual Store',
    icon: 'solar:shop-linear',
    className: 'bg-gradient-storefront text-module-storefront',
    variant: 'storefront',
  },
  {
    icon: <VersaAITextLogo />,
    className: 'bg-white text-brand',
    variant: 'versa-ai',
  },
];

export const data = [
  {
    id: 'experience',
    title: 'Experience',
    count: 1,
  },
  {
    id: 'assests',
    title: 'Assets',
    count: 7,
  },
];

export const productExperienceModulesTabData = [
  {
    id: 'all',
    title: 'All',
    color: 'black',
  },
  {
    id: '3d_visualizer',
    leftIcon: <Rotate3DIcon className="text-module-3d-viz size-6" />,
    title: '3D Visualizer',
    color: 'module-3d-viz',
  },
  {
    id: 'ar_experience',
    leftIcon: (
      <Icon
        icon="solar:object-scan-linear"
        width={24}
        height={24}
        className="text-module-ar"
      />
    ),
    title: 'AR Experience',
    color: 'module-ar',
  },
  // {
  //   id: '3d_configurator',
  //   leftIcon: (
  //     <Icon
  //       icon="solar:tuning-square-2-linear"
  //       width={24}
  //       height={24}
  //       className="text-module-configurator"
  //     />
  //   ),
  //   title: 'Configurator',
  //   color: 'module-configurator',
  // },
  {
    id: 'immersive_store',
    leftIcon: (
      <Icon
        icon="solar:shop-linear"
        width={24}
        height={24}
        className="text-module-storefront"
      />
    ),
    title: 'Virtual Storefront',
    color: 'module-storefront',
  },
  {
    // To do change id for tryon
    id: 'fashion_tryon',
    leftIcon: (
      <Icon
        icon="solar:shop-linear"
        width={24}
        height={24}
        className="text-module-storefront"
      />
    ),
    title: 'Virtual Try-Ons',
    color: 'module-storefront',
  },
  // {
  //   id: 'video-ad',
  //   leftIcon: (
  //     <Icon
  //       icon="solar:video-library-linear"
  //       width={24}
  //       height={24}
  //       className="text-module-video"
  //     />
  //   ),
  //   title: 'Video Ads',
  //   color: 'module-video',
  // },
  // {
  //   id: 'social-creatives',
  //   leftIcon: (
  //     <Icon
  //       icon="solar:wallpaper-linear"
  //       width={24}
  //       height={24}
  //       className="text-module-social"
  //     />
  //   ),
  //   title: 'Social Creatives',
  //   color: 'module-social',
  // },
];

export const experiences: Experience[] = [
  {
    id: 'exp-001',
    title: '3D Visualizer',
    productId: 'prod-001',
    type: '3d-visualizer',
    status: 'PUBLISHED',
    views: 12450,
    ctr: 12.5,
    lastUpdated: '2026-02-20',
    icon: <Icon icon="lucide:rotate-3d" />,
  },
  {
    id: 'exp-002',
    title: 'AR Experience',
    productId: 'prod-001',
    type: 'ar-experience',
    status: 'PUBLISHED',
    views: 8300,
    ctr: 8.1,
    lastUpdated: '2026-02-18',
    icon: <Icon icon="solar:object-scan-linear" />,
  },
  {
    id: 'exp-003',
    title: 'Video Ads',
    productId: 'prod-001',
    type: 'video-ads',
    status: 'DRAFT',
    views: 0,
    ctr: 0,
    lastUpdated: '2026-02-21',
    icon: <Icon icon="solar:video-library-linear" />,
  },
];
//   {
//     id: 'asset-001',
//     productId: 'prod-001',
//     title: 'Stool Product Brochure',
//     lastUpdated: '2026-02-20',
//     image: '/assets/images/profile.png',
//     assetType: 'generatedImages',
//     section: '3d-visualizer',
//     filesize: '13MB',
//     category: 'Furniture',
//     productName: 'Stool',
//     format: 'PDF',
//     icons: ['solar:video-library-linear', 'solar:wallpaper-linear'],
//     iconColor: ['text-module-video', 'text-module-social'],
//   },
//   {
//     id: 'asset-002',
//     productId: 'prod-001',
//     title: 'High-Resolution Image Pack',
//     lastUpdated: '2026-02-18',
//     image: '/assets/images/profile.png',
//     assetType: '3dModel',
//     filesize: '12MB',
//     category: 'Furniture',
//     productName: 'Stool',
//     format: 'GLB',
//     icons: ['solar:video-library-linear', 'solar:wallpaper-linear'],
//     iconColor: ['text-module-video', 'text-module-social'],
//   },
//   {
//     id: 'asset-video-001',
//     productId: 'prod-001',
//     title: 'Product Walkthrough Video',
//     lastUpdated: '2026-02-22',
//     image: 'https://www.w3schools.com/html/mov_bbb.mp4',
//     assetType: 'uploadedImages',
//     section: 'All',
//     filesize: '24MB',
//     category: 'Furniture',
//     productName: 'Stool',
//     format: 'MP4',
//     icons: ['solar:video-library-linear', 'solar:wallpaper-linear'],
//     iconColor: ['text-module-video', 'text-module-social'],
//   },
//   {
//     id: 'asset-001',
//     productId: 'prod-001',
//     title: 'Stool Product Brochure',
//     lastUpdated: '2026-02-20',
//     image: '/assets/images/profile.png',
//     assetType: 'uploadedImages',
//     section: 'All',
//     filesize: '13MB',
//     category: 'Furniture',
//     productName: 'Stool',
//     format: 'PDF',
//     icons: ['solar:video-library-linear', 'solar:wallpaper-linear'],
//     iconColor: ['text-module-video', 'text-module-social'],
//   },
//   {
//     id: 'asset-001',
//     productId: 'prod-001',
//     title: 'Stool Product Brochure',
//     lastUpdated: '2026-02-20',
//     image: '/assets/images/profile.png',
//     assetType: 'generatedImages',
//     section: 'All',
//     filesize: '13MB',
//     category: 'Furniture',
//     productName: 'Stool',
//     format: 'PDF',
//     icons: ['solar:video-library-linear', 'solar:wallpaper-linear'],
//     iconColor: ['text-module-video', 'text-module-social'],
//   },
//   {
//     id: 'asset-002',
//     productId: 'prod-001',
//     title: 'High-Resolution Image Pack',
//     lastUpdated: '2026-02-18',
//     image: '/assets/images/profile.png',
//     assetType: '3dModel',
//     filesize: '12MB',
//     category: 'Furniture',
//     productName: 'Stool',
//     format: 'GLB',
//     icons: ['solar:video-library-linear', 'solar:wallpaper-linear'],
//     iconColor: ['text-module-video', 'text-module-social'],
//   },
//   {
//     id: 'asset-001',
//     productId: 'prod-001',
//     title: 'Stool Product Brochure',
//     lastUpdated: '2026-02-20',
//     image: '/assets/images/profile.png',
//     assetType: 'uploadedImages',
//     section: 'All',
//     filesize: '13MB',
//     category: 'Furniture',
//     productName: 'Stool',
//     format: 'PDF',
//     icons: ['solar:video-library-linear', 'solar:wallpaper-linear'],
//     iconColor: ['text-module-video', 'text-module-social'],
//   },
// ];

export const AssetsTabDummyData = [
  {
    id: 'all',
    title: 'All',
    color: 'black',
  },
  {
    id: 'images',
    title: 'Images',
    leftIcon: <Icon icon="solar:gallery-linear" className="size-4" />,
  },
  {
    id: 'videos',
    title: 'Videos',
    leftIcon: <Icon icon="solar:videocamera-linear" className="size-4" />,
  },
  {
    id: '3dModels',
    title: '3D Models',
    leftIcon: <Icon icon="solar:box-minimalistic-linear" className="size-4" />,
  },
  {
    id: 'generated',
    title: 'Generated',
    leftIcon: <Icon icon="solar:upload-square-linear" className="size-4" />,
  },
  {
    id: 'uploaded',
    title: 'Uploaded',
    leftIcon: <Icon icon="solar:upload-square-linear" className="size-4" />,
  },
];

export const Categories = [
  {
    label: 'Accessories',
    value: 'accessories',
  },
  {
    label: 'Appliances',
    value: 'appliances',
  },
  {
    label: 'Clothes',
    value: 'clothes',
  },
  {
    label: 'Cosmetics',
    value: 'cosmetics',
  },
  {
    label: 'Electronics',
    value: 'electronics',
  },
  {
    label: 'Furniture',
    value: 'furniture',
  },
  {
    label: 'Medical',
    value: 'medical',
  },
  {
    label: 'Sports',
    value: 'sports',
  },
  {
    label: 'Transport',
    value: 'transport',
  },
  {
    label: 'Others',
    value: 'others',
  },
];

export const Experiences = [
  {
    label: '3D Visualizer',
    value: '3d-visualizer',
  },
  {
    label: 'AR Experience',
    value: 'ar-experience',
  },
  {
    label: '3D Configurator',
    value: '3d-configurator',
  },
  {
    label: 'Immersive Store',
    value: 'immersive-store',
  },
  {
    label: 'Virtual Try-On',
    value: 'virtual-try-on ',
  },
  {
    label: 'AI Content',
    value: 'ai-content',
  },
];

export const publishedCardMenuItems: MenuItemProps[] = [
  {
    label: 'Preview',
    icon: 'solar:arrow-right-up-linear',
    variant: 'default',
  },
  {
    label: 'Copy Link',
    icon: 'solar:copy-linear',
    variant: 'default',
  },
  {
    label: 'Edit',
    icon: 'solar:pen-new-square-linear',
    variant: 'default',
  },
  { label: 'Rename', icon: 'solar:pen-linear', variant: 'default' },
  {
    label: 'Unpublish',
    icon: 'solar:eye-closed-linear',
    variant: 'danger',
  },
  {
    label: 'Delete',
    icon: 'solar:trash-bin-2-linear',
    variant: 'danger',
  },
];

export const draftsCardMenuItems: MenuItemProps[] = [
  {
    label: 'Publish',
    icon: 'lucide:rocket',
    variant: 'default',
  },
  {
    label: 'Edit',
    icon: 'solar:pen-new-square-linear',
    variant: 'default',
  },
  { label: 'Rename', icon: 'solar:pen-linear', variant: 'default' },
  {
    label: 'Delete',
    icon: 'solar:trash-bin-2-linear',
    variant: 'danger',
  },
];

export const experienceSectionData = [
  {
    title: '3D Visualizer',
    type: '3d_visualizer',
    icon: 'lucide:rotate-3d',
    className: 'text-module-3d-viz',
    bgClassName: 'bg-module-3d-viz',
    variant: '3d-visualizer' as const,
  },
  {
    title: 'AR Experience',
    type: 'ar_experience',
    icon: 'solar:object-scan-linear',
    className: 'text-module-ar',
    bgClassName: 'bg-module-ar',
    variant: 'ar-experience' as const,
  },
  {
    title: 'Configurator',
    type: '3d_configurator',
    icon: 'solar:tuning-square-2-linear',
    className: 'text-module-configurator',
    bgClassName: 'bg-module-configurator',
    variant: 'configurator' as const,
  },
  {
    title: 'Virtual Try-On',
    type: ['fashion_tryon', 'beauty_tryon'],
    icon: 'solar:face-scan-square-linear',
    className: 'text-module-tryon',
    bgClassName: 'bg-module-tryon',
    variant: 'virtualtry-on' as const,
  },
  {
    title: 'Video',
    type: 'video',
    icon: 'solar:video-library-linear',
    className: 'text-module-video',
    bgClassName: 'bg-module-video',
    variant: 'video' as const,
  },
  {
    title: 'Social Creative',
    type: 'social',
    icon: 'solar:wallpaper-linear',
    className: 'text-module-social',
    bgClassName: 'bg-module-social',
    variant: 'social' as const,
  },
  {
    title: 'Video Ad',
    type: 'video_ad',
    icon: 'solar:video-library-linear',
    className: 'text-module-video',
    bgClassName: 'bg-module-video',
    variant: 'video-ad',
  },
  {
    title: 'Virtual Store',
    type: 'immersive_store',
    icon: 'solar:shop-linear',
    className: 'text-module-storefront',
    bgClassName: 'bg-module-storefront',
    variant: 'storefront',
  },
];

// ---------------- Settings ----------------

export const settingsItems = [
  {
    id: nanoid(),
    title: 'Personal account',
    children: [
      {
        id: nanoid(),
        title: 'Your Profile',
        icon: 'solar:user-rounded-linear',
        path: '/settings/personal-account/profile',
      },
      {
        id: nanoid(),
        title: 'Login',
        icon: 'solar:login-2-linear',
        path: '/settings/personal-account/login',
      },
      // {
      //   id: nanoid(),
      //   title: 'Accessibility',
      //   icon: 'solar:accessibility-linear',
      //   path: '/settings/personal-account/accessibility',
      // },
    ],
  },
  {
    id: nanoid(),
    title: 'Brand space',
    children: [
      {
        id: nanoid(),
        title: 'Brand Profile',
        icon: 'solar:crown-line-linear',
        path: '/settings/brand-space/brand-profile',
      },
      {
        id: nanoid(),
        title: 'Brand Kit',
        icon: 'solar:palette-round-linear',
        path: '/settings/brand-space/brand-kit',
      },
    ],
  },
  {
    id: nanoid(),
    title: 'Site settings',
    children: [
      {
        id: nanoid(),
        title: 'General',
        icon: 'solar:settings-linear',
        path: '/settings/site-settings/general',
      },
      {
        id: nanoid(),
        title: 'Manage Experiences',
        icon: 'solar:planet-linear',
        path: '/settings/site-settings/manage-experiences',
      },
    ],
  },
  {
    id: nanoid(),
    title: 'Payments',
    children: [
      {
        id: nanoid(),
        title: 'Plan & Billing',
        icon: 'solar:card-outline',
        path: '/settings/payments/plan-and-billing',
      },
    ],
  },
];

export const currencyData: FilterOption[] = [
  {
    id: 'USD',
    label: 'United States Dollar - USD',
    value: 'USD',
  },
  {
    id: 'EUR',
    label: 'Euro - EUR',
    value: 'EUR',
  },
  {
    id: 'GBP',
    label: 'British Pound Sterling - GBP',
    value: 'GBP',
  },
  {
    id: 'INR',
    label: 'Indian Rupee - INR',
    value: 'INR',
  },
];

export const languageData: FilterOption[] = [
  {
    id: 'en-US',
    label: 'English - US',
    value: 'en-US',
  },
  {
    id: 'es-US',
    label: 'Spanish - US',
    value: 'es-US',
  },
  {
    id: 'en-GB',
    label: 'English - UK',
    value: 'en-GB',
  },
  {
    id: 'en-IN',
    label: 'English - India',
    value: 'en-IN',
  },
  {
    id: 'hi-IN',
    label: 'Hindi - India',
    value: 'hi-IN',
  },
  {
    id: 'fr-FR',
    label: 'French - France',
    value: 'fr-FR',
  },
  {
    id: 'de-DE',
    label: 'German - Germany',
    value: 'de-DE',
  },
  {
    id: 'it-IT',
    label: 'Italian - Italy',
    value: 'it-IT',
  },
  {
    id: 'es-ES',
    label: 'Spanish - Spain',
    value: 'es-ES',
  },
  {
    id: 'nl-NL',
    label: 'Dutch - Netherlands',
    value: 'nl-NL',
  },
  {
    id: 'ga-IE',
    label: 'Irish - Ireland',
    value: 'ga-IE',
  },
];

export const fontsData: FilterOption[] = [
  {
    id: 'metropolis',
    label: 'Metropolis',
    value: 'metropolis',
  },
  {
    id: 'roboto',
    label: 'Roboto',
    value: 'roboto',
  },
  {
    id: 'poppins',
    label: 'Poppins',
    value: 'poppins',
  },
];

export const visitorsData: FilterOption[] = [
  {
    id: '10000',
    label: '10,000',
    value: '10000',
  },
  {
    id: '20000',
    label: '20,000',
    value: '20000',
  },
  {
    id: '50000',
    label: '50,000',
    value: '50000',
  },
];
