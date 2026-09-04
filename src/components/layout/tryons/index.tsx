// eslint-disable-next-line simple-import-sort/imports
import type { TTryOnSelection } from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import type { Ref } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { IEyeTryOnState } from '@/classes/tryon/categories/eye';
import type { IFaceTryOnState } from '@/classes/tryon/categories/face';
import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import { EYE_PATTERNS, EYE_RANGE_BOUNDS } from '@/constants/tryon-constants/eye';
import { FACE_RANGE_BOUNDS } from '@/constants/tryon-constants/face';
import { LIP_RANGE_BOUNDS } from '@/constants/tryon-constants/lip';
import useDebounce from '@/hooks/useDebounce';
import useTryOnUpload from '@/hooks/useTryOnUpload';
import type {
  IMakeupState,
  IShade,
  ITryOnStageRef,
  TFaceDetectionStatus,
} from '@/types/tryon-types';

import { InputError } from '@/components/ui/inputs/children';
import BottomButtons from './BottomButtons';
import EyeTryOnStage from './eye/EyeTryOnStage';
import FaceTryOnStage from './face/FaceTryOnStage';
import LipTryOnStage from './lip/LipTryOnStage';
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
  engineState: ILipTryOnState | IFaceTryOnState | IEyeTryOnState | null;
}

// `stageRef` below has to hold whichever category's stage is currently mounted - not the full
// `ITryOnStageRef<ILipTryOnState> | ITryOnStageRef<IFaceTryOnState>` union, though. That union
// fails wherever a `<XTryOnStage>` component's own single-category ref prop needs it:
// `setMakeupState`'s `type` field is contravariant per category (LIP's finishes aren't
// assignable where FACE's are expected, and vice versa), so a value valid for a *union* target
// isn't guaranteed valid for either concrete one alone. This narrower interface sidesteps that -
// it only declares what this file actually calls, with `setMakeupState` narrowed to exactly the
// fields ever passed here (`color`/`range`, never `type`). Every category's full
// `ITryOnStageRef<TState>` is still structurally assignable *to* this narrower shape (accepting
// `Partial<TState>` already covers accepting a plain `{color, range}`), so passing this as
// either stage's `ref` still type-checks correctly - only the reverse (using the narrow type
// somewhere a full one is required) wouldn't.
interface ITryOnStageColorRangeRef {
  // `pattern` is EYE-only (see `IEyeTryOnState`) - optional here since LIP/FACE never pass it,
  // but declaring it lets this one shared ref type also cover the EYE branch below. A concrete
  // engine that doesn't know about `pattern` (LIP/FACE) just never receives it at runtime -
  // TryOnModal only ever calls `setMakeupState({ pattern })` from EYE-specific handlers.
  setMakeupState: (state: { color?: string | null; range?: number; pattern?: string }) => void;
  getState: () => IMakeupState;
  takeSnapshot: () => string | null;
  getStream: () => MediaStream | null;
  setComparePosition: (value: number | null) => void;
  getCanvas: () => HTMLCanvasElement;
}

const INITIAL_FLOW_STATE: ITryOnFlowState = {
  step: 'select',
  mode: 'live',
  uploadedImageUrl: null,
  engineState: null,
};

