import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import {
  Checklist,
  InfoCardGrid,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
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
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:hand-stars-linear"
        title="Values & Culture"
        description={
          <>
            How the team behind{' '}
            <GradientText type="accent" text="Beautinique" className="font-semibold" /> works, and
            what we expect from each other.
          </>
        }
      />

      <Divider />

      <StaticPageSection title="What We Value">
        <InfoCardGrid items={CORE_VALUES} />
      </StaticPageSection>

      <StaticPageSection title="Life at Beautinique">
        <Checklist items={LIFE_AT_BQ} />
      </StaticPageSection>

      <Divider />

      <StaticPageCTA
        title="Sound Like You?"
        description="See what roles we're hiring for right now."
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

export default ValuesCulture;
