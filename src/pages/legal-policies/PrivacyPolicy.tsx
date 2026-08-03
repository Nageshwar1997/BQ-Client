import { Link } from 'react-router-dom';

import {
  BeautiniqueLink,
  Checklist,
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

const QUICK_OVERVIEW = [
  {
    icon: 'solar:user-id-linear',
    title: 'Data We Collect',
    description: 'Account details, order info, and how you use the site.',
  },
  {
    icon: 'solar:settings-linear',
    title: 'How We Use It',
    description: 'To fulfill orders, support you, and improve your experience.',
  },
  {
    icon: 'solar:share-linear',
    title: 'Limited Sharing',
    description: 'We never sell your data; sharing is limited to trusted partners.',
  },
  {
    icon: 'solar:shield-keyhole-linear',
    title: 'Data Security',
    description: 'Sensitive account data is encrypted, both in transit and at rest.',
  },
  {
    icon: 'mdi:cookie',
    title: 'Cookies',
    description: 'We use cookies as described in our dedicated Cookie Policy.',
  },
  {
    icon: 'solar:user-check-rounded-linear',
    title: 'Your Rights',
    description: 'Access, correct, or delete your data whenever you want.',
  },
] as const;

const DATA_WE_COLLECT = [
  {
    icon: 'solar:user-id-linear',
    title: 'Account Information',
    description: 'Name, email address, phone number, and password (stored encrypted).',
  },
  {
    icon: 'solar:card-linear',
    title: 'Order & Payment Information',
    description:
      'Shipping address and payment details, processed securely by our payment partners.',
  },
  {
    icon: 'solar:devices-linear',
    title: 'Usage & Device Information',
    description:
      'Pages visited, browser type, and device information via cookies and similar tech.',
  },
  {
    icon: 'solar:videocamera-linear',
    title: 'Virtual Try-On Camera Data',
    description:
      'Camera access used only to render live previews; frames are not stored or shared.',
  },
] as const;

const HOW_WE_USE_INFO = [
  'Processing and fulfilling your orders, including shipping and returns.',
  'Providing customer support and responding to your inquiries.',
  'Sending order updates, and promotions or newsletters if you’ve subscribed.',
  'Improving website functionality and personalizing your shopping experience.',
  'Detecting and preventing fraud, abuse, or security incidents.',
] as const;

const YOUR_RIGHTS = [
  'Request a copy of the personal data we hold about you.',
  'Correct any inaccurate or outdated information in your profile.',
  'Request deletion of your account and associated personal data.',
  'Opt out of marketing emails at any time, from the email itself or your settings.',
] as const;

const PrivacyPolicy = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:lock-keyhole-linear"
        title="Privacy Policy"
        description={
          <>
            This Privacy Policy explains how <BeautiniqueLink /> collects, uses, shares, and
            protects your personal information when you shop, sell, or browse with us.
          </>
        }
        meta={<LastUpdatedBadge />}
      />

      <Divider />

      <StaticPageSection title="Key Points at a Glance">
        <InfoCardGrid items={QUICK_OVERVIEW} />
      </StaticPageSection>

      <StaticPageSection title="Information We Collect">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We collect information you give us directly, information generated as you use our
          services, and information needed to power certain features:
        </p>
        <InfoCardGrid items={DATA_WE_COLLECT} />
      </StaticPageSection>

      <StaticPageSection title="How We Use Your Information">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          <BeautiniqueLink /> uses your information to:
        </p>
        <Checklist items={HOW_WE_USE_INFO} />
      </StaticPageSection>

      <StaticPageSection title="Cookies & Tracking" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We use cookies and similar technologies to keep you signed in, remember your preferences,
          analyze traffic, and enhance your overall experience. For full details on the types of
          cookies we use and how to manage them, see our{' '}
          <Link to={`/${ROUTES.LEGAL.COOKIE_POLICY}`} className="inline">
            <GradientText type="accent" text="Cookie Policy" className="font-semibold" />
          </Link>
          .
        </p>
      </StaticPageSection>

      <StaticPageSection title="How We Share Your Information" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We do not sell or rent your personal information to third parties. Your data may be shared
          only with trusted partners who help us run our platform &mdash; such as payment
          processors, shipping carriers, marketplace sellers fulfilling your order, and
          authentication providers (Google, LinkedIn, GitHub) if you choose to sign in through them
          &mdash; or when required to comply with the law.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Data Security" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We implement appropriate technical and organizational measures to protect your personal
          information from unauthorized access, disclosure, or misuse &mdash; including encrypting
          sensitive account data and transmitting information over secure connections. While no
          system can be guaranteed to be 100% secure, we work continuously to keep your information
          safe.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Data Retention" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We retain your personal information for as long as your account is active or as needed to
          provide our services, comply with legal obligations, resolve disputes, and enforce our
          agreements. When you delete your account, we remove or anonymize your personal data,
          except where retention is required by law.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Your Rights & Choices">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You&apos;re always in control of your personal information. You can:
        </p>
        <Checklist
          items={YOUR_RIGHTS}
          icon="solar:user-check-rounded-linear"
          iconClassName="text-primary/60"
        />
      </StaticPageSection>

      <StaticPageSection title="Children's Privacy" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Beautinique is not directed at children under 18, and we do not knowingly collect personal
          information from anyone under that age. If you believe a child has provided us with
          personal information, please contact us so we can remove it promptly.
        </p>
      </StaticPageSection>

      <StaticPageSection title="International Data Transfers" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Your information may be processed or stored on servers located outside your home country.
          Wherever your data is processed, we take steps to ensure it receives an adequate level of
          protection, consistent with this Privacy Policy.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Changes to This Policy" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We may update this Privacy Policy periodically to reflect changes in our practices or
          legal requirements. Continued use of our website after changes are posted constitutes
          acceptance of the updated policy.
        </p>
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Questions About Your Data?"
        description="For access, correction, or deletion requests, or any other privacy questions, reach out to us."
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default PrivacyPolicy;
