interface ITryOnRangeSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  // The active shade's hex - the track fills from transparent to this color, so the slider
  // itself reads as "how much of this shade" rather than a generic progress bar. Mirrors the
  // reference implementation's range slider (`virtual-tryon/component/CosmeticTryOn.tsx`).
  color: string;
  disabled?: boolean;
  onChange: (value: number) => void;
  className?: string;
}

// Shade-intensity control - drives the LIP engine's `state.range` (rendered as canvas alpha,
// see LipEngineBase.applyEffect), already fully wired end-to-end in the engine layer; this is
// just the missing UI piece. Category-agnostic despite living in `tryons/` - any future
// category with its own intensity bounds can reuse it as-is.
const TryOnRangeSlider = ({
  value,
  min,
  max,
  step = 0.01,
  color,
  disabled = false,
  onChange,
  className = '',
}: ITryOnRangeSliderProps) => (
  <div
    className={`bg-primary-invert/10 mx-auto flex w-full max-w-xs items-center justify-center rounded-full px-3 py-2 backdrop-blur-xs ${disabled ? 'opacity-50' : ''} ${className}`}
  >
    <input
      type="range"
      aria-label="Shade intensity"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(event) => {
        onChange(Number(event.target.value));
      }}
      className="border-primary/50 h-3 w-full cursor-pointer appearance-none rounded-full border disabled:cursor-not-allowed [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
      style={{ background: `linear-gradient(to right, ${color}00, ${color})` }}
    />
  </div>
);

export default TryOnRangeSlider;
