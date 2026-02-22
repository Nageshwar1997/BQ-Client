/* components/input/Range.tsx */
import { useEffect, useRef } from 'react';
import type { IRange } from '../../../Types';

/* helper: % position on track */
const pct = (v: number, min: number, max: number) => ((v - min) / (max - min)) * 100;

export const Range = ({ mode, min, max, step = 1, className = '', value, onChange }: IRange) => {
  const trackRef = useRef<HTMLDivElement>(null);
  /* paint coloured track */
  useEffect(() => {
    if (!trackRef.current) return;

    if (mode === 'single' && value.single) {
      const p = pct(value.single, min, max);
      trackRef.current.style.backgroundImage = `linear-gradient(
        to right,
        var(--primary) ${p}%,
        transparent ${p}% 100%
      )`;
    } else if (mode === 'dual' && value.dual) {
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
  }, [mode, value.single, value.dual?.min, value.dual?.max, min, max, value.dual]);

  return (
    <div className={`relative h-5 w-full select-none ${className}`}>
      {/* first thumb (single OR min‑thumb) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        className="range-slider"
        value={mode === 'single' ? value.single : value.dual?.min}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (mode === 'single' && onChange.single) {
            onChange.single(v);
          } else if (mode === 'dual' && onChange.dual && value.dual) {
            onChange.dual({
              min: Math.min(v, value.dual.max - step),
              max: value.dual.max,
            });
          }
        }}
      />
      {/* second thumb only in dual mode */}
      {mode === 'dual' && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          className="range-slider"
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
        className="bg-primary/30 absolute top-1/2 h-0.75 w-full -translate-y-1/2 rounded-sm"
      />
    </div>
  );
};
