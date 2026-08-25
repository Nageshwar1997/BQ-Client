import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import FashionTryOnSubHeader from './FashionTryOnSubHeader';
import useQueryParams from '../../../hooks/useQueryParams';
import {
  AllowCameraScreen,
  PhotoUploadScreen,
  SelectionScreen,
  ShowPreviewScreen,
} from './FashionScreens';
import FashionTryOnFooter from './FashionTryOnFooter';
import FashionTryOnThumbnails from './FashionTryOnThumbnails';
import Button from '../../../components/Button';
import type {
  TFashionTryOnForm,
  ToastCardProps,
  TTryOnMode,
} from '../../../types';
import { type TryOnHandle } from './TryOn';
import TryOn from './TryOn';
import type { IFashionTryOnState } from '../class';
import { TryOnControls } from '../../virtual-tryon/component/Screens';
import { Versa } from '../../../icons';
import { Icon } from '@iconify/react';
import type z from 'zod';
import type { FashionProductSchema } from './FashionSchema';
import ToastCard from '../../../components/AlertCards/ToastCard';
import {
  useCheckVtonHealth,
  useGenerateFashionVton,
} from '../../../services/fashion-vton';
import { VITE_S3_BASE_URL } from '../../../env';
import { FASHION_DEFAULT_MODELS } from '../../../constants';
import {
  toRecord,
  waitForGeneratedMediaCompletion,
} from '../../../services/ai-creative-studio';
import { privateApiClient } from '../../../services/api';
import { urlToImageFile } from '../../../lib/utils';

type TFashionProductSchema = z.infer<typeof FashionProductSchema>;
type TImageSource = File | string;
const DEFAULT_CAPTURE_COUNTDOWN_SECONDS = 5;
const isDefaultModelPhotoSet = (photos: TFashionTryOnForm['modelPhotos']) => {
  if (photos.length !== FASHION_DEFAULT_MODELS.length) return false;

  return photos.every((photo, idx) => {
    const value = photo?.value;
    const defaultValue = FASHION_DEFAULT_MODELS[idx]?.value;
    return typeof value === 'string' && value === defaultValue;
  });
};

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

const readUrlField = (value: unknown): string | null => {
  const record = toRecord(value);
  const candidateKeys = [
    'resultUrl',
    'resultURL',
    'result_url',
    'outputUrl',
    'outputURL',
    'output_url',
    'generatedUrl',
    'generatedURL',
    'generated_url',
    'imageUrl',
    'imageURL',
    'image_url',
    'url',
  ];

  for (const key of candidateKeys) {
    const candidate = record[key];
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }

  return null;
};

const readFromOutputs = (value: unknown): string | null => {
  if (!Array.isArray(value)) return null;

  for (const output of value) {
    const candidate = readUrlField(output);
    if (candidate) return candidate;
  }

  return null;
};

const extractGeneratedMediaResultUrl = (value: unknown): string | null => {
  const root = toRecord(value);
  const level1 = toRecord(root.data);
  const level2 = toRecord(level1.data);

  const directLevels = [root, level1, level2];
  for (const level of directLevels) {
    const directUrl = readUrlField(level);
    if (directUrl) return directUrl;

    const resultUrl = readUrlField(level.result);
    if (resultUrl) return resultUrl;

    const outputUrl = readUrlField(level.output);
    if (outputUrl) return outputUrl;
  }

  const outputLevels = [root.outputs, level1.outputs, level2.outputs];
  for (const outputLevel of outputLevels) {
    const outputUrl = readFromOutputs(outputLevel);
    if (outputUrl) return outputUrl;
  }

  return null;
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
      const mediaResponse = await privateApiClient.get(
        `/generated-media/${generatedMediaId}`
      );
      const resultUrl = extractGeneratedMediaResultUrl(mediaResponse.data);
      if (resultUrl) return resultUrl;
    } catch {
      // Keep retrying until max attempts because completion/consistency can lag.
    }

    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, intervalMs);
      });
    }
  }

  return null;
};

