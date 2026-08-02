import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const CORE_VALUES = [
  {
    icon: 'solar:users-group-rounded-linear',
    title: 'Inclusive by Default',
    description: 'A team as diverse as the shoppers and sellers we build for.',
  },
  {
    icon: 'solar:lightbulb-linear',
    title: 'Bias for Building',
    description: 'We ship, learn, and iterate — perfection isn’t the starting line.',
  },
  {
    icon: 'solar:hand-heart-linear',
    title: 'Ownership',
    description: 'Everyone owns outcomes, not just tasks.',
  },
  {
    icon: 'solar:balance-linear',
    title: 'Work-Life Balance',
    description: 'Flexible hours and remote-friendly roles, because life happens.',
  },
  {
    icon: 'solar:chat-round-line-linear',
    title: 'Direct Feedback',
    description: 'We say what we mean, kindly and quickly, instead of sitting on it.',
  },
  {
    icon: 'solar:graduation-linear',
    title: 'Always Learning',
    description: 'Growth is expected, not optional — for the platform and for each other.',
  },
] as const;

const LIFE_AT_BQ = [
  'Small, cross-functional teams that move fast and stay close to the product.',
  'Flexible, remote-friendly working hours built around outcomes, not clock-in times.',
  'Direct access to leadership — no layers between an idea and a decision.',
  'A culture that treats mistakes as part of building, not something to hide.',
] as const;

const ValuesCulture = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:hand-stars-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Values & Culture"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          How the team behind{' '}
          <GradientText type="accent" text="Beautinique" className="font-semibold" /> works, and
          what we expect from each other.
        </p>
      </div>

      <Divider />

      {/* Core Values */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="What We Value"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CORE_VALUES.map((value) => (
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

      {/* Life at Beautinique */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Life at Beautinique"
          className="text-xl font-semibold sm:text-2xl"
        />
        <ul className="flex flex-col gap-3">
          {LIFE_AT_BQ.map((point) => (
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
          <p className="text-primary text-base font-semibold sm:text-lg">Sound Like You?</p>
          <p className="text-secondary text-xs sm:text-sm">
            See what roles we&apos;re hiring for right now.
          </p>
        </div>
        <Link
          to={`/${ROUTES.COMPANY.CAREERS}`}
          className="border-primary/20 hover:bg-primary-invert/60 text-primary flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Icon icon="solar:compass-linear" className="size-4.5" />
          View Open Roles
        </Link>
      </section>
    </div>
  );
};

export default ValuesCulture;
