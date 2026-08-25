import { Icon } from '@iconify/react';

import type { IShade } from '@/types/tryon-engine.type';

interface ITryOnShadeSwatchesProps {
  shades: IShade[];
  appliedColor: string | null;
  onSelect: (hexColor: string) => void;
  className?: string;
}

// Bottom-of-canvas shade strip - mirrors the reference's Variants.tsx (circular swatch, active
// state = border + check icon), driven by real product shade data, not a color-wheel input.
const TryOnShadeSwatches = ({
  shades,
  appliedColor,
  onSelect,
  className = '',
}: ITryOnShadeSwatchesProps) => {
  if (!shades.length) return null;

  return (
    <div className={`bg-primary-invert/70 backdrop-blur-xs ${className}`}>
      <div className="no-scrollbar flex items-center gap-3 overflow-x-auto px-4 py-3">
        {shades.map((shade) => {
          const active = shade.hexColor === appliedColor;

          return (
            <div key={shade.hexColor} className="flex shrink-0 flex-col items-center gap-1.5">
              <button
                type="button"
                aria-label={shade.name}
                onClick={() => {
                  onSelect(shade.hexColor);
                }}
                className={`flex size-12 cursor-pointer items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  active ? 'border-white' : 'border-white/30 hover:border-white/60'
                }`}
                style={{ backgroundColor: shade.hexColor }}
              >
                {active && <Icon icon="solar:check-circle-bold" className="size-5 text-white" />}
              </button>
              <p className="max-w-14 truncate text-center text-[10px] text-white">{shade.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TryOnShadeSwatches;
