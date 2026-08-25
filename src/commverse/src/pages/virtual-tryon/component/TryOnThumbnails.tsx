import type { RefObject } from 'react';
import { Icon } from '@iconify/react';
import Divider from '../../../components/Divider';
import type { TTryOnMode, TTryOnState } from '../../../types';
import { COSMETIC_MODEL_IMAGES } from '../../../constants';

const TryOnThumbnails = ({
  state,
  thumbnailVideoRef,
  thumbnailImageUrl,
  watchedPhotoUpload,
  tryOnMode,
  onCameraClick,
  onUploadClick,
  onModelSelect,
  step,
}: {
  state: TTryOnState;
  thumbnailVideoRef: RefObject<HTMLVideoElement | null>;
  thumbnailImageUrl?: string | null;
  tryOnMode: TTryOnMode;
  watchedPhotoUpload: boolean;
  onUploadClick: () => void;
  onCameraClick: () => void;
  onModelSelect: (url: string) => void;
  step: string;
}) => {
  if (!['preview', 'tryon'].includes(step) && !step) return null;
  return (
    <div className="flex h-full max-h-full min-h-0 flex-col overflow-hidden">
      <div className="sticky top-0 z-2 flex shrink-0 flex-col gap-3 pb-3">
        <div
          className={`hover:border-neutral-gray-900 border-brand bg-neutral-gray-150 relative size-30 shrink-0 overflow-hidden rounded-2xl border-[1.5px] ${!COSMETIC_MODEL_IMAGES.includes(thumbnailImageUrl || '') ? 'border-brand' : 'border-neutral-gray-300'}`}
        >
          {state.imageReady && thumbnailImageUrl ? (
            <>
              <img
                src={thumbnailImageUrl}
                alt="Thumbnail"
                className="size-full object-cover"
              />
              <button
                className="bg-overlay-dark absolute top-2 right-2 z-1 flex size-8 cursor-pointer items-center justify-center rounded-lg"
                onClick={onUploadClick}
              >
                <Icon
                  icon="lucide:x"
                  className="text-neutral-gray-100 size-5"
                />
              </button>
            </>
          ) : tryOnMode === 'live' && state.cameraReady ? (
            <video
              ref={thumbnailVideoRef}
              autoPlay
              muted
              playsInline
              className="size-full scale-x-[-1] object-cover object-center blur-xs"
            />
          ) : null}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {!thumbnailImageUrl && (
              <div className="border-neutral-gray-400 bg-neutral-gray-300 flex h-7.75 w-15.5 items-center justify-center rounded-lg border">
                {/* CAMERA */}
                <button
                  type="button"
                  className={`flex h-full w-full cursor-pointer items-center justify-center rounded-l-[7px] [&>svg]:size-4 ${watchedPhotoUpload ? 'text-neutral-gray-900' : 'bg-neutral-gray-800 text-neutral-gray-100'}`}
                  onClick={onCameraClick}
                >
                  <Icon icon="solar:camera-linear" />
                </button>
                {/* UPLOAD */}
                <button
                  type="button"
                  className={`flex h-full w-full cursor-pointer items-center justify-center rounded-r-[7px] [&>svg]:size-4 ${watchedPhotoUpload ? 'bg-neutral-gray-800 text-neutral-gray-100' : 'text-neutral-gray-900'}`}
                  onClick={onUploadClick}
                >
                  <Icon icon="solar:gallery-send-linear" />
                </button>
              </div>
            )}
            {/* MODE LABEL */}
            {state.cameraReady && tryOnMode === 'live' ? (
              <span className="text-neutral-gray-100 font-google-sans text-xs/normal font-medium">
                Camera
              </span>
            ) : (
              <span className="text-neutral-gray-700 font-metropolis text-xs/[15px] font-medium underline decoration-solid decoration-[8%] underline-offset-auto">
                {!thumbnailImageUrl && tryOnMode === 'upload'
                  ? 'Upload'
                  : !state.cameraReady && tryOnMode === 'live'
                    ? 'Camera'
                    : ''}
              </span>
            )}
          </div>
        </div>
        <Divider className="border-neutral-gray-200! border-t!" />
      </div>
      <div className="no-scrollbar flex min-h-0 flex-1 snap-y flex-col gap-3 overflow-y-auto scroll-smooth">
        {COSMETIC_MODEL_IMAGES.map((url, idx) => (
          <button
            type="button"
            key={idx}
            className={`hover:border-neutral-gray-900 size-30 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-[1.5px] ${
              thumbnailImageUrl === url
                ? 'border-brand'
                : 'border-neutral-gray-300'
            }`}
            onClick={() => onModelSelect(url)}
          >
            <img
              src={url}
              alt={`Image-${idx}`}
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TryOnThumbnails;
