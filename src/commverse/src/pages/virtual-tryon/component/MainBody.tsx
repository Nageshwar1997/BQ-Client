import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import TryOnSubHeader from './TryOnSubHeader';
import Variants, { Patterns } from './Variants';
import useQueryParams from '../../../hooks/useQueryParams';
import Slider from '../../../components/Slider';
import {
  AllowCameraScreen,
  LoadingUploadScreen,
  PhotoUploadScreen,
  SelectionScreen,
  ShowPreviewScreen,
  TryOnControls,
} from './Screens';
import TryOnFooter from './TryOnFooter';
import TryOnThumbnails from './TryOnThumbnails';
import LipstickTryOn from './LipstickTryOn';
import type {
  ITryOnCommonRef,
  TEyeliner,
  TKajal,
  TTryOn,
  TTryOnForm,
  TTryOnMode,
  TTryOnState,
} from '../../../types';
import { getInitialState, getRangeValues } from '../utils';
import FoundationTryOn from './FoundationTryOn';
import { useGetCosmeticCategory } from '../../../hooks/useGetCosmeticCategory';
import BlushTryOn from './BlushTryOn';
import EyelinerTryOn from './EyelinerTryOn';
import DraggableContainer from './DraggableContainer';
import EyeshadowTryOn from './EyeshadowTryOn';
import EyebrowTryOn from './EyebrowTryOn';
import KajalTryOn from './KajalTryOn';

interface MainBodyProps {
  subCategoryOverride?: TTryOn;
  experienceTitle?: string;
}

