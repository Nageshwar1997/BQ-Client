import Skeleton from "..";
import useHorizontalScrollable from "../../../hooks/useHorizontalScrollable";
import { StarFillIcon } from "../../../icons";
import { LeftGradient, RightGradient } from "../../Gradients";

export const MediaCarouselSkeleton = ({
  mainImage = true,
  hrLine = true,
  thumbnails = true,
}: {
  mainImage?: boolean;
  hrLine?: boolean;
  thumbnails: boolean;
}) => {
  const [showGradient, containerRef] = useHorizontalScrollable();
  return (
    <div className={`rounded-lg max-w-3xl w-full overflow-hidden`}>
      {/* Main Image */}
      {mainImage && (
        <div className="mb-4 h-[400px] lg:h-[420px] xl:h-[500px] flex items-center justify-center">
          <Skeleton className="h-full !rounded-lg" />
        </div>
      )}
      {hrLine && (
        <hr className="h-px mb-4 block border-none bg-gradient-line" />
      )}
      {/* Thumbnails */}
      {thumbnails && (
        <div className={`p-1 relative`}>
          {showGradient.left && (
            <LeftGradient className="!w-10 sm:!w-20 h-full" />
          )}
          <div
            className={`flex items-center gap-2 ${
              !showGradient.left && !showGradient.right
                ? "justify-center"
                : "overflow-x-scroll scroll-smooth overflow-hidden"
            }`}
            ref={containerRef}
          >
            {Array.from({ length: 8 })?.map((_, i) => (
              <div
                key={i}
                className={`w-20 h-20 group rounded overflow-hidden shadow-sm shrink-0`}
              >
                <Skeleton className="w-full h-full object-cover cursor-pointer aspect-square" />
              </div>
            ))}
          </div>
          {showGradient.right && (
            <RightGradient className="!w-10 sm:!w-20 h-full" />
          )}
        </div>
      )}
    </div>
  );
};

const ProductDetailsSkeleton = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start gap-5">
      <div className="w-full lg:w-1/2 lg:sticky top-24">
        <div className="flex flex-col gap-4">
          {/* Image Section */}
          <MediaCarouselSkeleton thumbnails={true} />
          <div className="w-full hidden lg:block">
            <hr className="w-full h-px block border-none bg-gradient-line mb-4" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="!h-11" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 lg:sticky top-24">
        <div className="flex flex-col gap-4">
          {/* For Title */}
          <Skeleton className="!h-7" />
          {/* For Ratings */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarFillIcon
                  key={index}
                  className="stroke-none fill-primary-50 animate-pulse"
                />
              ))}
            </div>
            <Skeleton className="!w-6 h-6 !rounded-full" />
          </div>
          {/* Price Section */}
          <div className="flex items-center gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className={`!h-[22px] ${index !== 2 ? "!w-[70px]" : "!w-16"}`}
              />
            ))}
          </div>
          {/* EMI and Viewers */}
          <Skeleton className="!h-5 !w-24 mb-2" />
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="!h-8" />
          ))}
          {/* Variants and Shades */}
          <div className="flex flex-col gap-4">
            <Skeleton className="!w-1/4 !h-5" />
            <div className="flex flex-wrap gap-2 md:gap-2.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="cursor-pointer relative">
                  <div
                    className={`w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border p-px md:p-0.5 border-primary-30`}
                  >
                    <Skeleton className="!h-full !rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 py-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="!h-14 !rounded-xl" />
            ))}
          </div>
          <hr className="w-full h-px block border-none bg-gradient-line" />
          {/* Categories Section */}
          <div className="flex flex-shrink-0 gap-4 overflow-x-scroll">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-full aspect-[9/16] object-cover shrink !rounded-lg"
              />
            ))}
          </div>
        </div>
        <div className="w-full lg:hidden">
          <hr className="w-full h-px block border-none bg-gradient-line my-4 lg:mb-4" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="!h-11" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
