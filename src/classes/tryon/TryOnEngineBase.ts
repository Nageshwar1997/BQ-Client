import type {
  FaceLandmarker,
  FaceLandmarkerResult,
  NormalizedLandmark,
} from '@mediapipe/tasks-vision';

import type { ColorTuple, IMakeupState, TRunningMode } from '@/types/tryon-engine.type';
import { captureSnapShot, hexToRGBA, resizeElements } from '@/utils/tryon.util';

import { getSharedFaceLandmarker } from './FaceLandmarkerCache';

/**
 * Category-agnostic engine machinery shared by every Try-On category (LIP today, EYE/FACE/
 * HAIR/SKIN later): state pub-sub, abort-safe lifecycle, canvas sizing, the compare-slider
 * split-screen render, and snapshot capture. Ported from the reference implementation's
 * `<Category>BaseClass` pattern, generalized over `TState`/`TAssets` so this file is written
 * once - a category only ever needs to extend it and fill in the five abstract members below,
 * never touch this file.
 *
 * `TAssets` is whatever a category needs loaded once before rendering can start (LIP loads 6
 * texture images; a color-only category like blush/foundation would use `null`).
 */
export abstract class TryOnEngineBase<TState extends IMakeupState, TAssets = null> {
  protected state: TState;

  protected canvas1: HTMLCanvasElement;
  protected canvas2: HTMLCanvasElement;

  protected landmarker: FaceLandmarker | null = null;
  protected landmark: FaceLandmarkerResult | null = null;
  protected assets: TAssets | null = null;

  protected cachedRGBA: ColorTuple | null = null;
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

    // `updateState.set` computes this for UI-driven color changes, but a color seeded straight
    // through `initialState` (e.g. switching Live<->Upload, or picking a different model, with a
    // shade already applied - see TryOnModal's `initialState`) never goes through that path.
    // Without this, `renderFrame` silently no-ops (it bails on `!this.cachedRGBA`) even though
    // `state.color` - and so the UI's "selected" swatch - is correct.
    if (this.state.color) {
      this.cachedRGBA = hexToRGBA(this.state.color);
    }
  }

  /* ================= STATE ================= */

  get currentState(): TState {
    return this.state;
  }

  // Flat aliases matching `ITryOnEngineBaseRef` (see `@/types/tryon-engine.type`) - the
  // React wrapper's imperative ref is typed against that plain interface rather than this
  // class directly (see `withLiveCamera`/`withImageUpload`'s comments on why), so these exist
  // purely to give it something to point at.
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

    // Upload mode has no continuous render loop, so a compare-slider drag needs to force one.
    if (this.getRunningMode() === 'IMAGE') this.onStateUpdated();
  }

  public setMirror(value: boolean) {
    this.isMirrored = value;
  }

  public getCanvas() {
    return this.canvas2;
  }

  // Grouped under one namespace (rather than loose public methods) so the React wrapper's
  // imperative ref can expose `engine.updateState.set(...)` directly. UI-driven updates go
  // through `set`, which can't touch the lifecycle-owned fields - those are only ever flipped
  // internally (`setCameraReady`/`setImageReady`/`setTryOnStarted`).
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
        this.cachedRGBA = hexToRGBA(safePartial.color);
      }

      this.notify();
      this.onStateUpdated();
    },

    internalReset: () => {
      this.state = this.getInitialState();
      this.cachedRGBA = null;
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

      this.landmarker = await getSharedFaceLandmarker(this.canvas1, this.getRunningMode(), signal);
      // `signal.aborted` can genuinely flip to `true` while the (possibly long) landmarker
      // load above is in flight - TS just can't statically prove that across an `await` on a
      // live DOM property, hence the disable.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (signal.aborted || !this.ensureAlive(token)) return;

      this.updateState.setTryOnStarted(true);
      await this.onTryOnReady();
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('startTryOn failed', err);
      this.cleanup();
    }
  }

  /* ================= RENDER ================= */

  protected renderFrame(drawSource: HTMLVideoElement | HTMLImageElement) {
    const ctx = this.canvas2.getContext('2d');
    if (!ctx || !this.landmark) return;

    resizeElements(drawSource, this.canvas1, this.canvas2);

    const width = this.canvas2.width;
    const height = this.canvas2.height;

    ctx.clearRect(0, 0, width, height);

    const face = this.landmark.faceLandmarks[0];

    ctx.save();

    // ===== MIRROR (LIVE MODE ONLY) =====
    if (this.isMirrored) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    // Always draw the base frame, even with nothing selected yet.
    ctx.drawImage(drawSource, 0, 0, width, height);

    if (!face || !this.state.color || !this.cachedRGBA) {
      ctx.restore();
      return;
    }

    const size = { width, height };
    const rgb = this.cachedRGBA;
    const applyMakeup = () => {
      this.applyEffect(face, ctx, size, rgb, this.state, this.assets);
    };

    // ===== NORMAL MODE (NO SPLIT) =====
    if (this.comparePosition === null) {
      applyMakeup();
      ctx.restore();
      return;
    }

    // ===== COMPARE-SLIDER SPLIT MODE =====
    const screenSplit = width * this.comparePosition;
    const drawingSplit = this.isMirrored ? width - screenSplit : screenSplit;

    ctx.save();
    ctx.beginPath();

    if (this.isMirrored) {
      // Mirror active: clip LEFT drawing space -> becomes RIGHT on screen.
      ctx.rect(0, 0, drawingSplit, height);
    } else {
      ctx.rect(drawingSplit, 0, width - drawingSplit, height);
    }

    ctx.clip();
    applyMakeup();

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
    this.initToken++; // invalidate any in-flight async work
    this.abortController?.abort();
    this.abortController = null;
    this.cleanup();
  }

  protected cleanup() {
    this.listeners = [];
    // Deliberately NOT closing `this.landmarker` - it's a shared instance from
    // `FaceLandmarkerCache`, reused by later mounts/categories. Only drop this engine's
    // reference to it.
    this.landmarker = null;
    this.updateState.internalReset();
  }

  /* ================= ABSTRACT (category-specific) ================= */

  protected abstract getRunningMode(): TRunningMode;
  protected abstract onTryOnReady(): Promise<void> | void;
  protected abstract onStateUpdated(): void;
  protected abstract getInitialState(): TState;
  protected abstract loadCategoryAssets(signal: AbortSignal): Promise<TAssets | null>;
  protected abstract applyEffect(
    face: NormalizedLandmark[],
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    rgb: ColorTuple,
    state: TState,
    assets: TAssets | null,
  ): void;
}
