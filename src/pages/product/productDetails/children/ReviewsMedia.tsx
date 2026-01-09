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

  const reviewMedia = useMemo(() => {
    return (
      reviews?.flatMap((review) => {
        const images: TMediaOption[] =
          review?.images?.map((url) => ({ url, type: "image" })) ?? [];
        const videos: TMediaOption[] =
          review?.videos?.map((url) => ({ url, type: "video" })) ?? [];

        return [...images, ...videos];
      }) ?? []
    );
  }, [reviews]);
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col items-center mx-auto gap-4 max-w-3xl">
          <Skeleton className="w-2/3!" />
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
          className="w-full mx-auto mb-auto [&>h3]:text-base base:[&>h3]:text-base sm:[&>h3]:text-xl md:[&>h3]:text-2xl lg:[&>h3]:text-3xl xl:[&>h3]:text-4xl [&>h3]:uppercase [&>p]:text-xs base:[&>p]:text-sm sm:[&>p]:text-base md:[&>p]:text-lg"
        />
      ) : reviewMedia.length ? (
        <div className="flex flex-col gap-4">
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
        </div>
      ) : (
        <EmptyData
          content={"Reviews media not available"}
          className="w-full mx-auto [&>h3]:text-base base:[&>h3]:text-base sm:[&>h3]:text-xl md:[&>h3]:text-2xl lg:[&>h3]:text-3xl xl:[&>h3]:text-4xl [&>h3]:uppercase gap-3 p-3.5!"
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
