import { loadImage } from '../../utils';
import { EyebrowBaseClass } from './EyebrowBaseClass';

export class EyebrowUploadClass extends EyebrowBaseClass {
  private image?: HTMLImageElement;
  private imageAbort?: AbortController;

  protected getRunningMode(): 'IMAGE' {
    return 'IMAGE';
  }

  async loadImageUrl(url: string) {
    // Abort previous load
    this.imageAbort?.abort();
    this.imageAbort = new AbortController();
    const { signal } = this.imageAbort;

    this.updateState.setImageReady(false);

    try {
      const img = await loadImage(url, signal);

      // Final guard
      if (signal.aborted || this.destroyed) return;

      this.image = img;

      if (this.landmarker) {
        this.landmark = this.landmarker.detect(img);
        this.renderFrame(img);
      }

      this.updateState.setImageReady(true);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      console.error('Image load failed', err);
      this.updateState.setImageReady(false);
    }
  }

  protected onTryOnReady() {
    if (this.image && this.landmarker && !this.destroyed) {
      this.landmark = this.landmarker.detect(this.image);
      this.renderFrame(this.image);
      this.updateState.setImageReady(true);
    }
  }

  protected onStateUpdated() {
    if (this.image && this.landmarker && !this.destroyed) {
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
