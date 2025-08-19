/* components/input/Range.tsx */
import { useEffect, useRef } from "react";

export interface RangeProps {
  mode: "single" | "dual";
  min: number;
  max: number;
  step?: number;
  className?: string;
  value: { single?: number; dual?: { min: number; max: number } };
  onChange: {
    single?: (next: number) => void;
    dual?: (next: { min: number; max: number }) => void;
  };
}

/* helper: % position on track */
const pct = (v: number, min: number, max: number) =>
  ((v - min) / (max - min)) * 100;

const Range = ({
  mode,
  min,
  max,
  step = 1,
  className = "",
  value,
  onChange,
}: RangeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  /* paint coloured track */
  useEffect(() => {
    if (!trackRef.current) return;

    if (mode === "single" && value.single) {
      const p = pct(value.single, min, max);
      trackRef.current.style.backgroundImage = `linear-gradient(
        to right,
        var(--primary) ${p}%,
        transparent ${p}% 100%
      )`;
    } else if (mode === "dual" && value.dual) {
      const pMin = pct(value.dual.min, min, max);
      const pMax = pct(value.dual.max, min, max);
      trackRef.current.style.backgroundImage = `linear-gradient(
        to right,
        transparent ${pMin}%,
        var(--primary) ${pMin}%,
        var(--primary) ${pMax}%,
        transparent ${pMax}%
        )`;
    }
  }, [
    mode,
    value.single,
    value.dual?.min,
    value.dual?.max,
    min,
    max,
    value.dual,
  ]);

  return (
    <div className={`relative w-full h-5 select-none ${className}`}>
      {/* first thumb (single OR min‑thumb) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        className="range-slider-thumb absolute w-full h-full bg-transparent appearance-none pointer-events-none z-20"
        value={mode === "single" ? value.single : value.dual?.min}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (mode === "single" && onChange.single) {
            onChange.single(v);
          } else if (mode === "dual" && onChange.dual && value.dual) {
            onChange.dual({
              min: Math.min(v, value.dual.max - step),
              max: value.dual.max,
            });
          }
        }}
      />
      {/* second thumb only in dual mode */}
      {mode === "dual" && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          className="range-slider-thumb absolute w-full h-full bg-transparent appearance-none pointer-events-none z-20"
          value={value.dual?.max}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (onChange.dual && value.dual) {
              onChange.dual({
                min: value.dual.min,
                max: Math.max(v, value.dual.min + step),
              });
            }
          }}
        />
      )}
      {/* coloured track behind thumbs */}
      <div
        ref={trackRef}
        className="absolute top-1/2 -translate-y-1/2 w-full h-[3px] bg-primary-30 rounded"
      />
    </div>
  );
};

export default Range;
