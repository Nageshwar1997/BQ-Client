import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
import { formatDate } from '@/utils/common.util';

const QUICK_OVERVIEW = [
  {
    icon: 'solar:stethoscope-linear',
    title: 'Not Medical Advice',
    description: 'Our content is informational, not a substitute for professional advice.',
  },
  {
    icon: 'solar:document-text-linear',
    title: 'Product Info May Vary',
    description: 'Packaging, shades, and ingredients can change between manufacturer batches.',
  },
  {
    icon: 'solar:test-tube-linear',
    title: 'Patch Test First',
    description: 'Always patch test new products before applying them fully.',
  },
  {
    icon: 'solar:eye-scan-linear',
    title: 'Try-On Is a Preview',
    description: 'Virtual try-on colors are an approximation, not an exact match.',
  },
  {
    icon: 'solar:link-linear',
    title: 'External Links',
    description: 'We aren’t responsible for third-party sites we link to.',
  },
  {
    icon: 'solar:scale-linear',
    title: 'Limited Liability',
    description: 'We limit our liability for damages arising from site or product use.',
  },
] as const;

const BeautiniqueLink = () => (
  <Link to={ROUTES.HOME} className="inline">
    <GradientText type="accent" text="Beautinique" className="font-semibold" />
  </Link>
);

const Disclaimer = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:document-text-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Disclaimer"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          Please read this page carefully. It explains what you can and can&apos;t rely on when
          using <BeautiniqueLink /> &mdash; from product descriptions to our virtual try-on
          experience.
        </p>
        <span className="text-primary/50 flex items-center gap-1 text-xs sm:text-sm">
          <Icon icon="solar:calendar-mark-linear" className="size-3.5" />
          Last updated {formatDate(new Date())}
        </span>
      </div>

      <Divider />

      {/* Introduction */}
      <section className="flex flex-col gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Welcome to <BeautiniqueLink />. All information, products, and services provided on this
          website are intended solely for general informational and beauty enhancement purposes. By
          accessing this site, you acknowledge and agree to the terms outlined in this disclaimer.
        </p>
      </section>

      {/* Quick Overview */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Key Points at a Glance"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_OVERVIEW.map((point) => (
            <div
              key={point.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={point.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{point.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Not Medical Advice */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Not Medical Advice"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          <BeautiniqueLink /> does not provide medical, dermatological, or professional skincare
          advice. Always consult a qualified healthcare or skincare professional before using any
          beauty or cosmetic product, particularly if you have underlying skin conditions,
          allergies, or other medical concerns. Nothing on this site should be interpreted as a
          diagnosis, treatment, or cure for any condition.
        </p>
      </section>

      {/* Product Information & Accuracy */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Product Information & Accuracy"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We strive to provide accurate descriptions, ingredients, and usage details for every
          product listed by our sellers. However, product packaging, formulations, and shades may
          vary depending on manufacturer updates, and screen displays may render colors slightly
          differently across devices. Please refer to the physical product label for the most
          accurate and up-to-date information before use.
        </p>
      </section>

      {/* Patch Testing & Allergies — highlighted warning */}
      <section className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4 sm:p-5">
        <Icon icon="solar:test-tube-linear" className="text-primary/60 mt-0.5 size-5 shrink-0" />
        <div className="flex flex-col gap-1.5">
          <p className="text-primary text-sm font-semibold sm:text-base">
            Patch Testing & Allergies
          </p>
          <p className="text-secondary text-xs leading-relaxed sm:text-sm">
            Individual skin results vary. We strongly recommend performing a patch test 24&ndash;48
            hours before full application to check for allergic reactions or sensitivities.{' '}
            <BeautiniqueLink /> is not responsible for adverse reactions, breakouts, or skin
            sensitivities resulting from product use.
          </p>
        </div>
      </section>

      {/* Virtual Try-On Accuracy */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Virtual Try-On & Preview Accuracy"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Our virtual try-on feature is designed to give you a general sense of how a shade or
          product might look. Actual results can vary based on your camera, screen calibration,
          lighting conditions, and skin tone, and should be treated as a guide rather than an exact
          preview of the physical product.
        </p>
      </section>

      {/* Reviews & User-Generated Content */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Reviews & User-Generated Content"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Product reviews, ratings, and feedback shown on this site reflect the personal opinions of
          individual customers. They are not independently verified, edited, or endorsed by{' '}
          <BeautiniqueLink />, and should not be treated as professional or medical recommendations.
        </p>
      </section>

      {/* External Links */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="External Links"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          This website may include links to third-party websites, seller storefronts, or social
          media for additional information. We do not control, endorse, or take responsibility for
          the content, products, or privacy practices of any external site you visit.
        </p>
      </section>

      {/* Limitation of Liability */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Limitation of Liability"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          To the fullest extent permitted by law, <BeautiniqueLink /> is not liable for any direct,
          indirect, incidental, or consequential damages resulting from product use, reliance on
          website content, or access to and use of this website.
        </p>
      </section>

      {/* Changes to This Disclaimer */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Changes to This Disclaimer"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          This disclaimer may be updated periodically to reflect changes in our policies, products,
          or applicable regulations. We encourage you to review this page from time to time;
          continued use of the site after changes are posted constitutes acceptance of the updated
          disclaimer.
        </p>
      </section>

      {/* Your Consent */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Your Consent"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          By using our website, you acknowledge that you have read this disclaimer and consent to
          its terms in full.
        </p>
      </section>

      <Divider />

      {/* Contact */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col items-start justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">Have Questions?</p>
          <p className="text-secondary text-xs sm:text-sm">
            If anything in this disclaimer is unclear, reach out and we&apos;ll be happy to explain.
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

export default Disclaimer;
