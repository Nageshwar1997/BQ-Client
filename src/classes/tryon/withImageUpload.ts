import type { IMakeupState, ITryOnUploadEngineRef, TRunningMode } from '@/types/tryon-types';
import { loadImage } from '@/utils/tryon-utils';

import type { TryOnEngineBase } from './TryOnEngineBase';

type TEngineConstructor<TState extends IMakeupState, TAssets> = abstract new (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
  initialState?: Partial<TState>,
) => TryOnEngineBase<TState, TAssets>;

/**
 * Attaches uploaded-photo (load once, detect once, re-render on state change) behavior to
 * *any* category's engine base class. Written once, same rationale as `withLiveCamera` - see
 * that file's doc comments (including why the return type is cast to a plain interface).
 */
export function withImageUpload<TState extends IMakeupState, TAssets>(
  Base: TEngineConstructor<TState, TAssets>,
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
        // the landmarker (slow - downloads WASM/model) and the image (fast - a local asset) load
        // concurrently; if this resolves first, `this.landmarker` is still null here, so there's
        // nothing to render yet - `onTryOnReady` picks it up once the landmarker itself finishes
        // loading instead. Setting `imageReady` unconditionally here used to hide the loading
        // overlay before any frame existed, leaving a blank canvas until that later render.
        if (this.landmarker) {
          this.landmark = this.landmarker.detect(img);
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
      if (this.image && this.landmarker && this.ensureAlive()) {
        this.landmark = this.landmarker.detect(this.image);
        this.renderFrame(this.image);
        this.updateState.setImageReady(true);
      }
    }

    protected onStateUpdated() {
      if (this.image && this.landmarker && this.ensureAlive()) {
        this.renderFrame(this.image);
      }
    }

    public takeSnapshot() {
      return this.image ? this.takeSnapshotInternal(this.image) : null;
    }

    protected override cleanup() {
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
