import { Icon } from '@iconify/react';

import type { IEyePatternOption } from '@/types/tryon-types/eye';

import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';

interface ITryOnPatternSwatchesProps {
  patterns: IEyePatternOption[];
  appliedPattern: string | null;
  onSelect: (patternId: string) => void;
  // Same reasoning as TryOnShadeSwatches's identical prop - picking a pattern before the engine
  // can actually render it is a no-op at best.
  disabled?: boolean;
  className?: string;
}

// EYE-only row, shown alongside TryOnShadeSwatches for finishes that have a `pattern` dimension
// (see docs/tryons/EYE-PLAN.md) - same swatch-strip shape as the shade picker, but each option is
// a preview thumbnail image (the style itself) rather than a flat color circle, since "which
// pattern" isn't something a color swatch can show. No deselect-to-null here (unlike shade
// swatches) - a pattern always has *some* value once a pattern-bearing finish is picked (see
// EYELINER_DEFAULT_PATTERN), there's no "no pattern" state to toggle back to.
const TryOnPatternSwatches = ({
  patterns,
  appliedPattern,
  onSelect,
  disabled = false,
  className = '',
}: ITryOnPatternSwatchesProps) => {
  if (!patterns.length) return null;

  return (
    <div
      className={`bg-primary-invert/10 rounded-b-2xl backdrop-blur-xs ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      <ScrollableGradientContainer
        direction="horizontal"
        className="px-4 py-3 [&>div]:gap-3"
        gradientClassNames={{
          left: 'from-primary-invert/30 w-10!',
          right: 'from-primary-invert/30 w-10!',
        }}
      >
        {patterns.map((option) => {
          const active = option.id === appliedPattern;

          return (
            <div key={option.id} className="flex shrink-0 flex-col items-center gap-1.5">
              <button
                type="button"
                aria-label={`Apply ${option.label} pattern`}
                disabled={disabled}
                onClick={() => {
                  onSelect(option.id);
                }}
                className={`group relative flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 bg-white transition-colors duration-300 disabled:cursor-not-allowed ${active ? 'border-white' : 'border-white/30 hover:border-white/60'}`}
              >
                <img src={option.image} alt={option.label} className="size-full object-cover" />
                {active && (
                  <Icon
                    icon="solar:check-circle-bold"
                    className="absolute right-0 bottom-0 size-4 text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
                  />
                )}
              </button>
              <p className="max-w-14 truncate text-center text-[10px] text-white">{option.label}</p>
            </div>
          );
        })}
      </ScrollableGradientContainer>
    </div>
  );
};

export default TryOnPatternSwatches;
