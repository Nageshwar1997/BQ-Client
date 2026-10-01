// eslint-disable-next-line simple-import-sort/imports
import type { TTryOnSelection } from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import type { Ref } from 'react';

import type { IEyeTryOnState } from '@/classes/tryon/categories/eye';
import type { IFaceTryOnState } from '@/classes/tryon/categories/face';
import type { IHairTryOnState } from '@/classes/tryon/categories/hair';
import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import type { INailTryOnState } from '@/classes/tryon/categories/nail';
import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import {
  EYE_DEFAULT_PATTERNS,
  EYE_PATTERNS,
  EYE_RANGE_BOUNDS,
} from '@/constants/tryon-constants/eye';
import { FACE_RANGE_BOUNDS } from '@/constants/tryon-constants/face';
import { HAIR_RANGE_BOUNDS } from '@/constants/tryon-constants/hair';
import { LIP_RANGE_BOUNDS } from '@/constants/tryon-constants/lip';
import { NAIL_RANGE_BOUNDS } from '@/constants/tryon-constants/nail';
import useDebouncedDetectionStatus from '@/hooks/useDebouncedDetectionStatus';
import useTryOnFlow from '@/hooks/useTryOnFlow';
import type { IShade, ITryOnStageRef, TDetectionStatus } from '@/types/tryon-types';

import { InputError } from '@/components/ui/inputs/children';
import { TRYON_MODE_MAP } from '@/constants/tryon-constants';
import BottomButtons from './BottomButtons';
import EyeTryOnStage from './eye/EyeTryOnStage';
import FaceTryOnStage from './face/FaceTryOnStage';
import HairTryOnStage from './hair/HairTryOnStage';
import LipTryOnStage from './lip/LipTryOnStage';
import NailTryOnStage from './nail/NailTryOnStage';
import TryOnBottomSheet from './TryOnBottomSheet';
import TryOnCompareSlider from './TryOnCompareSlider';
import TryOnInstructions from './TryOnInstructions';
import TryOnModelList from './TryOnModelList';
import TryOnModeSelect from './TryOnModeSelect';
import TryOnOverlay from './TryOnOverlay';
import TryOnPatternSwatches from './TryOnPatternSwatches';
import TryOnRangeSlider from './TryOnRangeSlider';
import TryOnShadeSwatches from './TryOnShadeSwatches';
import TryOnSidebar from './TryOnSidebar';
import TryOnTopControls from './TryOnTopControls';

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

