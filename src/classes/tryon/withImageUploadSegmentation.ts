import type { IMakeupState, ITryOnUploadEngineRef, TRunningMode } from '@/types/tryon-types';
import { loadImage } from '@/utils/tryon-utils';

import { extractHairMask } from './HairSegmenterCache';
import type { SegmentationEngineBase } from './SegmentationEngineBase';

type TEngineConstructor<TState extends IMakeupState, TAssets> = abstract new (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
  initialState?: Partial<TState>,
) => SegmentationEngineBase<TState, TAssets>;

/**
 * `withImageUpload`'s exact counterpart for segmentation-tracked categories - same "load once,
 * detect once, re-render on state change" shape, wired to `ImageSegmenter`'s synchronous
 * `segment()` instead of `FaceLandmarker.detect()`. The synchronous overload's per-call mask-copy
 * cost (see `withLiveCameraSegmentation.ts`'s own comment) is a non-issue here - this only ever
 * runs once per uploaded photo, not once per rendered frame.
 */
export function withImageUploadSegmentation<TState extends IMakeupState, TAssets>(
  Base: TEngineConstructor<TState, TAssets>,
): new (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
  initialState?: Partial<TState>,
) => ITryOnUploadEngineRef<TState> {
  abstract class SegmentationUploadEngine extends Base {
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

        // Same "segmenter may still be loading" race as `withImageUpload` - see its own comment.
        if (this.segmenter) {
          // `true`: this mask is an app-owned copy from the synchronous overload, not
          // task-owned - see `extractHairMask`'s own comment on why this one needs closing.
          this.mask = extractHairMask(this.segmenter.segment(img), true);
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
      if (this.image && this.segmenter && this.ensureAlive()) {
        this.mask = extractHairMask(this.segmenter.segment(this.image), true);
        this.renderFrame(this.image);
        this.updateState.setImageReady(true);
      }
    }

    protected onStateUpdated() {
      if (this.image && this.segmenter && this.ensureAlive()) {
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
  return SegmentationUploadEngine as unknown as new (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    initialState?: Partial<TState>,
  ) => ITryOnUploadEngineRef<TState>;
}
