import { GradientText } from '@beautinique/frontend-components';
import {
  EmailUsAction as CompanyEmailAction,
  LastUpdatedBadge as DateBadge,
} from '@beautinique/frontend-components/static-page';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes.constants';

// Shared shell and building blocks for the "static content" pages (company/legal/services/misc
// info pages) — every one of these is header → a few sections → closing CTA. They come from the
// components package; what is this app's own (the address, the date, the link home) is below.
export {
  Checklist,
  HighlightNote,
  InfoCard,
  InfoCardGrid,
  NumberedSteps,
  StaticPageCTA,
  StaticPageHeader,
  StaticPageLayout,
  StaticPageSection,
} from '@beautinique/frontend-components/static-page';

const COMPANY_EMAIL = 'beautinique.bq@gmail.com';

// The pages say they were checked today. The badge writes the UTC day of a date, so today is given
// as the person's own day at midnight UTC: in India after midnight it still shows today.
const today = () => {
  const now = new Date();

  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

// "Last updated {date}" / "Last reviewed {date}" meta row used under a StaticPageHeader.
export const LastUpdatedBadge = ({ label }: { label?: string }) => (
  <DateBadge date={today()} label={label} locale="en-IN" />
);

// Shared "mailto us" pill used as the default StaticPageCTA action across most static pages.
export const EmailUsAction = () => <CompanyEmailAction email={COMPANY_EMAIL} />;

export const BeautiniqueLink = () => (
  <Link to={ROUTES.HOME} className="inline">
    <GradientText type="accent" text="Beautinique" className="font-semibold" />
  </Link>
);
