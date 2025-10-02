import RatingStars from "../../../components/ui/RatingStars";

const CustomerReviews = ({ reviews }: { reviews: number[] }) => {
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews?.forEach((review) => {
    const roundedReview = Math.round(review);
    if (ratingCounts[roundedReview]) {
      ratingCounts[roundedReview]++;
    } else {
      ratingCounts[roundedReview] = 1;
    }
  });

  return (
    <div className="flex flex-col gap-1 md:gap-3 p-5">
      {Object.entries(ratingCounts)
        ?.sort((a, b) => Number(b[0]) - Number(a[0])) // Optional: ensure descending order
        ?.map(([rating, count]) => {
          const percent = reviews?.length ? (count / reviews?.length) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3 md:gap-5">
              <RatingStars
                rating={Number(rating)}
                className="[&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5 gap-0 md:gap-0.5"
              />
              <div className="relative h-4 md:h-5 bg-primary-10 rounded-sm w-full max-w-xs">
                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded-sm"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="min-w-5 text-sm text-secondary text-center w-fit">
                {count}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default CustomerReviews;
