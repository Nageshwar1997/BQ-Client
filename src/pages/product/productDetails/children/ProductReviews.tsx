import { useState } from "react";
import { FetchedReviewType, TCarouselOption } from "../../../../types";
import ReviewMediaModal from "./ReviewMediaModal";
import ReviewCard from "./ReviewCard";

const ProductReviews = ({
  reviews,
  ref,
}: {
  reviews: FetchedReviewType[];
  ref: (node?: Element | null | undefined) => void;
}) => {
  const [mediaIndex, setMediaIndex] = useState<null | number>(null);
  const [selectedReviewMedia, setSelectedReviewMedia] = useState<
    TCarouselOption[]
  >([]);

  return (
    <div>
      {reviews.map((review, index) => (
        <div
          key={index}
          ref={index === reviews.length - 1 ? ref : null}
          className={`py-4 ${index === 0 ? "" : ""} ${
            index === reviews.length - 1
              ? "pb-0"
              : "border-b border-b-primary-10"
          }`}
        >
          <ReviewCard
            review={review}
            onMediaClick={(reviewMedia, index) => {
              setSelectedReviewMedia(reviewMedia);
              setMediaIndex(index);
            }}
          />
        </div>
      ))}
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
