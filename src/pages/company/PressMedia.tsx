import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:tv-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Press & Media"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          Resources for journalists, bloggers, and partners covering{' '}
          <GradientText type="accent" text="Beautinique" className="font-semibold" /> &mdash; from
          brand assets to how to reach our team.
        </p>
      </div>

      <Divider />

      {/* As Featured In */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="As Featured In"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="border-primary/10 bg-secondary-invert flex flex-col items-start gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <img
              src={`/images/footer/Forbes-${theme}.webp`}
              alt="Forbes"
              className="h-8 w-fit object-contain"
            />
            <p className="text-secondary text-xs leading-relaxed sm:text-sm">
              Featured in Forbes&apos; &quot;Rising Beauty-Tech Startups to Watch,&quot;
              recognizing our virtual try-on technology and marketplace model.
            </p>
          </div>
          <Link
            to="/awards"
            className="text-primary flex shrink-0 items-center gap-1 text-xs font-medium sm:text-sm"
          >
            Read the full story
            <Icon icon="solar:alt-arrow-down-linear" className="size-3.5 -rotate-90" />
          </Link>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Quick Facts"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_FACTS.map((fact) => (
            <div
              key={fact.title}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={fact.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{fact.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{fact.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Assets */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Brand Assets"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          Download our logo in the format that fits your background. Please use these assets
          as-is, without altering the logo&apos;s shape, colors, or proportions.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BRAND_LOGOS.map((logo) => (
            <a
              key={logo.key}
              href={logo.src}
              download
              className="border-primary/10 bg-smoke-eerie hover:border-primary/20 flex flex-col items-center gap-3 rounded-xl border p-4 transition-colors"
            >
              <img src={logo.src} alt={`Beautinique logo — ${logo.label}`} className="h-10 w-fit object-contain" />
              <span className="text-secondary flex items-center gap-1 text-xs font-medium">
                <Icon icon="solar:download-linear" className="size-3.5" />
                {logo.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      <Divider />

      {/* Media Contact */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">Media Inquiries</p>
          <p className="text-secondary text-xs sm:text-sm">
            For interviews, quotes, or additional brand assets, reach out to our team directly.
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

export default PressMedia;
