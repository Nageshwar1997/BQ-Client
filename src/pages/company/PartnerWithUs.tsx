import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import {
  Checklist,
  InfoCardGrid,
  NumberedSteps,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const PARTNER_BENEFITS = [
  {
    icon: 'solar:global-linear',
    title: 'Reach & Visibility',
    description: 'Get your products in front of a growing community of beauty shoppers.',
  },
  {
    icon: 'solar:scale-linear',
    title: 'Fair & Transparent Terms',
    description: 'Clear commission structure and policies applied the same way to everyone.',
  },
  {
    icon: 'solar:wallet-money-linear',
    title: 'Fast Payouts',
    description: 'Reliable, on-time payments so you can focus on running your business.',
  },
  {
    icon: 'solar:presentation-graph-linear',
    title: 'Marketing Support',
    description: 'Featured placements, campaigns, and content that help you get discovered.',
  },
  {
    icon: 'solar:verified-check-linear',
    title: 'Verified Trust Badge',
    description: 'Approved partners get a visible trust signal that shoppers recognize.',
  },
  {
    icon: 'solar:headphones-round-linear',
    title: 'Dedicated Partner Support',
    description: 'A real team to help with onboarding, listings, and anything in between.',
  },
] as const;

const PARTNERSHIP_TYPES = [
  {
    icon: 'solar:shop-2-linear',
    title: 'Sell Your Products',
    description: 'List your beauty products on our marketplace and reach shoppers directly.',
  },
  {
    icon: 'solar:diagram-up-linear',
    title: 'Brand Collaborations',
    description: 'Co-marketing campaigns, launches, and features with our team.',
  },
  {
    icon: 'solar:users-group-rounded-linear',
    title: 'Affiliate & Influencer Partners',
    description: 'Earn by recommending products you love to your own audience.',
  },
  {
    icon: 'solar:box-linear',
    title: 'Bulk / Wholesale Supply',
    description: 'Supply products at scale for our marketplace sellers to list and sell.',
  },
] as const;

const PARTNER_STEPS = [
  {
    title: 'Apply',
    description: 'Tell us about your business, products, and what you’re looking for.',
  },
  { title: 'Review', description: 'Our team reviews your application and product details.' },
  {
    title: 'Onboard',
    description: 'Get set up with everything you need — listings, payouts, and support.',
  },
  {
    title: 'Go Live',
    description: 'Your products or collaboration go live for our customers to discover.',
  },
] as const;

const REQUIREMENTS = [
  'Accurate business and product information, provided honestly and completely.',
  'Genuine, non-counterfeit products with correct ingredient and usage details.',
  'Agreement to our marketplace standards, covering quality, pricing, and customer service.',
] as const;

const PartnerWithUs = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:rocket-linear"
        title="Partner With Us"
        description={
          <>
            <GradientText
              type="accent"
              text="Together, we're Unstoppable!"
              className="font-medium italic"
            />{' '}
            Whether you sell beauty products, run a brand, or have an audience that loves beauty —
            there&apos;s a place for you on Beautinique.
          </>
        }
      />

      <Divider />

      <StaticPageSection title="Why Partner With Us">
        <InfoCardGrid items={PARTNER_BENEFITS} />
      </StaticPageSection>

      <StaticPageSection title="Ways to Partner">
        <InfoCardGrid items={PARTNERSHIP_TYPES} />
      </StaticPageSection>

      <StaticPageSection title="How It Works">
        <NumberedSteps steps={PARTNER_STEPS} />
      </StaticPageSection>

      <StaticPageSection title="What You'll Need">
        <Checklist
          items={REQUIREMENTS}
          icon="solar:clipboard-check-linear"
          iconClassName="text-primary/60"
        />
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Ready to Get Started?"
        description="Apply as a seller, or reach out directly for brand and affiliate partnerships."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/${ROUTES.QUICK_LINKS.BECOME_SELLER}`}
              className="bg-accent-duo flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <Icon icon="solar:shop-2-linear" className="size-4.5" />
              Become a Seller
            </Link>
            <a
              href="mailto:beautinique.bq@gmail.com"
              className="border-primary/20 hover:bg-primary-invert/60 text-primary flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <Icon icon="solar:letter-linear" className="size-4.5" />
              beautinique.bq@gmail.com
            </a>
          </div>
        }
      />
    </StaticPageLayout>
  );
};

export default PartnerWithUs;
