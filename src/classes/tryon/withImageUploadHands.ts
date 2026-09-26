import type { IMakeupState, ITryOnUploadEngineRef, TRunningMode } from '@/types/tryon-types';
import { loadImage } from '@/utils/tryon-utils';

import type { HandTrackingEngineBase } from './HandTrackingEngineBase';

type TEngineConstructor<TState extends IMakeupState, TAssets> = abstract new (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
  initialState?: Partial<TState>,
) => HandTrackingEngineBase<TState, TAssets>;

/**
 * `withImageUpload`'s counterpart for hand-tracked categories - same "load once, detect once,
 * re-render on state change" shape, wired to `HandLandmarker.detect()` instead of
 * `FaceLandmarker.detect()`. Both are synchronous, so this is a close, simple mirror of the
 * original - no callback-vs-sync-cost tradeoff like HAIR's `withImageUploadSegmentation` had to
 * make.
 */
export function withImageUploadHands<TState extends IMakeupState, TAssets>(
  Base: TEngineConstructor<TState, TAssets>,
): new (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
  initialState?: Partial<TState>,
) => ITryOnUploadEngineRef<TState> {
  abstract class HandUploadEngine extends Base {
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

        // Same "landmarker may still be loading" race as `withImageUpload`/
        // `withImageUploadSegmentation` - see their own comments.
        if (this.handLandmarker) {
          this.hands = this.handLandmarker.detect(img).landmarks;
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
      if (this.image && this.handLandmarker && this.ensureAlive()) {
        this.hands = this.handLandmarker.detect(this.image).landmarks;
        this.renderFrame(this.image);
        this.updateState.setImageReady(true);
      }
    }

    protected onStateUpdated() {
      if (this.image && this.handLandmarker && this.ensureAlive()) {
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

  // See the matching comment at the end of withLiveCamera.ts - same reasoning applies here.
  return HandUploadEngine as unknown as new (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    initialState?: Partial<TState>,
  ) => ITryOnUploadEngineRef<TState>;
}
