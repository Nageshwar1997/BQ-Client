import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
import type { IChildren, IClassName } from '@/types/component.type';
import { formatDate } from '@/utils/common.util';

// Shared shell for the "static content" pages (company/legal/services/misc info pages) — every
// one of these is header → a few sections → closing CTA, inside the same max-width column.
export const StaticPageLayout = ({ children }: IChildren) => (
  <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
    {children}
  </div>
);

export const StaticPageHeader = ({
  icon,
  title,
  description,
  meta,
}: {
  icon: string;
  title: string;
  description: ReactNode;
  meta?: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-4 text-center">
    <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
      <Icon icon={icon} className="size-8 text-white sm:size-10" />
    </span>
    <GradientText
      type="accent"
      text={title}
      className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
    />
    <p className="text-secondary max-w-2xl text-sm sm:text-base">{description}</p>
    {meta}
  </div>
);

// "Last updated {date}" / "Last reviewed {date}" meta row used under a StaticPageHeader.
export const LastUpdatedBadge = ({ label = 'Last updated' }: { label?: string }) => (
  <span className="text-primary/50 flex items-center gap-1 text-xs sm:text-sm">
    <Icon icon="solar:calendar-mark-linear" className="size-3.5" />
    {label} {formatDate(new Date())}
  </span>
);

export const StaticPageSection = ({
  title,
  children,
  className = 'gap-4',
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) => (
  <section className={`flex flex-col ${className}`}>
    {title && (
      <GradientText type="accent" text={title} className="text-xl font-semibold sm:text-2xl" />
    )}
    {children}
  </section>
);

export const InfoCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className="border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-start gap-3 rounded-xl border p-4 transition-colors">
    <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
      <Icon icon={icon} className="size-5 text-white" />
    </span>
    <div>
      <p className="text-primary text-sm font-semibold sm:text-base">{title}</p>
      <p className="text-secondary text-xs sm:text-sm">{description}</p>
    </div>
  </div>
);

export const InfoCardGrid = ({
  items,
  columns = 2,
}: {
  items: readonly { icon: string; title: string; description: string }[];
  columns?: 2 | 3;
}) => (
  <div className={`grid grid-cols-1 gap-4 ${columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
    {items.map((item) => (
      <InfoCard key={item.title} {...item} />
    ))}
  </div>
);

// Bullet-style list of short statements, each in its own bordered row with a leading icon.
export const Checklist = ({
  items,
  icon = 'solar:check-circle-linear',
  iconClassName = 'text-primary-green',
}: {
  items: readonly string[];
  icon?: string;
  iconClassName?: string;
}) => (
  <ul className="flex flex-col gap-3">
    {items.map((item) => (
      <li
        key={item}
        className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-3 sm:p-4"
      >
        <Icon icon={icon} className={`mt-0.5 size-4.5 shrink-0 ${iconClassName}`} />
        <span className="text-secondary text-xs sm:text-sm">{item}</span>
      </li>
    ))}
  </ul>
);

// Single highlighted note/warning box — an icon beside a title + body, in its own bordered card.
export const HighlightNote = ({
  icon = 'solar:danger-triangle-linear',
  title,
  children,
}: {
  icon?: string;
  title: string;
  children: ReactNode;
}) => (
  <section className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4 sm:p-5">
    <Icon icon={icon} className="text-primary/60 mt-0.5 size-5 shrink-0" />
    <div className="flex flex-col gap-1.5">
      <p className="text-primary text-sm font-semibold sm:text-base">{title}</p>
      <p className="text-secondary text-xs leading-relaxed sm:text-sm">{children}</p>
    </div>
  </section>
);

// Ordered process steps, each in a bordered row with a numbered badge instead of an icon.
export const NumberedSteps = ({
  steps,
}: {
  steps: readonly { title: string; description: string }[];
}) => (
  <div className="flex flex-col gap-3">
    {steps.map((step, index) => (
      <div
        key={step.title}
        className="border-primary/10 bg-secondary-invert flex items-start gap-3 rounded-xl border p-4"
      >
        <span className="bg-accent-duo flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
          {index + 1}
        </span>
        <div>
          <p className="text-primary text-sm font-semibold sm:text-base">{step.title}</p>
          <p className="text-secondary text-xs sm:text-sm">{step.description}</p>
        </div>
      </div>
    ))}
  </div>
);

// Closing "get in touch" / action block. `layout="row"` puts the text and actions side by side
// from `sm:` up; `layout="stack"` keeps them stacked (for CTAs with several wrapped actions).
export const StaticPageCTA = ({
  title,
  description,
  actions,
  footer,
  layout = 'row',
  className = '',
}: {
  title: string;
  description: ReactNode;
  actions: ReactNode;
  footer?: ReactNode;
  layout?: 'row' | 'stack';
} & IClassName) => (
  <section
    className={`border-primary/10 bg-secondary-invert flex flex-col gap-4 rounded-2xl border p-4 sm:p-6 ${className}`}
  >
    <div
      className={`flex flex-col gap-4 ${
        layout === 'row' ? 'items-start justify-between sm:flex-row sm:items-center' : ''
      }`}
    >
      <div className="flex flex-col gap-1">
        <p className="text-primary text-base font-semibold sm:text-lg">{title}</p>
        <p className="text-secondary text-xs sm:text-sm">{description}</p>
      </div>
      {actions}
    </div>
    {footer}
  </section>
);

// Shared "mailto us" pill used as the default StaticPageCTA action across most static pages.
export const EmailUsAction = () => (
  <a
    href="mailto:beautinique.bq@gmail.com"
    className="border-primary/20 hover:bg-primary-invert/60 text-primary flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
  >
    <Icon icon="solar:letter-linear" className="size-4.5" />
    beautinique.bq@gmail.com
  </a>
);

export const BeautiniqueLink = () => (
  <Link to={ROUTES.HOME} className="inline">
    <GradientText type="accent" text="Beautinique" className="font-semibold" />
  </Link>
);
