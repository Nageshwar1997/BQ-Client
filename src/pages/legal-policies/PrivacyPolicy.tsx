import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { formatDate } from '@/utils/common.util';

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
    description: 'Shipping address and payment details, processed securely by our payment partners.',
  },
  {
    icon: 'solar:devices-linear',
    title: 'Usage & Device Information',
    description: 'Pages visited, browser type, and device information via cookies and similar tech.',
  },
  {
    icon: 'solar:videocamera-linear',
    title: 'Virtual Try-On Camera Data',
    description: 'Camera access used only to render live previews; frames are not stored or shared.',
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

const BeautiniqueLink = () => (
  <Link to="/" className="inline">
    <GradientText type="accent" text="Beautinique" className="font-semibold" />
  </Link>
);

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:lock-keyhole-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Privacy Policy"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          This Privacy Policy explains how <BeautiniqueLink /> collects, uses, shares, and
          protects your personal information when you shop, sell, or browse with us.
        </p>
        <span className="text-primary/50 flex items-center gap-1 text-xs sm:text-sm">
          <Icon icon="solar:calendar-mark-linear" className="size-3.5" />
          Last updated {formatDate(new Date())}
        </span>
      </div>

      <Divider />

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

      {/* Information We Collect */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Information We Collect"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We collect information you give us directly, information generated as you use our
          services, and information needed to power certain features:
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DATA_WE_COLLECT.map((item) => (
            <div
              key={item.title}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={item.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{item.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="How We Use Your Information"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          <BeautiniqueLink /> uses your information to:
        </p>
        <ul className="flex flex-col gap-3">
          {HOW_WE_USE_INFO.map((use) => (
            <li
              key={use}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-3 sm:p-4"
            >
              <Icon
                icon="solar:check-circle-linear"
                className="text-primary-green mt-0.5 size-4.5 shrink-0"
              />
              <span className="text-secondary text-xs sm:text-sm">{use}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Cookies & Tracking */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Cookies & Tracking"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We use cookies and similar technologies to keep you signed in, remember your
          preferences, analyze traffic, and enhance your overall experience. For full details on
          the types of cookies we use and how to manage them, see our{' '}
          <Link to="/cookie-policy" className="inline">
            <GradientText type="accent" text="Cookie Policy" className="font-semibold" />
          </Link>
          .
        </p>
      </section>

      {/* Sharing Your Information */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="How We Share Your Information"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We do not sell or rent your personal information to third parties. Your data may be
          shared only with trusted partners who help us run our platform &mdash; such as payment
          processors, shipping carriers, marketplace sellers fulfilling your order, and
          authentication providers (Google, LinkedIn, GitHub) if you choose to sign in through
          them &mdash; or when required to comply with the law.
        </p>
      </section>

      {/* Data Security */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Data Security"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We implement appropriate technical and organizational measures to protect your personal
          information from unauthorized access, disclosure, or misuse &mdash; including encrypting
          sensitive account data and transmitting information over secure connections. While no
          system can be guaranteed to be 100% secure, we work continuously to keep your
          information safe.
        </p>
      </section>

      {/* Data Retention */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Data Retention"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We retain your personal information for as long as your account is active or as needed
          to provide our services, comply with legal obligations, resolve disputes, and enforce
          our agreements. When you delete your account, we remove or anonymize your personal data,
          except where retention is required by law.
        </p>
      </section>

      {/* Your Rights */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Your Rights & Choices"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You&apos;re always in control of your personal information. You can:
        </p>
        <ul className="flex flex-col gap-3">
          {YOUR_RIGHTS.map((right) => (
            <li
              key={right}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-3 sm:p-4"
            >
              <Icon
                icon="solar:user-check-rounded-linear"
                className="text-primary/60 mt-0.5 size-4.5 shrink-0"
              />
              <span className="text-secondary text-xs sm:text-sm">{right}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Children's Privacy */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Children's Privacy"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Beautinique is not directed at children under 18, and we do not knowingly collect
          personal information from anyone under that age. If you believe a child has provided us
          with personal information, please contact us so we can remove it promptly.
        </p>
      </section>

      {/* International Data Transfers */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="International Data Transfers"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Your information may be processed or stored on servers located outside your home
          country. Wherever your data is processed, we take steps to ensure it receives an
          adequate level of protection, consistent with this Privacy Policy.
        </p>
      </section>

      {/* Changes to This Policy */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Changes to This Policy"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We may update this Privacy Policy periodically to reflect changes in our practices or
          legal requirements. Continued use of our website after changes are posted constitutes
          acceptance of the updated policy.
        </p>
      </section>

      <Divider />

      {/* Contact */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col items-start justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">
            Questions About Your Data?
          </p>
          <p className="text-secondary text-xs sm:text-sm">
            For access, correction, or deletion requests, or any other privacy questions, reach
            out to us.
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

export default PrivacyPolicy;
