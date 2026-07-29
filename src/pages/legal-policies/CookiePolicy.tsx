import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { formatDate } from '@/utils/common.util';

const QUICK_OVERVIEW = [
  {
    icon: 'solar:shield-check-linear',
    title: 'Essential Cookies',
    description: 'Required to keep you logged in and the site working correctly.',
  },
  {
    icon: 'solar:chart-2-linear',
    title: 'Analytics Cookies',
    description: 'Help us understand how the site is used so we can improve it.',
  },
  {
    icon: 'solar:tuning-2-linear',
    title: 'Functional Cookies',
    description: 'Remember preferences like theme, language, and saved filters.',
  },
  {
    icon: 'solar:target-linear',
    title: 'Personalization Cookies',
    description: 'Power product recommendations tailored to your browsing.',
  },
  {
    icon: 'solar:hourglass-linear',
    title: 'Session & Persistent',
    description: 'Some cookies expire when you close your browser, some don’t.',
  },
  {
    icon: 'solar:settings-linear',
    title: 'You Stay in Control',
    description: 'Manage or disable cookies anytime from your browser settings.',
  },
] as const;

const COOKIE_TYPES = [
  {
    icon: 'solar:shield-check-linear',
    name: 'Essential / Strictly Necessary',
    status: 'Always Active',
    description:
      'Needed for core functionality like staying signed in, managing your cart, and keeping the site secure. These can’t be switched off.',
  },
  {
    icon: 'solar:chart-2-linear',
    name: 'Performance & Analytics',
    status: 'Optional',
    description:
      'Help us understand which pages are popular and how visitors move through the site, so we can improve performance and usability.',
  },
  {
    icon: 'solar:tuning-2-linear',
    name: 'Functional / Preference',
    status: 'Optional',
    description:
      'Remember choices you make, such as your theme (light/dark), region, or previously viewed categories, to make your next visit smoother.',
  },
  {
    icon: 'solar:target-linear',
    name: 'Targeting & Personalization',
    status: 'Optional',
    description:
      'Used to tailor product recommendations and offers to your interests based on your browsing behavior on our site.',
  },
] as const;

const HOW_WE_USE_COOKIES = [
  'Remembering your sign-in session so you don’t have to log in on every visit.',
  'Keeping items in your cart and wishlist while you continue browsing.',
  'Analyzing website traffic, popular products, and overall performance.',
  'Personalizing product recommendations and homepage content.',
  'Remembering your theme (light/dark) and other display preferences.',
] as const;

const BeautiniqueLink = () => (
  <Link to="/" className="inline">
    <GradientText type="accent" text="Beautinique" className="font-semibold" />
  </Link>
);

const CookiePolicy = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="mdi:cookie" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Cookie Policy"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          This page explains how <BeautiniqueLink /> uses cookies and similar technologies to run
          our site, remember your preferences, and improve your shopping experience.
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

      {/* What Are Cookies */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="What Are Cookies?"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Cookies are small text files stored on your device when you visit a website. They help
          websites remember information about your visit, like your preferred language, login
          status, and items in your cart, so your next visit can be faster and more personalized.
          We also use similar technologies such as local storage and session storage for the same
          purposes.
        </p>
      </section>

      {/* Types of Cookies We Use */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Types of Cookies We Use"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4">
          {COOKIE_TYPES.map((type) => (
            <div
              key={type.name}
              className="border-primary/10 bg-secondary-invert flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div className="flex items-start gap-3">
                <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Icon icon={type.icon} className="size-5 text-white" />
                </span>
                <div>
                  <p className="text-primary text-sm font-semibold sm:text-base">{type.name}</p>
                  <p className="text-secondary text-xs sm:text-sm">{type.description}</p>
                </div>
              </div>
              <span
                className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap sm:text-sm ${
                  type.status === 'Always Active'
                    ? 'border-primary-green/30 text-primary-green'
                    : 'border-primary/20 text-secondary'
                }`}
              >
                {type.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How We Use Cookies */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="How We Use Cookies"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          <BeautiniqueLink /> uses cookies for purposes such as:
        </p>
        <ul className="flex flex-col gap-3">
          {HOW_WE_USE_COOKIES.map((use) => (
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

      {/* Third-Party Cookies */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Third-Party Cookies & Services"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Some cookies are set by third-party services we rely on, such as analytics providers,
          payment processors, and social sign-in options like Google, LinkedIn, and GitHub. These
          partners may use cookies to help us understand site usage, process payments securely,
          and let you sign in without creating a new password. We don&apos;t control these
          third-party cookies directly, so we encourage you to review each provider&apos;s own
          privacy and cookie practices.
        </p>
      </section>

      {/* Cookie Duration */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="How Long Cookies Last"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          <span className="text-primary font-medium">Session cookies</span> are temporary and are
          automatically deleted once you close your browser. {' '}
          <span className="text-primary font-medium">Persistent cookies</span> remain on your
          device for a set period, or until you delete them, so we can recognize you on return
          visits.
        </p>
      </section>

      {/* Managing Cookies */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Managing & Disabling Cookies"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You can control or disable cookies at any time through your browser settings &mdash;
          most browsers let you view, delete, and block cookies from specific sites, or all sites
          entirely. Keep in mind that disabling essential cookies may prevent parts of the site,
          like sign-in or checkout, from working properly.
        </p>
      </section>

      {/* Consent */}
      <section className="flex flex-col gap-3">
        <GradientText type="accent" text="Consent" className="text-xl font-semibold sm:text-2xl" />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          By continuing to use our website, you consent to the use of cookies as described in this
          policy. If you do not agree, you can adjust your browser settings or discontinue use of
          the site.
        </p>
      </section>

      {/* Changes to Policy */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Changes to This Policy"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We may update this Cookie Policy from time to time to reflect changes in the cookies and
          technologies we use. Any updates will be posted on this page with a revised
          &quot;last updated&quot; date.
        </p>
      </section>

      <Divider />

      {/* Contact */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col items-start justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">Questions About Cookies?</p>
          <p className="text-secondary text-xs sm:text-sm">
            For more details or concerns about how we use cookies, reach out anytime.
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

export default CookiePolicy;
