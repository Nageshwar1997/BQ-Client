import { useEffect, useRef, useState } from 'react';
import DraggableContainer from './DraggableContainer';
import LipstickTryOn from './LipstickTryOn';
import BlushTryOn from './BlushTryOn';
import FoundationTryOn from './FoundationTryOn';
import EyelinerTryOn from './EyelinerTryOn';
import KajalTryOn from './KajalTryOn';
import EyebrowTryOn from './EyebrowTryOn';
import EyeshadowTryOn from './EyeshadowTryOn';
import {
  AllowCameraScreen,
  LoadingUploadScreen,
  PhotoUploadScreen,
  ShowPreviewScreen,
  TryOnControls,
} from './Screens';
import Slider from '../../../components/Slider';
import Variants from './Variants';
import type {
  ITryOnCommonRef,
  TEyeliner,
  TKajal,
  TLip,
  TTryOn,
  TTryOnState,
} from '../../../types';
import { getInitialState, getRangeValues } from '../utils';
import TryOnThumbnails from './TryOnThumbnails';
import Button from '../../../components/Button';
import { Link } from 'react-router';
import { Icon } from '@iconify/react';

const CosmeticTryOn = ({
  productTitle,
  subCategory,
  type,
  variants,
  productLink,
  showExperienceMeta = true,
  onNext,
  isNextLoading = false,
}: {
  productTitle: string;
  productLink?: string;
  showExperienceMeta?: boolean;
  onNext: () => void;
  isNextLoading?: boolean;
  subCategory: TTryOn;
  type?: TLip | TEyeliner | TKajal;
  variants: string[];
}) => {
  const tryOnRef = useRef<ITryOnCommonRef | null>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement | null>(null);
  const rangeValues = getRangeValues(subCategory);

  const [state, setState] = useState<TTryOnState>(() =>
    getInitialState(subCategory)
  );
  const [screen, setScreen] = useState<'preview' | 'tryon'>('preview');
  const [tryOnMode, setTryOnMode] = useState<'live' | 'upload'>('live');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isCompareActive, setIsCompareActive] = useState(false);
  const [showCameraRetry, setShowCameraRetry] = useState(false);

  const newType = ['Eyeliner', 'Kajal'].includes(subCategory)
    ? 'pattern1'
    : subCategory === 'Lipstick'
      ? (type ?? 'matte')
      : null;

  /* ================= LOADER ================= */

  const showLoader =
    !state.tryOnStarted ||
    (tryOnMode === 'upload' && !state.imageReady) ||
    (tryOnMode === 'live' && !state.cameraReady);

  const handleShadeClick = (color: string) => {
    const isSame = color === state.color;

    const nextState = {
      color: isSame ? null : color,
      range: isSame ? 0 : (state.range ?? 0),
      type: newType,
    };

    tryOnRef.current?.setMakeupState(nextState);
    setState((prev) => ({ ...prev, ...nextState }));
  };

  /* ================= RESET ================= */

  const handleReset = () => {
    tryOnRef.current?.setMakeupState({
      color: null,
      range: 0,
      type: newType,
    });
    setIsCompareActive(false);
  };

  /* ================= CAMERA (FIXED) ================= */

  useEffect(() => {
    const canStartCamera =
      state.tryOnStarted && // engine ready to start camera
      tryOnMode === 'live' &&
      screen === 'tryon' &&
      !uploadedImageUrl;

    if (canStartCamera) {
      tryOnRef.current?.startCamera?.();
    } else {
      tryOnRef.current?.stopCamera?.();
    }
  }, [state.tryOnStarted, tryOnMode, screen, uploadedImageUrl]);

  useEffect(() => {
    if (tryOnMode !== 'live' || screen !== 'tryon' || state.cameraReady) {
      setShowCameraRetry(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowCameraRetry(true);
    }, 6000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [screen, state.cameraReady, tryOnMode]);

  /* ================= STREAM → THUMBNAIL ================= */

  useEffect(() => {
    if (tryOnMode !== 'live' || screen !== 'tryon' || !state.cameraReady) {
      if (thumbnailVideoRef.current) {
        thumbnailVideoRef.current.srcObject = null;
      }
      return;
    }

    const stream = tryOnRef.current?.getStream?.();
    if (stream && thumbnailVideoRef.current) {
      thumbnailVideoRef.current.srcObject = stream;
    }
  }, [tryOnMode, screen, state.cameraReady]);

  return (
    <div className="flex h-full w-full flex-col gap-3 px-8 py-6">
      <div className="font-metropolis flex items-center justify-between gap-6">
        <h1 className="line-clamp-1 text-xl/6 font-bold">{productTitle}</h1>
        <Button
          content="Next"
          className="h-9.5! w-fit! px-4! py-2.5!"
          size="sm"
          isLoading={isNextLoading}
          onClick={onNext}
        />
      </div>
      {showExperienceMeta && productLink && (
      <div className="font-metropolis flex items-center justify-between gap-6 px-2">
        <h1 className="line-clamp-1 text-lg/5 font-bold">
          New 3D Visualizer Experience
        </h1>
        <div className="font-metropolis flex max-w-1/2 items-center gap-2">
          <strong className="text-neutral-gray-900">Product:</strong>

          <Link
            className="decoration-brand flex items-center gap-1 text-xs/4 font-medium underline"
            to={productLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-brand line-clamp-1">{productTitle}</span>
            <Icon
              icon="solar:arrow-right-up-linear"
              className="text-brand size-4 shrink-0"
            />
          </Link>
            <Icon
              onClick={()=> navigator.clipboard.writeText(productLink)}
            icon="solar:link-minimalistic-linear"
            className="text-neutral-gray-600 hover:text-neutral-gray-900 size-4 shrink-0 cursor-pointer"
          />
        </div>
      </div>
      )}
      {/* Body */}
      <div className="flex min-h-0 w-full grow gap-3">
        {/* MAIN TRY-ON AREA */}
        <div
          className={`bg-neutral-gray-150 font-metropolis text-neutral-gray-900 flex-1 rounded-3xl border-2 ${
            !showLoader && screen === 'tryon'
              ? 'border-neutral-gray-300'
              : 'border-neutral-gray-500 border-dashed'
          }`}
        >
          {screen === 'tryon' ? (
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
                  captureProps={{
                    onClick: () => tryOnRef.current?.takeSnapshot?.(),
                    disabled: !state.color || isCompareActive,
                  }}
                  compareProps={{
                    onClick: () => setIsCompareActive((prev) => !prev),
                    isCompareActive,
                    disabled: !state.color,
                  }}
                  resetProps={{
                    onClick: handleReset,
                    disabled: !state.color,
                  }}
                />
              )}
              {variants && !showLoader && !isCompareActive && (
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
                  <Variants
                    appliedColor={state.color}
                    variants={variants.map((v) => ({ name: v, hexColor: v }))}
                    onShadeClick={handleShadeClick}
                    className="[&_p]:hidden"
                  />
                </div>
              )}

              {/* LOADER */}
              {showLoader &&
                (tryOnMode === 'live' ? (
                  <AllowCameraScreen
                    showRetry={showCameraRetry}
                    onClick={() => tryOnRef.current?.restartCamera?.()}
                  />
                ) : (
                  <LoadingUploadScreen />
                ))}
            </div>
          ) : tryOnMode === 'live' ? (
            <ShowPreviewScreen onClick={() => setScreen('tryon')} />
          ) : (
            <PhotoUploadScreen
              onClick={(file) => {
                const url = URL.createObjectURL(file);
                setTryOnMode('upload');
                setScreen('tryon');
                setUploadedImageUrl(url);
              }}
            />
          )}
        </div>
        <TryOnThumbnails
          step={screen}
          thumbnailImageUrl={uploadedImageUrl}
          thumbnailVideoRef={thumbnailVideoRef}
          watchedPhotoUpload={tryOnMode === 'upload'}
          tryOnMode={tryOnMode}
          state={state}
          onCameraClick={() => {
            setScreen('preview');
            setTryOnMode('live');
            setUploadedImageUrl(null);
          }}
          onUploadClick={() => {
            setScreen('preview');
            setTryOnMode('upload');
            setUploadedImageUrl(null);
          }}
          onModelSelect={(imgUrl: string) => {
            setTryOnMode('upload');
            setScreen('tryon');
            setUploadedImageUrl(imgUrl);
          }}
        />
      </div>
    </div>
  );
};

export default CosmeticTryOn;
