import { IMAGE_MIMES } from '@beautinique/frontend-constants';
import { Icon } from '@iconify/react';
import { type ChangeEvent, type RefObject } from 'react';

import { TRYON_MODEL_IMAGES } from '@/constants/tryon.constants';

interface ITryOnSidebarProps {
  mode: 'live' | 'upload';
  onModeChange: (mode: 'live' | 'upload') => void;
  cameraVideoRef: RefObject<HTMLVideoElement | null>;
  cameraReady: boolean;
  previewImageUrl: string | null;
  onFileSelected: (file: File) => void;
  onModelSelect: (url: string) => void;
}

// Right-side sidebar: a mode-toggle box on top (blurred backdrop behind it - live camera feed,
// selected model, or the shopper's own upload, whichever is current) plus a scrollable list of
// preset model photos below. Mirrors the reference's TryOnThumbnails.tsx.
const TryOnSidebar = ({
  mode,
  onModeChange,
  cameraVideoRef,
  cameraReady,
  previewImageUrl,
  onFileSelected,
  onModelSelect,
}: ITryOnSidebarProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onFileSelected(file);
  };

  return (
    <div className="flex w-28 shrink-0 flex-col gap-3 sm:w-32">
      <div className="border-primary/10 bg-secondary-invert relative aspect-square shrink-0 overflow-hidden rounded-2xl border">
        {mode === 'live' && cameraReady && (
          <video
            ref={cameraVideoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 size-full scale-x-[-1] object-cover blur-[2px]"
          />
        )}
        {mode === 'upload' && previewImageUrl && (
          <img
            src={previewImageUrl}
            alt=""
            className="absolute inset-0 size-full object-cover blur-sm"
          />
        )}

        <div className="bg-primary-invert/20 absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="border-primary/20 bg-secondary-invert flex h-8 w-16 shrink-0 items-center overflow-hidden rounded-lg border">
            <button
              type="button"
              aria-label="Try it live"
              onClick={() => {
                onModeChange('live');
              }}
              className={`flex h-full flex-1 cursor-pointer items-center justify-center transition-colors duration-300 ${
                mode === 'live' ? 'bg-sky-blue-burst text-white' : 'text-secondary'
              }`}
            >
              <Icon icon="solar:camera-linear" className="size-4" />
            </button>
            <label
              htmlFor="tryon-sidebar-upload"
              onClick={() => {
                onModeChange('upload');
              }}
              className={`flex h-full flex-1 cursor-pointer items-center justify-center transition-colors duration-300 ${
                mode === 'upload' ? 'bg-sky-blue-burst text-white' : 'text-secondary'
              }`}
            >
              <Icon icon="solar:gallery-send-linear" className="size-4" />
            </label>
          </div>
          <span className="text-[10px] font-medium text-white drop-shadow">
            {mode === 'live' ? 'Camera' : 'Upload'}
          </span>
        </div>

        <input
          id="tryon-sidebar-upload"
          type="file"
          accept={IMAGE_MIMES.join(', ')}
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {TRYON_MODEL_IMAGES.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => {
              onModelSelect(url);
            }}
            className={`aspect-square shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-colors duration-300 ${
              mode === 'upload' && previewImageUrl === url
                ? 'border-primary'
                : 'border-primary/10 hover:border-primary/30'
            }`}
          >
            <img src={url} alt="Model" className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TryOnSidebar;
