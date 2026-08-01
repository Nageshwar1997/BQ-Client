import { Icon } from '@iconify/react';

import ApiStatus from '@/components/layout/ApiStatus';
import GradientText from '@/components/ui/GradientText';

interface IDiscoverEmptyPage {
  icon: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
}

const DiscoverEmptyPage = ({
  icon,
  title,
  description,
  emptyTitle,
  emptyDescription,
}: IDiscoverEmptyPage) => (
  <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
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
    </div>
    <ApiStatus status="empty" title={emptyTitle} description={emptyDescription} />
  </div>
);

export default DiscoverEmptyPage;
