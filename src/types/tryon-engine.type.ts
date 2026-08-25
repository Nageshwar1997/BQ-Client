// Generic types for the class-based Try-On rendering engine (canvas + MediaPipe
// FaceLandmarker) in `@/classes/tryon`. Shared by every category's engine
// (LipEngineBase today, EyeEngineBase/FaceEngineBase/... later) - not to be
// confused with `@/types/tryon.type`, which holds the product-taxonomy types
// (TRY_ON_MAP category/subCategory) and is a temporary shim for that concern.

export type TRunningMode = 'VIDEO' | 'IMAGE';

export type ColorTuple = [r: number, g: number, b: number, a: number];

export interface IMakeupBaseState {
  cameraReady: boolean;
  imageReady: boolean;
  tryOnStarted: boolean;
  error?: string;
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
