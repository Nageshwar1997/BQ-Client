import { Icon } from '@iconify/react';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { formatDate } from '@/utils/common.util';

const ACCESSIBILITY_FEATURES = [
  {
    icon: 'solar:keyboard-linear',
    title: 'Keyboard Navigation',
    description: 'Every interactive element can be reached and operated using just a keyboard.',
  },
  {
    icon: 'solar:volume-loud-linear',
    title: 'Screen Reader Friendly',
    description: 'Semantic markup and ARIA labels keep content clear for assistive technologies.',
  },
  {
    icon: 'solar:moon-linear',
    title: 'High-Contrast Themes',
    description: 'Dark and light modes are tuned for readable contrast in either setting.',
  },
  {
    icon: 'solar:cursor-linear',
    title: 'Clear Focus & Forms',
    description: 'Visible focus indicators and accessible form fields guide every interaction.',
  },
  {
    icon: 'solar:gallery-linear',
    title: 'Alt Text for Media',
    description: 'Images, videos, and try-on previews carry descriptive alternative text.',
  },
  {
    icon: 'solar:text-square-linear',
    title: 'Resizable Text',
    description: 'Text scales cleanly up to 200% without losing content or breaking layout.',
  },
  {
    icon: 'solar:pause-circle-linear',
    title: 'Reduced Motion Support',
    description: 'Animations and carousels respect your system’s reduced-motion preference.',
  },
  {
    icon: 'solar:signpost-linear',
    title: 'Skip & Consistent Navigation',
    description: 'Skip-to-content links and a predictable layout help you get around faster.',
  },
  {
    icon: 'solar:link-linear',
    title: 'Descriptive Links & Labels',
    description: 'Links and buttons are named for what they do, not just "click here".',
  },
  {
    icon: 'solar:palette-linear',
    title: 'Color Is Never the Only Cue',
    description: 'Status, errors, and actions are always paired with text or icons, not color alone.',
  },
] as const;

const SUPPORTED_BROWSERS = [
  { icon: 'logos:chrome', label: 'Chrome' },
  { icon: 'logos:firefox', label: 'Firefox' },
  { icon: 'logos:safari', label: 'Safari' },
  { icon: 'logos:microsoft-edge', label: 'Edge' },
  { icon: 'logos:brave', label: 'Brave' },
] as const;

const SUPPORTED_SCREEN_READERS = ['NVDA', 'JAWS', 'VoiceOver', 'TalkBack'] as const;

const KEYBOARD_SHORTCUTS = [
  { keys: 'Tab / Shift + Tab', description: 'Move focus forward or backward between elements' },
  { keys: 'Enter / Space', description: 'Activate the focused button, link, or control' },
  { keys: 'Esc', description: 'Close the open modal, dropdown, or search overlay' },
  { keys: 'Arrow Keys', description: 'Move between options in menus, carousels, and radio groups' },
] as const;

const KNOWN_LIMITATIONS = [
  'A few third-party embeds (like payment gateways) are outside our direct control and may not fully meet our accessibility standards yet.',
  'The virtual try-on experience relies on camera access and visual feedback; a fully non-visual alternative is still in progress.',
  'Some older product images uploaded by sellers may be missing descriptive alt text while we complete a full content audit.',
] as const;

