export type CreateBannerVariant =
  | '3d-visualizer'
  | 'ar-experience'
  | 'virtual-try-on'
  | '3d-configurator'
  | 'immersive-store'
  | 'ai-content';

export interface CreateBannerVariantConfig {
  variant: CreateBannerVariant;
  title: string;
  subtitle: string;
  buttonText: string;
  routePath: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  accentColor: string;
  fillBackground: string;
  strokeBackground: string;
  buttonBgColor: string;
  buttonIcon: string;
  heroIcon: string;
  // heroAssetUrl: string;
  nodeId: string;
  buttonNodeId: string;
  heroNodeId: string;
}

export const createBannerVariants: CreateBannerVariantConfig[] = [
  {
    variant: '3d-visualizer',
    title: 'Create Interactive 3D Viewers',
    subtitle:
      'Create interactive 3D views. Rotate, zoom, and explore every detail in beautiful 360°.',
    buttonText: 'Create 3D Experience',
    routePath: '/3d-visualizer',
    emptyStateTitle: 'Create Your First 3D Experience',
    emptyStateDescription:
      'Design immersive, interactive 3D visualizations in minutes.',
    accentColor: '#1D5FFF',
    fillBackground:
      'linear-gradient(40deg, rgba(46, 156, 255, 0.00) 22.87%, rgba(46, 156, 255, 0.20) 100%), #F2F6FF',
    strokeBackground:
      'linear-gradient(40deg, rgba(46, 156, 255, 0.00) 22.87%, rgba(46, 156, 255, 0.20) 100%), #FFFFFF',
    buttonBgColor: '#1D5FFF',
    buttonIcon: 'lucide:rotate-3d',
    heroIcon: 'lucide:rotate-3d',
    nodeId: '4857:424373',
    buttonNodeId: '4857:421459',
    heroNodeId: '4857:421436',
  },
  {
    variant: 'ar-experience',
    title: 'Create Real-World AR Experiences',
    subtitle:
      'Bring products into the real world. Place, scale, and view them instantly with marker or markerless AR.',
    buttonText: 'Create AR Experience',
    routePath: '/ar-experience',
    emptyStateTitle: 'Create Your First AR Experience',
    emptyStateDescription:
      'Design interactive augmented reality journeys for your products.',
    accentColor: '#00C2A1',
    fillBackground:
      'linear-gradient(40deg, rgba(61, 235, 178, 0.00) 22.87%, rgba(61, 235, 178, 0.20) 100%), #F2F6FF',
    strokeBackground:
      'linear-gradient(40deg, rgba(61, 235, 178, 0.00) 22.87%, rgba(61, 235, 178, 0.20) 100%), #FFFFFF',
    buttonBgColor: '#00C2A1',
    buttonIcon: 'solar:object-scan-linear',
    heroIcon: 'solar:object-scan-linear',
    nodeId: '4857:424401',
    buttonNodeId: '4857:424407',
    heroNodeId: '4857:424408',
  },
  {
    variant: 'virtual-try-on',
    title: 'Create Virtual Try-On Experiences',
    subtitle:
      'Let customers try before they buy. See how products look and feel in real life, instantly.',
    buttonText: 'Create Virtual Try-On',
    routePath: '/virtual-try-on',
    emptyStateTitle: 'Create Your First Virtual Try-On',
    emptyStateDescription:
      'Build realistic virtual try-on experiences tailored to your products.',
    accentColor: '#5A3FFF',
    fillBackground:
      'linear-gradient(40deg, rgba(122, 108, 255, 0.00) 22.87%, rgba(122, 108, 255, 0.20) 100%), #F2F6FF',
    strokeBackground:
      'linear-gradient(40deg, rgba(122, 108, 255, 0.00) 22.87%, rgba(122, 108, 255, 0.20) 100%), #FFFFFF',
    buttonBgColor: '#5A3FFF',
    buttonIcon: 'solar:face-scan-square-linear',
    heroIcon: 'solar:face-scan-square-linear',
    nodeId: '4858:352923',
    buttonNodeId: '4858:352929',
    heroNodeId: '4858:352930',
  },
  {
    variant: '3d-configurator',
    title: 'Create 3D Product Configurators',
    subtitle:
      'Create product configurators with product variations. Switch colors, materials, and styles in real time.',
    buttonText: 'Create 3D Configurator',
    routePath: '/configurator',
    emptyStateTitle: 'Create Your First 3D Configurator',
    emptyStateDescription:
      'Launch configurable 3D product experiences with dynamic options.',
    accentColor: '#FF7C1F',
    fillBackground:
      'linear-gradient(40deg, rgba(251, 139, 40, 0.00) 22.87%, rgba(251, 139, 40, 0.20) 100%), #F2F6FF',
    strokeBackground:
      'linear-gradient(40deg, rgba(251, 139, 40, 0.00) 22.87%, rgba(251, 139, 40, 0.20) 100%), #FFFFFF',
    buttonBgColor: '#FF7C1F',
    buttonIcon: 'solar:tuning-square-2-linear',
    heroIcon: 'solar:tuning-square-2-linear',
    nodeId: '4858:352936',
    buttonNodeId: '4858:352942',
    heroNodeId: '4858:352943',
  },
  {
    variant: 'immersive-store',
    title: 'Create Immersive Virtual Stores',
    subtitle:
      'Build interactive virtual stores and showcase products inside immersive environments.',
    buttonText: 'Create Virtual Store',
    routePath: '/virtual-store',
    emptyStateTitle: 'Create Your First Immersive Store',
    emptyStateDescription:
      'Craft immersive virtual storefronts that engage and convert shoppers.',
    accentColor: '#E5A417',
    fillBackground:
      'linear-gradient(40deg, rgba(253, 198, 51, 0.00) 22.87%, rgba(253, 198, 51, 0.20) 100%), #F2F6FF',
    strokeBackground:
      'linear-gradient(40deg, rgba(253, 198, 51, 0.00) 22.87%, rgba(253, 198, 51, 0.20) 100%), #FFFFFF',
    buttonBgColor: '#E5A417',
    buttonIcon: 'solar:shop-linear',
    heroIcon: 'solar:shop-linear',
    nodeId: '4858:352949',
    buttonNodeId: '4858:352955',
    heroNodeId: '4858:352956',
  },
  {
    variant: 'ai-content',
    title: 'AI Content',
    subtitle:
      'Generate dynamic social media creatives and videos. Turn product assets into engaging visuals instantly.',
    buttonText: 'Generate Immersive Ad',
    routePath: '/ai-content',
    emptyStateTitle: 'Create Your First AI Content Experience',
    emptyStateDescription:
      'Generate AI-powered creative content workflows in just a few clicks.',
    accentColor: '#A74EFF',
    fillBackground:
      'linear-gradient(40deg, rgba(217, 108, 255, 0.00) 22.87%, rgba(217, 108, 255, 0.20) 100%), #F2F6FF',
    strokeBackground:
      'linear-gradient(40deg, rgba(217, 108, 255, 0.00) 22.87%, rgba(217, 108, 255, 0.20) 100%), #FFFFFF',
    buttonBgColor: '#A74EFF',
    buttonIcon: 'solar:magic-stick-3-linear',
    heroIcon: 'solar:magic-stick-3-linear',
    nodeId: '4858:352962',
    buttonNodeId: '4858:352968',
    heroNodeId: '4858:352969',
  },
];
export const createBannerVariantMap: Record<
  CreateBannerVariant,
  CreateBannerVariantConfig
> = Object.fromEntries(
  createBannerVariants.map((config) => [config.variant, config])
) as Record<CreateBannerVariant, CreateBannerVariantConfig>;
