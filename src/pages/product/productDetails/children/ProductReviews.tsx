import { Fragment, useState } from "react";
import { FetchedReviewType, TCarouselOption } from "../../../../types";
import ReviewMediaModal from "./ReviewMediaModal";
import ReviewCard from "./ReviewCard";
import ShowError from "../../../../components/errors/ShowError";
import EmptyData from "../../../../components/empty-data/EmptyData";
import ReviewCardSkeleton from "../../../../components/skeletons/children/ReviewCardSkeleton";

const ProductReviews = ({
  reviews,
  isLoading,
  isError,
  ref,
  isFetchingNextPage = false,
}: {
  reviews: FetchedReviewType[];
  isLoading: boolean;
  isError: boolean;
  ref: (node?: Element | null | undefined) => void;
  isFetchingNextPage?: boolean;
}) => {
  const [mediaIndex, setMediaIndex] = useState<null | number>(null);
  const [selectedReviewMedia, setSelectedReviewMedia] = useState<
    TCarouselOption[]
  >([]);

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <ReviewCardSkeleton className="pt-4" />
      ) : isError ? (
        <ShowError
          headingText="Something went wrong!"
          descriptionText="Failed to get the reviews. Please reload the page"
          className="w-full mx-auto mb-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase [&>p]:text-xs [&>p]:base:text-sm [&>p]:sm:text-base [&>p]:md:text-lg"
        />
      ) : reviews.length > 0 ? (
        <Fragment>
          {reviews.map((review, index) => (
            <div key={index} ref={index === reviews.length - 1 ? ref : null}>
              <ReviewCard
                className={`${index === 0 ? "pt-4" : ""} ${
                  index !== reviews.length - 1
                    ? "border-b border-b-primary-10"
                    : ""
                }`}
                review={review}
                onMediaClick={(reviewMedia, index) => {
                  setSelectedReviewMedia(reviewMedia);
                  setMediaIndex(index);
                }}
              />
            </div>
          ))}
          {isFetchingNextPage && (
            <ReviewCardSkeleton className="border-t border-t-primary-10 pt-4" />
          )}
        </Fragment>
      ) : (
        <EmptyData
          content={"Reviews not available"}
          className="w-full mx-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase gap-5"
        />
      )}
      {selectedReviewMedia.length > 0 && (
        <ReviewMediaModal
          currentIndex={mediaIndex}
          setCurrentIndex={setMediaIndex}
          reviewMedia={selectedReviewMedia}
          opened={selectedReviewMedia.length > 0}
          onClose={() => setSelectedReviewMedia([])}
        />
      )}
    </div>
  );
};

export default ProductReviews;
