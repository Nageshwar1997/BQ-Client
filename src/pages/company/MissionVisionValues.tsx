import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const OUR_VALUES = [
  {
    icon: 'solar:verified-check-linear',
    title: 'Authenticity',
    description: 'What you see is what you get — no counterfeit products, ever.',
  },
  {
    icon: 'solar:hand-heart-linear',
    title: 'Integrity',
    description: 'Honest pricing, honest descriptions, and honest customer support.',
  },
  {
    icon: 'solar:users-group-rounded-linear',
    title: 'Inclusivity',
    description: 'A platform where every shade, skin type, and shopper feels represented.',
  },
  {
    icon: 'solar:lightbulb-linear',
    title: 'Innovation',
    description: 'From virtual try-on to smart recommendations, we keep pushing forward.',
  },
  {
    icon: 'solar:shield-check-linear',
    title: 'Trust',
    description: 'Verified sellers and genuine reviews, so every purchase feels safe.',
  },
  {
    icon: 'solar:leaf-linear',
    title: 'Sustainability',
    description: 'We favor sellers and practices that care about their environmental footprint.',
  },
] as const;

const HOW_WE_LIVE_IT = [
  'Every seller is verified before their products go live on the marketplace.',
  'Reviews are only accepted from customers who actually purchased the product.',
  'Product descriptions and shade guides are written to set accurate expectations.',
  'We invest in tools like virtual try-on to remove guesswork from online shopping.',
] as const;

const MissionVisionValues = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:flag-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Mission, Vision & Values"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          What drives <GradientText type="accent" text="Beautinique" className="font-semibold" />{' '}
          forward, and the principles we hold ourselves to along the way.
        </p>
      </div>

      <Divider />

      {/* Mission & Vision */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border-primary/10 bg-secondary-invert flex flex-col gap-3 rounded-xl border p-4 sm:p-5">
            <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Icon icon="solar:flag-linear" className="size-5 text-white" />
            </span>
            <p className="text-primary text-sm font-semibold sm:text-base">Our Mission</p>
            <p className="text-secondary text-xs leading-relaxed sm:text-sm">
              To make discovering and buying genuine beauty products simple, trustworthy, and
              enjoyable &mdash; for every shopper, every seller, and every skin tone.
            </p>
          </div>
          <div className="border-primary/10 bg-secondary-invert flex flex-col gap-3 rounded-xl border p-4 sm:p-5">
            <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Icon icon="solar:eye-linear" className="size-5 text-white" />
            </span>
            <p className="text-primary text-sm font-semibold sm:text-base">Our Vision</p>
            <p className="text-secondary text-xs leading-relaxed sm:text-sm">
              A beauty marketplace people recommend by word of mouth &mdash; not because we asked,
              but because shopping with us just works.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Our Values"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {OUR_VALUES.map((value) => (
            <div
              key={value.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={value.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{value.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How We Live It */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="How We Live It"
          className="text-xl font-semibold sm:text-2xl"
        />
        <ul className="flex flex-col gap-3">
          {HOW_WE_LIVE_IT.map((point) => (
            <li
              key={point}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-3 sm:p-4"
            >
              <Icon
                icon="solar:check-circle-linear"
                className="text-primary-green mt-0.5 size-4.5 shrink-0"
              />
              <span className="text-secondary text-xs sm:text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <Divider />

      {/* CTA */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col items-start justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">Want the Full Story?</p>
          <p className="text-secondary text-xs sm:text-sm">
            Read more about who we are and where we&apos;re headed.
          </p>
        </div>
        <Link
          to={`/${ROUTES.COMPANY.ABOUT_US}`}
          className="border-primary/20 hover:bg-primary-invert/60 text-primary flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Icon icon="solar:bag-heart-linear" className="size-4.5" />
          About Beautinique
        </Link>
      </section>
    </div>
  );
};

export default MissionVisionValues;
