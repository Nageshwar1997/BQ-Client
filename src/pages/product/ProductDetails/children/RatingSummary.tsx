import { Icon } from '@iconify/react';

interface IRatingSummary {
  /** The average, 0 to 5. */
  rating: number;
  reviews: number;
  /** How many were sold: said only when there are some. */
  soldCount?: number;
}

const STARS = [0, 1, 2, 3, 4] as const;

/**
 * The stars of a product, filled as far as its rating goes (4.8 fills the fifth star by 80%), the rating, how many
 * reviews it is of and how many were sold. A product nobody reviewed says so, with empty stars, and not "0.0".
 */
const RatingSummary = ({ rating, reviews, soldCount = 0 }: IRatingSummary) => {
  const hasReviews = reviews > 0;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span
        role="img"
        aria-label={
          hasReviews
            ? `Rated ${rating.toFixed(1)} out of 5 from ${String(reviews)} ${reviews === 1 ? 'review' : 'reviews'}`
            : 'Not rated yet'
        }
        className="flex items-center gap-0.5"
      >
        {STARS.map((index) => {
          // whole percents: (4.8 - 4) * 100 is 79.99999999999999 in floating point
          const fill = hasReviews
            ? Math.max(0, Math.min(100, Math.round((rating - index) * 100)))
            : 0;

          return (
            <span key={index} className="relative block size-5">
              <Icon
                icon="solar:star-linear"
                className="text-silver-jet-2 absolute inset-0 size-5"
                aria-hidden="true"
              />
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${String(fill)}%` }}
              >
                <Icon
                  icon="solar:star-bold"
                  className="text-primary-yellow size-5 max-w-none shrink-0"
                  aria-hidden="true"
                />
              </span>
            </span>
          );
        })}
      </span>

      {hasReviews ? (
        <>
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span className="text-silver-jet text-sm">
            ({reviews.toLocaleString('en-IN')} {reviews === 1 ? 'review' : 'reviews'})
          </span>
        </>
      ) : (
        <span className="text-silver-jet text-sm">No reviews yet</span>
      )}

      {soldCount > 0 && (
        <span className="text-silver-jet text-sm">· {soldCount.toLocaleString('en-IN')} sold</span>
      )}
    </div>
  );
};

export default RatingSummary;
