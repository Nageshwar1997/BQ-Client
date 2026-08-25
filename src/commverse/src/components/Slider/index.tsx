// import React, { useCallback } from 'react';
import type { SliderProps } from '../../types';

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  className,
  onChange,
  ...props
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-neutral-gray-900 mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-neutral-gray-100 [&::-moz-range-thumb]:-neutral-gray-100 [&::-moz-range-thumb]:border-neutral-gray-100 [&::-webkit-slider-thumb]:border-neutral-gray-400 [&::-webkit-slider-thumb]:bg-neutral-gray-100 h-2 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:shadow-sm"
          style={{
            background: `linear-gradient(to right, #48494D 0%, #48494D ${percentage}%, #D0D1D9 ${percentage}%, #D0D1D9 100%)`,
          }}
          {...props}
        />
      </div>
    </div>
  );
};

export default Slider;
