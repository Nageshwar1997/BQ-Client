import { useMemo, useState } from "react";
import MediaCarousel from "../../../../components/carousels/MediaCarousel";
import RatingStars from "../../../../components/navbar/components/rating/RatingStars";
import {
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserCircleIcon,
} from "../../../../icons";
import { FetchedReviewType, TMediaOption } from "../../../../types";
import { formatDate } from "../../../../utils";
import Button from "../../../../components/button/Button";

const ReviewCard = ({
  className = "",
  review,
  onMediaClick,
}: {
  className?: string;
  review: FetchedReviewType;
  onMediaClick: (reviewMedia: TMediaOption[], index: number) => void;
}) => {
  const [updateStatus, setUpdateStatus] = useState({
    liked: false,
    disliked: false,
    helpful: false,
  });

  const reviewMedia = useMemo(() => {
    const images: TMediaOption[] =
      review?.images?.map((url) => ({ url, type: "image" })) ?? [];
    const videos: TMediaOption[] =
      review?.videos?.map((url) => ({ url, type: "video" })) ?? [];
    return [...images, ...videos];
  }, [review]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
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
            <Button
              content="Helpful"
              pattern="outline"
              onClick={() =>
                setUpdateStatus((prev) => ({ ...prev, helpful: !prev.helpful }))
              }
              className={`!w-fit !py-0.5 !px-2 !rounded-sm !text-xs/normal !border-none !duration-0 ${
                updateStatus.helpful
                  ? "bg-accent-duo !text-primary-inverted"
                  : "bg-silver-duo !text-primary-inverted"
              }`}
            />
            <div className="flex items-center gap-2">
              <ThumbsUpIcon
                role="button"
                onClick={() =>
                  setUpdateStatus((prev) => ({
                    ...prev,
                    liked: !prev.liked,
                    disliked: false,
                  }))
                }
                className={`w-4 h-4 cursor-pointer stroke-primary hover:rotate-12 transition-all duration-300 ${
                  updateStatus.liked
                    ? "dark:fill-blue-crayola-c light:fill-picton-blue-c"
                    : ""
                }`}
              />
              <ThumbsDownIcon
                onClick={() =>
                  setUpdateStatus((prev) => ({
                    ...prev,
                    disliked: !prev.disliked,
                    liked: false,
                  }))
                }
                role="button"
                className={`w-4 h-4 cursor-pointer stroke-primary hover:rotate-12 transition-all duration-300 ${
                  updateStatus.disliked
                    ? "dark:fill-blue-crayola-c light:fill-picton-blue-c"
                    : ""
                }`}
              />
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
