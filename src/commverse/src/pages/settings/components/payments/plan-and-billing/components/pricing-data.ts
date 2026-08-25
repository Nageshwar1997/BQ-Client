import type { PlanId } from '../../../../../../types';

export type CellValue = string | boolean | null;

export interface PlanHeader {
  id: PlanId;
  name: string;
  priceMonthly: string;
  pricePeriod: string;
  priceYearly?: string;
  priceYearlyPeriod?: string;
  saveBadge?: string;
  description: string;
  buttonLabel: string;
  buttonStyle: 'subscribed' | 'outline' | 'primary' | 'dark';
  highlighted?: boolean;
  mostValue?: boolean;
  mostValueLabel?: string;
  mostValueBgColor?: string;
  mostValueTextColor?: string;
  mostValueBorderColor?: string;
}

export interface FeatureRow {
  label: string;
  values: CellValue[];
}

export interface FeatureSection {
  title: string;
  icon?: string;
  iconColor?: string;
  rows: FeatureRow[];
}

export const plans: PlanHeader[] = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: '$0',
    pricePeriod: '/forever',
    description: 'For hobbyists and individuals',
    buttonLabel: 'Subscribed',
    buttonStyle: 'subscribed',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: '$25',
    pricePeriod: '/Month',
    priceYearly: '$300',
    priceYearlyPeriod: '/Year',
    saveBadge: 'Save 20%',
    description: 'For small businesses',
    buttonLabel: 'Upgrade',
    buttonStyle: 'outline',
  },
  {
    id: 'business',
    name: 'Business',
    priceMonthly: '$75',
    pricePeriod: '/Month',
    priceYearly: '$900',
    priceYearlyPeriod: '/Year',
    saveBadge: 'Save 25%',
    description: 'For growing businesses',
    buttonLabel: 'Upgrade',
    buttonStyle: 'primary',
    highlighted: true,
    mostValue: true,
    mostValueLabel: 'Most Value',
    mostValueBgColor: '#002DFF',
    mostValueTextColor: '#FFFFFF',
    mostValueBorderColor: 'rgba(255,255,255,0.1)',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 'Custom',
    pricePeriod: '',
    description: 'For rapidly scaling businesses',
    buttonLabel: 'Book a demo',
    buttonStyle: 'dark',
  },
];

