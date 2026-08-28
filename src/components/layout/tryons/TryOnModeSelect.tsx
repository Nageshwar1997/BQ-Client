import { Icon } from '@iconify/react';

import { TRYON_MODE_OPTIONS } from '@/constants/tryon-constants';

interface ITryOnModeSelectProps {
  onSelect: (mode: 'live' | 'upload') => void;
}

// Step 1 of the flow - picking a mode advances to the instructions step for that mode (see
// TryOnModal's `handleSelectMode`), not straight to the camera/upload picker.
const TryOnModeSelect = ({ onSelect }: ITryOnModeSelectProps) => (
  <div className="mx-auto flex h-full w-fit flex-col justify-center gap-3 p-6">
    {TRYON_MODE_OPTIONS.map(({ icon, mode, title, description }) => (
      <button
        key={mode}
        type="button"
        onClick={() => {
          onSelect(mode);
        }}
        className="border-primary/10 bg-secondary-invert hover:border-primary/30 flex h-min cursor-pointer flex-col items-center gap-2 rounded-lg border p-6 text-center transition-colors duration-300"
      >
        <span className="size-8 shrink-0">
          <Icon icon={icon} className="text-primary size-full" />
        </span>
        <span className="text-primary text-sm font-medium">{title}</span>
        <span className="text-tertiary text-xs">{description}</span>
      </button>
    ))}
  </div>
);

export default TryOnModeSelect;
