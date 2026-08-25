import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import ToastCard from '../../../components/AlertCards/ToastCard';
import { enqueueFashionVton } from '../../../services/onboarding/onboardingApi';
import {
  getGeneratedMediaById,
  waitForGeneratedMediaCompletion,
} from '../../../services/ai-creative-studio';
import { useGenerateFashionVton } from '../../../services/fashion-vton';
import { Versa } from '../../../icons';
import type { ToastCardProps } from '../../../types';
import TryOn, { type TryOnHandle } from '../../fashion-tryon/components/TryOn';
import type { IFashionTryOnState } from '../../fashion-tryon/class';
import { urlToImageFile } from '../../../lib/utils';

type GarmentType = 'top' | 'bottom' | 'dress';
type PersonImageSource = File | string;

const DEFAULT_CAPTURE_COUNTDOWN_SECONDS = 5;

type BrandFashionTryOnModalProps = {
  open: boolean;
  onClose: () => void;
  productName: string;
  garmentImage: string;
  garmentType: GarmentType;
};

const MODEL_IMAGES = [
  '/assets/images/try-on/fashion/male1.png',
  '/assets/images/try-on/fashion/female1.png',
  '/assets/images/try-on/fashion/male2.png',
  '/assets/images/try-on/fashion/female2.png',
  '/assets/images/try-on/fashion/male3.png',
  '/assets/images/try-on/fashion/female3.png',
  '/assets/images/try-on/fashion/male4.png',
  '/assets/images/try-on/fashion/female4.png',
];

const getQueueDescription = (
  queuePosition?: number,
  estimatedWaitSec?: number
) => {
  const parsedQueuePosition = Number(queuePosition);
  const parsedEstimatedWaitSec = Number(estimatedWaitSec);
  const safeQueuePosition = Number.isFinite(parsedQueuePosition)
    ? parsedQueuePosition
    : 0;
  const safeEstimatedWaitSec = Number.isFinite(parsedEstimatedWaitSec)
    ? parsedEstimatedWaitSec
    : 0;

  const queueText =
    safeQueuePosition <= 0
      ? 'Your request is next in queue.'
      : `Queue position: ${safeQueuePosition}.`;

  const waitText =
    safeEstimatedWaitSec <= 0
      ? 'Processing should begin shortly.'
      : `Estimated wait: ${Math.ceil(safeEstimatedWaitSec)} sec.`;

  return `${queueText} ${waitText} We will update this once ready.`;
};

const toImageFile = async (
  imageSource: PersonImageSource,
  filename: string
) => {
  if (imageSource instanceof File) {
    if (!imageSource.type.startsWith('image/')) {
      throw new Error(`Invalid ${filename} format.`);
    }
    return imageSource;
  }

  if (typeof imageSource !== 'string' || !imageSource.trim()) {
    throw new Error(`Failed to load ${filename}.`);
  }
  return urlToImageFile(imageSource, filename);
};

const fetchGeneratedMediaResultUrlWithRetry = async (
  generatedMediaId: string,
  options?: {
    maxAttempts?: number;
    intervalMs?: number;
  }
) => {
  const maxAttempts = options?.maxAttempts ?? 8;
  const intervalMs = options?.intervalMs ?? 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const media = await getGeneratedMediaById(generatedMediaId);
      const resultUrl = media.outputs.find((output) => output.url)?.url;
      if (resultUrl) return resultUrl;
    } catch {
      // Keep retrying because completion can lag behind notifications.
    }

    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, intervalMs);
      });
    }
  }

  return null;
};

