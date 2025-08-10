import { useState } from "react";
import { FetchedReviewType, TCarouselOption } from "../../../../types";
import ReviewMediaModal from "./ReviewMediaModal";
import ReviewCard from "./ReviewCard";

const ProductReviews = ({
  reviews,
}: {
  reviews: FetchedReviewType[];
  isLoading: boolean;
  isError: boolean;
}) => {
  const [mediaIndex, setMediaIndex] = useState<null | number>(null);
  const [selectedReviewMedia, setSelectedReviewMedia] = useState<
    TCarouselOption[]
  >([]);

  return (
    <div className="flex flex-col gap-4">
      {reviews?.map((review, index) => {
        return (
          <ReviewCard
            key={index}
            className={`${index === 0 ? "pt-4" : ""} ${
              index !== reviews.length - 1 ? "border-b border-b-primary-10" : ""
            }`}
            review={review}
            onMediaClick={(reviewMedia, index) => {
              setSelectedReviewMedia(reviewMedia);
              setMediaIndex(index);
            }}
          />
        );
      })}
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
