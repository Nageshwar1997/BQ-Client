import RatingStars from "../../../../components/navbar/components/rating/RatingStars";
import {
  CheckedUserIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "../../../../icons";
import { FetchedReviewType } from "../../../../types";
import { formatDate } from "../../../../utils";

const ProductReviews = ({ reviews }: { reviews: FetchedReviewType[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {reviews?.map((review, index) => (
        <div
          key={index}
          className={`flex flex-col gap-2 pb-4 ${index === 0 ? "pt-4" : ""} ${
            index !== reviews.length - 1 ? "border-b border-b-primary-10" : ""
          }`}
        >
          <div className="flex justify-between items-center">
            <RatingStars rating={review.rating || 0} />
            <div className="text-sm">{formatDate(review.createdAt, "LLL")}</div>
          </div>
          <div className="w-fit flex gap-2">
            {review.user.profilePic ? (
              <img
                src={review.user.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full aspect-square object-cover object-center"
              />
            ) : (
              <CheckedUserIcon className="w-10 h-10 stroke-tertiary" />
            )}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="bg-primary text-primary-inverted text-xs/normal px-2 w-fit font-medium">
                  Verified
                </p>
                {/* Like and dislike Logic pending */}
                <div className="flex items-center gap-2">
                  <ThumbsUpIcon className="w-4 h-4 cursor-pointer stroke-primary hover:rotate-12 transition-transform duration-300" />
                  <ThumbsDownIcon className="w-4 h-4 cursor-pointer stroke-primary hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <p className="font-semibold text-sm capitalize">{`${review.user.firstName} ${review.user.lastName}`}</p>
            </div>
          </div>
          <div className="text-sm space-y-0.5">
            <p className="font-semibold">{review.title}</p>
            {review.comment && <p className="text-sm">{review.comment}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
