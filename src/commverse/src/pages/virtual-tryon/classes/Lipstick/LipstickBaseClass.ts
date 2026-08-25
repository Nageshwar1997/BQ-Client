import type {
  FaceLandmarker,
  FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';
import {
  applyOnLips,
  applyTextureOnLips,
  applyTextureOnLipsc,
  applyTextureOnLipss,
  captureSnapShot,
  getInitialState,
  getLandmarker,
  getTextures,
  hexToRGBA,
  resizeElements,
  resolveTextureImages,
} from '../../utils';
import type {
  ColorTuple,
  ILipstickState,
  TRunningMode,
} from '../../../../types';

export abstract class LipstickBaseClass {
  protected state: ILipstickState = getInitialState(
    'Lipstick'
  ) as ILipstickState;

  protected canvas1: HTMLCanvasElement;
  protected canvas2: HTMLCanvasElement;

  protected landmarker: FaceLandmarker | null = null;
  protected landmark: FaceLandmarkerResult | null = null;

  protected textureImages: Record<
    'L' | 'U' | 'Lc' | 'Uc' | 'Ls' | 'Us',
    HTMLImageElement
  > | null = null;

  protected cachedRGBA: ColorTuple | null = null;
  protected listeners: ((state: ILipstickState) => void)[] = [];
  // lifecycle guards
  protected destroyed = false;
  protected initToken = 0;
  protected abortController: AbortController | null = null;
  protected comparePosition: number | null = null;
  protected isMirrored = false;

  constructor(
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    initialState?: Partial<ILipstickState>
  ) {
    this.canvas1 = canvas1;
    this.canvas2 = canvas2;
    this.state = { ...this.state, ...initialState };
  }

  /* ================= STATE ================= */

  get currentState() {
    return this.state;
  }

  public onSourceChange() {
    this.updateState.setCameraReady(false);
    this.updateState.setImageReady(false);
  }

  public setComparePosition(value: number | null) {
    this.comparePosition = value;

    // Upload mode needs forced re-render
    if (this.getRunningMode() === 'IMAGE') {
      this.onStateUpdated();
    }
  }

  public setMirror(value: boolean) {
    this.isMirrored = value;
  }

  public getCanvas() {
    return this.canvas2;
  }

  // UI cannot overwrite lifecycle flags
  public updateState = {
    set: (partial: Partial<ILipstickState>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cameraReady, imageReady, tryOnStarted, error, ...safePartial } =
        partial;

      const prev = this.state;
      this.state = { ...prev, ...safePartial };

      if (safePartial.color && safePartial.color !== prev.color) {
        this.cachedRGBA = hexToRGBA(safePartial.color);
      }

      this.notify();
      this.onStateUpdated();
    },

    // reset is internal-only usage
    internalReset: () => {
      this.state = getInitialState('Lipstick') as ILipstickState;
      this.cachedRGBA = null;
      this.notify();
    },

    // lifecycle setters (class only)
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
  };

  protected notify() {
    this.listeners.forEach((l) => l(this.state));
  }

  public onChange(listener: (state: ILipstickState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /* ================= INIT ================= */

  protected createAbortSignal() {
    this.abortController?.abort();
    this.abortController = new AbortController();
    return this.abortController.signal;
  }

  public async startTryOn(): Promise<void> {
    const token = ++this.initToken;
    const signal = this.createAbortSignal();
    this.destroyed = false;

    try {
      const textures = await getTextures({ signal });
      if (signal.aborted || !this.ensureAlive(token)) return;

      const resolved = resolveTextureImages(textures);
      if (!resolved) throw new Error('Texture resolution failed');

      this.textureImages = resolved.TextureImage;

      this.landmarker = await getLandmarker(
        this.canvas1,
        this.getRunningMode(),
        signal
      );

      if (signal.aborted || !this.ensureAlive(token)) return;

      this.updateState.setTryOnStarted(true);
      await this.onTryOnReady();
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      console.error('startTryOn failed', err);
      this.cleanup();
    }
  }

  /* ================= RENDER ================= */

  protected renderFrame(drawSource: HTMLVideoElement | HTMLImageElement) {
    const ctx = this.canvas2.getContext('2d');
    if (!ctx || !this.landmark || !this.textureImages) return;

    resizeElements(drawSource, this.canvas1, this.canvas2);

    const width = this.canvas2.width;
    const height = this.canvas2.height;

    ctx.clearRect(0, 0, width, height);

    const face = this.landmark.faceLandmarks?.[0];

    ctx.save();

    // ===== MIRROR (LIVE MODE ONLY) =====
    if (this.isMirrored) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    // Always draw base image
    ctx.drawImage(drawSource, 0, 0, width, height);

    // If no makeup selected → just base image
    if (!face || !this.state.color || !this.cachedRGBA) {
      ctx.restore();
      return;
    }

    const [r, g, b] = this.cachedRGBA;
    const color = `rgba(${r},${g},${b},0.6)`;
    const size = { width, height };

    const applyMakeup = () => {
      switch (this.state.type) {
        case 'glossy':
          applyTextureOnLips(
            face,
            ctx,
            color,
            this.textureImages!.L,
            this.textureImages!.U,
            size,
            this.state.range
          );
          break;

        case 'crayon':
          applyTextureOnLipsc(
            face,
            ctx,
            color,
            this.textureImages!.Lc,
            this.textureImages!.Uc,
            size,
            this.state.range
          );
          break;

        case 'shimmer':
          applyTextureOnLipss(
            face,
            ctx,
            color,
            this.textureImages!.Ls,
            this.textureImages!.Us,
            size,
            this.state.range
          );
          break;

        case 'matte':
          applyOnLips(face, ctx, color, size, this.state.range);
          break;
      }
    };

    // ===== NORMAL MODE (NO SPLIT) =====
    if (this.comparePosition === null) {
      applyMakeup();
      ctx.restore();
      return;
    }

    // ===== SPLIT MODE =====

    // Divider position in screen space
    const screenSplit = width * this.comparePosition;

    // Convert to drawing coordinate space
    const drawingSplit = this.isMirrored ? width - screenSplit : screenSplit;

    ctx.save();

    ctx.beginPath();

    if (this.isMirrored) {
      // Mirror active:
      // Clip LEFT drawing space → becomes RIGHT on screen
      ctx.rect(0, 0, drawingSplit, height);
    } else {
      // Normal:
      // Clip RIGHT side
      ctx.rect(drawingSplit, 0, width - drawingSplit, height);
    }

    ctx.clip();

    applyMakeup();

    ctx.restore(); // restore clip
    ctx.restore(); // restore mirror transform

    // ===== DRAW DIVIDER (SCREEN SPACE) =====

    ctx.save();

    // ----- Subtle dark base line (visibility on light backgrounds) -----
    ctx.beginPath();
    ctx.moveTo(screenSplit, 0);
    ctx.lineTo(screenSplit, height);
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // ----- Smooth center gradient -----
    const spread = 6;

    const gradient = ctx.createLinearGradient(
      screenSplit - spread,
      0,
      screenSplit + spread,
      0
    );

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

    // ----- Soft glow -----
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
    this.initToken++; // invalidate async
    this.abortController?.abort();
    this.abortController = null;
    this.cleanup();
  }

  protected cleanup() {
    this.listeners = [];
    this.landmarker?.close();
    this.landmarker = null;
    this.updateState.internalReset();
  }

  /* ================= ABSTRACT ================= */

  protected abstract getRunningMode(): TRunningMode;
  protected abstract onTryOnReady(): Promise<void> | void;
  protected abstract onStateUpdated(): void;
}
