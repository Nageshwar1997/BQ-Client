import MediaCarousel from "../../../../components/carousels/MediaCarousel";
import RatingStars from "../../../../components/navbar/components/rating/RatingStars";
import {
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserCircleIcon,
} from "../../../../icons";
import { FetchedReviewType, TCarouselOption } from "../../../../types";
import { formatDate } from "../../../../utils";

const ReviewCard = ({
  className = "",
  review,
  onMediaClick,
}: {
  className?: string;
  review: FetchedReviewType;
  onMediaClick: (reviewMedia: TCarouselOption[], index: number) => void;
}) => {
  const reviewMedia: TCarouselOption[] = [
    ...(review?.images?.map((url) => ({ url, type: "image" as const })) ?? []),
    ...(review?.videos?.map((url) => ({ url, type: "video" as const })) ?? []),
  ];
  return (
    <div className={`flex flex-col gap-2 pb-4 ${className}`}>
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
          <UserCircleIcon className="w-10 h-10 stroke-tertiary" />
        )}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <p className="bg-primary text-primary-inverted text-xs/normal px-2 w-fit font-medium">
              Helpful
            </p>
            <div className="flex items-center gap-2">
              <ThumbsUpIcon className="w-4 h-4 cursor-pointer stroke-primary hover:rotate-12 transition-transform duration-300" />
              <ThumbsDownIcon className="w-4 h-4 cursor-pointer stroke-primary hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <p className="font-semibold text-sm capitalize">
            {`${review.user.firstName} ${review.user.lastName}`}
          </p>
        </div>
      </div>
      <div className="text-sm space-y-0.5">
        <p className="font-semibold text-tertiary">{review.title}</p>
        {review.comment && (
          <p className="text-sm text-tertiary">{review.comment}</p>
        )}
      </div>
      {reviewMedia.length > 0 && (
        <MediaCarousel
          data={reviewMedia}
          onClick={(index) => {
            onMediaClick(reviewMedia, index);
          }}
          className="[&>div]:justify-start [&>div>div]:w-12 [&>div>div]:h-12 [&>div>div>div>svg]:w-4 [&>div>div>div>svg]:h-4"
        />
      )}
    </div>
  );
};

export default ReviewCard;
