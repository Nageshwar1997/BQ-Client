import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import {
  Checklist,
  InfoCardGrid,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const TEAMS = [
  {
    icon: 'solar:shop-2-linear',
    title: 'Seller Success',
    description: 'Help sellers onboard, grow, and stay compliant on the marketplace.',
  },
  {
    icon: 'solar:delivery-linear',
    title: 'Operations & Fulfilment',
    description: 'Keep orders moving smoothly from checkout to doorstep.',
  },
  {
    icon: 'solar:chart-2-linear',
    title: 'Category & Merchandising',
    description: 'Shape which products and collections show up where.',
  },
  {
    icon: 'solar:headphones-round-linear',
    title: 'Customer Support',
    description: 'The first line of help for shoppers, before and after every order.',
  },
] as const;

const WHY_THIS_TEAM = [
  'Direct impact on real orders, real sellers, and real customer experience every day.',
  'A front-row seat to how an online marketplace actually runs, end to end.',
  'Close collaboration with product and engineering to fix what shoppers actually hit.',
] as const;

const RetailEcommerce = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:cart-large-4-linear"
        title="Retail & E-Commerce"
        description={
          <>
            The teams keeping the{' '}
            <GradientText type="accent" text="Beautinique" className="font-semibold" /> marketplace
            running, day in and day out.
          </>
        }
      />

      <Divider />

      <StaticPageSection title="What These Teams Do">
        <InfoCardGrid items={TEAMS} />
      </StaticPageSection>

      <StaticPageSection title="Why Join These Teams">
        <Checklist items={WHY_THIS_TEAM} />
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Interested?"
        description="Check our current openings, or reach out directly."
        actions={
          <Link
            to={`/${ROUTES.COMPANY.CAREERS}`}
            className="border-primary/20 hover:bg-primary-invert/60 text-primary flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Icon icon="solar:compass-linear" className="size-4.5" />
            View Open Roles
          </Link>
        }
      />
    </StaticPageLayout>
  );
};

export default RetailEcommerce;
