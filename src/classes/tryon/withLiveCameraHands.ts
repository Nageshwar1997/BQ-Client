import type { IMakeupState, ITryOnLiveEngineRef, TRunningMode } from '@/types/tryon-types';

import type { HandTrackingEngineBase } from './HandTrackingEngineBase';

type TEngineConstructor<TState extends IMakeupState, TAssets> = abstract new (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
  initialState?: Partial<TState>,
) => HandTrackingEngineBase<TState, TAssets>;

/**
 * `withLiveCamera`'s counterpart for hand-tracked categories - same webcam (getUserMedia +
 * `requestAnimationFrame` render loop) shape, wired to `HandLandmarker` instead of
 * `FaceLandmarker`. Unlike `withLiveCameraSegmentation` (HAIR's own fork), this stays a close,
 * simple mirror of the original - `HandLandmarker.detectForVideo` is synchronous just like
 * `FaceLandmarker`'s, no callback overload or mask-lifetime complexity to work around (see
 * docs/tryons/NAIL-PLAN.md's Research section).
 */
export function withLiveCameraHands<TState extends IMakeupState, TAssets>(
  Base: TEngineConstructor<TState, TAssets>,
): new (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
  initialState?: Partial<TState>,
) => ITryOnLiveEngineRef<TState> {
  abstract class HandLiveEngine extends Base {
    private video: HTMLVideoElement | null = null;
    private stream: MediaStream | null = null;
    private rafId: number | null = null;
    private isRunning = false;
    private restartToken = 0;
    private cameraAbort?: AbortController;

    constructor(
      canvas1: HTMLCanvasElement,
      canvas2: HTMLCanvasElement,
      initialState?: Partial<TState>,
    ) {
      super(canvas1, canvas2, initialState);
      this.setMirror(true);
    }

    public attachVideo(video: HTMLVideoElement) {
      this.video = video;
    }

    /* ================= REQUIRED OVERRIDES ================= */

    protected getRunningMode(): TRunningMode {
      return 'VIDEO';
    }

    protected onTryOnReady() {
      // Same as `withLiveCamera`/`withLiveCameraSegmentation` - the camera itself is started/
      // stopped by the React wrapper's imperative `startCamera`/`stopCamera`, not automatically
      // here.
    }

    protected onStateUpdated() {
      // Live mode re-renders continuously via the RAF loop below.
    }

    /* ================= CAMERA ================= */

    public async startCamera() {
      if (!this.video) {
        console.error('startCamera called before attachVideo()');
        return;
      }

      this.cameraAbort?.abort();
      this.cameraAbort = new AbortController();
      const { signal } = this.cameraAbort;

      const token = ++this.restartToken;
      this.isRunning = true;
      this.updateState.setError(undefined);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });

        if (signal.aborted || token !== this.restartToken) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          return;
        }

        this.stream = stream;
        this.video.srcObject = stream;
        await this.video.play();

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (signal.aborted || token !== this.restartToken) return;

        this.updateState.setCameraReady(true);
        this.loop(token);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error('startCamera failed', err);
        this.isRunning = false;

        const denied =
          err instanceof DOMException &&
          (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');
        this.updateState.setError(
          denied
            ? 'Camera access was denied. Allow camera access in your browser settings and try again.'
            : "Couldn't access your camera. Make sure it's connected and not in use by another app.",
        );
      }
    }

    public stopCamera() {
      this.cameraAbort?.abort();
      this.cameraAbort = undefined;

      this.restartToken++;
      this.isRunning = false;

      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }

      if (this.stream) {
        this.stream.getTracks().forEach((track) => {
          track.stop();
        });
        this.stream = null;
      }

      if (this.video?.srcObject) {
        this.video.pause();
        this.video.srcObject = null;
      }

      this.hands = [];

      if (this.ensureAlive()) {
        this.updateState.setCameraReady(false);
      }
    }

    public async restartCamera() {
      this.stopCamera();
      await new Promise((resolve) => {
        setTimeout(resolve, 150);
      });
      await this.startCamera();
    }

    public getStream() {
      return this.stream;
    }

    /* ================= LOOP ================= */

    private loop = (token: number) => {
      if (
        !this.isRunning ||
        token !== this.restartToken ||
        !this.handLandmarker ||
        !this.video ||
        !this.ensureAlive()
      ) {
        return;
      }

      // Same try/catch reasoning as `withLiveCamera`'s loop - a throw here (MediaPipe or a canvas
      // draw call inside `renderFrame`) would otherwise silently stop the RAF chain with no
      // indication anything's wrong.
      try {
        this.hands = this.handLandmarker.detectForVideo(this.video, performance.now()).landmarks;
        this.renderFrame(this.video);
      } catch (err) {
        console.error('Live render loop failed', err);
        this.stopCamera();
        this.updateState.setError(
          'Something went wrong with the live preview. Try restarting the camera.',
        );
        return;
      }

      this.rafId = requestAnimationFrame(() => {
        this.loop(token);
      });
    };

    /* ================= SNAPSHOT ================= */

    public takeSnapshot() {
      return this.video ? this.takeSnapshotInternal(this.video) : null;
    }

    protected override cleanup() {
      this.stopCamera();
      super.cleanup();
    }
  }

  // See the matching comment at the end of withLiveCamera.ts - same reasoning applies here.
  return HandLiveEngine as unknown as new (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    initialState?: Partial<TState>,
  ) => ITryOnLiveEngineRef<TState>;
}
