import { useState } from "react";
import Button from "../../../../components/button/Button";
import RatingStars from "../../../../components/ui/RatingStars";
import TextDisplay from "../../../../components/TextDisplay";
import { FetchedReviewType } from "../../../../types";
import { getAvgRating } from "../../../../utils";
import CustomerReviews from "../CustomerReviews";
import AddReviewModal from "../../../../components/modal/children/AddReviewModal";
import useRequireAuth from "../../../../hooks/useRequireAuth";

const RatingBars = ({ reviews = [] }: { reviews: FetchedReviewType[] }) => {
  const requireAuth = useRequireAuth();
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  const handlePopupToggle = () => {
    const action = () => setShowAddReviewModal(true); // wrap in a function
    if (!requireAuth(action)) return; // store action if not logged in
    action(); // run immediately if logged in
  };
  return (
    <>
      <div className="w-full pb-8 border-b border-b-primary-50 space-y-4">
        <TextDisplay
          content={[{ isHighlighted: true, text: "Customer Reviews" }]}
          className="text-xl md:text-3xl lg:text-4xl"
        />
        <hr className="max-w-xl mx-auto h-px block border-none bg-gradient-line my-4" />
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-8">
          <div className="w-full">
            <CustomerReviews reviews={reviews?.map((r) => r.rating)} />
          </div>
          <div className="w-full flex flex-col gap-4 items-center justify-center">
            <Button
              pattern="secondary"
              content="Write a Review"
              className="max-w-44 py-2! lg:py-3 rounded-md!"
              buttonProps={{ onClick: handlePopupToggle }}
            />
            <div className="flex flex-col gap-0.5 items-center justify-center text-secondary">
              <div className="flex items-center gap-2 text-sm">
                <RatingStars
                  rating={getAvgRating(reviews)}
                  className="[&>svg]:w-4 [&>svg]:h-4"
                />
                <span className="leading-none mt-px">
                  {getAvgRating(reviews).toFixed(1)} out of 5
                </span>
              </div>
              <p>Based on {reviews?.length} reviews</p>
            </div>
          </div>
        </div>
      </div>
      {showAddReviewModal && (
        <AddReviewModal
          isOpen={showAddReviewModal}
          onClose={() => setShowAddReviewModal(false)}
        />
      )}
    </>
  );
};

export default RatingBars;
