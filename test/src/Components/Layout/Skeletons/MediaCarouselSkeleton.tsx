import { Skeleton } from '.';
import { HR } from '../../UI';
import { ScrollableGradientContainer } from '../Containers';

export const MediaCarouselSkeleton = ({
  mainImage = true,
  hrLine = true,
  thumbnails = true,
  className = '',
  thumbnailsCount = 8,
}: {
  mainImage?: boolean;
  hrLine?: boolean;
  thumbnails?: boolean;
  className?: string;
  thumbnailsCount?: number;
}) => {
  return (
    <div className={`w-full max-w-3xl overflow-hidden rounded-lg ${className}`}>
      {/* Main Image Skeleton */}
      {mainImage && (
        <div className="mb-4 flex h-100 items-center justify-center lg:h-105 xl:h-125">
          <Skeleton className="h-full rounded-lg!" />
        </div>
      )}
      {hrLine && <HR className="mb-4 animate-pulse" />}
      {/* Thumbnails Skeleton */}
      {thumbnails && (
        <ScrollableGradientContainer containerClassName="p-1" direction="horizontal">
          {Array.from({ length: thumbnailsCount })?.map((_, i) => (
            <div key={i} className="group size-20 shrink-0 overflow-hidden rounded-sm shadow-xs">
              <Skeleton className="aspect-square size-full" />
            </div>
          ))}
        </ScrollableGradientContainer>
      )}
    </div>
  );
};
