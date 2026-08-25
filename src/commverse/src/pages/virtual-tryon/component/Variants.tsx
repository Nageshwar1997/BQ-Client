import type { TTryOnForm } from '../../../types';
import { Icon } from '@iconify/react';

const Label = ({ label }: { label: string }) => (
  <p className="border-neutral-gray-400 bg-neutral-gray-100 font-metropolis text-neutral-gray-900 line-clamp-2 w-full max-w-12 rounded-sm border-[0.5px] px-1 py-0.5 text-center text-[8px]/[10px] wrap-break-word capitalize">
    {label}
  </p>
);

const ActiveIcon = ({ isSelected }: { isSelected: boolean }) => {
  return (
    <>
      {isSelected && (
        <Icon
          icon="solar:check-circle-linear"
          className="text-neutral-gray-100 size-5 group-hover:hidden"
        />
      )}
      {!isSelected && (
        <Icon
          icon="solar:round-arrow-up-linear"
          className="text-neutral-gray-100 hidden size-5 group-hover:block"
        />
      )}
      {isSelected && (
        <Icon
          icon="solar:close-circle-linear"
          className="text-neutral-gray-100 hidden size-5 group-hover:block"
        />
      )}
    </>
  );
};

const Variants = ({
  variants,
  appliedColor,
  onShadeClick,
  className,
}: {
  variants: TTryOnForm['variants'];
  className?: string;
  appliedColor: string | null;
  onShadeClick: (color: string) => void;
}) => {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`}>
      <div className="no-scrollbar flex max-w-full flex-nowrap gap-3 overflow-x-auto px-4">
        {variants.map((variant, idx) => {
          if (!variant.hexColor || !variant.name) return null;
          const active = variant.hexColor === appliedColor;

          return (
            <div
              key={idx}
              className="flex shrink-0 flex-col items-center gap-1.5"
              onClick={() => onShadeClick(variant.hexColor)}
            >
              <button
                type="button"
                className={`group flex size-12 cursor-pointer items-center justify-center rounded-full border-2 ${
                  active
                    ? 'border-neutral-gray-100'
                    : 'border-neutral-gray-700 hover:border-neutral-gray-400'
                }`}
                style={{ backgroundColor: variant.hexColor }}
              >
                <ActiveIcon isSelected={active} />
              </button>
              {variant.name && <Label label={variant.name} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Patterns = ({
  patterns,
  appliedPattern,
  onPatternClick,
}: {
  patterns: TTryOnForm['patterns'];
  appliedPattern: NonNullable<TTryOnForm['patterns']>[number]['value'] | null;
  onPatternClick: (
    value: NonNullable<TTryOnForm['patterns']>[number]['value']
  ) => void;
}) => {
  if (!patterns?.length) return null;
  return (
    <div className="flex items-center justify-center">
      <div className="no-scrollbar flex max-w-full flex-nowrap gap-3 overflow-x-auto px-4">
        {patterns?.map((pattern, idx) => {
          const active = pattern.value === appliedPattern;
          return (
            <div
              key={idx}
              className="flex shrink-0 flex-col items-center gap-1.5"
              onClick={() => onPatternClick(pattern.value)}
            >
              <button
                type="button"
                className={`group bg-neutral-gray-100 relative flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 ${
                  active
                    ? 'border-neutral-gray-100'
                    : 'border-neutral-gray-700 hover:border-neutral-gray-400'
                }`}
              >
                <div className="bg-overlay-dark absolute inset-0 z-1">
                  <div
                    className={`size-full bg-contain bg-center bg-no-repeat ${active ? 'bg-overlay-dark' : 'bg-overlay-light'}`}
                    style={{ backgroundImage: `url(${pattern.icon})` }}
                  />
                </div>
                <div className="absolute inset-0 z-2 flex items-center justify-center">
                  <ActiveIcon isSelected={active} />
                </div>
              </button>
              <Label label={pattern.label} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Variants;
