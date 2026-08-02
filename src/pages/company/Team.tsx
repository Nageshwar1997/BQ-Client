import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { TESTIMONIALS } from '@/constants/navbar.constants';
import { ROUTES } from '@/constants/routes.constants';

const LEADERSHIP = TESTIMONIALS.filter((member) => member.role.includes('Founder')).map(
  ({ name, role, image }) => ({ name, role, image }),
);

const WHAT_DRIVES_US = [
  {
    icon: 'solar:heart-linear',
    title: 'Beauty For Everyone',
    description: 'We build for every shade, skin type, and budget — no exceptions.',
  },
  {
    icon: 'solar:shield-check-linear',
    title: 'Trust First',
    description: 'Every decision we make starts with keeping shoppers and sellers safe.',
  },
  {
    icon: 'solar:lightbulb-linear',
    title: 'Always Building',
    description: 'From virtual try-on to smarter search, we keep pushing the platform forward.',
  },
] as const;

const Team = () => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:users-group-rounded-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Meet Our Team"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          The people behind{' '}
          <GradientText type="accent" text="Beautinique" className="font-semibold" />, working to
          make beauty shopping simple, trustworthy, and enjoyable.
        </p>
      </div>

      <Divider />

      {/* Leadership */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Leadership"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {LEADERSHIP.map((member) => (
            <div
              key={member.name}
              className="border-primary/10 bg-secondary-invert flex items-center gap-4 rounded-xl border p-4"
            >
              <img
                src={member.image}
                alt={member.name}
                className="size-14 shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="text-primary text-sm font-semibold sm:text-base">{member.name}</p>
                <p className="text-secondary text-xs sm:text-sm">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What Drives Us */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="What Drives Us"
          className="text-xl font-semibold sm:text-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {WHAT_DRIVES_US.map((point) => (
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

      <Divider />

      {/* CTA */}
      <section className="border-primary/10 bg-secondary-invert flex flex-col items-start justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-primary text-base font-semibold sm:text-lg">We&apos;re Growing</p>
          <p className="text-secondary text-xs sm:text-sm">
            We&apos;re always looking for people who care about beauty, trust, and great products.
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

export default Team;
