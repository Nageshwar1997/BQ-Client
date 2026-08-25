import { useCallback } from 'react';
import type { DualSliderProps } from '../../types';

export const DualSlider: React.FC<DualSliderProps> = ({
  label,
  minValue,
  maxValue,
  min = 0,
  max = 100,
  step = 1,
  className,
  onMinChange,
  onMaxChange,
  clampToBounds = true,
}) => {
  const minPercentage = Math.max(
    0,
    Math.min(100, ((minValue - min) / (max - min)) * 100)
  );

  const maxPercentage = Math.max(
    0,
    Math.min(100, ((maxValue - min) / (max - min)) * 100)
  );

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      const newMin = clampToBounds
        ? Math.min(newValue, maxValue - step)
        : newValue;
      onMinChange(newMin);
    },
    [maxValue, step, onMinChange, clampToBounds]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      const newMax = clampToBounds
        ? Math.max(newValue, minValue + step)
        : newValue;
      onMaxChange(newMax);
    },
    [minValue, step, onMaxChange, clampToBounds]
  );

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-neutral-gray-900 mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative h-2">
        {/* Track background */}
        <div className="bg-neutral-gray-400 absolute top-0 h-2 w-full rounded-full" />

        {/* Active range track */}
        <div
          className="bg-neutral-gray-700 absolute top-0 h-2 rounded-full"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="[&::-moz-range-thumb]:border-neutral-gray-400 [&::-moz-range-thumb]:bg-neutral-gray-100 [&::-webkit-slider-thumb]:border-neutral-gray-400 [&::-webkit-slider-thumb]:bg-neutral-gray-100 pointer-events-none absolute top-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-[1] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:shadow-sm [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-[1] [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:shadow-sm"
        />

        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="[&::-moz-range-thumb]:border-neutral-gray-400 [&::-moz-range-thumb]:bg-neutral-gray-100 [&::-webkit-slider-thumb]:border-neutral-gray-400 [&::-webkit-slider-thumb]:bg-neutral-gray-100 pointer-events-none absolute top-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-[1] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:shadow-sm [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-[1] [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>
    </div>
  );
};

export default DualSlider;
