import { useState } from 'react';
import type React from 'react';
import { StarEmptyIcon, StarFillIcon } from '@/Icons';
import { InputError } from './children';
import { Button } from '../Button';
import { RatingStars } from '../RatingStars';

interface RatingProps {
  initialValue?: number;
  onChange?: (value: number) => void;
  error?: string;
}

export const SelectRating = ({ initialValue = 0, onChange, error }: RatingProps) => {
  const [rating, setRating] = useState(initialValue);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (value: number) => {
    setRating(value);
    setHoverRating(null); // hover value reset
    if (onChange) onChange(value);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    const { left, width } = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeX = e.clientX - left;
    const percent = relativeX / width;
    const value = index + percent;
    setHoverRating(Number.parseFloat(value.toFixed(1)));
  };

  const handleLeave = () => setHoverRating(null);

  const displayRating = hoverRating ?? rating;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-full items-center gap-2">
        <div className="border-b-primary/50 h-px flex-1 border-b border-dashed" />
        <span className="w-10 text-center text-xl font-bold">
          {Number.isInteger(displayRating) ? displayRating : displayRating.toFixed(1)}
        </span>
        <div className="border-b-primary/50 h-px flex-1 border-b border-dashed" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1" onMouseLeave={handleLeave}>
          {[...Array(5)].map((_, i) => {
            const fillPercent = Math.min(Math.max(displayRating - i, 0), 1) * 100;

            return (
              <div
                key={i}
                className="relative cursor-pointer"
                onClick={(e) => {
                  const { left, width } = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const relativeX = e.clientX - left;
                  const percent = relativeX / width;
                  const value = i + percent;
                  handleClick(Number.parseFloat(value.toFixed(1)));
                }}
                onMouseMove={(e) => handleMove(e, i)}
              >
                <StarEmptyIcon className="stroke-primary size-10 fill-none" />
                <div
                  className="pointer-events-none absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${fillPercent}%` }}
                >
                  <StarEmptyIcon
                    className={`stroke-primary size-10 ${
                      hoverRating !== null
                        ? 'fill-blue-crayola-c stroke-blue-crayola-c'
                        : 'fill-primary'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <InputError error={error} />
      </div>
      <div className="flex w-full items-center gap-2 py-2 text-xs font-medium">
        <div className="bg-primary/50 h-px flex-1 rounded-full" />
        <span>OR Select Below Rating</span>
        <div className="bg-primary/50 h-px flex-1 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((val, index) => (
          <div className="flex items-center gap-5" key={index}>
            <RatingStars rating={val} className="[&>svg]:size-6" />
            <Button
              content={`Give ${val}`}
              pattern="secondary"
              className="hover:shadow-primary/50 rounded-sm! px-2! py-1! text-xs! shadow-none hover:shadow-xs [&>*:first-child]:pt-px"
              rightIcon={<StarFillIcon className="size-4" fill="currentColor" />}
              buttonProps={{ onClick: () => handleClick(val) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
