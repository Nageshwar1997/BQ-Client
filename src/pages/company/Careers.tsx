import { Icon } from '@iconify/react';

import {
  InfoCardGrid,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';

const VALUES_CULTURE = [
  {
    icon: 'solar:users-group-rounded-linear',
    title: 'Inclusive by Default',
    description: 'A team as diverse as the shoppers and sellers we build for.',
  },
  {
    icon: 'solar:lightbulb-linear',
    title: 'Bias for Building',
    description: 'We ship, learn, and iterate — perfection isn’t the starting line.',
  },
  {
    icon: 'solar:hand-heart-linear',
    title: 'Ownership',
    description: 'Everyone owns outcomes, not just tasks.',
  },
  {
    icon: 'solar:balance-linear',
    title: 'Work-Life Balance',
    description: 'Flexible hours and remote-friendly roles, because life happens.',
  },
] as const;

const RETAIL_ECOMMERCE_ROLES = [
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
] as const;

const Careers = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:case-round-minimalistic-linear"
        title="Careers"
        description="Join the team building a beauty marketplace people actually trust."
      />

      <Divider />

      <StaticPageSection title="Values & Culture">
        <InfoCardGrid items={VALUES_CULTURE} />
      </StaticPageSection>

      <StaticPageSection title="Retail & E-Commerce Teams">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          The teams keeping the marketplace running day to day, from seller support to order
          fulfilment:
        </p>
        <InfoCardGrid items={RETAIL_ECOMMERCE_ROLES} columns={3} />
      </StaticPageSection>

      <Divider />

      {/* Current Openings */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col items-center gap-3 rounded-2xl border p-8 text-center">
        <span className="bg-accent-duo flex size-12 items-center justify-center rounded-full">
          <Icon icon="solar:inbox-linear" className="size-6 text-white" />
        </span>
        <p className="text-primary text-base font-semibold sm:text-lg">
          No Open Positions Right Now
        </p>
        <p className="text-secondary max-w-md text-xs sm:text-sm">
          We don&apos;t have any active openings at the moment, but we&apos;re growing. Check back
          soon, or reach out — we&apos;re always happy to hear from people who want to build with
          us.
        </p>
        <a
          href="mailto:beautinique.bq@gmail.com"
          className="border-primary/20 hover:bg-primary-invert/60 text-primary mt-2 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Icon icon="solar:letter-linear" className="size-4.5" />
          beautinique.bq@gmail.com
        </a>
      </section>
    </StaticPageLayout>
  );
};

export default Careers;
