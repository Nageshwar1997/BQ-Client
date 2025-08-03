import { useMemo, useState } from "react";
import Button from "../../../../components/button/Button";
import MediaCarousel from "../../../../components/carousels/MediaCarousel";
import RatingStars from "../../../../components/navbar/components/rating/RatingStars";
import TextDisplay from "../../../../components/TextDisplay";
import { FetchedReviewType, TCarouselOption } from "../../../../types";
import CustomerReviews from "../CustomerReviews";
import ReviewMediaModal from "./ReviewMediaModal";
import ProductReviews from "./ProductReviews";
import Dropdown from "../../../../components/dropdown/Dropdown";
import useQueryParams from "../../../../hooks/useQueryParams";
import { REVIEWS_OPTIONS } from "../../../../constants";
import DropdownOptions from "../../../../components/dropdown/children/DropdownOptions";

const ReviewsSection = ({ reviews = [] }: { reviews: FetchedReviewType[] }) => {
  const [mediaIndex, setMediaIndex] = useState<null | number>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const { queryParams, setParams, removeParam } = useQueryParams();
  const reviewMedia: TCarouselOption[] = useMemo(() => {
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
    <div className="flex flex-col">
      <div className="w-full pb-8 border-b border-b-primary-50 space-y-4">
        <TextDisplay
          content={[{ isHighlighted: true, text: "Customer Reviews" }]}
          className="text-xl md:text-3xl lg:text-4xl"
        />
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-8">
          <div className="w-full">
            <CustomerReviews reviews={reviews?.map((r) => r.rating)} />
          </div>
          <div className="w-full flex flex-col gap-4 items-center justify-center">
            <Button
              pattern="secondary"
              content="Write a Review"
              className="max-w-44 py-2! lg:py-3 !rounded-md"
            />
            <div className="flex flex-col gap-0.5 items-center justify-center text-secondary">
              <div className="flex items-center gap-2 text-sm">
                <RatingStars
                  rating={
                    reviews && reviews.length > 0
                      ? reviews.reduce(
                          (acc, review) => acc + (review?.rating || 0),
                          0
                        ) / reviews.length
                      : 0
                  }
                />
                <span>
                  {reviews && reviews.length > 0
                    ? reviews.reduce(
                        (acc, review) => acc + (review?.rating || 0),
                        0
                      ) / reviews.length
                    : (0).toFixed(1)}{" "}
                  out of 5
                </span>
              </div>
              <p>Based on {reviews?.length} reviews</p>
            </div>
          </div>
        </div>
      </div>
      {reviewMedia.length > 0 && (
        <div className="w-full py-8 space-y-4">
          <p className="text-center text-lg/normal font-medium">
            Customer review's photos & videos
          </p>
          <MediaCarousel
            data={reviewMedia}
            currentIndex={mediaIndex}
            setCurrentIndex={setMediaIndex}
            onImageClick={() => setShowMediaModal(true)}
          />
        </div>
      )}
      <div className="w-full py-2 border-y border-y-primary-50 space-y-4 relative">
        <Dropdown
          title={
            REVIEWS_OPTIONS.find((o) => o.value === queryParams?.sort)?.name ??
            REVIEWS_OPTIONS[0].name
          }
          isAbsolute={true}
          closeOnOptionClick={true}
          closeOnOutsideClick={true}
          showShadow={true}
          className="w-[180px] ml-auto [&>button]:border [&>button]:border-primary-30 [&>button]:rounded-md [&>div]:rounded-md sticky top-[72px]"
        >
          <DropdownOptions
            options={REVIEWS_OPTIONS}
            selected={queryParams?.sort ?? REVIEWS_OPTIONS[0].value}
            onChange={(data) => {
              if (queryParams?.sort === data.value) {
                removeParam("sort");
              } else {
                setParams({ sort: data.value });
              }
            }}
          />
        </Dropdown>
        <ProductReviews reviews={reviews} />
        {showMediaModal && (
          <ReviewMediaModal
            currentIndex={mediaIndex}
            setCurrentIndex={setMediaIndex}
            reviewMedia={reviewMedia}
            isOpen={showMediaModal}
            setIsOpen={setShowMediaModal}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