const BrandFashionTryOnModal = ({
  open,
  onClose,
  productName,
  garmentImage,
  garmentType,
}: BrandFashionTryOnModalProps) => {
  const generateFashionVtonMutation = useGenerateFashionVton();
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement | null>(null);
  const tryOnRef = useRef<TryOnHandle | null>(null);
  const hasStartedInitialCountdownRef = useRef(false);
  const shouldRestartCountdownRef = useRef(false);

  const [selectedPersonImage, setSelectedPersonImage] =
    useState<PersonImageSource | null>(null);
  const [selectedPersonImageObjectUrl, setSelectedPersonImageObjectUrl] =
    useState<string | null>(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [tryOnState, setTryOnState] = useState<IFashionTryOnState>({
    cameraReady: false,
    tryOnStarted: false,
  });

  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastIndex, setToastIndex] = useState(0);

  const selectedPersonPreviewUrl = useMemo(
    () =>
      selectedPersonImage instanceof File
        ? selectedPersonImageObjectUrl
        : selectedPersonImage,
    [selectedPersonImage, selectedPersonImageObjectUrl]
  );

  const previewImageUrl = useMemo(
    () => resultImageUrl ?? selectedPersonPreviewUrl,
    [resultImageUrl, selectedPersonPreviewUrl]
  );

  useEffect(() => {
    if (!(selectedPersonImage instanceof File)) {
      setSelectedPersonImageObjectUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedPersonImage);
    setSelectedPersonImageObjectUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedPersonImage]);

  const showToast = (toastProps: ToastCardProps) => {
    setToastCardProps(toastProps);
    setToastIndex((prev) => prev + 1);
  };

  const handlePersonImageSelect = (imageSource: PersonImageSource) => {
    setSelectedPersonImage(imageSource);
    setResultImageUrl(null);
    setIsCameraMode(false);
    setCountdown(null);
  };

  const handleCameraClick = () => {
    if (isGenerating) return;

    setResultImageUrl(null);
    setIsCameraMode(true);
    setCountdown(null);
    shouldRestartCountdownRef.current = true;
    hasStartedInitialCountdownRef.current = false;
  };

  const handleUploadClick = () => {
    if (isGenerating) return;
    galleryInputRef.current?.click();
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handlePersonImageSelect(file);
    }

    event.target.value = '';
  };

  useEffect(() => {
    if (!isCameraMode) {
      hasStartedInitialCountdownRef.current = false;
      shouldRestartCountdownRef.current = false;
      setCountdown(null);
      return;
    }

    if (!tryOnState.cameraReady) return;

    if (
      !shouldRestartCountdownRef.current &&
      hasStartedInitialCountdownRef.current
    ) {
      return;
    }

    setCountdown(DEFAULT_CAPTURE_COUNTDOWN_SECONDS);
    tryOnRef.current?.requestCaptureWithCountdown(
      DEFAULT_CAPTURE_COUNTDOWN_SECONDS
    );

    hasStartedInitialCountdownRef.current = true;
    shouldRestartCountdownRef.current = false;
  }, [isCameraMode, tryOnState.cameraReady]);

  useEffect(() => {
    if (!isCameraMode || !tryOnState.cameraReady) {
      if (thumbnailVideoRef.current) {
        thumbnailVideoRef.current.srcObject = null;
      }
      return;
    }

    const stream = tryOnRef.current?.getStream?.();
    if (stream && thumbnailVideoRef.current) {
      thumbnailVideoRef.current.srcObject = stream;
    }
  }, [isCameraMode, tryOnState.cameraReady]);

  useEffect(() => {
    return () => {
      tryOnRef.current?.stopCamera?.();
      if (thumbnailVideoRef.current) {
        thumbnailVideoRef.current.srcObject = null;
      }
    };
  }, []);

  const handleGenerate = async () => {
    if (!selectedPersonImage || isGenerating) return;

    if (!garmentImage) {
      showToast({
        type: 'error',
        title: 'Garment image missing',
        description: 'Please select a garment image before generating.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const personImage = await toImageFile(
        selectedPersonImage,
        'person_image'
      );
      const garmentImageFile = await toImageFile(garmentImage, 'garment_image');

      const formData = new FormData();
      formData.append('person_image', personImage);
      formData.append('garment_image', garmentImageFile);
      formData.append('garment_type', garmentType);

      const queueData = await enqueueFashionVton(
        generateFashionVtonMutation,
        formData
      );

      if (!queueData.generatedMediaId.trim()) {
        throw new Error('Invalid queue response from VTON service.');
      }

      showToast({
        type: 'loading',
        title: 'Request queued',
        description: getQueueDescription(
          queueData.queuePosition,
          queueData.estimatedWaitSec
        ),
      });

      const completedMedia = await waitForGeneratedMediaCompletion(
        queueData.generatedMediaId
      );

      let generatedUrl =
        completedMedia.outputs.find((output) => output.url)?.url ?? null;

      if (!generatedUrl) {
        generatedUrl = await fetchGeneratedMediaResultUrlWithRetry(
          queueData.generatedMediaId
        );
      }

      if (!generatedUrl) {
        showToast({
          type: 'warning',
          title: 'No result generated',
          description: 'VTON did not return an output image. Please retry.',
        });
        return;
      }

      setResultImageUrl(generatedUrl);
      setIsCameraMode(false);
      setCountdown(null);

      showToast({
        type: 'success',
        title: 'Generated successfully',
        description: 'Try-on image is ready.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Generation failed',
        description:
          error instanceof Error
            ? error.message
            : 'Unable to generate try-on image.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        if (isGenerating) return;
        onClose();
      }}
      closeOnOutsideClick={false}
      className="z-100001 bg-black/10! [&>div]:h-[min(790px,90vh)] [&>div]:w-[min(1280px,95vw)] [&>div]:max-w-none [&>div]:overflow-hidden [&>div]:rounded-[24px]"
    >
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <div className="bg-neutral-gray-100 flex h-full w-full flex-col">
        <div className="flex items-center justify-between gap-3 px-8 pt-6">
          <h2 className="mt-4 grow truncate text-xl leading-6 font-bold text-[#18181A]">
            {productName}
          </h2>
          <Button
            variant="secondary"
            content="Close"
            size="sm"
            className="h-10! w-fit! px-4!"
            disabled={isGenerating}
            onClick={() => {
              if (isGenerating) return;
              onClose();
            }}
          />
        </div>

        <div className="mx-8 mt-3 mb-6 flex min-h-0 flex-1 gap-3 overflow-hidden">
          <div className="border-neutral-gray-300 relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[20px] border-2 bg-[#EDEFF4]">
            {isCameraMode ? (
              <>
                {countdown ? (
                  <div className="text-neutral-gray-100 pointer-events-none absolute z-10 flex h-full w-full flex-col items-center justify-center text-7xl">
                    <span>Hold still</span>
                    <span>{countdown}</span>
                  </div>
                ) : null}
                <TryOn
                  ref={tryOnRef}
                  onCapture={(file) => {
                    handlePersonImageSelect(file);
                  }}
                  onError={(message) => {
                    if (!message || message === 'Initializing...') return;

                    const normalized = message.toLowerCase();
                    const isCameraAccessIssue =
                      normalized.includes('access denied') ||
                      normalized.includes('unavailable');

                    if (!isCameraAccessIssue) return;

                    setIsCameraMode(false);
                    setCountdown(null);
                    showToast({
                      type: 'error',
                      title: 'Camera unavailable',
                      description:
                        'Unable to access camera. Please check permissions and retry.',
                    });
                  }}
                  onCountdown={(value) => setCountdown(value)}
                  facingMode="user"
                  onStateChange={setTryOnState}
                />
              </>
            ) : previewImageUrl ? (
              <img
                src={previewImageUrl}
                alt="Try-on preview"
                className="h-full w-full object-contain"
              />
            ) : (
              <p className="text-sm text-[#7A7C87]">
                Select a model to start try-on
              </p>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Versa />}
                content={isGenerating ? 'Generating...' : 'Generate'}
                disabled={!selectedPersonImage || isCameraMode || isGenerating}
                isLoading={isGenerating}
                className="h-10! min-w-[220px] rounded-[10px]! bg-[#0E35FF]! leading-6! enabled:hover:bg-[#0A2DE0]! enabled:active:bg-[#0928C7]!"
                onClick={handleGenerate}
              />
            </div>
          </div>

          <div className="no-scrollbar flex w-[118px] flex-col gap-3">
            <div className="border-brand relative flex h-[120px] min-h-[120px] w-[118px] items-center justify-center overflow-hidden rounded-[18px] border-[1.5px] bg-[#D9DCE5]">
              {isCameraMode && tryOnState.cameraReady ? (
                <video
                  ref={thumbnailVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full scale-x-[-1] object-cover blur-sm"
                />
              ) : selectedPersonPreviewUrl ? (
                <>
                  <img
                    src={selectedPersonPreviewUrl}
                    alt="Selected model"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-[18px] bg-black/25 backdrop-blur-sm" />
                </>
              ) : null}
              <div className="relative z-1 flex flex-col items-center gap-1 text-white">
                <div className="flex items-center gap-1 rounded-[8px] border border-white/40 bg-black/20 px-2 py-1">
                  <button
                    type="button"
                    className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleCameraClick}
                    disabled={isGenerating}
                  >
                    <Icon icon="solar:camera-linear" className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleUploadClick}
                    disabled={isGenerating}
                  >
                    <Icon icon="solar:gallery-send-linear" className="size-4" />
                  </button>
                </div>
                <span className="text-xs font-semibold">Camera</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto">
              {MODEL_IMAGES.map((modelImage) => {
                const isSelected =
                  selectedPersonImage instanceof File
                    ? false
                    : modelImage === selectedPersonImage;

                return (
                  <button
                    key={modelImage}
                    type="button"
                    onClick={() => {
                      handlePersonImageSelect(modelImage);
                    }}
                    disabled={isGenerating}
                    className={`h-[120px] min-h-[120px] w-[118px] cursor-pointer overflow-hidden rounded-[18px] border-[1.5px] transition-all disabled:cursor-not-allowed disabled:opacity-60 ${isSelected ? 'border-brand' : 'border-[#DADCE5] hover:border-[#8E90A0]'}`}
                  >
                    <img
                      src={modelImage}
                      alt="Model option"
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {toastCardProps ? (
        <ToastCard key={toastIndex} {...toastCardProps} />
      ) : null}
    </Modal>
  );
};

export default BrandFashionTryOnModal;
