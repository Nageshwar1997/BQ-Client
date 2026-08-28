import { Icon } from '@iconify/react';
import { type RefObject } from 'react';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { TRYON_MODE_OPTIONS } from '@/constants/tryon-constants';

import TryOnModelList from './TryOnModelList';

interface ITryOnSidebarProps {
  mode: 'live' | 'upload';
  // Always resets the flow back to that mode's instructions screen (even re-clicking the
  // already-active mode) - matches the reference's onCameraClick/onUploadClick, and doubles as
  // a "start over"/"pick a different photo" action. The actual camera-start/file-picker trigger
  // lives on the instructions screen from there, not here.
  onModeToggle: (mode: 'live' | 'upload') => void;
  cameraVideoRef: RefObject<HTMLVideoElement | null>;
  cameraReady: boolean;
  previewImageUrl: string | null;
  onModelSelect: (url: string) => void;
  // Picking a different model before the current one has even finished loading is a no-op at
  // best - disable just the model list (mode-toggle stays clickable, so switching away or
  // retrying is always possible).
  modelsDisabled?: boolean;
}

// Right-side sidebar: the mode-toggle box + Divider stay fixed at the top (not part of any
// scroll region at all - they're a plain sibling above it, not a sticky element sharing the
// scroll container), and only the preset model photos below scroll.
const TryOnSidebar = ({
  mode,
  onModeToggle,
  cameraVideoRef,
  cameraReady,
  previewImageUrl,
  onModelSelect,
  modelsDisabled = false,
}: ITryOnSidebarProps) => {
  return (
    // `min-h-0` lets this shrink below its content's natural height instead of pushing the
    // modal taller - required for the models list below to actually clip/scroll rather than
    // just growing.
    <div className="flex min-h-0 w-28 flex-1 flex-col gap-3 sm:w-32">
      <div className="border-primary/10 bg-secondary-invert relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl border">
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
            alt="Model preview"
            className="absolute inset-0 size-full object-cover blur-sm"
          />
        )}
        <div className="bg-primary-invert/20 absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="border-primary/20 bg-secondary-invert flex h-8 w-16 shrink-0 items-center overflow-hidden rounded-lg border">
            {TRYON_MODE_OPTIONS.map((option) => (
              <button
                key={option.mode}
                type="button"
                aria-label={option.title}
                onClick={() => {
                  onModeToggle(option.mode);
                }}
                className={`flex size-full cursor-pointer items-center justify-center p-1.5 ${
                  option.mode === mode ? 'bg-sky-blue-burst text-white' : 'text-secondary'
                }`}
              >
                <Icon icon={option.icon} className="size-full" />
              </button>
            ))}
          </div>
          <GradientText
            type="silver"
            text={mode === 'live' ? 'Camera' : 'Upload'}
            className="text-xs font-semibold"
          />
        </div>
      </div>
      <Divider className="shrink-0" />
      <TryOnModelList
        direction="vertical"
        mode={mode}
        previewImageUrl={previewImageUrl}
        onModelSelect={onModelSelect}
        disabled={modelsDisabled}
      />
    </div>
  );
};

export default TryOnSidebar;
