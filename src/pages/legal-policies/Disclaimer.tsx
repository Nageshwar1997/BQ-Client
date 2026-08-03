import {
  BeautiniqueLink,
  EmailUsAction,
  HighlightNote,
  InfoCardGrid,
  LastUpdatedBadge,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';

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

const Disclaimer = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:document-text-linear"
        title="Disclaimer"
        description={
          <>
            Please read this page carefully. It explains what you can and can&apos;t rely on when
            using <BeautiniqueLink /> &mdash; from product descriptions to our virtual try-on
            experience.
          </>
        }
        meta={<LastUpdatedBadge />}
      />

      <Divider />

      <StaticPageSection className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Welcome to <BeautiniqueLink />. All information, products, and services provided on this
          website are intended solely for general informational and beauty enhancement purposes. By
          accessing this site, you acknowledge and agree to the terms outlined in this disclaimer.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Key Points at a Glance">
        <InfoCardGrid items={QUICK_OVERVIEW} />
      </StaticPageSection>

      <StaticPageSection title="Not Medical Advice" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          <BeautiniqueLink /> does not provide medical, dermatological, or professional skincare
          advice. Always consult a qualified healthcare or skincare professional before using any
          beauty or cosmetic product, particularly if you have underlying skin conditions,
          allergies, or other medical concerns. Nothing on this site should be interpreted as a
          diagnosis, treatment, or cure for any condition.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Product Information & Accuracy" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We strive to provide accurate descriptions, ingredients, and usage details for every
          product listed by our sellers. However, product packaging, formulations, and shades may
          vary depending on manufacturer updates, and screen displays may render colors slightly
          differently across devices. Please refer to the physical product label for the most
          accurate and up-to-date information before use.
        </p>
      </StaticPageSection>

      <HighlightNote icon="solar:test-tube-linear" title="Patch Testing & Allergies">
        Individual skin results vary. We strongly recommend performing a patch test 24&ndash;48
        hours before full application to check for allergic reactions or sensitivities.{' '}
        <BeautiniqueLink /> is not responsible for adverse reactions, breakouts, or skin
        sensitivities resulting from product use.
      </HighlightNote>

      <StaticPageSection title="Virtual Try-On & Preview Accuracy" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Our virtual try-on feature is designed to give you a general sense of how a shade or
          product might look. Actual results can vary based on your camera, screen calibration,
          lighting conditions, and skin tone, and should be treated as a guide rather than an exact
          preview of the physical product.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Reviews & User-Generated Content" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Product reviews, ratings, and feedback shown on this site reflect the personal opinions of
          individual customers. They are not independently verified, edited, or endorsed by{' '}
          <BeautiniqueLink />, and should not be treated as professional or medical recommendations.
        </p>
      </StaticPageSection>

      <StaticPageSection title="External Links" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          This website may include links to third-party websites, seller storefronts, or social
          media for additional information. We do not control, endorse, or take responsibility for
          the content, products, or privacy practices of any external site you visit.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Limitation of Liability" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          To the fullest extent permitted by law, <BeautiniqueLink /> is not liable for any direct,
          indirect, incidental, or consequential damages resulting from product use, reliance on
          website content, or access to and use of this website.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Changes to This Disclaimer" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          This disclaimer may be updated periodically to reflect changes in our policies, products,
          or applicable regulations. We encourage you to review this page from time to time;
          continued use of the site after changes are posted constitutes acceptance of the updated
          disclaimer.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Your Consent" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          By using our website, you acknowledge that you have read this disclaimer and consent to
          its terms in full.
        </p>
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Have Questions?"
        description="If anything in this disclaimer is unclear, reach out and we'll be happy to explain."
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default Disclaimer;
