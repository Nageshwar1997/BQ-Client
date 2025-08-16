import { useMemo, useState } from "react";
import MediaCarousel from "../../../../components/carousels/MediaCarousel";
import MediaModal from "./MediaModal";
import { FetchedReviewType, TMediaOption } from "../../../../types";
import Skeleton from "../../../../components/skeletons";
import ShowError from "../../../../components/errors/ShowError";
import EmptyData from "../../../../components/empty-data/EmptyData";
import MediaCarouselSkeleton from "../../../../components/skeletons/children/MediaCarouselSkeleton";

const ReviewsMedia = ({
  reviews,
  isError,
  isLoading,
}: {
  reviews: FetchedReviewType[];
  isError: boolean;
  isLoading: boolean;
}) => {
  const [mediaIndex, setMediaIndex] = useState<null | number>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const reviewMedia: TMediaOption[] = useMemo(() => {
    return (
      reviews?.flatMap((review) => {
        const images =
          review?.images?.map((url) => ({ url, type: "image" as const })) ?? [];
        const videos =
          review?.videos?.map((url) => ({ url, type: "video" as const })) ?? [];

        return [...images, ...videos];
      }) ?? []
    );
  }, [reviews]);
  return (
    <div className="w-full py-8 space-y-4">
      {isLoading ? (
        <div className="flex flex-col items-center mx-auto gap-4 max-w-3xl">
          <Skeleton className="!w-2/3" />
          <MediaCarouselSkeleton
            thumbnails={true}
            hrLine={false}
            mainImage={false}
          />
        </div>
      ) : isError ? (
        <ShowError
          headingText="Something went wrong!"
          descriptionText="Failed to get the reviews media. Please reload the page"
          className="w-full mx-auto mb-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase [&>p]:text-xs [&>p]:base:text-sm [&>p]:sm:text-base [&>p]:md:text-lg"
        />
      ) : reviewMedia.length ? (
        <>
          <p className="text-center text-lg/normal font-medium w-fit mx-auto">
            Customer review's photos & videos
          </p>
          <MediaCarousel
            data={reviewMedia}
            selected={mediaIndex}
            onClick={(i) => {
              if (!showMediaModal) {
                setShowMediaModal(true);
              }
              setMediaIndex(i);
            }}
          />
        </>
      ) : (
        <EmptyData
          content={"Reviews media not available"}
          className="w-full mx-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase gap-3 border border-[red] !p-[14px]"
        />
      )}
      {showMediaModal && (
        <MediaModal
          currentIndex={mediaIndex}
          setCurrentIndex={setMediaIndex}
          reviewMedia={reviewMedia}
          opened={showMediaModal}
          onClose={setShowMediaModal}
        />
      )}
    </div>
  );
};

export default ReviewsMedia;
