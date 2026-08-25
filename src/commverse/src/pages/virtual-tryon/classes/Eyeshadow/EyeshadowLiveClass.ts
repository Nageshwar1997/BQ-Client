import type { IEyeshadowState } from '../../../../types';
import { EyeshadowBaseClass } from './EyeshadowBaseClass';

export class EyeshadowLiveClass extends EyeshadowBaseClass {
  private video: HTMLVideoElement;
  private stream: MediaStream | null = null;
  private rafId: number | null = null;
  private isRunning = false;
  private restartToken = 0;
  private cameraAbort?: AbortController;

  constructor(
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    video: HTMLVideoElement,
    initialState?: Partial<IEyeshadowState>,
  ) {
    super(canvas1, canvas2, initialState);
    this.video = video;
    this.setMirror(true);
  }

  /* ================= REQUIRED OVERRIDES ================= */

  protected getRunningMode(): 'VIDEO' {
    return 'VIDEO';
  }

  protected async onTryOnReady() {
    // engine ready — camera controlled by React lifecycle
  }

  protected onStateUpdated() {
    // live mode renders continuously
  }

  /* ================= CAMERA ================= */

  public async startWebCam() {
    this.cameraAbort?.abort();
    this.cameraAbort = new AbortController();
    const { signal } = this.cameraAbort;

    const token = ++this.restartToken;
    this.isRunning = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
        },
        audio: false,
      });

      // Check if the request was aborted or cancelled
      if (signal.aborted || token !== this.restartToken) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      this.stream = stream;
      this.video.srcObject = stream;

      await this.video.play();

      if (signal.aborted || token !== this.restartToken) return;

      this.updateState.setCameraReady(true);
      this.loop(token);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      console.error('startWebCam failed', err);
      this.isRunning = false;
    }
  }

  public stopWebCam() {

    this.cameraAbort?.abort();
    this.cameraAbort = undefined;

    this.restartToken++;
    this.isRunning = false;

    // Stop render loop
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Stop camera tracks
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }

    // Reset video element
    if (this.video.srcObject) {
      this.video.pause();
      this.video.srcObject = null;
    }

    this.landmark = null;

    if (this.ensureAlive()) {
      // Update state
      this.updateState.setCameraReady(false);
    }
  }

  public async restartWebCam() {
    this.stopWebCam();
    await new Promise((r) => setTimeout(r, 150));
    await this.startWebCam();
  }

  public getStream() {
    return this.stream;
  }

  /* ================= LOOP ================= */

  private loop = (token: number) => {
    if (
      !this.isRunning ||
      token !== this.restartToken ||
      !this.landmarker ||
      !this.ensureAlive()
    ) {
      return;
    }

    this.landmark = this.landmarker.detectForVideo(this.video, performance.now());
    this.renderFrame(this.video);

    this.rafId = requestAnimationFrame(() => this.loop(token));
  };

  /* ================= SNAPSHOT ================= */

  public takeSnapshot() {
    return this.takeSnapshotInternal(this.video);
  }

  protected override cleanup() {
    this.stopWebCam();
    super.cleanup();
  }
}
