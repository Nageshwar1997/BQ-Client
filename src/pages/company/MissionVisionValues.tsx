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

const OUR_VALUES = [
  {
    icon: 'solar:verified-check-linear',
    title: 'Authenticity',
    description: 'What you see is what you get — no counterfeit products, ever.',
  },
  {
    icon: 'solar:hand-heart-linear',
    title: 'Integrity',
    description: 'Honest pricing, honest descriptions, and honest customer support.',
  },
  {
    icon: 'solar:users-group-rounded-linear',
    title: 'Inclusivity',
    description: 'A platform where every shade, skin type, and shopper feels represented.',
  },
  {
    icon: 'solar:lightbulb-linear',
    title: 'Innovation',
    description: 'From virtual try-on to smart recommendations, we keep pushing forward.',
  },
  {
    icon: 'solar:shield-check-linear',
    title: 'Trust',
    description: 'Verified sellers and genuine reviews, so every purchase feels safe.',
  },
  {
    icon: 'solar:leaf-linear',
    title: 'Sustainability',
    description: 'We favor sellers and practices that care about their environmental footprint.',
  },
] as const;

const HOW_WE_LIVE_IT = [
  'Every seller is verified before their products go live on the marketplace.',
  'Reviews are only accepted from customers who actually purchased the product.',
  'Product descriptions and shade guides are written to set accurate expectations.',
  'We invest in tools like virtual try-on to remove guesswork from online shopping.',
] as const;

const MissionVisionValues = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:flag-linear"
        title="Mission, Vision & Values"
        description={
          <>
            What drives <GradientText type="accent" text="Beautinique" className="font-semibold" />{' '}
            forward, and the principles we hold ourselves to along the way.
          </>
        }
      />

      <Divider />

      <StaticPageSection>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border-primary/10 bg-secondary-invert flex flex-col gap-3 rounded-xl border p-4 sm:p-5">
            <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Icon icon="solar:flag-linear" className="size-5 text-white" />
            </span>
            <p className="text-primary text-sm font-semibold sm:text-base">Our Mission</p>
            <p className="text-secondary text-xs leading-relaxed sm:text-sm">
              To make discovering and buying genuine beauty products simple, trustworthy, and
              enjoyable &mdash; for every shopper, every seller, and every skin tone.
            </p>
          </div>
          <div className="border-primary/10 bg-secondary-invert flex flex-col gap-3 rounded-xl border p-4 sm:p-5">
            <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Icon icon="solar:eye-linear" className="size-5 text-white" />
            </span>
            <p className="text-primary text-sm font-semibold sm:text-base">Our Vision</p>
            <p className="text-secondary text-xs leading-relaxed sm:text-sm">
              A beauty marketplace people recommend by word of mouth &mdash; not because we asked,
              but because shopping with us just works.
            </p>
          </div>
        </div>
      </StaticPageSection>

      <StaticPageSection title="Our Values">
        <InfoCardGrid items={OUR_VALUES} />
      </StaticPageSection>

      <StaticPageSection title="How We Live It">
        <Checklist items={HOW_WE_LIVE_IT} />
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Want the Full Story?"
        description="Read more about who we are and where we're headed."
        actions={
          <Link
            to={`/${ROUTES.COMPANY.ABOUT_US}`}
            className="border-primary/20 hover:bg-primary-invert/60 text-primary flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Icon icon="solar:bag-heart-linear" className="size-4.5" />
            About Beautinique
          </Link>
        }
      />
    </StaticPageLayout>
  );
};

export default MissionVisionValues;
