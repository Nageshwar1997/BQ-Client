import type {
  IDetectableEngine,
  IMakeupState,
  ITryOnUploadEngineRef,
  TRunningMode,
} from '@/types/tryon-types';
import { loadImage } from '@/utils/tryon-utils';

type TEngineConstructor<TState extends IMakeupState> = abstract new (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
  initialState?: Partial<TState>,
) => IDetectableEngine;

/**
 * Attaches uploaded-photo (load once, detect once, re-render on state change) behavior to
 * *any* category's engine base class. Written once, same rationale as `withLiveCamera` - see
 * that file's doc comments (including why the return type is cast to a plain interface, and why
 * this is generic over `IDetectableEngine` rather than any one tracking model's engine base).
 */
export function withImageUpload<TState extends IMakeupState>(
  Base: TEngineConstructor<TState>,
): new (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
  initialState?: Partial<TState>,
) => ITryOnUploadEngineRef<TState> {
  abstract class TryOnUploadEngine extends Base {
    private image?: HTMLImageElement;
    private imageAbort?: AbortController;

    protected getRunningMode(): TRunningMode {
      return 'IMAGE';
    }

    public async loadImageUrl(url: string) {
      this.imageAbort?.abort();
      this.imageAbort = new AbortController();
      const { signal } = this.imageAbort;

      this.updateState.setImageReady(false);
      this.updateState.setError(undefined);

      try {
        const img = await loadImage(url, signal);
        if (signal.aborted || !this.ensureAlive()) return;

        this.image = img;

        // Only report ready once a frame has actually been detected + drawn. On first mount,
        // the detector (slow - downloads WASM/model) and the image (fast - a local asset) load
        // concurrently; if this resolves first, the detector isn't ready yet here, so there's
        // nothing to render yet - `onTryOnReady` picks it up once the detector itself finishes
        // loading instead. Setting `imageReady` unconditionally here used to hide the loading
        // overlay before any frame existed, leaving a blank canvas until that later render.
        if (this.hasDetector()) {
          this.detectFrameForUpload(img);
          this.renderFrame(img);
          this.updateState.setImageReady(true);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error('Image load failed', err);
        this.updateState.setImageReady(false);
        this.updateState.setError("Couldn't process that photo. Try a different one.");
      }
    }

    protected onTryOnReady() {
      if (this.image && this.hasDetector() && this.ensureAlive()) {
        this.detectFrameForUpload(this.image);
        this.renderFrame(this.image);
        this.updateState.setImageReady(true);
      }
    }

    protected onStateUpdated() {
      if (this.image && this.hasDetector() && this.ensureAlive()) {
        this.renderFrame(this.image);
      }
    }

    public takeSnapshot() {
      return this.image ? this.takeSnapshotInternal(this.image) : null;
    }

    public override cleanup() {
      this.imageAbort?.abort();
      this.imageAbort = undefined;
      this.image = undefined;
      super.cleanup();
    }
  }

  // See the matching comment at the end of withLiveCamera.ts.
  return TryOnUploadEngine as unknown as new (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    initialState?: Partial<TState>,
  ) => ITryOnUploadEngineRef<TState>;
}