const MainBody = ({ subCategoryOverride, experienceTitle }: MainBodyProps) => {
  /* ================= ROUTING ================= */
  const { subCategory: routeSubCategory, expId } = useGetCosmeticCategory();
  const subCategory = subCategoryOverride ?? routeSubCategory;

  /* ================= REFS ================= */

  const tryOnRef = useRef<ITryOnCommonRef | null>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement | null>(null);

  /* ================= STATE ================= */

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [state, setState] = useState<TTryOnState>(() =>
    getInitialState(subCategory)
  );
  const [isCompareActive, setIsCompareActive] = useState(false);

  /* ================= FORM ================= */

  const { control, setValue } = useFormContext<TTryOnForm>();
  const { queryParams, updateParams } = useQueryParams();

  const watchedType = useWatch({ control, name: 'type' });
  const watchedVariants = useWatch({ control, name: 'variants' });
  const watchedPatterns = useWatch({ control, name: 'patterns' });
  const watchedCompare = useWatch({ control, name: 'compare' });
  const watchedDownloadable = useWatch({ control, name: 'downloadable' });
  const watchedPhotoUpload = useWatch({ control, name: 'photoUpload' });
  const activeExperienceId = queryParams.experienceId ?? expId;
  const activeStep = queryParams.product ?? (queryParams.id ? 'preview' : '');

  const rangeValues = getRangeValues(subCategory, watchedType);

  /* ================= MODE ================= */

  const tryOnMode: TTryOnMode = watchedPhotoUpload ? 'upload' : 'live';

  /* ================= SHADE ================= */

  const handleShadeClick = (color: string) => {
    const isSame = color === state.color;

    const nextState = {
      color: isSame ? null : color,
      range: isSame ? 0 : (state.range ?? 0),
      type: watchedType,
    };

    tryOnRef.current?.setMakeupState(nextState);
    setState((prev) => ({ ...prev, ...nextState }));
  };

  const handlePatternClick = (pattern: TEyeliner | TKajal) => {
    const isSame = pattern === state.type;

    const nextState = {
      color: watchedVariants?.[0]?.hexColor,
      range: isSame ? 0 : (state.range ?? 0),
      type: isSame ? null : pattern,
    };

    tryOnRef.current?.setMakeupState(nextState);
    setState((prev) => ({ ...prev, ...nextState }));
  };

  useEffect(() => {
    if ((['Lipstick', 'Eyeliner', 'Kajal'] as TTryOn[]).includes(subCategory)) {
      tryOnRef.current?.setMakeupState({
        type: watchedType,
        color: state.color,
        range: state.range,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedType, subCategory]);

  useEffect(() => {
    setState(getInitialState(subCategory));
    setIsCompareActive(false);
  }, [subCategory]);

  /* ================= CAMERA (FIXED) ================= */

  useEffect(() => {
    const canStartCamera =
      state.tryOnStarted && // engine ready to start camera
      tryOnMode === 'live' &&
      queryParams.product === 'tryon' &&
      !uploadedImageUrl;

    if (canStartCamera) {
      tryOnRef.current?.startCamera?.();
    } else {
      tryOnRef.current?.stopCamera?.();
    }
  }, [state.tryOnStarted, tryOnMode, queryParams.product, uploadedImageUrl]);

  /* ================= STREAM → THUMBNAIL ================= */

  useEffect(() => {
    if (
      tryOnMode !== 'live' ||
      queryParams.product !== 'tryon' ||
      !state.cameraReady
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
  }, [tryOnMode, queryParams.product, state.cameraReady]);

  /* ================= RESET ================= */

  const handleReset = () => {
    tryOnRef.current?.setMakeupState({
      color: null,
      range: 0,
      type: watchedType,
    });
    setIsCompareActive(false);
  };

  /* ================= LOADER ================= */

  const showLoader =
    !state.tryOnStarted ||
    (tryOnMode === 'upload' && !state.imageReady) ||
    (tryOnMode === 'live' && !state.cameraReady);

  /* ================= QUERY SYNC ================= */

  useEffect(() => {
    if (
      tryOnMode === 'upload' &&
      uploadedImageUrl &&
      queryParams.product !== 'tryon'
    ) {
      updateParams({ set: { product: 'tryon' } });
      return;
    }

    if (
      queryParams.product === 'tryon' &&
      tryOnMode === 'upload' &&
      !uploadedImageUrl
    ) {
      updateParams({ set: { product: 'preview' } });
    } else if (
      queryParams.product === 'tryon' &&
      tryOnMode === 'live' &&
      uploadedImageUrl
    ) {
      updateParams({ set: { product: 'preview' } });
    }
    if (isCompareActive) {
      setIsCompareActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPhotoUpload, uploadedImageUrl, tryOnMode, queryParams.product]);

  useEffect(() => {
    if (!watchedPhotoUpload) {
      setUploadedImageUrl(null);
    }
  }, [watchedPhotoUpload]);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    const ref = tryOnRef.current;
    return () => {
      ref?.stopCamera?.();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (uploadedImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
    };
  }, [uploadedImageUrl]);

  useEffect(() => {
    if (!activeExperienceId) return;
    if (queryParams.product) return;
    updateParams({ set: { product: 'preview' } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeExperienceId, queryParams.product]);

  /* ================= RENDER ================= */

  return (
    <>
      <div className="flex min-h-0 w-full grow flex-col gap-6 pt-6 pr-12 pb-8 pl-8">
        {/* Header */}
        <TryOnSubHeader experienceTitle={experienceTitle} />
        {/* Body */}
        <div className="flex min-h-0 w-full grow gap-3">
          {/* MAIN TRY-ON AREA */}
          <div
            className={`bg-neutral-gray-150 font-metropolis text-neutral-gray-900 flex-1 rounded-3xl border-2 ${
              !showLoader && activeStep === 'tryon'
                ? 'border-neutral-gray-300'
                : 'border-neutral-gray-500 border-dashed'
            }`}
          >
            {activeStep === 'preview' ? (
              tryOnMode === 'live' ? (
                <ShowPreviewScreen
                  onClick={() => updateParams({ set: { product: 'tryon' } })}
                />
              ) : (
                <PhotoUploadScreen
                  onClick={(file) => {
                    const url = URL.createObjectURL(file);
                    setUploadedImageUrl(url);
                    setValue('photoUpload', true);
                    updateParams({ set: { product: 'tryon' } });
                  }}
                />
              )
            ) : activeStep === 'tryon' ? (
              <div className="relative flex h-full w-full items-center justify-center">
                {/* TRY-ON ENGINE */}
                {subCategory === 'Lipstick' ? (
                  <DraggableContainer
                    tryOnRef={tryOnRef}
                    isCompareActive={isCompareActive}
                    mode={tryOnMode}
                  >
                    <LipstickTryOn
                      ref={tryOnRef}
                      mode={tryOnMode}
                      uploadedImageUrl={uploadedImageUrl}
                      initialState={{ range: rangeValues.default }}
                      className="rounded-[23px]"
                      onStateChange={setState}
                    />
                  </DraggableContainer>
                ) : subCategory === 'Blush' ? (
                  <DraggableContainer
                    tryOnRef={tryOnRef}
                    isCompareActive={isCompareActive}
                    mode={tryOnMode}
                  >
                    <BlushTryOn
                      ref={tryOnRef}
                      mode={tryOnMode}
                      uploadedImageUrl={uploadedImageUrl}
                      initialState={{ range: rangeValues.default }}
                      className="rounded-[23px]"
                      onStateChange={setState}
                    />
                  </DraggableContainer>
                ) : subCategory === 'Foundation' ? (
                  <DraggableContainer
                    tryOnRef={tryOnRef}
                    isCompareActive={isCompareActive}
                    mode={tryOnMode}
                  >
                    <FoundationTryOn
                      ref={tryOnRef}
                      mode={tryOnMode}
                      uploadedImageUrl={uploadedImageUrl}
                      initialState={{ range: rangeValues.default }}
                      className="rounded-[23px]"
                      onStateChange={setState}
                    />
                  </DraggableContainer>
                ) : subCategory === 'Eyeliner' ? (
                  <DraggableContainer
                    tryOnRef={tryOnRef}
                    isCompareActive={isCompareActive}
                    mode={tryOnMode}
                  >
                    <EyelinerTryOn
                      ref={tryOnRef}
                      mode={tryOnMode}
                      uploadedImageUrl={uploadedImageUrl}
                      initialState={{ range: rangeValues.default }}
                      className="rounded-[23px]"
                      onStateChange={setState}
                    />
                  </DraggableContainer>
                ) : subCategory === 'Kajal' ? (
                  <DraggableContainer
                    tryOnRef={tryOnRef}
                    isCompareActive={isCompareActive}
                    mode={tryOnMode}
                  >
                    <KajalTryOn
                      ref={tryOnRef}
                      mode={tryOnMode}
                      uploadedImageUrl={uploadedImageUrl}
                      initialState={{ range: rangeValues.default }}
                      className="rounded-[23px]"
                      onStateChange={setState}
                    />
                  </DraggableContainer>
                ) : subCategory === 'Eyebrow' ? (
                  <DraggableContainer
                    tryOnRef={tryOnRef}
                    isCompareActive={isCompareActive}
                    mode={tryOnMode}
                  >
                    <EyebrowTryOn
                      ref={tryOnRef}
                      mode={tryOnMode}
                      uploadedImageUrl={uploadedImageUrl}
                      initialState={{ range: rangeValues.default }}
                      className="rounded-[23px]"
                      onStateChange={setState}
                    />
                  </DraggableContainer>
                ) : (
                  subCategory === 'Eyeshadow' && (
                    <DraggableContainer
                      tryOnRef={tryOnRef}
                      isCompareActive={isCompareActive}
                      mode={tryOnMode}
                    >
                      <EyeshadowTryOn
                        ref={tryOnRef}
                        mode={tryOnMode}
                        uploadedImageUrl={uploadedImageUrl}
                        initialState={{ range: rangeValues.default }}
                        className="rounded-[23px]"
                        onStateChange={setState}
                      />
                    </DraggableContainer>
                  )
                )}

                {/* CONTROLS */}
                {!showLoader && (
                  <TryOnControls
                    captureProps={
                      watchedDownloadable
                        ? {
                            onClick: () => tryOnRef.current?.takeSnapshot?.(),
                            disabled: !state.color || isCompareActive,
                          }
                        : undefined
                    }
                    compareProps={
                      watchedCompare
                        ? {
                            onClick: () => setIsCompareActive((prev) => !prev),
                            isCompareActive,
                            disabled: !state.color,
                          }
                        : undefined
                    }
                    resetProps={{
                      onClick: handleReset,
                      disabled: !state.color,
                    }}
                  />
                )}
                {watchedVariants && !showLoader && !isCompareActive && (
                  <div className="absolute inset-x-0 bottom-4 z-10 flex flex-col gap-6">
                    {/* Range Slider */}
                    {state.color && (
                      <div className="mx-auto w-40">
                        <Slider
                          value={state.range}
                          min={rangeValues.min}
                          max={rangeValues.max}
                          step={0.01}
                          onChange={(value) =>
                            tryOnRef.current?.setMakeupState({ range: value })
                          }
                          className="[&>div>input]:border-neutral-gray-400 [&>div>input]:h-2.5! [&>div>input]:border"
                          style={{
                            background: `linear-gradient(to right, ${state.color}00, ${state.color})`,
                          }}
                        />
                      </div>
                    )}
                    {(['Eyeliner', 'Kajal'] as TTryOn[]).includes(
                      subCategory
                    ) ? (
                      <Patterns
                        appliedPattern={state.type as TKajal | TEyeliner}
                        patterns={watchedPatterns}
                        onPatternClick={(pattern) =>
                          handlePatternClick(pattern)
                        }
                      />
                    ) : (
                      <Variants
                        appliedColor={state.color}
                        variants={watchedVariants}
                        onShadeClick={handleShadeClick}
                      />
                    )}
                  </div>
                )}

                {/* LOADER */}
                {showLoader &&
                  (tryOnMode === 'live' ? (
                    <AllowCameraScreen
                      onClick={() => tryOnRef.current?.restartCamera?.()}
                    />
                  ) : (
                    <LoadingUploadScreen />
                  ))}
              </div>
            ) : (
              <SelectionScreen />
            )}
          </div>
          {/* THUMBNAILS */}
          <TryOnThumbnails
            step={activeStep}
            thumbnailImageUrl={uploadedImageUrl}
            thumbnailVideoRef={thumbnailVideoRef}
            watchedPhotoUpload={watchedPhotoUpload}
            tryOnMode={tryOnMode}
            state={state}
            onCameraClick={() => {
              updateParams({ set: { product: 'preview' } });
              setValue('photoUpload', false);
              setUploadedImageUrl(null);
            }}
            onUploadClick={() => {
              updateParams({ set: { product: 'preview' } });
              setValue('photoUpload', true);
              setUploadedImageUrl(null);
            }}
            onModelSelect={(imgUrl: string) => {
              setValue('photoUpload', true);
              setUploadedImageUrl(imgUrl);
            }}
          />
        </div>
        <TryOnFooter />
      </div>
    </>
  );
};

export default MainBody;
