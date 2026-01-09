import Skeleton from "..";
import { StarFillIcon } from "../../../icons";
import { ClassName } from "../../../types";
import MediaCarouselSkeleton from "./MediaCarouselSkeleton";

const ReviewCardSkeleton = ({ className }: ClassName) => {
  return (
    <div className={`flex flex-col gap-2 pb-4 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarFillIcon
              key={index}
              className="stroke-none fill-primary-50 animate-pulse w-5 h-5"
            />
          ))}
        </div>
        <Skeleton className="w-36!" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-10! h-10! rounded-full!" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 h-4">
            <Skeleton className="w-14 h-full!" />
            <div className="h-full flex items-center gap-2">
              <Skeleton className="w-4! h-full!" />
              <Skeleton className="w-4! h-full!" />
            </div>
          </div>
          <Skeleton className="h-4" />
        </div>
      </div>
      <div className="text-sm space-y-1">
        <Skeleton className="w-36!" />
        <Skeleton className="max-w-lg" />
      </div>
      <MediaCarouselSkeleton
        thumbnailsCount={4}
        thumbnails={true}
        hrLine={false}
        mainImage={false}
        className="[&>div>div]:justify-start [&>div>div>div]:w-12 [&>div>div>div]:h-12"
      />
    </div>
  );
};

export default ReviewCardSkeleton;
