import { Link } from 'react-router-dom';

import ApiStatus from '@/components/layout/ApiStatus';
import {
  EmailUsAction,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@/components/layout/static-page';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
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
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:tv-linear"
        title="Newsroom"
        description={
          <>
            Announcements, recognition, and coverage from{' '}
            <GradientText type="accent" text="Beautinique" className="font-semibold" />.
          </>
        }
      />

      <Divider />

      <StaticPageSection title="Latest Updates">
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
      </StaticPageSection>

      <ApiStatus
        status="empty"
        title="More updates on the way"
        description="We'll post new announcements here as they happen — check back soon."
      />

      <Divider />

      <StaticPageCTA
        title="Press Resources"
        description={
          <>
            Journalists and partners can find brand assets and media contacts on our{' '}
            <Link to={`/${ROUTES.COMPANY.PRESS_MEDIA}`} className="inline">
              <GradientText type="accent" text="Press / Media" className="font-medium" />
            </Link>{' '}
            page.
          </>
        }
        actions={<EmailUsAction />}
      />
    </StaticPageLayout>
  );
};

export default Newsroom;
