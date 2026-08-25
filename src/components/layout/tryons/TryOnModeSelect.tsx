import { Icon } from '@iconify/react';

interface ITryOnModeSelectProps {
  onSelect: (mode: 'live' | 'upload') => void;
}

const TryOnModeSelect = ({ onSelect }: ITryOnModeSelectProps) => (
  <div className="flex flex-col gap-3 sm:flex-row">
    <button
      type="button"
      onClick={() => {
        onSelect('live');
      }}
      className="border-primary/10 bg-secondary-invert hover:border-primary/30 flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-lg border p-6 text-center transition-colors duration-300"
    >
      <Icon icon="solar:camera-linear" className="text-primary size-8" />
      <span className="text-primary text-sm font-medium">Try it Live</span>
      <span className="text-tertiary text-xs">Use your camera for a real-time try-on</span>
    </button>

    <button
      type="button"
      onClick={() => {
        onSelect('upload');
      }}
      className="border-primary/10 bg-secondary-invert hover:border-primary/30 flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-lg border p-6 text-center transition-colors duration-300"
    >
      <Icon icon="solar:gallery-add-linear" className="text-primary size-8" />
      <span className="text-primary text-sm font-medium">Upload a Photo</span>
      <span className="text-tertiary text-xs">Try it on a photo from your device</span>
    </button>
  </div>
);

export default TryOnModeSelect;