const FashionMainBody = () => {
  const { queryParams, updateParams } = useQueryParams();
  const checkVtonHealthQuery = useCheckVtonHealth();
  const generateFashionVtonQuery = useGenerateFashionVton();

  /* ================= REFS ================= */

  const tryOnRef = useRef<TryOnHandle | null>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement | null>(null);
  const shouldRestartCountdownRef = useRef(false);
  const hasStartedInitialCountdownRef = useRef(false);
  const previousVisibleCountRef = useRef(0);

  /* ================= STATE ================= */

  const [countdown, setCountdown] = useState<number | null>(null);
  const [tryOnState, setTryOnState] = useState<IFashionTryOnState>({
    cameraReady: false,
    tryOnStarted: false,
  });
  const [selectedImages, setSelectedImages] = useState<{
    cloth: TFashionProductSchema | null;
    uploadedImage: TImageSource | null;
    resultImage: string | null;
  } | null>(null);
  const [uploadedImageObjectUrl, setUploadedImageObjectUrl] = useState<
    string | null
  >(null);
  const [isCompareActive, setIsCompareActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastIndex, setToastIndex] = useState(0);

  /* ================= FORM ================= */

  const { control, setValue } = useFormContext<TFashionTryOnForm>();
  const watchedProducts = useWatch({ control, name: 'products' }) ?? [];
  const watchedCompare = useWatch({ control, name: 'compare' });
  const watchedDownloadable = useWatch({ control, name: 'downloadable' });
  const watchedPhotoUpload = useWatch({ control, name: 'photoUpload' });
  const watchedBuyNowEnabled = useWatch({ control, name: 'buyNowEnabled' });
  const watchedCta = useWatch({ control, name: 'cta' });
  const watchedGarmentType = useWatch({ control, name: 'type' });
  const watchedModelPhotos = useWatch({ control, name: 'modelPhotos' }) ?? [];
  const visibleIds = useWatch({ control, name: 'visibleIds' }) ?? [];

  const hasGeneratedResult = Boolean(selectedImages?.resultImage);
  const primaryCta = hasGeneratedResult
    ? watchedCta?.retry
    : watchedCta?.['try-on'];
  const buyNowCta = watchedCta?.['buy-now'];
  const selectedProductByQueryId =
    (watchedProducts as TFashionProductSchema[]).find(
      (item) => item?._id === queryParams.id
    ) ?? null;
  const buyNowLink =
    selectedImages?.cloth?.url ?? selectedProductByQueryId?.url ?? '';

  const productsToShow = (watchedProducts as TFashionProductSchema[]).filter(
    (product) => visibleIds.includes(product?._id ?? '')
  );

  /* ================= MODE ================= */

  const tryOnMode: TTryOnMode = watchedPhotoUpload ? 'upload' : 'live';

  const getResolvedImageUrl = (rawUrl?: string | null) => {
    if (!rawUrl) return undefined;
    const normalizedUrl = rawUrl.trim();
    if (!normalizedUrl) return undefined;

    if (
      normalizedUrl.startsWith('blob:') ||
      normalizedUrl.startsWith('data:') ||
      normalizedUrl.startsWith('http://') ||
      normalizedUrl.startsWith('https://')
    ) {
      return normalizedUrl;
    }

    if (normalizedUrl.startsWith('/assets/')) {
      return normalizedUrl;
    }

    return `${VITE_S3_BASE_URL}/${normalizedUrl.replace(/^\/+/, '')}`;
  };

  const uploadedImageSrc =
    selectedImages?.uploadedImage instanceof File
      ? (uploadedImageObjectUrl ?? undefined)
      : getResolvedImageUrl(
          typeof selectedImages?.uploadedImage === 'string'
            ? selectedImages.uploadedImage
            : undefined
        );
  const generatedImageSrc = getResolvedImageUrl(selectedImages?.resultImage);
  const resultImageSrc = isCompareActive
    ? uploadedImageSrc
    : (generatedImageSrc ?? uploadedImageSrc);

  /* ================= RESET ================= */

  const handleReset = async () => {
    setSelectedImages(null);
    setCountdown(null);
    shouldRestartCountdownRef.current = true;
    hasStartedInitialCountdownRef.current = false;
    await tryOnRef.current?.restartCamera?.();
  };

  const handleCapture = async () => {
    if (!resultImageSrc) {
      tryOnRef.current?.takeSnapshot?.();
      return;
    }

    const fallbackDownload = () => {
      const anchor = document.createElement('a');
      anchor.href = resultImageSrc;
      anchor.download = `fashion-tryon-${Date.now()}.png`;
      anchor.click();
    };

    try {
      const file = await urlToImageFile(
        resultImageSrc,
        `fashion-tryon-${Date.now()}`
      );
      const objectUrl = URL.createObjectURL(file);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = file.name;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      fallbackDownload();
    }
  };

  const showToast = (toastProps: ToastCardProps) => {
    setToastCardProps(toastProps);
    setToastIndex((prev) => prev + 1);
  };

  const toImageFile = async (imageSource: TImageSource, filename: string) => {
    if (imageSource instanceof File) {
      if (!imageSource.type.startsWith('image/')) {
        throw new Error(
          `Invalid ${filename} format. Please select a valid image file.`
        );
      }

      return imageSource;
    }

    const resolvedImageUrl = getResolvedImageUrl(imageSource) ?? imageSource;
    if (typeof resolvedImageUrl !== 'string' || !resolvedImageUrl.trim()) {
      throw new Error(`Failed to load ${filename} image`);
    }
    return urlToImageFile(resolvedImageUrl, filename);
  };

  const handleGenerate = async () => {
    if (isGenerating) return;

    const selectedClothId = selectedImages?.cloth?._id ?? null;
    const activeSelectedCloth =
      (productsToShow as TFashionProductSchema[]).find(
        (product) => product?._id === selectedClothId
      ) ?? null;
    const garmentImageSource = activeSelectedCloth?.image ?? null;
    const personImageSource = selectedImages?.uploadedImage ?? null;
    const garmentType = watchedGarmentType ?? null;

    if (!activeSelectedCloth || !garmentImageSource) {
      showToast({
        type: 'error',
        title: 'Garment image missing',
        description:
          'Select a product first so a garment image can be sent to VTON.',
      });
      return;
    }

    if (!personImageSource) {
      showToast({
        type: 'error',
        title: 'Person image missing',
        description:
          'Capture or upload a person image before generating the try-on.',
      });
      return;
    }

    if (!garmentType) {
      showToast({
        type: 'error',
        title: 'Garment type missing',
        description:
          'Select garment type as Top, Bottom, or Dress before generating.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      let healthResponse: { success?: boolean; message?: string } | undefined;
      try {
        healthResponse = await checkVtonHealthQuery.mutateAsync();
      } catch {
        showToast({
          type: 'error',
          title: 'VTON service is unavailable',
          description: 'Health check failed. Please try again later.',
        });
        return;
      }

      const isHealthOk = healthResponse?.success ?? false;

      if (!isHealthOk) {
        showToast({
          type: 'error',
          title: 'VTON service is unavailable',
          description: 'Service health is not OK. Please try again later.',
        });
        return;
      }

      const personFile = await toImageFile(personImageSource, 'person_image');
      const garmentFile = await toImageFile(
        garmentImageSource,
        'garment_image'
      );

      const formData = new FormData();
      formData.append('person_image', personFile);
      formData.append('garment_image', garmentFile);
      formData.append('garment_type', garmentType);

      const vtonResponse = await generateFashionVtonQuery.mutateAsync(formData);

      const queueData = vtonResponse?.data as
        | {
            generatedMediaId?: string;
            queuePosition?: number;
            estimatedWaitSec?: number;
          }
        | undefined;

      const generatedMediaId = queueData?.generatedMediaId;
      if (!generatedMediaId) {
        throw new Error('Invalid queue response from VTON service.');
      }

      showToast({
        type: 'loading',
        title: 'Request queued',
        description: getQueueDescription(
          queueData?.queuePosition,
          queueData?.estimatedWaitSec
        ),
        autoClose: false,
      });

      const completedMedia =
        await waitForGeneratedMediaCompletion(generatedMediaId);

      let resultImage =
        completedMedia.outputs.find((output) => output.url)?.url ?? null;

      if (!resultImage) {
        resultImage =
          await fetchGeneratedMediaResultUrlWithRetry(generatedMediaId);
      }

      if (!resultImage) {
        showToast({
          type: 'warning',
          title: 'No result generated',
          description: 'VTON did not return an output image. Please retry.',
        });
        return;
      }

      setSelectedImages((prev) => ({
        cloth: prev?.cloth as TFashionProductSchema,
        uploadedImage: prev?.uploadedImage ?? null,
        resultImage,
      }));
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

  /* ================= LOADER ================= */

  const showLoader =
    !selectedImages?.uploadedImage &&
    !tryOnState?.cameraReady &&
    queryParams.product === 'tryon' &&
    tryOnMode === 'live';
  const shouldRenderTryOnView =
    queryParams.product === 'tryon' ||
    (queryParams.product === 'preview' && Boolean(resultImageSrc));
  const hasResetModelPhotos =
    watchedModelPhotos.length === 0 || isDefaultModelPhotoSet(watchedModelPhotos);

  /* ================= QUERY SYNC ================= */

  useEffect(() => {
    const currentVisibleProducts = (
      watchedProducts as TFashionProductSchema[]
    ).filter((product) => visibleIds.includes(product?._id ?? ''));
    const previousVisibleCount = previousVisibleCountRef.current;
    const currentVisibleCount = currentVisibleProducts.length;

    // Auto-select only when the first visible product is added.
    if (previousVisibleCount === 0 && currentVisibleCount === 1) {
      const firstVisibleProduct = currentVisibleProducts[0];
      if (firstVisibleProduct?._id) {
        setSelectedImages((prev) => ({
          cloth: firstVisibleProduct,
          uploadedImage: prev?.uploadedImage ?? null,
          resultImage: prev?.resultImage ?? null,
        }));
        updateParams({ set: { id: firstVisibleProduct._id } });
      }
    }

    previousVisibleCountRef.current = currentVisibleCount;
  }, [visibleIds, watchedProducts, updateParams]);

  useEffect(() => {
    const isResetAllState =
      !queryParams.product &&
      !queryParams.id &&
      watchedProducts.length === 0 &&
      hasResetModelPhotos &&
      visibleIds.length === 0;

    if (!isResetAllState) return;

    setSelectedImages(null);
    setIsCompareActive(false);
  }, [
    queryParams.product,
    queryParams.id,
    watchedProducts.length,
    hasResetModelPhotos,
    visibleIds.length,
  ]);

  useEffect(() => {
    if (tryOnMode !== 'live' || queryParams.product !== 'tryon') {
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
  }, [tryOnMode, queryParams.product, tryOnState.cameraReady]);

  useEffect(() => {
    if (
      tryOnMode !== 'live' ||
      queryParams.product !== 'tryon' ||
      !tryOnState?.cameraReady
    ) {
      if (thumbnailVideoRef.current) {
        thumbnailVideoRef.current.srcObject = null;
      }
      return;
    }

    const stream = tryOnRef.current?.getStream?.();
    if (stream && thumbnailVideoRef.current) {
      thumbnailVideoRef.current.srcObject = stream;
    }
  }, [tryOnMode, queryParams.product, tryOnState?.cameraReady]);

  useEffect(() => {
    if (
      queryParams.product === 'tryon' &&
      tryOnMode === 'upload' &&
      !selectedImages?.uploadedImage
    ) {
      updateParams({ set: { product: 'preview' } });
    }
    if (isCompareActive) {
      setIsCompareActive(false);
    }
  }, [
    watchedPhotoUpload,
    selectedImages?.uploadedImage,
    tryOnMode,
    queryParams.product,
  ]);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      tryOnRef.current?.stopCamera?.();
    };
  }, []);

  useEffect(() => {
    const uploadedImage = selectedImages?.uploadedImage;

    if (!(uploadedImage instanceof File)) {
      setUploadedImageObjectUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedImage);
    setUploadedImageObjectUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImages?.uploadedImage]);

  /* ================= RENDER ================= */

  return (
    <>
      <div className="font-metropolis flex min-h-0 w-full grow flex-col gap-6 pt-6 pr-12 pb-8 pl-8">
        {/* Header */}
        <FashionTryOnSubHeader />
        {/* Body */}
        <div className="flex min-h-0 w-full grow gap-3">
          {queryParams.product !== 'select' && productsToShow.length > 0 && (
            <div className="border-neutral-gray-300 bg-neutral-gray-150 flex w-60 min-w-60 flex-col gap-2.5 rounded-3xl border-2 p-3">
              <div className="text-xl leading-6 font-bold">Products</div>
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                {productsToShow.map((item) => {
                  const isSelected = selectedImages?.cloth?._id === item._id;

                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        const nextProductView =
                          queryParams.product ?? 'preview';
                        updateParams({
                          set: { id: item._id, product: nextProductView },
                        });
                        setSelectedImages((prev) => ({
                          cloth: item,
                          uploadedImage: prev?.uploadedImage ?? null,
                          resultImage: prev?.resultImage ?? null,
                        }));
                      }}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2 ${isSelected ? 'border-neutral-gray-700 bg-neutral-gray-300' : 'hover:bg-neutral-gray-300 hover:border-neutral-gray-700 border-transparent'}`}
                    >
                      <img
                        src={
                          typeof item.image === 'string'
                            ? getResolvedImageUrl(item.image)
                            : undefined
                        }
                        className="aspect-square h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="truncate text-sm leading-[18px] font-medium">
                          {item.name || 'Untitled Product'}
                        </div>
                        <div className="text-base leading-5 font-semibold">
                          {item.price}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* MAIN TRY-ON AREA */}
          <div
            className={`bg-neutral-gray-150 font-metropolis text-neutral-gray-900 flex-1 overflow-hidden rounded-3xl border-2 ${
              !showLoader && shouldRenderTryOnView
                ? 'border-neutral-gray-300'
                : 'border-neutral-gray-500 border-dashed'
            }`}
          >
            {queryParams.product === 'preview' && !resultImageSrc ? (
              tryOnMode === 'live' ? (
                <ShowPreviewScreen
                  onClick={() => updateParams({ set: { product: 'tryon' } })}
                />
              ) : (
                <PhotoUploadScreen
                  onClick={(file) => {
                    setSelectedImages((prev) => ({
                      cloth: prev?.cloth ?? null,
                      uploadedImage: file,
                      resultImage: null,
                    }));
                    setValue('photoUpload', true);
                  }}
                />
              )
            ) : shouldRenderTryOnView ? (
              <div className="relative flex h-full w-full items-center justify-center">
                {/* TRY-ON ENGINE */}
                {!selectedImages?.uploadedImage ? (
                  <div className="relative h-full w-full">
                    {countdown && (
                      <div className="text-neutral-gray-100 pointer-events-none absolute z-10 flex h-full w-full flex-col items-center justify-center text-7xl">
                        <span>Hold still</span>
                        <span>{countdown}</span>
                      </div>
                    )}
                    <TryOn
                      ref={tryOnRef}
                      onCapture={(file) => {
                        setSelectedImages((prev) => ({
                          cloth: prev?.cloth ?? null,
                          uploadedImage: file,
                          resultImage: null,
                        }));
                      }}
                      onError={() => {}}
                      onCountdown={(val) => setCountdown(val)}
                      facingMode="user"
                      onStateChange={setTryOnState}
                    />
                  </div>
                ) : (
                  <>
                    <img
                      src={resultImageSrc}
                      className="z-1 h-full w-full object-contain"
                    />
                    <div
                      className={`absolute right-5 bottom-4 left-5 z-1 grid place-items-center gap-3 ${
                        watchedBuyNowEnabled ? 'grid-cols-2' : 'grid-cols-1'
                      }`}
                    >
                      <Button
                        content={
                          isGenerating
                            ? 'Generating...'
                            : (primaryCta?.text?.trim() ??
                              (hasGeneratedResult ? 'Retry' : 'Try On'))
                        }
                        size="sm"
                        className={`h-12! rounded-xl! disabled:opacity-90! ${watchedBuyNowEnabled ? '' : 'max-w-lg'}`}
                        leftIcon={
                          hasGeneratedResult ? (
                            <Icon
                              icon="solar:refresh-linear"
                              className="h-5 w-5"
                              style={{
                                color: primaryCta?.textColor,
                              }}
                            />
                          ) : (
                            <Versa />
                          )
                        }
                        style={{
                          backgroundColor: primaryCta?.buttonColor,
                          color: primaryCta?.textColor,
                        }}
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        isLoading={isGenerating}
                      />
                      {watchedBuyNowEnabled && (
                        <div className="w-full">
                          <Button
                            content={buyNowCta?.text?.trim() ?? 'Buy Now'}
                            variant="secondary"
                            size="sm"
                            className="h-12! rounded-xl!"
                            style={{
                              backgroundColor: buyNowCta?.buttonColor,
                              color: buyNowCta?.textColor,
                            }}
                            leftIcon={
                              <Icon
                                icon="solar:round-arrow-right-outline"
                                className="h-5 w-5"
                                style={{
                                  color: buyNowCta?.textColor,
                                }}
                              />
                            }
                            onClick={() => {
                              if (!buyNowLink) {
                                showToast({
                                  type: 'warning',
                                  title: 'Buy now link missing',
                                  description:
                                    'Add a product URL to enable Buy Now.',
                                });
                                return;
                              }

                              window.open(
                                buyNowLink,
                                '_blank',
                                'noopener,noreferrer'
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* CONTROLS */}
                {!showLoader && (
                  <TryOnControls
                    className={
                      isCompareActive ? '[&>div:last-child]:hidden' : ''
                    }
                    captureProps={
                      watchedDownloadable
                        ? {
                            onClick: handleCapture,
                          }
                        : undefined
                    }
                    compareProps={
                      watchedCompare
                        ? {
                            onClick: () => setIsCompareActive((prev) => !prev),
                            isCompareActive,
                          }
                        : undefined
                    }
                    resetProps={{
                      onClick: handleReset,
                    }}
                  />
                )}

                {/* LOADER */}
                {showLoader && (
                  <AllowCameraScreen
                    onClick={() => tryOnRef.current?.restartCamera?.()}
                  />
                )}
              </div>
            ) : (
              <SelectionScreen />
            )}
          </div>
          {/* THUMBNAILS */}
          <FashionTryOnThumbnails
            thumbnailImageUrl={uploadedImageSrc}
            selectedImageSource={selectedImages?.uploadedImage}
            thumbnailVideoRef={thumbnailVideoRef}
            watchedPhotoUpload={watchedPhotoUpload}
            tryOnMode={tryOnMode}
            state={tryOnState}
            onCameraClick={() => {
              updateParams({ set: { product: 'preview' } });
              setValue('photoUpload', false);
            }}
            onUploadClick={() => {
              updateParams({ set: { product: 'preview' } });
              setValue('photoUpload', true);
              setSelectedImages((prev) => ({
                cloth: prev?.cloth ?? null,
                uploadedImage: null,
                resultImage: null,
              }));
            }}
            onModelSelect={(imageSource: TImageSource) => {
              updateParams({ set: { product: 'tryon' } });
              setValue('photoUpload', true);
              setSelectedImages((prev) => ({
                cloth: prev?.cloth ?? null,
                uploadedImage: imageSource,
                resultImage: null,
              }));
            }}
          />
        </div>
        <FashionTryOnFooter />
      </div>
      {toastCardProps && <ToastCard key={toastIndex} {...toastCardProps} />}
    </>
  );
};

export default FashionMainBody;