// How long a non-'detected' `faceDetection` reading has to hold continuously before the
// face-guide TryOnOverlay actually shows (see the debounce effect below) - showing it the instant
// a single frame reports one flickers constantly, since a stray frame or two of jitter/motion-
// blur/momentary occlusion is normal and shouldn't interrupt the flow.
const FACE_GUIDE_DEBOUNCE_MS = 1500;

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
  // Bumped only by the error overlay's "Retry" action (see `handleRetry` below) - passed as
  // `key` on the stage below, so changing it forces React to fully unmount+remount it. That's
  // deliberately heavier than calling some narrower "retry" method on the engine: a fresh mount
  // re-runs the exact same setup path that worked the first time (new engine, `startTryOn()`,
  // `startCamera()`/`loadImageUrl()`) for *any* of the ways that setup can fail - camera
  // permission, image decode, or the shared landmarker/texture load - without needing a
  // separate recovery method wired up per failure mode.
  const [retryKey, setRetryKey] = useState(0);
  // Debounced view of `flow.engineState?.faceDetection` (see the effect below) - the overlay/
  // disabled-controls logic further down reads this instead of the raw per-frame value, so both
  // stay in sync with each other (never "controls disabled but no overlay explains why").
  const [debouncedFaceDetection, setDebouncedFaceDetection] = useState<
    TFaceDetectionStatus | undefined
  >(undefined);

  const stageRef = useRef<ITryOnStageColorRangeRef>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const { previewUrl, error: uploadError, setFile, reset: resetUpload } = useTryOnUpload();

  // Shared debounce-a-callback hook (see useDebounce.ts) instead of a hand-rolled setTimeout/
  // cleanup pair - owns the timer/cleanup mechanics, this just supplies what to call and when.
  // `cancel` matters here specifically - see the effect below.
  const { trigger: debounceFaceDetection, cancel: cancelFaceDetectionDebounce } = useDebounce<
    [TFaceDetectionStatus | undefined]
  >({
    callback: setDebouncedFaceDetection,
    delay: FACE_GUIDE_DEBOUNCE_MS,
  });

  // Shared readiness check - drives both the not-ready overlay and disabling shade/model
  // selection until the stage can actually act on either. Declared up here (not just further
  // down where it's also used for render) because the face-detection debounce right below needs
  // it too.
  const isTryOnReady =
    flow.step === 'tryon' &&
    (flow.mode === 'live'
      ? !!flow.engineState?.cameraReady
      : !!flow.uploadedImageUrl && !!flow.engineState?.imageReady);

  // Gated on `isTryOnReady`, not read unconditionally - `cameraReady`/`imageReady` and
  // `faceDetection` becoming correct don't land in the same state update (the engine's own
  // `getInitialState` default, `'not-in-frame'`, is what `flow.engineState.faceDetection` holds
  // the instant `cameraReady`/`imageReady` first flips true - the *real* reading from an actual
  // renderFrame pass only arrives in a following update). Reading the raw value unconditionally
  // here would prime `debouncedFaceDetection` with that stale default the moment the stage
  // became ready, which - since 'not-in-frame' is falsy-different-from-'detected' - could flash
  // the face-guide TryOnOverlay on for that one render before the real reading corrects it a
  // moment later. Forcing this to stay `undefined` until `isTryOnReady` is true sidesteps that: the
  // first value it can ever take on is whatever the *next* real update reports, never the
  // engine's un-started default.
  const rawFaceDetection = isTryOnReady ? flow.engineState?.faceDetection : undefined;
  useEffect(() => {
    // Recovering to 'detected' (or resetting to no reading at all, e.g. on mode/model switch -
    // see `flow.engineState` getting set back to `null` in several handlers below, or
    // `isTryOnReady` itself going false again while a new engine spins up) is never debounced -
    // only showing the warning needs the "did this actually last a while" check, not clearing
    // it once things are genuinely fine again.
    if (!rawFaceDetection || rawFaceDetection === 'detected') {
      // Must cancel, not just skip scheduling a new one - a mode/model switch remounts the
      // stage's engine, whose fresh initial state briefly reports 'not-in-frame' (see
      // LipEngineBase.getInitialState) before the first real detection comes in. That
      // transient reading already started a debounced timer below; if the *real* 'detected'
      // reading (this branch) only set state directly without cancelling it, that stale timer
      // would still fire ~FACE_GUIDE_DEBOUNCE_MS later and clobber this correct value right
      // back to 'not-in-frame' - the overlay flashing on for no visible reason well after the
      // switch. See useDebounce.ts's `cancel` comment.
      cancelFaceDetectionDebounce();
      // Mirrors an external signal (the engine's own state), not a render-derived value - a
      // plain useMemo can't run this "only sometimes" conditionally against a timer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDebouncedFaceDetection(rawFaceDetection);
      return;
    }

    debounceFaceDetection(rawFaceDetection);
  }, [rawFaceDetection, debounceFaceDetection, cancelFaceDetectionDebounce]);

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
    setRetryKey(0);
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
  // own status overlay covers the "processing photo" loading state until `imageReady`. Only
  // advances on a file `setFile` actually accepted - staying on 'instructions' when it's
  // rejected (oversized, wrong type) leaves the engine unmounted rather than stuck forever on
  // its own loading overlay for an image that's never coming, with `uploadError`'s rejection
  // message rendered right below it at the same time (see `useTryOnUpload.setFile`'s comment).
  const handleFileSelected = (file: File) => {
    resetUpload();
    if (!setFile(file)) return;
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

  // EYE-only (see TryOnPatternSwatches) - unlike shades, there's no deselect-to-null here, a
  // pattern-bearing finish always has *some* pattern applied once picked.
  const handlePatternSelect = (patternId: string) => {
    stageRef.current?.setMakeupState({ pattern: patternId });
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

  // Wired to the not-ready overlay's "Retry" action (only shown once `flow.engineState?.error`
  // is actually set - see `notReadyError` below) - bumping `retryKey` remounts the stage fresh
  // (see its own comment above).
  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };

  const handleDownload = () => {
    const dataUrl = stageRef.current?.takeSnapshot();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'Try-On.png';
    link.click();
  };

  // Reads the *debounced* signal (see the effect above, already gated on `isTryOnReady` at the
  // source), not the raw per-frame one, so this and the face-guide TryOnOverlay's visibility
  // never disagree. Reused below both to show that overlay and to keep shade/compare/download
  // actions disabled while it's showing - applying a shade with no reliably-placed face doesn't
  // do anything useful.
  const faceDetection = isTryOnReady ? debouncedFaceDetection : undefined;
  const canInteract = isTryOnReady && faceDetection === 'detected';

  // Copy for the not-ready overlay below (TryOnOverlay - the very same component the
  // face-detection guide further down uses) - split out here since it's a 2x2 matrix (loading/
  // error x live/upload), too much for the JSX to carry inline. `notReadyError` set is exactly
  // when this used to switch from a spinner to an error card, so the icon/title mirror that
  // same split.
  const notReadyError = flow.engineState?.error;
  const notReadyIcon = notReadyError
    ? 'solar:danger-triangle-linear'
    : flow.mode === 'live'
      ? 'solar:videocamera-record-linear'
      : 'solar:gallery-add-linear';
  const notReadyTitle = notReadyError
    ? flow.mode === 'live'
      ? 'Camera unavailable'
      : "Couldn't process photo"
    : flow.mode === 'live'
      ? 'Waiting for camera permission...'
      : 'Processing photo...';
  const notReadyDescription = notReadyError ?? 'This should only take a moment.';

  // Copy for the face-guide overlay below, keyed by every non-'detected' `TFaceDetectionStatus`
  // value - a `Record` (not another inline ternary chain like `notReadyIcon` above) specifically
  // so TS forces a new entry here the moment a category ever adds another status value, instead
  // of that new case silently falling through to the wrong copy. 'turned' only ever actually
  // shows for FACE (see `FaceEngineBase.refineFaceDetectionStatus`) - LIP's `faceDetection` can
  // never take that value, but the copy still lives here rather than forked per category, same
  // reasoning as everything else in this shared overlay.
  const FACE_GUIDE_COPY: Record<
    Exclude<TFaceDetectionStatus, 'detected'>,
    { icon: string; title: string; description: string }
  > = {
    'not-in-frame': {
      icon: 'solar:scanner-linear',
      title: 'Face not in frame',
      description: 'Move so your whole face is inside the frame.',
    },
    'not-clear': {
      icon: 'solar:danger-triangle-linear',
      title: 'Face not clearly visible',
      description: "Move closer, and make sure there's good, even lighting.",
    },
    turned: {
      // Same icon as the "facing the camera directly" instruction-screen tip
      // (FACE_UPLOAD_INSTRUCTIONS/FACE_LIVE_INSTRUCTIONS) - deliberately not 'not-in-frame's
      // scanner icon, even though both guide the shopper toward a better frame, since this one
      // reads as its own distinct situation (in frame, just angled) rather than another flavor
      // of "not in frame at all".
      icon: 'solar:face-scan-circle-linear',
      title: 'Face turned too much',
      description: 'Face the camera directly - a slight turn is fine, just not a big one.',
    },
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
      {/* Only LIP, FACE, and EYE have a rendering engine built so far - see
          docs/tryons/README.md. The discriminant check stays inline (not a separately-computed
          boolean) so TS keeps narrowing `tryOn` to `{category: 'LIP' | 'FACE' | 'EYE', ...}` for
          every access inside the branch below - a plain boolean variable would lose that link. */}
      {!tryOn ||
      (tryOn.category !== 'LIP' && tryOn.category !== 'FACE' && tryOn.category !== 'EYE') ? (
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <Icon icon="solar:hourglass-linear" className="text-primary/40 size-8" />
          <p className="text-tertiary text-sm">
            {tryOn
              ? `Try-on for ${tryOn.category} is coming soon.`
              : 'This product has no Try-On configured yet.'}
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
                        // (LIP/FACE's `flow.engineState` can never have a `pattern` field, so
                        // this reads `undefined` there rather than a type error, falling back to
                        // EYELINER_DEFAULT_PATTERN via `EyeEngineBase.getInitialState()`).
                        pattern: (flow.engineState as IEyeTryOnState | null)?.pattern ?? undefined,
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
                  {isTryOnReady && faceDetection && faceDetection !== 'detected' && (
                    <TryOnOverlay
                      icon={FACE_GUIDE_COPY[faceDetection].icon}
                      title={FACE_GUIDE_COPY[faceDetection].title}
                      description={FACE_GUIDE_COPY[faceDetection].description}
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
                  <div className="absolute top-3 right-3 z-5 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={
                        compareCanvas ? 'Hide before/after compare' : 'Compare before/after'
                      }
                      onClick={handleCompareToggle}
                      disabled={!canInteract || !flow.engineState?.color}
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
                      disabled={!canInteract || !flow.engineState?.color || !!compareCanvas}
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
