import { Icon } from '@iconify/react';

import type { IShade } from '@/types/tryon-engine.type';

import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';

interface ITryOnShadeSwatchesProps {
  shades: IShade[];
  appliedColor: string | null;
  // `null` means "deselect" - clicking the already-active shade again toggles it off.
  onSelect: (hexColor: string | null) => void;
  // Picking a shade before the engine can actually render it is a no-op at best - disable the
  // whole strip until the stage reports ready (see TryOnModal's `isTryOnReady`).
  disabled?: boolean;
  className?: string;
}

// Bottom-of-canvas shade strip - mirrors the reference's Variants.tsx (circular swatch, active
// state = border + check icon), driven by real product shade data, not a color-wheel input.
const TryOnShadeSwatches = ({
  shades,
  appliedColor,
  onSelect,
  disabled = false,
  className = '',
}: ITryOnShadeSwatchesProps) => {
  if (!shades.length) return null;

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
        {shades.map((shade) => {
          const active = shade.hexColor === appliedColor;

          return (
            <div key={shade.hexColor} className="flex shrink-0 flex-col items-center gap-1.5">
              <button
                type="button"
                aria-label={active ? `Remove ${shade.name}` : `Apply ${shade.name}`}
                disabled={disabled}
                onClick={() => {
                  onSelect(active ? null : shade.hexColor);
                }}
                className={`group flex size-12 cursor-pointer items-center justify-center rounded-full border-2 transition-colors duration-300 disabled:cursor-not-allowed ${active ? 'border-white' : 'border-white/30 hover:border-white/60'}`}
                style={{ backgroundColor: shade.hexColor }}
              >
                {active ? (
                  <>
                    {/* Selected: filled check, swaps to a "remove" icon on hover. */}
                    <Icon
                      icon="solar:check-circle-bold"
                      className="size-5 text-white group-hover:hidden"
                    />
                    <Icon
                      icon="solar:close-circle-bold"
                      className="hidden size-5 text-white group-hover:block"
                    />
                  </>
                ) : (
                  // Not selected: an outline check preview, only on hover.
                  <Icon
                    icon="solar:check-circle-linear"
                    className="hidden size-5 text-white/90 group-hover:block"
                  />
                )}
              </button>
              <p className="max-w-14 truncate text-center text-[10px] text-white">{shade.name}</p>
            </div>
          );
        })}
      </ScrollableGradientContainer>
    </div>
  );
};

export default TryOnShadeSwatches;
