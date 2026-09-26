import type { HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';

import type { IMakeupState, TRGBTuple, TRunningMode } from '@/types/tryon-types';
import type { IApplyNailEffectParams } from '@/types/tryon-types/nail';
import { captureSnapShot, hexToRGBA, resizeElements } from '@/utils/tryon-utils';
import { getHandDetectionStatus } from '@/utils/tryon-utils/nail';

import { getSharedHandLandmarker } from './HandLandmarkerCache';

/**
 * `TryOnEngineBase`'s counterpart for hand-tracked categories - same state pub-sub, abort-safe
 * lifecycle, canvas sizing, compare-slider split-screen render, and snapshot capture, just built
 * on MediaPipe `HandLandmarker` (a *plural*, multi-hand landmark result) instead of
 * `FaceLandmarker` (a single face). Deliberately a parallel file, not a change to
 * `TryOnEngineBase` itself - that class's `startTryOn`/`renderFrame` call `getSharedFaceLandmarker`
 * and read `this.landmark.faceLandmarks[0]` directly (not through any overridable "detector"
 * abstraction), and `IRenderTargetParams`'s base shape carries a single-`face` field that can't
 * represent multiple detected hands. Much closer to `TryOnEngineBase`'s own original shape than
 * `SegmentationEngineBase` (HAIR's own parallel) had to be, though - `HandLandmarker`'s
 * `detect`/`detectForVideo` are synchronous just like `FaceLandmarker`'s, no callback/mask-lifetime
 * complexity to work around. See docs/tryons/NAIL-PLAN.md's "Engine architecture" section for the
 * full reasoning.
 *
 * `TAssets` is whatever a category needs loaded once before rendering can start - `null` for
 * every NAIL finish so far (see `INailAssets`).
 */
export abstract class HandTrackingEngineBase<TState extends IMakeupState, TAssets = null> {
  protected state: TState;

  protected canvas1: HTMLCanvasElement;
  protected canvas2: HTMLCanvasElement;

  protected handLandmarker: HandLandmarker | null = null;
  protected hands: NormalizedLandmark[][] = [];
  protected assets: TAssets | null = null;

  protected cachedRGB: TRGBTuple | null = null;
  protected comparePosition: number | null = null;
  protected isMirrored = false;

  private listeners: ((state: TState) => void)[] = [];

  // lifecycle guards
  private destroyed = false;
  private initToken = 0;
  private abortController: AbortController | null = null;

  constructor(
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    initialState?: Partial<TState>,
  ) {
    this.canvas1 = canvas1;
    this.canvas2 = canvas2;
    this.state = { ...this.getInitialState(), ...initialState };

    // Same reasoning as `TryOnEngineBase`/`SegmentationEngineBase`'s identical block - a color
    // seeded straight through `initialState` (switching Live<->Upload with a shade already
    // applied) never goes through `updateState.set`, so `renderFrame` would silently no-op
    // without this.
    if (this.state.color) {
      const [r, g, b] = hexToRGBA(this.state.color);
      this.cachedRGB = [r, g, b];
    }
  }

  /* ================= STATE ================= */

  get currentState(): TState {
    return this.state;
  }

  public getState(): TState {
    return this.state;
  }

  public setMakeupState(partial: Partial<TState>) {
    this.updateState.set(partial);
  }

  public resetState() {
    this.updateState.internalReset();
  }

  public onSourceChange() {
    this.updateState.setCameraReady(false);
    this.updateState.setImageReady(false);
  }

  public setComparePosition(value: number | null) {
    this.comparePosition = value;
    if (this.getRunningMode() === 'IMAGE') this.onStateUpdated();
  }

  public setMirror(value: boolean) {
    this.isMirrored = value;
  }

  public getCanvas() {
    return this.canvas2;
  }

  public updateState = {
    set: (partial: Partial<TState>) => {
      const {
        cameraReady: _cameraReady,
        imageReady: _imageReady,
        tryOnStarted: _tryOnStarted,
        error: _error,
        ...safePartial
      } = partial;

      const prev = this.state;
      this.state = { ...prev, ...safePartial };

      if (safePartial.color && safePartial.color !== prev.color) {
        const [r, g, b] = hexToRGBA(safePartial.color);
        this.cachedRGB = [r, g, b];
      }

      this.notify();
      this.onStateUpdated();
    },

    internalReset: () => {
      this.state = this.getInitialState();
      this.cachedRGB = null;
      this.notify();
    },

    setCameraReady: (value: boolean) => {
      this.state = { ...this.state, cameraReady: value };
      this.notify();
    },

    setImageReady: (value: boolean) => {
      this.state = { ...this.state, imageReady: value };
      this.notify();
    },

    setTryOnStarted: (value: boolean) => {
      this.state = { ...this.state, tryOnStarted: value };
      this.notify();
    },

    setError: (message: string | undefined) => {
      this.state = { ...this.state, error: message };
      this.notify();
    },

    // Reused as-is from `TryOnEngineBase`/`SegmentationEngineBase` - still literally named
    // `faceDetection` (`IMakeupBaseState`, shared by every category's state), just repurposed
    // here to mean "at least one hand confidently detected" instead of "face".
    setFaceDetectionStatus: (value: TState['faceDetection']) => {
      if (this.state.faceDetection === value) return;
      this.state = { ...this.state, faceDetection: value };
      this.notify();
    },
  };

  private notify() {
    this.listeners.forEach((listener) => {
      listener(this.state);
    });
  }

  public onChange(listener: (state: TState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /* ================= INIT ================= */

  private createAbortSignal() {
    this.abortController?.abort();
    this.abortController = new AbortController();
    return this.abortController.signal;
  }

  public async startTryOn(): Promise<void> {
    const token = ++this.initToken;
    const signal = this.createAbortSignal();
    this.destroyed = false;

    try {
      this.assets = await this.loadCategoryAssets(signal);
      if (signal.aborted || !this.ensureAlive(token)) return;

      this.handLandmarker = await getSharedHandLandmarker(
        this.canvas1,
        this.getRunningMode(),
        signal,
      );
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (signal.aborted || !this.ensureAlive(token)) return;

      this.updateState.setTryOnStarted(true);
      await this.onTryOnReady();
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('startTryOn failed', err);

      // Same "don't call cleanup()" reasoning as `TryOnEngineBase`/`SegmentationEngineBase` -
      // this engine is still mounted and still subscribed-to by the React wrapper.
      this.handLandmarker = null;
      this.updateState.setError("Couldn't set up the Try-On. Check your connection and try again.");
    }
  }

  /* ================= RENDER ================= */

  protected renderFrame(drawSource: HTMLVideoElement | HTMLImageElement) {
    const ctx = this.canvas2.getContext('2d');
    if (!ctx) return;

    resizeElements(drawSource, this.canvas1, this.canvas2);

    const width = this.canvas2.width;
    const height = this.canvas2.height;

    ctx.clearRect(0, 0, width, height);

    this.updateState.setFaceDetectionStatus(getHandDetectionStatus(this.hands));

    ctx.save();

    // ===== MIRROR (LIVE MODE ONLY) =====
    if (this.isMirrored) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    // Always draw the base frame, even with nothing selected yet.
    ctx.drawImage(drawSource, 0, 0, width, height);

    if (this.hands.length === 0 || !this.state.color || !this.cachedRGB) {
      ctx.restore();
      return;
    }

    const dimension = { width, height };
    const rgb = this.cachedRGB;
    const hands = this.hands;
    const applyNailEffect = () => {
      this.applyEffect({ hands, ctx, dimension, rgb, state: this.state, assets: this.assets });
    };

    // ===== NORMAL MODE (NO SPLIT) =====
    if (this.comparePosition === null) {
      applyNailEffect();
      ctx.restore();
      return;
    }

    // ===== COMPARE-SLIDER SPLIT MODE =====
    const screenSplit = width * this.comparePosition;
    const drawingSplit = this.isMirrored ? width - screenSplit : screenSplit;

    ctx.save();
    ctx.beginPath();

    if (this.isMirrored) {
      ctx.rect(0, 0, drawingSplit, height);
    } else {
      ctx.rect(drawingSplit, 0, width - drawingSplit, height);
    }

    ctx.clip();
    applyNailEffect();

    ctx.restore(); // restore clip
    ctx.restore(); // restore mirror transform

    // ===== DIVIDER (SCREEN SPACE) =====
    ctx.save();

    ctx.beginPath();
    ctx.moveTo(screenSplit, 0);
    ctx.lineTo(screenSplit, height);
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();

    const spread = 6;
    const gradient = ctx.createLinearGradient(screenSplit - spread, 0, screenSplit + spread, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.35, 'rgba(255,255,255,0.7)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.65, 'rgba(255,255,255,0.7)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.beginPath();
    ctx.moveTo(screenSplit, 0);
    ctx.lineTo(screenSplit, height);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(255,255,255,0.9)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.stroke();

    ctx.restore();
  }

  /* ================= SNAPSHOT ================= */

  protected takeSnapshotInternal(source: HTMLVideoElement | HTMLImageElement) {
    return captureSnapShot(source, this.canvas2);
  }

  /* ================= LIFECYCLE ================= */

  protected ensureAlive(token?: number) {
    if (this.destroyed) return false;
    if (token !== undefined && token !== this.initToken) return false;
    return true;
  }

  public destroy() {
    this.destroyed = true;
    this.initToken++;
    this.abortController?.abort();
    this.abortController = null;
    this.cleanup();
  }

  protected cleanup() {
    this.listeners = [];
    // Deliberately NOT closing `this.handLandmarker` - it's a shared instance from
    // `HandLandmarkerCache`, reused by later mounts (same reasoning as
    // `TryOnEngineBase.cleanup`/`SegmentationEngineBase.cleanup` not closing their own shared
    // detector).
    this.handLandmarker = null;
    this.hands = [];
    this.updateState.internalReset();
  }

  /* ================= ABSTRACT (category-specific) ================= */

  protected abstract getRunningMode(): TRunningMode;
  protected abstract onTryOnReady(): Promise<void> | void;
  protected abstract onStateUpdated(): void;
  protected abstract getInitialState(): TState;
  protected abstract loadCategoryAssets(signal: AbortSignal): Promise<TAssets | null>;
  protected abstract applyEffect(params: IApplyNailEffectParams<TState, TAssets>): void;
}
