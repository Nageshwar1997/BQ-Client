import { Icon } from '@iconify/react';

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

const CookiePolicy = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="mdi:cookie"
        title="Cookie Policy"
        description={
          <>
            This page explains how <BeautiniqueLink /> uses cookies and similar technologies to run
            our site, remember your preferences, and improve your shopping experience.
          </>
        }
        meta={<LastUpdatedBadge />}
      />

      <Divider />

      <StaticPageSection title="Key Points at a Glance">
        <InfoCardGrid items={QUICK_OVERVIEW} />
      </StaticPageSection>

      <StaticPageSection title="What Are Cookies?" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Cookies are small text files stored on your device when you visit a website. They help
          websites remember information about your visit, like your preferred language, login
          status, and items in your cart, so your next visit can be faster and more personalized. We
          also use similar technologies such as local storage and session storage for the same
          purposes.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Types of Cookies We Use">
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
      </StaticPageSection>

      <StaticPageSection title="How We Use Cookies">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          <BeautiniqueLink /> uses cookies for purposes such as:
        </p>
        <Checklist items={HOW_WE_USE_COOKIES} />
      </StaticPageSection>

      <StaticPageSection title="Third-Party Cookies & Services" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Some cookies are set by third-party services we rely on, such as analytics providers,
          payment processors, and social sign-in options like Google, LinkedIn, and GitHub. These
          partners may use cookies to help us understand site usage, process payments securely, and
          let you sign in without creating a new password. We don&apos;t control these third-party
          cookies directly, so we encourage you to review each provider&apos;s own privacy and
          cookie practices.
        </p>
      </StaticPageSection>

      <StaticPageSection title="How Long Cookies Last" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          <span className="text-primary font-medium">Session cookies</span> are temporary and are
          automatically deleted once you close your browser.{' '}
          <span className="text-primary font-medium">Persistent cookies</span> remain on your device
          for a set period, or until you delete them, so we can recognize you on return visits.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Managing & Disabling Cookies" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          You can control or disable cookies at any time through your browser settings &mdash; most
          browsers let you view, delete, and block cookies from specific sites, or all sites
          entirely. Keep in mind that disabling essential cookies may prevent parts of the site,
          like sign-in or checkout, from working properly.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Consent" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          By continuing to use our website, you consent to the use of cookies as described in this
          policy. If you do not agree, you can adjust your browser settings or discontinue use of
          the site.
        </p>
      </StaticPageSection>

      <StaticPageSection title="Changes to This Policy" className="gap-3">
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We may update this Cookie Policy from time to time to reflect changes in the cookies and
          technologies we use. Any updates will be posted on this page with a revised &quot;last
          updated&quot; date.
        </p>
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Questions About Cookies?"
        description="For more details or concerns about how we use cookies, reach out anytime."
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default CookiePolicy;