const Accessibility = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="tabler:accessible" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Accessibility Statement"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          At Beautinique, we believe beauty should be inclusive. We&apos;re committed to making
          every part of our platform accessible, usable, and enjoyable for everyone, regardless
          of ability or the technology they use to browse.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="border-primary/20 text-primary rounded-full border px-3 py-1 text-xs font-medium sm:text-sm">
            WCAG 2.1 Level AA
          </span>
          <span className="text-primary/50 flex items-center gap-1 text-xs sm:text-sm">
            <Icon icon="solar:calendar-mark-linear" className="size-3.5" />
            Last reviewed {formatDate(new Date())}
          </span>
        </div>
      </div>

      <Divider />

      {/* Our Commitment */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Our Commitment"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We strive to provide an accessible, seamless shopping experience for all our customers,
          including individuals with diverse abilities. Accessibility isn&apos;t a one-time
          checklist for us &mdash; it&apos;s an ongoing practice woven into how we design, build,
          and test every page, product listing, and checkout flow, so that browsing, discovering,
          and buying products you love never feels like a barrier.
        </p>
      </section>

      {/* Conformance Status */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Conformance Status"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          The{' '}
          <span className="text-primary font-medium">
            Web Content Accessibility Guidelines (WCAG) 2.1
          </span>{' '}
          define requirements for designers and developers to improve accessibility for people
          with disabilities. It defines three levels of conformance: A, AA, and AAA. Beautinique
          is <span className="text-primary font-medium">partially conformant with WCAG 2.1 AA</span>
          , meaning most of the site meets this standard, and the sections that don&apos;t yet are
          listed openly under{' '}
          <span className="text-primary font-medium">Known Limitations</span> below.
        </p>
      </section>

      {/* Features We Support */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Features We Support"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ACCESSIBILITY_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={feature.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{feature.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compatibility */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Browser & Assistive Technology Compatibility"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We test Beautinique against the latest versions of the following browsers and screen
          readers, in both light and dark themes.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border-primary/10 bg-secondary-invert flex flex-col gap-3 rounded-xl border p-4">
            <p className="text-primary/50 text-[11px] font-medium tracking-wide uppercase">
              Supported Browsers
            </p>
            <div className="flex flex-wrap gap-3">
              {SUPPORTED_BROWSERS.map((browser) => (
                <div key={browser.label} className="flex items-center gap-1.5">
                  <Icon icon={browser.icon} className="size-4.5" />
                  <span className="text-secondary text-sm">{browser.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-primary/10 bg-secondary-invert flex flex-col gap-3 rounded-xl border p-4">
            <p className="text-primary/50 text-[11px] font-medium tracking-wide uppercase">
              Supported Screen Readers
            </p>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_SCREEN_READERS.map((reader) => (
                <span
                  key={reader}
                  className="border-primary/20 text-secondary rounded-full border px-2.5 py-1 text-xs sm:text-sm"
                >
                  {reader}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Keyboard Shortcuts"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="border-primary/10 bg-secondary-invert divide-primary/10 flex flex-col divide-y rounded-xl border">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex flex-col gap-1 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
            >
              <span className="text-secondary text-xs sm:text-sm">{shortcut.description}</span>
              <kbd className="border-primary/20 bg-primary-invert/60 text-primary w-fit rounded-md border px-2 py-1 font-mono text-xs">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      {/* Known Limitations */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Known Limitations"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We believe in being upfront about where we still fall short. Here&apos;s what we&apos;re
          actively working to improve:
        </p>
        <ul className="flex flex-col gap-3">
          {KNOWN_LIMITATIONS.map((limitation) => (
            <li
              key={limitation}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-3 sm:p-4"
            >
              <Icon
                icon="solar:danger-triangle-linear"
                className="text-primary/60 mt-0.5 size-4.5 shrink-0"
              />
              <span className="text-secondary text-xs sm:text-sm">{limitation}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Continuous Improvements */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Continuous Improvements"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          We regularly audit and enhance our site against WCAG 2.1 AA standards using both
          automated tools and manual screen-reader testing, so our beauty products, tutorials,
          and virtual try-on experiences can be enjoyed by everyone. Every new feature we ship
          goes through an accessibility review before it reaches you.
        </p>
      </section>

      <Divider />

      {/* Feedback */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <p className="text-primary text-base font-semibold sm:text-lg">Help Us Improve</p>
            <p className="text-secondary text-xs sm:text-sm">
              If you encounter any accessibility barriers or have suggestions, we&apos;d love to
              hear from you. We aim to respond within 2 business days.
            </p>
          </div>
          <a
            href="mailto:beautinique.bq@gmail.com"
            className="border-primary/20 hover:bg-primary-invert/60 text-primary flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Icon icon="solar:letter-linear" className="size-4.5" />
            beautinique.bq@gmail.com
          </a>
        </div>
        <div className="border-primary/10 flex items-start gap-2 border-t pt-4">
          <Icon icon="solar:clock-circle-linear" className="text-primary/50 mt-0.5 size-4 shrink-0" />
          <p className="text-primary/50 text-xs sm:text-sm">
            This statement was last reviewed on {formatDate(new Date())} and is reviewed
            periodically as our platform evolves.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Accessibility;
