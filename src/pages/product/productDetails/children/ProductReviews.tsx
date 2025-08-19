import { useState } from "react";
import { FetchedReviewType, TMediaOption } from "../../../../types";
import ReviewCard from "./ReviewCard";
import MediaModal from "./MediaModal";

const ProductReviews = ({
  reviews,
  ref,
}: {
  reviews: FetchedReviewType[];
  ref: (node?: Element | null | undefined) => void;
}) => {
  const [mediaIndex, setMediaIndex] = useState<null | number>(null);
  const [selectedReviewMedia, setSelectedReviewMedia] = useState<
    TMediaOption[]
  >([]);

  return (
    <div>
      {reviews.map((review, index) => (
        <div
          key={index}
          ref={index === reviews.length - 1 ? ref : null}
          className={`py-4 ${
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
        <MediaModal
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
