import { StarEmptyIcon, StarFillIcon, StarHalfFillIcon } from '../../Icons';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  className?: string;
}

export const RatingStars = ({ rating = 0, maxStars = 5, className = '' }: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <StarFillIcon key={`full-${i}`} className="fill-primary stroke-primary size-5" />
      ))}
      {hasHalfStar && <StarHalfFillIcon className="stroke-primary size-5" />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarEmptyIcon key={`empty-${i}`} className="stroke-primary size-5" />
      ))}
    </div>
  );
};
