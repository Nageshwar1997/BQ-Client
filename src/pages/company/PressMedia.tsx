import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import {
  EmailUsAction,
  InfoCardGrid,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
import useThemeStore from '@/stores/theme.store';

const BRAND_LOGOS = [
  { key: 'gradient', label: 'Gradient (Primary)', src: '/images/logo/BQ_gradient_logo.webp' },
  { key: 'black', label: 'Black', src: '/images/logo/BQ_black_logo.webp' },
  { key: 'white', label: 'White', src: '/images/logo/BQ_white_logo.webp' },
  { key: 'blue', label: 'Blue', src: '/images/logo/BQ_blue_logo.webp' },
] as const;

const QUICK_FACTS = [
  {
    icon: 'solar:widget-5-linear',
    title: 'What We Are',
    description: 'A curated online marketplace connecting beauty shoppers with verified sellers.',
  },
  {
    icon: 'solar:magic-stick-2-linear',
    title: 'Known For',
    description: 'Virtual try-on technology that lets shoppers preview products before buying.',
  },
  {
    icon: 'solar:shield-check-linear',
    title: 'Trust Model',
    description: 'Verified sellers, purchase-only reviews, and encrypted account security.',
  },
  {
    icon: 'solar:hand-shake-linear',
    title: 'Pronunciation',
    description: 'Beautinique — pronounced "Beauty-Unique".',
  },
] as const;

const PressMedia = () => {
  const theme = useThemeStore((s) => s.theme);

  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:tv-linear"
        title="Press & Media"
        description={
          <>
            Resources for journalists, bloggers, and partners covering{' '}
            <GradientText type="accent" text="Beautinique" className="font-semibold" /> &mdash; from
            brand assets to how to reach our team.
          </>
        }
      />

      <Divider />

      <StaticPageSection title="As Featured In" className="gap-3">
        <div className="border-primary/10 bg-secondary-invert flex flex-col items-start gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <img
              src={`/images/footer/Forbes-${theme}.webp`}
              alt="Forbes"
              className="h-8 w-fit object-contain"
            />
            <p className="text-secondary text-xs leading-relaxed sm:text-sm">
              Featured in Forbes&apos; &quot;Rising Beauty-Tech Startups to Watch,&quot; recognizing
              our virtual try-on technology and marketplace model.
            </p>
          </div>
          <Link
            to={`/${ROUTES.AWARDS}`}
            className="text-primary flex shrink-0 items-center gap-1 text-xs font-medium sm:text-sm"
          >
            Read the full story
            <Icon icon="solar:alt-arrow-down-linear" className="size-3.5 -rotate-90" />
          </Link>
        </div>
      </StaticPageSection>

      <StaticPageSection title="Quick Facts">
        <InfoCardGrid items={QUICK_FACTS} />
      </StaticPageSection>

      <StaticPageSection title="Brand Assets">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Download our logo in the format that fits your background. Please use these assets as-is,
          without altering the logo&apos;s shape, colors, or proportions.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BRAND_LOGOS.map((logo) => (
            <Link
              key={logo.key}
              to={logo.src}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="border-primary/10 bg-smoke-eerie hover:border-primary/20 flex flex-col items-center gap-3 rounded-xl border p-4 transition-colors"
            >
              <img
                src={logo.src}
                alt={`Beautinique logo — ${logo.label}`}
                className="h-10 w-fit object-contain"
              />
              <span className="text-secondary flex items-center gap-1 text-xs font-medium">
                <Icon icon="solar:download-linear" className="size-3.5" />
                {logo.label}
              </span>
            </Link>
          ))}
        </div>
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Media Inquiries"
        description="For interviews, quotes, or additional brand assets, reach out to our team directly."
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default PressMedia;
