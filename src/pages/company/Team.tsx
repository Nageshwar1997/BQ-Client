import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import {
  InfoCardGrid,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
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
    description: 'From virtual Try-On to smarter search, we keep pushing the platform forward.',
  },
] as const;

const Team = () => {
  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:users-group-rounded-linear"
        title="Meet Our Team"
        description={
          <>
            The people behind{' '}
            <GradientText type="accent" text="Beautinique" className="font-semibold" />, working to
            make beauty shopping simple, trustworthy, and enjoyable.
          </>
        }
      />

      <Divider />

      <StaticPageSection title="Leadership">
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
      </StaticPageSection>

      <StaticPageSection title="What Drives Us">
        <InfoCardGrid items={WHAT_DRIVES_US} />
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="We're Growing"
        description="We're always looking for people who care about beauty, trust, and great products."
        actions={
          <Link
            to={`/${ROUTES.COMPANY.CAREERS}`}
            className="border-primary/20 hover:bg-primary-invert/60 text-primary flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Icon icon="solar:compass-linear" className="size-4.5" />
            View Open Roles
          </Link>
        }
      />
    </StaticPageLayout>
  );
};

export default Team;
