import { useEffect, useMemo, type RefObject } from 'react';
import { Icon } from '@iconify/react';
import Divider from '../../../components/Divider';
import type { TFashionTryOnForm, TTryOnMode } from '../../../types';
import type { IFashionTryOnState } from '../class';
import { useFormContext, useWatch } from 'react-hook-form';
import { getResolvedImageUrl } from '../../virtual-tryon/utils';

const MODEL_IMAGES = [
  '/assets/images/try-on/fashion/male1.png',
  '/assets/images/try-on/fashion/female1.png',
  '/assets/images/try-on/fashion/male2.png',
  '/assets/images/try-on/fashion/female2.png',
  '/assets/images/try-on/fashion/male3.png',
  '/assets/images/try-on/fashion/female3.png',
  '/assets/images/try-on/fashion/male4.png',
  '/assets/images/try-on/fashion/female4.png',
  '/assets/images/try-on/fashion/male5.png',
  '/assets/images/try-on/fashion/female5.png',
  '/assets/images/try-on/fashion/male6.png',
  '/assets/images/try-on/fashion/female6.png',
  '/assets/images/try-on/fashion/male7.png',
  '/assets/images/try-on/fashion/female7.png',
  '/assets/images/try-on/fashion/male8.png',
  '/assets/images/try-on/fashion/female8.png',
  '/assets/images/try-on/fashion/female9.png',
];

type TImageSource = File | string;
const EMPTY_MODEL_PHOTOS: TFashionTryOnForm['modelPhotos'] = [];

const FashionTryOnThumbnails = ({
  state,
  thumbnailVideoRef,
  thumbnailImageUrl,
  selectedImageSource,
  watchedPhotoUpload,
  tryOnMode,
  onCameraClick,
  onUploadClick,
  onModelSelect,
}: {
  state: IFashionTryOnState;
  thumbnailVideoRef: RefObject<HTMLVideoElement | null>;
  thumbnailImageUrl?: string | null;
  selectedImageSource?: TImageSource | null;
  tryOnMode: TTryOnMode;
  watchedPhotoUpload: boolean;
  onUploadClick: () => void;
  onCameraClick: () => void;
  onModelSelect: (source: TImageSource) => void;
}) => {
  const { control } = useFormContext<TFashionTryOnForm>();
  const modelPhotos =
    useWatch({ control, name: 'modelPhotos' }) ?? EMPTY_MODEL_PHOTOS;

  const prevThumbnailImageUrl = getResolvedImageUrl(thumbnailImageUrl);

  const modelPhotoPreviews = useMemo(() => {
    const objectUrls: string[] = [];
    const previews = modelPhotos.map((photo) => {
      if (photo?.value instanceof File) {
        const previewUrl = URL.createObjectURL(photo?.value);
        objectUrls.push(previewUrl);
        return previewUrl;
      }

      return photo?.value ?? '';
    });

    return { previews, objectUrls };
  }, [modelPhotos]);

  useEffect(() => {
    return () => {
      modelPhotoPreviews.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [modelPhotoPreviews.objectUrls]);

  return (
    <div className="no-scrollbar flex h-full max-h-full min-h-0 snap-y flex-col gap-3 overflow-hidden">
      <>
        <div
          className={`hover:border-neutral-gray-900 border-brand bg-neutral-gray-150 relative size-30 shrink-0 overflow-hidden rounded-2xl border-[1.5px] ${!MODEL_IMAGES.includes(thumbnailImageUrl || '') ? 'border-brand' : 'border-neutral-gray-300'}`}
        >
          {prevThumbnailImageUrl ? (
            <>
              <img
                src={prevThumbnailImageUrl}
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
      </>
      <div className="flex flex-col gap-3 overflow-y-scroll scroll-smooth">
        {modelPhotos.map((photo, idx) => {
          const modelSource = photo?.value;
          const isSelected =
            modelSource instanceof File && selectedImageSource instanceof File
              ? modelSource === selectedImageSource
              : typeof modelSource === 'string' &&
                  typeof selectedImageSource === 'string'
                ? modelSource === selectedImageSource
                : false;

          return (
            <button
              type="button"
              key={idx}
              className={`hover:border-neutral-gray-900 size-30 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-[1.5px] ${
                isSelected ? 'border-brand' : 'border-neutral-gray-300'
              }`}
              onClick={() => {
                if (!modelSource) return;
                onModelSelect(modelSource);
              }}
            >
              <img
                src={getResolvedImageUrl(modelPhotoPreviews.previews[idx])}
                alt={`Image-${idx}`}
                className="size-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FashionTryOnThumbnails;
