import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
import { formatDate } from '@/utils/common.util';

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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:shield-star-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Compliance"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          How <GradientText type="accent" text="Beautinique" className="font-semibold" /> keeps the
          marketplace trustworthy — for shoppers and sellers alike.
        </p>
        <span className="text-primary/50 flex items-center gap-1 text-xs sm:text-sm">
          <Icon icon="solar:calendar-mark-linear" className="size-3.5" />
          Last updated {formatDate(new Date())}
        </span>
      </div>

      <Divider />

      {/* Pillars */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Our Standards"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {COMPLIANCE_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={pillar.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{pillar.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regulatory Alignment */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Regulatory Alignment"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We work to align our marketplace practices, seller onboarding, and data handling with
          applicable consumer protection and data privacy regulations. Sellers are expected to meet
          product labeling and safety requirements for the categories they list in.
        </p>
      </section>

      {/* Reporting */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Report a Concern"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          If you spot a counterfeit listing, a suspicious seller, or anything that doesn&apos;t look
          right, let us know and we&apos;ll investigate promptly.
        </p>
      </section>

      {/* Related Policies */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Related Policies"
          className="text-xl font-semibold sm:text-2xl"
        />
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
      </section>

      <Divider />

      {/* Contact */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col items-start justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">
            Have a Compliance Question?
          </p>
          <p className="text-secondary text-xs sm:text-sm">
            Reach out and our team will get back to you.
          </p>
        </div>
        <a
          href="mailto:beautinique.bq@gmail.com"
          className="border-primary/20 hover:bg-primary-invert/60 text-primary flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Icon icon="solar:letter-linear" className="size-4.5" />
          beautinique.bq@gmail.com
        </a>
      </section>
    </div>
  );
};

export default Compliance;
