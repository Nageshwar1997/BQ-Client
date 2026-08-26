// eslint-disable-next-line simple-import-sort/imports
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import { LIVE_INSTRUCTIONS, UPLOAD_INSTRUCTIONS } from '@/constants/tryon.constants';
import useTryOnUpload from '@/hooks/useTryOnUpload';
import type { IShade, ITryOnStageRef } from '@/types/tryon-engine.type';
import type { TTryOnSelection } from '@/types/tryon.type';

import LipTryOnStage from './LipTryOnStage';
import TryOnInstructions from './TryOnInstructions';
import TryOnModeSelect from './TryOnModeSelect';
import TryOnShadeSwatches from './TryOnShadeSwatches';
import TryOnSidebar from './TryOnSidebar';
import TryOnStatusOverlay from './TryOnStatusOverlay';

interface ITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  // The category/subCategory the user is trying on - comes straight from the product API
  // (`product.tryOn`), never picked in this modal.
  tryOn?: TTryOnSelection;
  // The product's real shade/color variants (`product.variants`, `type === 'Color'`) - never
  // invented in the UI via a color picker.
  shades: IShade[];
}

interface ITryOnFlowState {
  // select: mode pick. instructions: mode-specific tips screen. tryon: engine mounted (with its
  // own loading overlay until camera/image is ready).
  step: 'select' | 'instructions' | 'tryon';
  mode: 'live' | 'upload';
  uploadedImageUrl: string | null;
  engineState: ILipTryOnState | null;
}

const INITIAL_FLOW_STATE: ITryOnFlowState = {
  step: 'select',
  mode: 'live',
  uploadedImageUrl: null,
  engineState: null,
};