const TryOnModal = ({ isOpen, onClose, tryOn, shades }: ITryOnModalProps) => {
  // Owns step/mode/image/engine-state, the UI-only companion states reset alongside it
  // (compareCanvas/activeSheet/retryKey), the stage/camera-video refs, and every handler that
  // transitions between steps/modes/models - see useTryOnFlow.ts's own comment for why this lives
  // in its own hook. Same state/effects/handler bodies as before this was pulled out, so this
  // changes nothing about when or how often this component re-renders.
  const {
    flow,
    setFlow,
    compareCanvas,
    activeSheet,
    setActiveSheet,
    retryKey,
    stageRef,
    cameraVideoRef,
    uploadError,
    isTryOnReady,
    handleSelectMode,
    handleStartLive,
    handleFileSelected,
    handleModeToggle,
    handleBackToSelect,
    handleModelSelect,
    handleShadeSelect,
    handlePatternSelect,
    handleCompareToggle,
    handleRetry,
    handleDownload,
  } = useTryOnFlow(isOpen);

  // Gated on `isTryOnReady`, not read unconditionally - `cameraReady`/`imageReady` and the
  // engine's own `detectionStatus` field (`IMakeupBaseState`, every category's engine base reuses
  // it, repurposed to mean "face detected"/"hair mask detected"/"hand detected" depending on the
  // category, see `HandLandmarkerEngineBase`/`HairSegmenterEngineBase`'s own comments) becoming
  // correct don't land in the same state update (the engine's own `getInitialState` default,
  // `'not-in-frame'`, is what `flow.engineState.detectionStatus` holds the instant
  // `cameraReady`/`imageReady` first flips true - the *real* reading from an actual renderFrame
  // pass only arrives in a following update). Reading the raw value unconditionally here would
  // prime `useDebouncedDetectionStatus`'s own internal debounce with that stale default the moment
  // the stage became ready, which - since 'not-in-frame' is falsy-different-from-'detected' -
  // could flash the detection-guide TryOnOverlay on for that one render before the real reading
  // corrects it a moment later. Forcing this to stay `undefined` until `isTryOnReady` is true
  // sidesteps that: the first value it can ever take on is whatever the *next* real update
  // reports, never the engine's un-started default.
  const rawDetectionStatus = isTryOnReady ? flow.engineState?.detectionStatus : undefined;
  const debouncedDetectionStatus = useDebouncedDetectionStatus(rawDetectionStatus);

  // Reads the *debounced* signal (already gated on `isTryOnReady` at the source, see
  // `rawDetectionStatus` above), not the raw per-frame one, so this and the detection-guide
  // TryOnOverlay's visibility never disagree. Reused below both to show that overlay and to keep
  // shade/compare/download actions disabled while it's showing - applying a shade with nothing
  // reliably detected (face, hair, or hand, depending on the category) doesn't do anything useful.
  const detectionStatus = isTryOnReady ? debouncedDetectionStatus : undefined;
  const canInteract = isTryOnReady && detectionStatus === 'detected';

  // Copy for the not-ready overlay below (TryOnOverlay - the very same component the
  // detection-status guide further down uses) - split out here since it's a 2x2 matrix (loading/
  // error x live/upload), too much for the JSX to carry inline. `notReadyError` set is exactly
  // when this used to switch from a spinner to an error card, so the icon/title mirror that
  // same split.
  const notReadyError = flow.engineState?.error;
  const notReadyIcon = notReadyError
    ? 'solar:danger-triangle-linear'
    : flow.mode === TRYON_MODE_MAP.LIVE
      ? 'solar:videocamera-record-linear'
      : 'solar:gallery-add-linear';
  const notReadyTitle = notReadyError
    ? flow.mode === TRYON_MODE_MAP.LIVE
      ? 'Camera unavailable'
      : "Couldn't process photo"
    : flow.mode === TRYON_MODE_MAP.LIVE
      ? 'Waiting for camera permission...'
      : 'Processing photo...';
  const notReadyDescription = notReadyError ?? 'This should only take a moment.';

  // `detectionStatus` is one shared state field every category's engine reuses (see
  // `HandLandmarkerEngineBase`/`HairSegmenterEngineBase`'s own comments), but what it's actually
  // reporting differs by what that category tracks: LIP/FACE/EYE track a real face, HAIR tracks
  // `getHairDetectionStatus`'s hair mask, NAIL tracks `getHandDetectionStatus`'s hand landmarks.
  // The overlay copy has to match *that*, not always say "face" - a shopper doing a NAIL try-on
  // who moves their hand out of frame was seeing "Face not in frame", which doesn't match
  // anything on screen for them to fix.
  const trackedSubjectCopy =
    tryOn?.category === 'HAIR'
      ? { subject: 'hair', possessive: 'your hair' }
      : tryOn?.category === 'NAIL'
        ? { subject: 'hand', possessive: 'your whole hand' }
        : { subject: 'face', possessive: 'your whole face' };

  // 'turned' now reaches three categories with two different real-world meanings: FACE's and
  // EYE's own "head angled too far to one side" (`FaceEngineBase.refineDetectionStatus`/
  // `EyeEngineBase.refineDetectionStatus` - EYE tracks the same face mesh, added in a later
  // robustness pass after FACE's own), and NAIL's "a hand is in frame but not facing the camera
  // nail-side-up" (`getHandDetectionStatus`, utils/tryon-utils/nail.ts - reusing this status
  // rather than inventing a new one, since it's exactly the same "in frame, just not correctly
  // oriented" situation). Without this, a shopper who tilted their hand palm-out or edge-on got
  // zero nails painted with no on-screen explanation at all - the hand itself still counted as
  // "detected" (`hands.length > 0`), so the guide overlay never showed anything. HAIR/LIP never
  // produce 'turned' - this entry is unreachable there, same as 'not-clear' below, but still needs
  // to type-check against something.
  const turnedCopy =
    tryOn?.category === 'NAIL'
      ? {
          // Same icon NAIL's own upload/live instructions already use for this exact tip
          // (`NAIL_UPLOAD_INSTRUCTIONS`/`NAIL_LIVE_INSTRUCTIONS`, constants/tryon-constants/nail.ts)
          // - consistent iconography for the same underlying guidance.
          icon: 'solar:hand-stars-linear',
          title: 'Hand turned the wrong way',
          description:
            'Show the back of your hand to the camera - your nails need to be visible, not your palm.',
        }
      : {
          // Same icon as the "facing the camera directly" instruction-screen tip
          // (FACE_UPLOAD_INSTRUCTIONS/FACE_LIVE_INSTRUCTIONS) - deliberately not 'not-in-frame's
          // scanner icon, even though both guide the shopper toward a better frame, since this one
          // reads as its own distinct situation (in frame, just angled) rather than another flavor
          // of "not in frame at all".
          icon: 'solar:face-scan-circle-linear',
          title: 'Face turned too much',
          description: 'Face the camera directly - a slight turn is fine, just not a big one.',
        };

  // Copy for the detection-guide overlay below, keyed by every non-'detected' `TDetectionStatus`
  // value - a `Record` (not another inline ternary chain like `notReadyIcon` above) specifically
  // so TS forces a new entry here the moment a category ever adds another status value, instead
  // of that new case silently falling through to the wrong copy. 'not-clear' only ever actually
  // shows for FACE (see `FaceEngineBase.refineDetectionStatus`) - it stays face-specific
  // (unreachable for HAIR/NAIL, but the `Record` still needs every key filled in). 'not-in-frame'
  // is the one status every category can actually hit, so it's the one that needs to read
  // correctly for all of them.
  const DETECTION_GUIDE_COPY: Record<
    Exclude<TDetectionStatus, 'detected'>,
    { icon: string; title: string; description: string }
  > = {
    'not-in-frame': {
      icon: 'solar:scanner-linear',
      title: `${trackedSubjectCopy.subject} not in frame`,
      description: `Move so ${trackedSubjectCopy.possessive} is inside the frame.`,
    },
    'not-clear': {
      icon: 'solar:danger-triangle-linear',
      title: 'Face not clearly visible',
      description: "Move closer, and make sure there's good, even lighting.",
    },
    turned: turnedCopy,
  };

  // Only meaningful inside the supported-category branch below, but declared here (not
  // further down) to stay next to the other pre-render derived values. Each *finish* tunes its
  // own intensity-slider bounds now (see FACE_RANGE_BOUNDS/LIP_RANGE_BOUNDS's own per-finish
  // comments) - keyed by `tryOn.subCategory`, not just `tryOn.category`, since e.g. FOUNDATION
  // and BLUSH read very differently at the same raw alpha. The fallback below is never actually
  // reached by the UI (both real usages further down sit inside the branch that's already
  // confirmed `tryOn.category` is 'LIP' | 'FACE') - it exists purely so this stays a plain
  // object instead of `IRangeBounds | undefined`.
  const rangeBounds =
    tryOn?.category === 'FACE'
      ? FACE_RANGE_BOUNDS[tryOn.subCategory]
      : tryOn?.category === 'LIP'
        ? LIP_RANGE_BOUNDS[tryOn.subCategory]
        : tryOn?.category === 'EYE'
          ? EYE_RANGE_BOUNDS[tryOn.subCategory]
          : tryOn?.category === 'HAIR'
            ? HAIR_RANGE_BOUNDS[tryOn.subCategory]
            : tryOn?.category === 'NAIL'
              ? NAIL_RANGE_BOUNDS[tryOn.subCategory]
              : { min: 0, max: 1, default: 0.5 };

  // Only meaningful inside the EYE branch below, same "declared up top, next to rangeBounds"
  // reasoning - `undefined` for any EYE subcategory without a pattern picker yet (see
  // EYE_PATTERNS's own comment), which the render below already treats as "don't show the row".
  const eyePatterns = tryOn?.category === 'EYE' ? EYE_PATTERNS[tryOn.subCategory] : undefined;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      header={{ title: 'Try-On', showCloseIcon: true }}
      // Mobile/tablet: edge-to-edge, no backdrop margin - matches a native full-screen sheet.
      // `lg:` restores the original centered-dialog sizing exactly. Every one of these needs
      // `!` - ModalWrapper's own classes (`max-w-md rounded-xl border` etc.) can otherwise win
      // regardless of source order (`max-w-full` without `!` here once genuinely lost to the
      // component's own `max-w-md`, which - combined with `min-w-[80dvw]!` - clamped the whole
      // modal to exactly 80dvw even where `w-full!` should have taken it edge-to-edge instead,
      // since a conflicting `min-width` always wins over `max-width` regardless of importance).
      // `lg:w-auto!` un-forces the mobile `w-full!` back on large screens - width there is
      // meant to be driven by `min-w-[80dvw]` as a floor (content can still grow past it), not
      // pinned to 100% of the backdrop's padded space, which `w-full!` alone would do.
      containerProps={{ className: 'p-0! lg:p-8!' }}
      className="h-full max-h-full! w-full! max-w-full! min-w-[80dvw]! rounded-none! border-0! lg:max-h-[90dvh]! lg:w-auto! lg:rounded-xl! lg:border!"
    >
      {/* Only LIP, FACE, EYE, HAIR, and NAIL have a rendering engine built so far - see
          docs/tryons/TRYON.md. The discriminant check stays inline (not a separately-computed
          boolean) so TS keeps narrowing `tryOn` to `{category: 'LIP' | 'FACE' | 'EYE' | 'HAIR' |
          'NAIL', ...}` for every access inside the branch below - a plain boolean variable would
          lose that link. `TTryOnCategory` only has these same 5 members today, so both this
          exclusion chain and the `tryOn` check just below it are provably unreachable *right now*
          - TS narrows `tryOn` to `never` in that branch, which is exactly why both need an
          explicit disable rather than being simplified away: the moment a 6th category lands in
          `@beautinique/shared-constants` before this app's own code catches up, this is the
          fallback that's supposed to catch it, not dead weight to delete. */}
      {!tryOn ||
      (tryOn.category !== 'LIP' &&
        tryOn.category !== 'FACE' &&
        tryOn.category !== 'EYE' &&
        tryOn.category !== 'HAIR' &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        tryOn.category !== 'NAIL') ? (
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <Icon icon="solar:hourglass-linear" className="text-primary/40 size-8" />
          <p className="text-tertiary text-sm">
            {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              tryOn
                ? `Try-on for ${(tryOn as TTryOnSelection).category} is coming soon.`
                : 'This product has no Try-On configured yet.'
            }
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
                  category={tryOn.category}
                  onStartLive={handleStartLive}
                  onFileSelected={handleFileSelected}
                  onBack={handleBackToSelect}
                />
              ) : (
                <>
                  {tryOn.category === 'LIP' ? (
                    <LipTryOnStage
                      key={retryKey}
                      // `stageRef` is deliberately typed narrower than `ITryOnStageRef<TState>`
                      // (see its own comment) - TS can't verify a shared ref object is safe
                      // across two different categories' full ref shapes (its `RefObject.current`
                      // is mutable, so it wants exact bidirectional compatibility, which two
                      // *different* concrete `TState`s structurally can't give it), even though
                      // it genuinely is: every method this file actually calls through it stays
                      // within the narrower shape, and whichever stage is mounted still assigns
                      // its own full, correct ref object into `.current` regardless of this cast.
                      ref={stageRef as Ref<ITryOnStageRef<ILipTryOnState>>}
                      mode={flow.mode}
                      uploadedImageUrl={flow.uploadedImageUrl}
                      initialState={{
                        type: tryOn.subCategory,
                        color: flow.engineState?.color ?? null,
                        // Persists the intensity slider's position across Live<->Upload toggles
                        // too, same reasoning as `color` above - falls back to the engine's own
                        // default rather than `undefined` (which would win the spread in
                        // getInitialState()).
                        range: flow.engineState?.range ?? rangeBounds.default,
                      }}
                      onStateChange={(engineState) => {
                        setFlow((prev) => ({ ...prev, engineState }));
                      }}
                    />
                  ) : tryOn.category === 'EYE' ? (
                    <EyeTryOnStage
                      key={retryKey}
                      // See the matching cast comment on <LipTryOnStage> above.
                      ref={stageRef as Ref<ITryOnStageRef<IEyeTryOnState>>}
                      mode={flow.mode}
                      uploadedImageUrl={flow.uploadedImageUrl}
                      initialState={{
                        type: tryOn.subCategory,
                        color: flow.engineState?.color ?? null,
                        range: flow.engineState?.range ?? rangeBounds.default,
                        // Persists the pattern picker's position across Live<->Upload toggles
                        // too, same reasoning as `color`/`range` above - `IEyeTryOnState` only
                        // (LIP/FACE's `flow.engineState` can never have a `pattern` field, so this
                        // reads `undefined` there rather than a type error). Falls back to this
                        // *subCategory's own* default pattern, not `EyeEngineBase.getInitialState()`'s
                        // placeholder - an object-spread key set to `undefined` still overrides
                        // the base value it's spread onto (`{...getInitialState(), pattern:
                        // undefined}` really does end up `undefined`, it doesn't fall through to
                        // the base), and since EYELINER/KAJAL use separate pattern-id namespaces,
                        // only a lookup keyed by the actual subCategory gives the right one for
                        // both - a single fixed fallback would be wrong for whichever finish it
                        // wasn't written for.
                        pattern:
                          (flow.engineState as IEyeTryOnState | null)?.pattern ??
                          EYE_DEFAULT_PATTERNS[tryOn.subCategory],
                      }}
                      onStateChange={(engineState) => {
                        setFlow((prev) => ({ ...prev, engineState }));
                      }}
                    />
                  ) : tryOn.category === 'HAIR' ? (
                    <HairTryOnStage
                      key={retryKey}
                      // See the matching cast comment on <LipTryOnStage> above.
                      ref={stageRef as Ref<ITryOnStageRef<IHairTryOnState>>}
                      mode={flow.mode}
                      uploadedImageUrl={flow.uploadedImageUrl}
                      initialState={{
                        type: tryOn.subCategory,
                        color: flow.engineState?.color ?? null,
                        range: flow.engineState?.range ?? rangeBounds.default,
                      }}
                      onStateChange={(engineState) => {
                        setFlow((prev) => ({ ...prev, engineState }));
                      }}
                    />
                  ) : tryOn.category === 'NAIL' ? (
                    <NailTryOnStage
                      key={retryKey}
                      // See the matching cast comment on <LipTryOnStage> above.
                      ref={stageRef as Ref<ITryOnStageRef<INailTryOnState>>}
                      mode={flow.mode}
                      uploadedImageUrl={flow.uploadedImageUrl}
                      initialState={{
                        type: tryOn.subCategory,
                        color: flow.engineState?.color ?? null,
                        range: flow.engineState?.range ?? rangeBounds.default,
                      }}
                      onStateChange={(engineState) => {
                        setFlow((prev) => ({ ...prev, engineState }));
                      }}
                    />
                  ) : (
                    <FaceTryOnStage
                      key={retryKey}
                      // See the matching cast comment on <LipTryOnStage> above.
                      ref={stageRef as Ref<ITryOnStageRef<IFaceTryOnState>>}
                      mode={flow.mode}
                      uploadedImageUrl={flow.uploadedImageUrl}
                      initialState={{
                        type: tryOn.subCategory,
                        color: flow.engineState?.color ?? null,
                        range: flow.engineState?.range ?? rangeBounds.default,
                      }}
                      onStateChange={(engineState) => {
                        setFlow((prev) => ({ ...prev, engineState }));
                      }}
                    />
                  )}

                  {/* Not-ready-yet overlay - each mode has its own readiness signal (camera
                    permission vs. image processing), rolled into `isTryOnReady` since only the
                    orchestrator knows which mode is active. */}
                  {!isTryOnReady && (
                    <TryOnOverlay
                      icon={notReadyIcon}
                      title={notReadyTitle}
                      description={notReadyDescription}
                      action={notReadyError ? { label: 'Retry', onClick: handleRetry } : undefined}
                    />
                  )}

                  {/* Continuously reactive (recomputed every renderFrame, not a one-time
                    setup gate like the overlay above) - covers the canvas again if the user
                    drifts out of frame or too far away mid-session, even after already having
                    been ready once. */}
                  {isTryOnReady && detectionStatus && detectionStatus !== 'detected' && (
                    <TryOnOverlay
                      icon={DETECTION_GUIDE_COPY[detectionStatus].icon}
                      title={DETECTION_GUIDE_COPY[detectionStatus].title}
                      description={DETECTION_GUIDE_COPY[detectionStatus].description}
                    />
                  )}

                  {canInteract && compareCanvas && (
                    <TryOnCompareSlider
                      canvas={compareCanvas}
                      onDrag={(value) => {
                        stageRef.current?.setComparePosition(value);
                      }}
                    />
                  )}

                  {/* Above TryOnCompareSlider's full-canvas z-4 drag surface, so the toggle
                    itself (to turn compare back off) stays clickable while it's active. */}
                  <TryOnTopControls
                    compareProps={{
                      active: !!compareCanvas,
                      disabled: !canInteract || !flow.engineState?.color,
                      onClick: handleCompareToggle,
                    }}
                    downloadProps={{
                      disabled: !canInteract || !flow.engineState?.color || !!compareCanvas,
                      onClick: handleDownload,
                    }}
                  />

                  {/* Hidden while comparing - both would otherwise sit on top of the drag
                    surface and fight it for clicks, and neither is meaningful mid-comparison. */}
                  <div
                    className={`absolute inset-x-0 bottom-0 z-3 flex flex-col items-center gap-2 ${compareCanvas ? 'hidden' : ''}`}
                  >
                    {/* Intensity slider - only meaningful once a shade is actually applied. */}
                    {flow.engineState?.color && (
                      <TryOnRangeSlider
                        value={flow.engineState.range}
                        min={rangeBounds.min}
                        max={rangeBounds.max}
                        color={flow.engineState.color}
                        disabled={!canInteract}
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
                      disabled={!canInteract}
                    />

                    {/* EYE-only, same "only meaningful once a shade is applied" gate as the
                      intensity slider above - and only for a subCategory that actually has a
                      pattern list (see EYE_PATTERNS's own comment). */}
                    {eyePatterns && flow.engineState?.color && (
                      <TryOnPatternSwatches
                        className="w-full"
                        patterns={eyePatterns}
                        appliedPattern={(flow.engineState as IEyeTryOnState).pattern}
                        onSelect={handlePatternSelect}
                        disabled={!canInteract}
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Large screens only - unchanged from before. Below `lg:`, this same content is
              reachable through the two bottom-sheet triggers instead (just below). */}
            <div className="hidden flex-col gap-2 lg:flex">
              <TryOnSidebar
                category={tryOn.category}
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
              <InputError error={uploadError} className="text-center" />
            </div>

            <BottomButtons
              isTryOnReady={isTryOnReady}
              step={flow.step}
              mode={flow.mode}
              onModeToggle={handleModeToggle}
              onModelsClick={setActiveSheet}
            />
            <InputError error={uploadError} className="text-center lg:hidden" />
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
              category={tryOn.category}
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