export const sections: FeatureSection[] = [
  {
    title: 'General',
    rows: [
      // { label: 'Credits', values: ['100', '500', '2000', 'Book a Demo'] },
      { label: 'Library', values: [true, true, true, true] },
      {
        label: 'No. of 3D Assets',
        values: ['4', '20', '80', 'Custom No. of Assets'],
      },
      { label: 'CMS', values: [true, true, true, true] },
      {
        label: 'No. of Products',
        values: ['2', '10', '40', 'Custom No. of Products'],
      },
      {
        label: 'Brand DNA',
        values: [
          '1',
          '3 - Coming Soon',
          '5 - Coming Soon',
          'Custom No. of Brand DNAs - Coming Soon',
        ],
      },
      { label: 'Support', values: [true, true, true, true] },
    ],
  },

  {
    title: 'Versa AI',
    iconColor: '#2553F8',
    rows: [
      {
        label: 'Model Generation',
        values: [
          'Fast',
          'Fast, Turbo',
          'Fast, Turbo and Large',
          'Fast, Turbo and Large',
        ],
      },
      {
        label: 'Project Limit',
        values: [
          'Upto 5 Projects',
          'Upto 100 Projects',
          'Upto 400 Projects',
          'Custom No. of Generation',
        ],
      },
      {
        label: 'Image Upload and Size',
        values: ['5MB', '5MB', '5MB', '5MB'],
      },
      { label: 'BG Removal', values: [null, true, true, true] },
      { label: 'Export to Library', values: [true, true, true, true] },
    ],
  },
  {
    title: '3D Visualizer',
    iconColor: '#1D5FFF',
    rows: [
      {
        label: 'No. of Projects',
        values: [
          '1 Project',
          'Upto 5 Projects',
          'Upto 20 Projects',
          'Custom No. of Projects',
        ],
      },
      {
        label: 'Upload 3D Model Size',
        values: ['50 MB', '50 MB', '50 MB', '50 MB'],
      },
      {
        label: 'Publish',
        values: ['1', '5', '20', 'Custom No of Publish'],
      },
      {
        label: 'Personalized CTA',
        values: ['With CTRUH branding', true, true, true],
      },
      {
        label: 'Custom Deployed Links',
        values: [
          'With CTRUH branding',
          'Custom Domain - Coming Soon',
          'Custom Domain - Coming Soon',
          'Custom Domain - Coming Soon',
        ],
      },
    ],
  },
  {
    title: 'AR Studio',
    iconColor: '#00C2A1',
    rows: [
      {
        label: 'No. of Projects',
        values: [
          '1 Project',
          'Upto 5 Projects',
          'Upto 20 Projects',
          'Custom No of Projects',
        ],
      },
      {
        label: 'Upload 3D Model Size',
        values: ['50 MB', '50 MB', '50 MB', '50 MB'],
      },
      {
        label: 'Variants types',
        values: ['3', '5', '8', 'Custom No. of variants'],
      },
      {
        label: 'Publish',
        values: ['1', '5', '20', 'Custom No. of Publish'],
      },
    ],
  },

  {
    title: '3D Configurator',
    iconColor: '#FF7C1F',
    rows: [
      {
        label: 'No of Projects',
        values: [
          '1 Project',
          'Upto 5 Projects',
          'Upto 20 Projects',
          'Custom No. of Projects',
        ],
      },
      {
        label: 'Upload 3D Model Size',
        values: ['50MB', '50MB', '50MB', '50MB'],
      },
      {
        label: 'Project Limit',
        values: [null, 'Upto 50 Projects', 'Upto 200 Projects', 'Unlimited'],
      },
      {
        label: 'Variants Types',
        values: ['3', '5', '8', ''],
      },
      {
        label: 'Publish',
        values: [null, 'No watermark', 'No watermark', 'No watermark'],
      },
    ],
  },
  {
    title: 'Virtual Try-On',
    iconColor: '#5A3FFF',
    rows: [
      {
        label: 'Setup of Try-On with Inventory (No. of Projects)',
        values: [
          '1 Project',
          'Upto 5 Projects',
          'Upto 20 Projects',
          'Custom No. of Projects',
        ],
      },
      {
        label: 'Variant/ Try-On',
        values: ['5', '15', '50', 'Custom No. of variants'],
      },
      {
        label: "No of SKU's/ GenAI Try-On",
        values: ['3', '10', '50', 'Custom No. of SKU'],
      },
      {
        label: 'Preview Feature',
        values: [true, true, true, true],
      },
      {
        label: 'Try-On Trails',
        values: ['Upto 20', 'Upto 100', 'Upto 400', 'Custom No. of Trails'],
      },
      {
        label: 'Publish',
        values: ['1', '5', '20', 'Custom No. of Publish'],
      },
      {
        label: 'Custom Deployed Links',
        values: [
          'With CTRUH branding',
          'Custom Domain - Coming Soon',
          'Custom Domain - Coming Soon',
          'Custom Domain - Coming Soon',
        ],
      },
    ],
  },

  {
    title: 'Immersive Storefront',
    iconColor: '#E6A417',
    rows: [
      {
        label: 'No. of Projects',
        values: [
          '1 Project',
          'Upto 2 Projects',
          'Upto 5 Projects',
          'Custom No. of Creation',
        ],
      },
      { label: 'Templates', values: ['All', 'All', 'All', 'All'] },
      {
        label: 'Upload',
        values: [null, 'Coming Soon', 'Coming Soon', 'Coming Soon'],
      },
      {
        label: 'Try-On Option Available and AR Experience',
        values: ['Coming Soon', 'Coming Soon', 'Coming Soon', 'Coming Soon'],
      },
      { label: 'CTA for Product and Cards', values: [true, true, true, true] },
      { label: 'Publish', values: ['1', '2', '5', true] },
    ],
  },
  {
    title: 'AI Creative Studio',
    iconColor: '#FF2E63',
    rows: [
      {
        label: 'No. of generation and Regeneration',
        values: [
          'Upto 10 Generation',
          'Upto 200 Generation',
          'Upto 800 Generation',
          'Custom No. of Generation',
        ],
      },
    ],
  },
  {
    title: 'Video Ads',
    iconColor: '#A74EFF',
    rows: [
      {
        label: 'No. of Generation and Regeneration',
        values: [
          'Upto 5 Generation',
          'Upto 100 Generation',
          'Upto 400 Generation',
          'Custom No. of Generation',
        ],
      },
      {
        label: 'Video Generation time',
        values: ['3 sec', '5 sec', '8 sec', '8 sec plus'],
      },
    ],
  },
];
