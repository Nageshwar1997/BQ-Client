// Generic types for the class-based Try-On rendering engine (canvas + MediaPipe
// FaceLandmarker) in `@/classes/tryon`. Shared by every category's engine
// (LipEngineBase today, EyeEngineBase/FaceEngineBase/... later). Product-taxonomy types
// (TRY_ON_MAP category/subCategory) live in `@beautinique/frontend-types` instead - not here.

import type { FaceDetectorOptions, Landmark } from '@mediapipe/tasks-vision';

export type TRunningMode = FaceDetectorOptions['runningMode'];

export type ColorTuple = [r: number, g: number, b: number, a: number];

export type TDimension = Record<'width' | 'height', number>;

export type TPoint = Pick<Landmark, 'x' | 'y'>;

// Recomputed every `renderFrame` call (see `TryOnEngineBase`) from that frame's landmark
// detection, not a one-time setup flag like `cameraReady`/`imageReady` below - it can flip back
// and forth as the user moves in and out of frame while Live mode keeps running.
// 'not-in-frame': no face detected at all, or one that's partially cut off by the frame edge.
// 'not-clear': a face is detected and fully inside the frame, but too small to trust (too far
// from the camera, or - by the same "too little of the face is confidently visible" reasoning -
// too obscured/blurry in practice).
// 'turned': a face is detected, in frame, and large enough, but turned too far to one side -
// only ever produced by categories whose rendering genuinely needs a frontal-ish pose (see
// `TryOnEngineBase.refineFaceDetectionStatus` and `FaceEngineBase`'s override); a category that
// never overrides that hook can never report this value.
// 'detected': good enough to try makeup on.
export type TFaceDetectionStatus = 'detected' | 'not-in-frame' | 'not-clear' | 'turned';

export interface IMakeupBaseState {
  cameraReady: boolean;
  imageReady: boolean;
  tryOnStarted: boolean;
  error?: string;
  faceDetection: TFaceDetectionStatus;
}

// `TType` is a category's finish/variant union (e.g. a LIP subcategory like
// 'MATTE' | 'GLOSS' | ...) - `null` means "no finish picked yet".
export interface IMakeupState<TType extends string = string> extends IMakeupBaseState {
  type: TType | null;
  color: string | null;
  range: number;
}

// Imperative API every category's engine (Live or Upload) exposes up to its React wrapper
// component, generic over that category's state shape. Deliberately a plain interface (not a
// reference to the `TryOnEngineBase` class type) - the engine mixins (`withLiveCamera`/
// `withImageUpload`) cast their return type to these, and casting to a *class* type would
// drag its abstract-member bookkeeping along, defeating the cast. See those files' comments.
export interface ITryOnEngineBaseRef<TState> {
  setMakeupState: (state: Partial<TState>) => void;
  getState: () => TState;
  takeSnapshot: () => string | null;
  resetState: () => void;
  onSourceChange: () => void;
  setComparePosition: (value: number | null) => void;
  getCanvas: () => HTMLCanvasElement;
  onChange: (listener: (state: TState) => void) => () => void;
  startTryOn: () => Promise<void>;
  destroy: () => void;
}

export interface ITryOnLiveEngineRef<TState> extends ITryOnEngineBaseRef<TState> {
  attachVideo: (video: HTMLVideoElement) => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  restartCamera: () => Promise<void>;
  getStream: () => MediaStream | null;
}

export interface ITryOnUploadEngineRef<TState> extends ITryOnEngineBaseRef<TState> {
  loadImageUrl: (url: string) => Promise<void>;
}

// Minimal imperative surface a category's `<Category>TryOnStage` exposes to the orchestrating
// modal (e.g. `TryOnModal`) - just enough to drive shade selection, snapshotting, and the
// before/after compare split, whichever of Live/Upload is currently mounted underneath. Mirrors
// the reference implementation's `ITryOnCommonRef`, trimmed to what this app actually uses (no
// reset yet).
export interface ITryOnStageRef<TState> {
  setMakeupState: (state: Partial<TState>) => void;
  getState: () => TState | undefined;
  takeSnapshot: () => string | null;
  // Only meaningful in Live mode - `null` otherwise (Upload mode has no camera stream). Used to
  // feed the same stream into the sidebar's small blurred preview.
  getStream: () => MediaStream | null;
  // `null` clears the split (normal render); a 0-1 fraction shows "before" left of that x
  // position and "after" (the makeup-composited render) right of it. See `TryOnEngineBase`'s
  // `renderFrame` for the actual split/divider draw.
  setComparePosition: (value: number | null) => void;
  // The canvas actually being drawn to - lets a UI-side compare-slider account for its CSS
  // `object-fit` (contain/cover) sizing, so the draggable divider lines up with the one
  // `renderFrame` itself draws instead of assuming the canvas fills its box edge-to-edge.
  getCanvas: () => HTMLCanvasElement | null;
}

// A product's shade/color variant - real data (`product.variants`, `type === 'Color'`), not
// user-invented via a color picker. See `ProductDetails/index.tsx`'s `shades` memo.
export interface IShade {
  name: string;
  hexColor: string;
}

// How much of a canvas's own box its actual rendered content occupies, horizontally, once CSS
// `object-fit` has scaled it (see `getObjectFitContentRect` in utils/tryon-utils/index.ts) -
// lets UI drawn *over* the canvas (the compare-slider divider, see `TryOnCompareSlider.tsx`)
// line up with the actual rendered frame instead of the box's raw edges.
export interface IObjectFitContentRect {
  leftPercent: number;
  widthPercent: number;
}

export interface IRangeBounds {
  min: number;
  max: number;
  default: number;
}
