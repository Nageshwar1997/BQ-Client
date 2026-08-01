import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import ApiStatus from '@/components/layout/ApiStatus';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import useThemeStore from '@/stores/theme.store';

const NEWS_ITEMS = [
  {
    key: 'Forbes',
    tagline: 'Featured in Forbes’ "Rising Beauty-Tech Startups to Watch"',
    description:
      'Forbes recognized Beautinique for reimagining online beauty shopping through virtual try-on technology and a verified-seller marketplace model.',
  },
  {
    key: 'TalentAward',
    tagline: 'Recognized with a Talent Award',
    description:
      'The Talent Award celebrated the design and engineering craftsmanship behind the Beautinique platform, from product pages to the small details shoppers feel but rarely notice.',
  },
] as const;

const Newsroom = () => {
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
          text="Newsroom"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          Announcements, recognition, and coverage from{' '}
          <GradientText type="accent" text="Beautinique" className="font-semibold" />.
        </p>
      </div>

      <Divider />

      {/* News Items */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Latest Updates"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="flex flex-col gap-4">
          {NEWS_ITEMS.map((item) => (
            <div
              key={item.key}
              className="border-primary/10 bg-secondary-invert flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
            >
              <div className="flex shrink-0 items-center justify-center sm:w-32">
                <img
                  src={`/images/footer/${item.key}-${theme}.webp`}
                  alt={item.key}
                  loading="lazy"
                  className="h-10 w-fit object-contain"
                />
              </div>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{item.tagline}</p>
                <p className="text-secondary text-xs sm:text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* More Coming */}
      <ApiStatus
        status="empty"
        title="More updates on the way"
        description="We'll post new announcements here as they happen — check back soon."
      />

      <Divider />

      {/* CTA */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">Press Resources</p>
          <p className="text-secondary text-xs sm:text-sm">
            Journalists and partners can find brand assets and media contacts on our{' '}
            <Link to="/press-media" className="inline">
              <GradientText type="accent" text="Press / Media" className="font-medium" />
            </Link>{' '}
            page.
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

export default Newsroom;
