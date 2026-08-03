import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import {
  EmailUsAction,
  InfoCardGrid,
  LastUpdatedBadge,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const COMPLIANCE_PILLARS = [
  {
    icon: 'solar:shield-check-linear',
    title: 'Seller Verification',
    description: 'Every seller is reviewed and verified before their products go live.',
  },
  {
    icon: 'solar:verified-check-linear',
    title: 'Authentic Products Only',
    description: 'Sellers must attest to product authenticity; counterfeits get removed.',
  },
  {
    icon: 'solar:chat-round-check-linear',
    title: 'Genuine Reviews',
    description: 'Ratings and reviews are only accepted from verified purchases.',
  },
  {
    icon: 'solar:lock-keyhole-linear',
    title: 'Data Protection',
    description: 'Account and payment data are handled per our Privacy Policy standards.',
  },
] as const;

const RELATED_POLICIES = [
  { label: 'Privacy Policy', path: `/${ROUTES.LEGAL.PRIVACY_POLICY}` },
  { label: 'Terms & Conditions', path: `/${ROUTES.LEGAL.TERMS_CONDITIONS}` },
  { label: 'Cookie Policy', path: `/${ROUTES.LEGAL.COOKIE_POLICY}` },
  { label: 'Accessibility', path: `/${ROUTES.LEGAL.ACCESSIBILITY}` },
] as const;

const Compliance = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:shield-star-linear"
        title="Compliance"
        description={
          <>
            How <GradientText type="accent" text="Beautinique" className="font-semibold" /> keeps
            the marketplace trustworthy — for shoppers and sellers alike.
          </>
        }
        meta={<LastUpdatedBadge />}
      />

      <Divider />

      <StaticPageSection title="Our Standards">
        <InfoCardGrid items={COMPLIANCE_PILLARS} />
      </StaticPageSection>

      <StaticPageSection title="Regulatory Alignment" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We work to align our marketplace practices, seller onboarding, and data handling with
          applicable consumer protection and data privacy regulations. Sellers are expected to meet
          product labeling and safety requirements for the categories they list in.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Report a Concern" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          If you spot a counterfeit listing, a suspicious seller, or anything that doesn&apos;t look
          right, let us know and we&apos;ll investigate promptly.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Related Policies">
        <div className="flex flex-wrap gap-3">
          {RELATED_POLICIES.map((policy) => (
            <Link
              key={policy.path}
              to={policy.path}
              className="border-primary/20 hover:bg-primary-invert/60 text-primary flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <Icon icon="solar:document-text-linear" className="size-4.5" />
              {policy.label}
            </Link>
          ))}
        </div>
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Have a Compliance Question?"
        description="Reach out and our team will get back to you."
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default Compliance;
