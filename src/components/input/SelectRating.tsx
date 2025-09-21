import { useState } from "react";
import type React from "react";
import { InfoIcon, StarEmptyIcon, StarFillIcon } from "../../icons";
import RatingStars from "../ui/RatingStars";
import Button from "../button/Button";

interface RatingProps {
  initialValue?: number;
  onChange?: (value: number) => void;
  error?: string;
}

const SelectRating = ({ initialValue = 0, onChange, error }: RatingProps) => {
  const [rating, setRating] = useState(initialValue);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (value: number) => {
    setRating(value);
    setHoverRating(null); // hover value reset
    if (onChange) onChange(value);
  };

  const handleMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    const { left, width } = (
      e.currentTarget as HTMLElement
    ).getBoundingClientRect();
    const relativeX = e.clientX - left;
    const percent = relativeX / width;
    const value = index + percent;
    setHoverRating(Number.parseFloat(value.toFixed(1)));
  };

  const handleLeave = () => {
    setHoverRating(null);
  };

  const displayRating = hoverRating ?? rating;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 h-px bg-primary-50 rounded-full" />
        <span className="font-bold text-xl w-10 text-center">
          {Number.isInteger(displayRating)
            ? displayRating
            : displayRating.toFixed(1)}
        </span>
        <div className="flex-1 h-px bg-primary-50 rounded-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1" onMouseLeave={handleLeave}>
          {[...Array(5)].map((_, i) => {
            const fillPercent =
              Math.min(Math.max(displayRating - i, 0), 1) * 100;

            return (
              <div
                key={i}
                className="relative cursor-pointer"
                onClick={(e) => {
                  const { left, width } = (
                    e.currentTarget as HTMLElement
                  ).getBoundingClientRect();
                  const relativeX = e.clientX - left;
                  const percent = relativeX / width;
                  const value = i + percent;
                  handleClick(Number.parseFloat(value.toFixed(1)));
                }}
                onMouseMove={(e) => handleMove(e, i)}
              >
                <StarEmptyIcon className="w-10 h-10 fill-none stroke-primary" />

                <div
                  className="absolute top-0 left-0 overflow-hidden pointer-events-none"
                  style={{ width: `${fillPercent}%` }}
                >
                  <StarEmptyIcon
                    className={`w-10 h-10 stroke-primary ${
                      hoverRating !== null
                        ? "fill-blue-crayola-c stroke-blue-crayola-c"
                        : "fill-primary"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {error && (
          <p
            className={`w-full text-start flex gap-1 items-center text-[11px] leading-tight text-red-500`}
          >
            <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
            <span className="leading-none">{error}</span>
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 w-full py-2">
        <div className="flex-1 h-px bg-primary-50 rounded-full" />
        <span className="text-xs font-medium">OR Select Below Rating</span>
        <div className="flex-1 h-px bg-primary-50 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((val, index) => (
          <div className="flex items-center gap-5" key={index}>
            <RatingStars rating={val} className="[&>svg]:w-6 [&>svg]:h-6" />
            <Button
              content={`Give ${val}`}
              pattern="secondary"
              className="!py-1 !px-2 !rounded shadow-none hover:shadow-sm hover:shadow-primary-50 [&>*:first-child]:pt-px !text-xs"
              rightIcon={
                <StarFillIcon className="w-4 h-4" fill="currentColor" />
              }
              onClick={() => handleClick(val)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectRating;
