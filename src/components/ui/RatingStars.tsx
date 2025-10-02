import { StarEmptyIcon, StarFillIcon, StarHalfFillIcon } from "../../icons";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  className?: string;
}

const RatingStars = ({
  rating = 0,
  maxStars = 5,
  className = "",
}: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <StarFillIcon
          key={`full-${i}`}
          className="w-5 h-5 fill-primary stroke-primary"
        />
      ))}
      {hasHalfStar && <StarHalfFillIcon className="w-5 h-5 stroke-primary" />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarEmptyIcon key={`empty-${i}`} className="w-5 h-5 stroke-primary" />
      ))}
    </div>
  );
};

export default RatingStars;
