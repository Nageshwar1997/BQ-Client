import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';

const TEAMS = [
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
  {
    icon: 'solar:headphones-round-linear',
    title: 'Customer Support',
    description: 'The first line of help for shoppers, before and after every order.',
  },
] as const;

const WHY_THIS_TEAM = [
  'Direct impact on real orders, real sellers, and real customer experience every day.',
  'A front-row seat to how an online marketplace actually runs, end to end.',
  'Close collaboration with product and engineering to fix what shoppers actually hit.',
] as const;

const RetailEcommerce = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:cart-large-4-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Retail & E-Commerce"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          The teams keeping the{' '}
          <GradientText type="accent" text="Beautinique" className="font-semibold" /> marketplace
          running, day in and day out.
        </p>
      </div>

      <Divider />

      {/* Teams */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="What These Teams Do"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TEAMS.map((team) => (
            <div
              key={team.title}
              className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={team.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{team.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{team.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why This Team */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Why Join These Teams"
          className="text-xl font-semibold sm:text-2xl"
        />
        <ul className="flex flex-col gap-3">
          {WHY_THIS_TEAM.map((point) => (
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
          <p className="text-primary text-base font-semibold sm:text-lg">Interested?</p>
          <p className="text-secondary text-xs sm:text-sm">
            Check our current openings, or reach out directly.
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

export default RetailEcommerce;