const TryOnModal = ({ isOpen, onClose, tryOn, shades }: ITryOnModalProps) => {
  const [flow, setFlow] = useState<ITryOnFlowState>(INITIAL_FLOW_STATE);

  const stageRef = useRef<ITryOnStageRef<ILipTryOnState>>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const { previewUrl, error: uploadError, setFile, reset: resetUpload } = useTryOnUpload();

  useEffect(() => {
    if (isOpen) return;

    /**
     * `TryOnModal` itself never unmounts (it's always rendered by the parent page), so the
     * flow has to be reset explicitly on close - otherwise the next open would resume
     * mid-flow.
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlow(INITIAL_FLOW_STATE);
    resetUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!previewUrl) return;

    // `uploadedImageUrl` is derived from `useTryOnUpload`'s blob preview URL, an external-system
    // side effect unsafe to run during render - same reasoning as AvatarUpload.tsx's identical
    // pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlow((prev) => ({ ...prev, uploadedImageUrl: previewUrl }));
  }, [previewUrl]);

  // Feeds the live camera's stream into the sidebar's small blurred preview - a second
  // <video> element showing the same MediaStream as the main stage (browsers support one
  // stream driving multiple <video> elements at once).
  useEffect(() => {
    if (flow.mode !== 'live' || !flow.engineState?.cameraReady) return;

    const stream = stageRef.current?.getStream();
    if (stream && cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = stream;
    }
  }, [flow.mode, flow.engineState?.cameraReady]);

  // Step 1 -> 2: picking a mode always starts a fresh flow for it.
  const handleSelectMode = (mode: 'live' | 'upload') => {
    setFlow({ ...INITIAL_FLOW_STATE, step: 'instructions', mode });
  };

  // Step 2 -> 3/4 (live only) - the engine only mounts once we're in the 'tryon' step, and its
  // own status overlay covers the "waiting for camera" loading state from there.
  const handleStartLive = () => {
    setFlow((prev) => ({ ...prev, step: 'tryon' }));
  };

  // Step 2 -> 3/4 (upload only), passed to TryOnInstructions - which owns the file input/picker
  // trigger itself, since nothing else needs it - lands directly in 'tryon'; the upload stage's
  // own status overlay covers the "processing photo" loading state until `imageReady`.
  const handleFileSelected = (file: File) => {
    resetUpload();
    setFile(file);
    setFlow((prev) => ({ ...prev, step: 'tryon' }));
  };

  // Sidebar's mode-toggle, reachable from within the 'tryon' step - always resets back to that
  // mode's instructions screen, even re-clicking the already-active mode (matches the
  // reference's onCameraClick/onUploadClick; doubles as "start over"/"pick a different photo").
  const handleModeToggle = (mode: 'live' | 'upload') => {
    setFlow({ ...INITIAL_FLOW_STATE, step: 'instructions', mode });
  };

  const handleBackToSelect = () => {
    setFlow(INITIAL_FLOW_STATE);
  };

  const handleModelSelect = (url: string) => {
    resetUpload();
    setFlow((prev) => ({ ...prev, mode: 'upload', uploadedImageUrl: url, step: 'tryon' }));
  };

  const handleShadeSelect = (hexColor: string) => {
    stageRef.current?.setMakeupState({ color: hexColor });
  };

  const handleDownload = () => {
    const dataUrl = stageRef.current?.takeSnapshot();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'try-on.png';
    link.click();
  };

  // Shared readiness check - drives both the not-ready overlay and disabling shade/model
  // selection until the stage can actually act on either.
  const isTryOnReady =
    flow.step === 'tryon' &&
    (flow.mode === 'live'
      ? !!flow.engineState?.cameraReady
      : !!flow.uploadedImageUrl && !!flow.engineState?.imageReady);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      header={{ title: 'Try-On', showCloseIcon: true }}
      className="h-full max-w-full min-w-[80dvw]!"
    >
      {/* Only LIP has a rendering engine built so far - see docs/tryons/README.md. */}
      {tryOn?.category !== 'LIP' ? (
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <Icon icon="solar:hourglass-linear" className="text-primary/40 size-8" />
          <p className="text-tertiary text-sm">
            {tryOn
              ? `Try-on for ${tryOn.category} is coming soon.`
              : 'This product has no try-on configured yet.'}
          </p>
        </div>
      ) : (
        // The sidebar (mode-toggle + model list) is always visible, on every step - only the
        // left panel's content swaps between select/instructions/the actual canvas. `w-fit`
        // (`ModalWrapper`'s scrollable content wrapper default, for its usual centered-dialog
        // content) can't size a `flex-1` panel with no intrinsic width of its own (its children
        // are all absolutely-positioned), so the row would collapse to just the sidebar's width
        // without an explicit size here - `min-w-[80dvw]!` on ModalWrapper sidesteps that.
        <div className="flex h-full w-full gap-3">
          <div className="border-primary/10 relative flex-1 overflow-hidden rounded-2xl border">
            {flow.step === 'select' ? (
              <TryOnModeSelect onSelect={handleSelectMode} />
            ) : flow.step === 'instructions' ? (
              <TryOnInstructions
                mode={flow.mode}
                instructions={flow.mode === 'live' ? LIVE_INSTRUCTIONS : UPLOAD_INSTRUCTIONS}
                onStartLive={handleStartLive}
                onFileSelected={handleFileSelected}
                onBack={handleBackToSelect}
              />
            ) : (
              <>
                <LipTryOnStage
                  ref={stageRef}
                  mode={flow.mode}
                  uploadedImageUrl={flow.uploadedImageUrl}
                  initialState={{
                    type: tryOn.subCategory,
                    color: flow.engineState?.color ?? null,
                  }}
                  onStateChange={(engineState) => {
                    setFlow((prev) => ({ ...prev, engineState }));
                  }}
                />

                {/* Not-ready-yet overlay - each mode has its own readiness signal (camera
                    permission vs. image processing), rolled into `isTryOnReady` since only the
                    orchestrator knows which mode is active. */}
                {!isTryOnReady && (
                  <TryOnStatusOverlay
                    loadingText={
                      flow.mode === 'live'
                        ? 'Waiting for camera permission...'
                        : 'Processing photo...'
                    }
                    errorTitle={
                      flow.mode === 'live' ? 'Camera unavailable' : "Couldn't process photo"
                    }
                    error={flow.engineState?.error}
                  />
                )}

                <button
                  type="button"
                  aria-label="Download snapshot"
                  onClick={handleDownload}
                  disabled={!flow.engineState?.color}
                  className="bg-primary-invert/70 text-primary border-primary/10 absolute top-3 right-3 z-3 flex size-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xs disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon icon="solar:download-linear" className="size-4" />
                </button>

                <TryOnShadeSwatches
                  className="absolute inset-x-0 bottom-0 z-3"
                  shades={shades}
                  appliedColor={flow.engineState?.color ?? null}
                  onSelect={handleShadeSelect}
                  disabled={!isTryOnReady}
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <TryOnSidebar
              mode={flow.mode}
              onModeToggle={handleModeToggle}
              cameraVideoRef={cameraVideoRef}
              cameraReady={!!flow.engineState?.cameraReady}
              previewImageUrl={flow.uploadedImageUrl}
              onModelSelect={handleModelSelect}
              // The model list is visible on every step, including select/instructions, where
              // picking one is a valid shortcut straight into 'tryon' - only disable it once
              // already inside 'tryon' and still not ready, never on the earlier steps.
              modelsDisabled={flow.step === 'tryon' && !isTryOnReady}
            />
            {uploadError && (
              <p className="text-primary-red text-center text-[10px]">{uploadError}</p>
            )}
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};

export default TryOnModal;
