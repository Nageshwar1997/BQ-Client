import { Icon } from '@iconify/react';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';

const VALUES_CULTURE = [
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
] as const;

const RETAIL_ECOMMERCE_ROLES = [
  {
    icon: 'solar:shop-2-linear',
    title: 'Seller Success',
    description: 'Help sellers onboard, grow, and stay compliant on the marketplace.',
  },
  {
    icon: 'solar:delivery-linear',
    title: 'Operations & Fulfilment',
    description: 'Keep orders moving smoothly from checkout to doorstep.',
  },
  {
    icon: 'solar:chart-2-linear',
    title: 'Category & Merchandising',
    description: 'Shape which products and collections show up where.',
  },
] as const;

const Careers = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:case-round-minimalistic-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Careers"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          Join the team building a beauty marketplace people actually trust.
        </p>
      </div>

      <Divider />

      {/* Values / Culture */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Values & Culture"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {VALUES_CULTURE.map((value) => (
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

      {/* Retail / E-Commerce */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Retail & E-Commerce Teams"
          className="text-xl font-semibold sm:text-2xl"
        />
        <p className="text-secondary text-sm leading-relaxed sm:text-base">
          The teams keeping the marketplace running day to day, from seller support to order
          fulfilment:
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {RETAIL_ECOMMERCE_ROLES.map((role) => (
            <div
              key={role.title}
              className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={role.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{role.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Current Openings */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col items-center gap-3 rounded-2xl border p-8 text-center">
        <span className="bg-accent-duo flex size-12 items-center justify-center rounded-full">
          <Icon icon="solar:inbox-linear" className="size-6 text-white" />
        </span>
        <p className="text-primary text-base font-semibold sm:text-lg">No Open Positions Right Now</p>
        <p className="text-secondary max-w-md text-xs sm:text-sm">
          We don&apos;t have any active openings at the moment, but we&apos;re growing. Check back
          soon, or reach out — we&apos;re always happy to hear from people who want to build with
          us.
        </p>
        <a
          href="mailto:beautinique.bq@gmail.com"
          className="border-primary/20 hover:bg-primary-invert/60 text-primary mt-2 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Icon icon="solar:letter-linear" className="size-4.5" />
          beautinique.bq@gmail.com
        </a>
      </section>
    </div>
  );
};

export default Careers;
