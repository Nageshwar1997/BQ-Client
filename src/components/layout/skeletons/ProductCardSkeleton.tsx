import { Skeleton } from '.';
import { StarFillIcon } from '../../../icons';
import type { TClassName } from '../../../types';
import { BorderGradient, HR } from '../../ui';

export const ProductCardSkeleton = ({ className = '' }: TClassName) => {
  return (
    <BorderGradient containerClassName={`shadow-xs ${className}`}>
      <div className="border-rounded-corners-gradient flex h-full flex-col gap-4 rounded-lg p-4">
        <Skeleton className="aspect-square h-full w-full overflow-hidden rounded-lg" />
        <HR />
        <div className="flex grow flex-col justify-between gap-2">
          <Skeleton />
          <Skeleton className="w-2/3" />
          <Skeleton className="w-1/2!" />
          <Skeleton className="w-2/3" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-1/4" />
            <Skeleton className="w-1/4" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarFillIcon key={index} className="fill-primary/50 animate-pulse stroke-none" />
              ))}
            </div>
            <Skeleton className="size-6 rounded-full!" />
          </div>
        </div>
      </div>
    </BorderGradient>
  );
};
