import Skeleton from "..";
import useHorizontalScrollable from "../../../hooks/useHorizontalScrollable";
import { LeftGradient, RightGradient } from "../../Gradients";

const MediaCarouselSkeleton = ({
  mainImage = true,
  hrLine = true,
  thumbnails = true,
  className = "",
  thumbnailsCount = 8,
}: {
  mainImage?: boolean;
  hrLine?: boolean;
  thumbnails: boolean;
  className?: string;
  thumbnailsCount?: number;
}) => {
  const { showGradient, containerRef } = useHorizontalScrollable();
  return (
    <div className={`rounded-lg max-w-3xl w-full overflow-hidden ${className}`}>
      {/* Main Image */}
      {mainImage && (
        <div className="mb-4 h-100 lg:h-105 xl:h-125 flex items-center justify-center">
          <Skeleton className="h-full rounded-lg!" />
        </div>
      )}
      {hrLine && (
        <hr className="h-px mb-4 block border-none bg-gradient-line" />
      )}
      {/* Thumbnails */}
      {thumbnails && (
        <div className={`p-1 relative`}>
          {showGradient.left && (
            <LeftGradient className="w-10! sm:w-20! h-full" />
          )}
          <div
            className={`flex items-center gap-2 ${
              !showGradient.left && !showGradient.right
                ? "justify-center"
                : "overflow-x-scroll scroll-smooth overflow-hidden"
            }`}
            ref={containerRef}
          >
            {Array.from({ length: thumbnailsCount })?.map((_, i) => (
              <div
                key={i}
                className={`w-20 h-20 group rounded-sm overflow-hidden shadow-xs shrink-0`}
              >
                <Skeleton className="w-full h-full object-cover cursor-pointer aspect-square" />
              </div>
            ))}
          </div>
          {showGradient.right && (
            <RightGradient className="w-10! sm:w-20! h-full" />
          )}
        </div>
      )}
    </div>
  );
};

export default MediaCarouselSkeleton;
