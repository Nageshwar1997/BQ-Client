import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
import useThemeStore from '@/stores/theme.store';

const AWARD_STORIES = [
  {
    key: 'Forbes',
    name: 'Forbes',
    tagline: 'Featured in "Rising Beauty-Tech Startups to Watch"',
    story:
      'Forbes recognized Beautinique for reimagining how people shop for cosmetics online. The feature centered on our virtual try-on technology, which lets shoppers preview a shade or product live through their camera before it ever reaches checkout, and our marketplace model built around verified sellers and genuine, purchase-only reviews. In an industry where online beauty shopping often means guessing, the piece called out our attempt to replace that guesswork with real confidence.',
  },
  {
    key: 'TalentAward',
    name: 'Talent Award',
    tagline: 'Celebrating the people behind the platform',
    story:
      'Long before Beautinique had its first customer, it had a small team convinced it could build something better than a typical online store. The Talent Award recognized that team directly — the design and engineering craftsmanship behind everything from the product pages to the small interaction details most shoppers never consciously notice, but always feel. It was less about a finished product, and more about the care that went into building it.',
  },
] as const;

const Awards = () => {
  const theme = useThemeStore((s) => s.theme);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:cup-star-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Awards & Recognition"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          We&apos;re grateful for the recognition our team and platform have received along the way
          &mdash; it keeps us pushing to make Beautinique better for everyone who shops and sells
          here.
        </p>
      </div>

      <Divider />

      {/* Award Stories */}
      <section className="flex flex-col gap-6">
        <GradientText
          type="accent"
          text="Our Recognitions"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="flex flex-col gap-4">
          {AWARD_STORIES.map((award) => (
            <div
              key={award.key}
              className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:gap-6 sm:p-6"
            >
              <div className="flex shrink-0 items-center justify-center sm:w-40">
                <img
                  src={`/images/footer/${award.key}-${theme}.webp`}
                  alt={award.name}
                  loading="lazy"
                  className="h-14 w-fit object-contain"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-primary text-base font-semibold sm:text-lg">{award.name}</p>
                  <p className="text-secondary text-xs font-medium sm:text-sm">{award.tagline}</p>
                </div>
                <p className="text-secondary text-xs leading-relaxed sm:text-sm">{award.story}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Thank You */}
      <section className="flex flex-col gap-3">
        <GradientText
          type="accent"
          text="Thank You"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          None of this happens without our customers, sellers, and team. Every review, every order,
          and every product listed on{' '}
          <GradientText type="accent" text="Beautinique" className="font-semibold" /> is part of
          what got us here, and we don&apos;t take that for granted.
        </p>
      </section>

      <Divider />

      {/* CTA */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">Want the Full Story?</p>
          <p className="text-secondary text-xs sm:text-sm">
            Head over to{' '}
            <Link to={`/${ROUTES.COMPANY.PRESS_MEDIA}`} className="inline">
              <GradientText type="accent" text="Press / Media" className="font-medium" />
            </Link>{' '}
            for our latest news and coverage.
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

export default Awards;
