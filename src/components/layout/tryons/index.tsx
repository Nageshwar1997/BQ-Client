// eslint-disable-next-line simple-import-sort/imports
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import { LIP_RANGE_BOUNDS } from '@/constants/tryon-lip.constants';
import { LIVE_INSTRUCTIONS, UPLOAD_INSTRUCTIONS } from '@/constants/tryon.constants';
import useTryOnUpload from '@/hooks/useTryOnUpload';
import type { IShade, ITryOnStageRef } from '@/types/tryon-engine.type';
import type { TTryOnSelection } from '@/types/tryon.type';

import Button from '@/components/ui/Button';
import LipTryOnStage from './LipTryOnStage';
import TryOnBottomSheet from './TryOnBottomSheet';
import TryOnCompareSlider from './TryOnCompareSlider';
import TryOnInstructions from './TryOnInstructions';
import TryOnModelList from './TryOnModelList';
import TryOnModeSelect from './TryOnModeSelect';
import TryOnRangeSlider from './TryOnRangeSlider';
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
  // `null` = compare mode off; the actual canvas element = compare mode on. Its own truthiness
  // *is* "is compare active" - there used to be a separate `isCompareActive` boolean alongside
  // this, but the two had to be set together at every single call site anyway (nothing ever
  // needed them to disagree), which is exactly the kind of manually-synced duplicate state that
  // can drift out of sync by accident - the same class of bug `handleModelSelect` below had to
  // fix for `comparePosition` itself. One piece of state, nothing to forget to update.
  // Resolved in the toggle handler below (an event handler, not render - reading a ref's
  // `.current` during render itself is unsafe/lint-forbidden) - TryOnCompareSlider needs the
  // actual canvas element to account for its `object-fit` sizing.
  const [compareCanvas, setCompareCanvas] = useState<HTMLCanvasElement | null>(null);
  // Mobile/tablet only (below `lg:` - see the bottom action bar and ModalWrapper sizing further
  // down) - the desktop sidebar's model list moves into this on-demand sheet instead of an
  // always-visible right column once the screen's too narrow for one. Mode itself doesn't need
  // a sheet - the bottom bar's mode button just toggles directly (see `handleModeToggle` below).
  const [activeSheet, setActiveSheet] = useState<'models' | null>(null);

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
    setCompareCanvas(null);
    setActiveSheet(null);
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
    setCompareCanvas(null);
    setActiveSheet(null);
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
    setCompareCanvas(null);
    setActiveSheet(null);
  };

  const handleBackToSelect = () => {
    setFlow(INITIAL_FLOW_STATE);
    setCompareCanvas(null);
    setActiveSheet(null);
  };

  const handleModelSelect = (url: string) => {
    resetUpload();
    setFlow((prev) => ({ ...prev, mode: 'upload', uploadedImageUrl: url, step: 'tryon' }));
    // If we were already in upload mode, `TryOnUploadStage` doesn't remount for a new photo -
    // the *same* engine instance just loads the new image (see its `imageUrl` effect), so its
    // own `comparePosition` field would otherwise carry over from before this switch. Clearing
    // `compareCanvas` alone only hides the React-level drag UI - it doesn't stop `renderFrame`
    // from still drawing the split/divider line on the canvas itself, so this has to explicitly
    // clear the engine's own state too (harmless no-op on the old engine if we were in live mode
    // instead, since that path gets a fresh, already-null one regardless).
    stageRef.current?.setComparePosition(null);
    setCompareCanvas(null);
    setActiveSheet(null);
  };

  // `hexColor` is `null` when re-clicking the already-active shade to deselect it - the engine's
  // `applyEffect` already treats `color: null` as "nothing to draw", so this alone is enough to
  // clear the makeup.
  const handleShadeSelect = (hexColor: string | null) => {
    stageRef.current?.setMakeupState({ color: hexColor });
  };

  // Toggling on always (re)centers the split - toggling off clears it back to the normal
  // full render (`null`), matching `TryOnEngineBase`'s own semantics for `comparePosition`.
  const handleCompareToggle = () => {
    setCompareCanvas((prev) => {
      const next = prev ? null : (stageRef.current?.getCanvas() ?? null);
      stageRef.current?.setComparePosition(next ? 0.5 : null);
      return next;
    });
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
      // Mobile/tablet: edge-to-edge, no backdrop margin - matches a native full-screen sheet.
      // `lg:` restores the original centered-dialog sizing exactly. Both the base and the `lg:`
      // override need `!` - ModalWrapper's own classes (`max-w-md rounded-xl border` etc.) would
      // otherwise win at that breakpoint regardless of source order (see `min-w-[80dvw]!`
      // above, already needed for the same reason).
      containerProps={{ className: 'p-0! lg:p-8!' }}
      className="h-full max-h-full! w-full! max-w-full min-w-[80dvw]! rounded-none! border-0! lg:max-h-[90dvh]! lg:rounded-xl! lg:border!"
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
        <>
          {/* The sidebar (mode-toggle + model list) is always visible on `lg:` and up, on every
              step - only the left panel's content swaps between select/instructions/the actual
              canvas. `w-fit` (`ModalWrapper`'s scrollable content wrapper default, for its usual
              centered-dialog content) can't size a `flex-1` panel with no intrinsic width of its
              own (its children are all absolutely-positioned), so the row would collapse to just
              the sidebar's width without an explicit size here - `min-w-[80dvw]!` on ModalWrapper
              sidesteps that. Below `lg:` this stacks into a column instead - the sidebar's own
              content moves into the bottom sheets further down, so there's nothing to fit here. */}
          <div className="flex h-full w-full flex-col gap-3 lg:flex-row">
            <div className="border-primary/10 relative min-h-0 flex-1 overflow-hidden rounded-2xl border">
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
                      // Persists the intensity slider's position across Live<->Upload toggles too,
                      // same reasoning as `color` above - falls back to the engine's own default
                      // rather than `undefined` (which would win the spread in getInitialState()).
                      range: flow.engineState?.range ?? LIP_RANGE_BOUNDS.default,
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

                  {isTryOnReady && compareCanvas && (
                    <TryOnCompareSlider
                      canvas={compareCanvas}
                      onDrag={(value) => {
                        stageRef.current?.setComparePosition(value);
                      }}
                    />
                  )}

                  {/* Above TryOnCompareSlider's full-canvas z-4 drag surface, so the toggle
                    itself (to turn compare back off) stays clickable while it's active. */}
                  <div className="absolute top-3 right-3 z-5 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={
                        compareCanvas ? 'Hide before/after compare' : 'Compare before/after'
                      }
                      onClick={handleCompareToggle}
                      disabled={!isTryOnReady || !flow.engineState?.color}
                      className={`flex size-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xs transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                        compareCanvas
                          ? 'bg-sky-blue-burst border-transparent text-white'
                          : 'bg-primary-invert/70 text-primary border-primary/10'
                      }`}
                    >
                      <Icon icon="solar:transfer-horizontal-linear" className="size-4" />
                    </button>

                    <button
                      type="button"
                      aria-label="Download snapshot"
                      onClick={handleDownload}
                      disabled={!flow.engineState?.color || !!compareCanvas}
                      className="bg-primary-invert/70 text-primary border-primary/10 flex size-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xs disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Icon icon="solar:download-linear" className="size-4" />
                    </button>
                  </div>

                  {/* Hidden while comparing - both would otherwise sit on top of the drag
                    surface and fight it for clicks, and neither is meaningful mid-comparison. */}
                  <div
                    className={`absolute inset-x-0 bottom-0 z-3 flex flex-col items-center gap-2 ${compareCanvas ? 'hidden' : ''}`}
                  >
                    {/* Intensity slider - only meaningful once a shade is actually applied. */}
                    {flow.engineState?.color && (
                      <TryOnRangeSlider
                        value={flow.engineState.range}
                        min={LIP_RANGE_BOUNDS.min}
                        max={LIP_RANGE_BOUNDS.max}
                        color={flow.engineState.color}
                        disabled={!isTryOnReady}
                        onChange={(value) => {
                          stageRef.current?.setMakeupState({ range: value });
                        }}
                      />
                    )}

                    <TryOnShadeSwatches
                      className="w-full"
                      shades={shades}
                      appliedColor={flow.engineState?.color ?? null}
                      onSelect={handleShadeSelect}
                      disabled={!isTryOnReady}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Large screens only - unchanged from before. Below `lg:`, this same content is
              reachable through the two bottom-sheet triggers instead (just below). */}
            <div className="hidden flex-col gap-2 lg:flex">
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

            {/* Mobile/tablet only - stands in for the sidebar above. The mode button toggles
              directly (matching the desktop sidebar's own mode-toggle icons) - no picker UI
              needed for a straight either/or choice; Models still opens a sheet since there
              are more than two of those to choose from. */}
            <div className="flex shrink-0 gap-2 lg:hidden">
              <Button
                pattern="secondary"
                content={flow.mode}
                className="capitalize"
                buttonProps={{
                  onClick: () => {
                    handleModeToggle(flow.mode === 'live' ? 'upload' : 'live');
                  },
                }}
                leftIcon={{
                  icon: flow.mode === 'live' ? 'solar:camera-linear' : 'solar:gallery-send-linear',
                }}
              />
              <Button
                pattern="secondary"
                content="Models"
                className="capitalize"
                buttonProps={{
                  onClick: () => {
                    setActiveSheet('models');
                  },
                  disabled: flow.step === 'tryon' && !isTryOnReady,
                }}
                leftIcon={{ icon: 'solar:gallery-linear' }}
              />
            </div>
            {uploadError && (
              <p className="text-primary-red text-center text-[10px] lg:hidden">{uploadError}</p>
            )}
          </div>

          <TryOnBottomSheet
            isOpen={activeSheet === 'models'}
            onClose={() => {
              setActiveSheet(null);
            }}
            title="Choose a Model"
          >
            <TryOnModelList
              direction="horizontal"
              mode={flow.mode}
              previewImageUrl={flow.uploadedImageUrl}
              onModelSelect={handleModelSelect}
              disabled={flow.step === 'tryon' && !isTryOnReady}
            />
          </TryOnBottomSheet>
        </>
      )}
    </ModalWrapper>
  );
};

export default TryOnModal;
