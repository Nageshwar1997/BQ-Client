import { Pose, type Results, type NormalizedLandmark } from '@mediapipe/pose';
import { captureSnapShot } from '../../virtual-tryon/utils';

export const DEFAULT_HEIGHT = 4320;
export const DEFAULT_WIDTH = 7680;
export type TFacingMode = 'user' | 'environment';
export interface IFashionTryOnState {
  cameraReady: boolean;
  tryOnStarted: boolean;
}

export class FashionTryOnClass {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private onCapture: (file: File) => void;
  private onError?: (msg: string | null) => void;
  private onCountdown?: (val: number | null) => void;
  private state: IFashionTryOnState = {
    cameraReady: false,
    tryOnStarted: false,
  };
  private listeners: ((state: IFashionTryOnState) => void)[] = [];
  private viewWidth = 0;
  private viewHeight = 0;
  private pose: Pose;
  private animationId: number | null = null;
  private stream: MediaStream | null = null;
  private isRunning = false;
  private destroyed = false;
  private initToken = 0;
  private cameraAbort: AbortController | null = null;
  private frameCount = 0;
  private latestPoseValid = false;
  private isCapturing = false;

  private REQUIRE_STABLE_FRAMES = 10;
  private MIN_VISIBILITY = 0.9;

  private lastError: string | null = null;
  private firstFrame = true;
  private facingMode: TFacingMode = 'user';

  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private countdownValue: number | null = null;
  private pendingCapture = false;

  constructor(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    onCapture: (file: File) => void,
    onError?: (msg: string | null) => void,
    onCountdown?: (val: number | null) => void,
    facingMode?: TFacingMode
  ) {
    this.video = video;
    this.canvas = canvas;
    this.onCapture = onCapture;
    this.onError = onError;
    this.onCountdown = onCountdown;
    this.facingMode = facingMode ?? 'user';

    this.pose = new Pose({
      locateFile: (file: any) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    this.pose.onResults(this.onPoseResults);
  }

  /* -------------------- CAMERA START -------------------- */
  public start = async () => {
    const token = ++this.initToken;
    const signal = this.createAbortSignal();
    this.destroyed = false;

    this.stopInternal(false);
    this.isRunning = true;
    this.setTryOnStarted(true);

    this.setError('Initializing...');
    this.firstFrame = true;
    this.frameCount = 0;
    this.latestPoseValid = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          facingMode: { ideal: this.facingMode },
        },
        audio: false,
      });

      if (signal.aborted || !this.ensureAlive(token)) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      this.stream = stream;
      this.video.srcObject = stream;
      await this.video.play();

      if (signal.aborted || !this.ensureAlive(token) || !this.isRunning) {
        this.stopInternal(false);
        return;
      }

      // Sync canvas size to screen size (not video size) for correct cropping and display
      this.syncCanvasToScreenSize();
      this.setCameraReady(true);

      const processFrame = async () => {
        if (!this.ensureAlive(token) || !this.isRunning) return;
        await this.pose.send({ image: this.video });
        if (!this.ensureAlive(token) || !this.isRunning) return;
        this.animationId = requestAnimationFrame(processFrame);
      };

      await processFrame();
    } catch (err) {
      console.error('Camera init failed:', err);
      this.setError('Camera access denied or unavailable');
      this.setCameraReady(false);
      this.stopInternal(false);
    }
  };

  public startWebCam = async () => {
    await this.start();
  };

  // private isFrontalPose(landmarks: NormalizedLandmark[]) {
  //   const leftShoulder = landmarks[11];
  //   const rightShoulder = landmarks[12];
  //   const leftHip = landmarks[23];
  //   const rightHip = landmarks[24];

  //   if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return false;

  //   const shouldersAligned = Math.abs(leftShoulder.y - rightShoulder.y) < 0.3;
  //   const hipsAligned = Math.abs(leftHip.y - rightHip.y) < 0.3;

  //   const shoulderDistance = Math.abs(leftShoulder.x - rightShoulder.x);
  //   const hipDistance = Math.abs(leftHip.x - rightHip.x);

  //   return (
  //     shouldersAligned &&
  //     hipsAligned &&
  //     shoulderDistance >= 0.2 &&
  //     hipDistance >= 0.1
  //   );
  // }

  // private isInsideBox(
  //   landmarks: NormalizedLandmark[],
  //   box: { x: number; y: number; width: number; height: number },
  //   canvasWidth: number,
  //   canvasHeight: number
  // ) {
  //   const keyIndices = [
  //     this.POSE_LANDMARKS.NOSE,
  //     this.POSE_LANDMARKS.LEFT_EYE,
  //     11, // left shoulder
  //     12, // right shoulder
  //     23, // left hip
  //     24, // right hip
  //     this.POSE_LANDMARKS.LEFT_FOOT_INDEX,
  //     this.POSE_LANDMARKS.RIGHT_FOOT_INDEX,
  //   ];
  //   for (const idx of keyIndices) {
  //     const lm = landmarks[idx];
  //     if (!lm) continue;
  //     const x = lm.x * canvasWidth;
  //     const y = lm.y * canvasHeight;
  //     if (
  //       x < box.x ||
  //       x > box.x + box.width ||
  //       y < box.y ||
  //       y > box.y + box.height
  //     ) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  /* -------------------- CANVAS SIZE = SCREEN SIZE -------------------- */
  private syncCanvasToScreenSize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.viewWidth = rect.width;
    this.viewHeight = rect.height;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  /* -------------------- STOP CAMERA -------------------- */
  public stop = () => {
    this.destroyed = true;
    this.initToken++;
    this.cameraAbort?.abort();
    this.cameraAbort = null;
    this.setTryOnStarted(false);
    this.stopInternal(true);
  };

  public stopWebCam = () => {
    this.stop();
  };

  public restartWebCam = async () => {
    this.stop();
    await new Promise((resolve) => setTimeout(resolve, 150));
    await this.start();
  };

  public getStream = () => this.stream;
  public getState = () => this.state;

  public onChange(listener: (state: IFashionTryOnState) => void) {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private stopInternal(resetCountdown: boolean) {
    this.isRunning = false;
    this.setCameraReady(false);

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.video.srcObject) {
      this.video.pause();
      this.video.srcObject = null;
    }

    this.frameCount = 0;
    this.latestPoseValid = false;
    this.firstFrame = true;

    this.clearCountdown(resetCountdown);
    this.pendingCapture = false;
  }

  /** Reset tracking state */
  private resetTracking(msg: string) {
    this.frameCount = 0;
    this.latestPoseValid = false;
    this.clearCountdown(false); // stop ticking, but keep value
    this.pendingCapture = false;
    if (!this.firstFrame) this.setError(msg);
  }

  /** Clear countdown */
  private clearCountdown(reset = false) {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (reset) {
      this.countdownValue = null;
      this.onCountdown?.(null);
    }
  }

  private setError(msg: string | null) {
    this.lastError = msg;
    this.onError?.(msg);
  }

  private setCameraReady(value: boolean) {
    if (this.state.cameraReady === value) return;
    this.state = { ...this.state, cameraReady: value };
    this.notify();
  }

  private setTryOnStarted(value: boolean) {
    if (this.state.tryOnStarted === value) return;
    this.state = { ...this.state, tryOnStarted: value };
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  public getError() {
    return this.lastError;
  }

  public requestCaptureWithCountdown(seconds: number) {
    if (!this.isRunning) {
      this.setError('Camera is not ready');
      return;
    }

    this.clearCountdown(true);
    this.pendingCapture = false;

    const normalizedSeconds = Math.max(0, Math.floor(seconds));

    if (normalizedSeconds === 0) {
      if (
        this.frameCount >= this.REQUIRE_STABLE_FRAMES &&
        this.latestPoseValid
      ) {
        this.captureImage();
        return;
      }
      this.pendingCapture = true;
      return;
    }

    this.countdownValue = normalizedSeconds;
  }

  /** Handle pose results */
  private onPoseResults = (results: Results) => {
    if (!this.isRunning || this.destroyed) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);

    const { sx, sy, sw, sh } = this.getVisibleVideoRect();

    ctx.drawImage(
      results.image,
      sx,
      sy,
      sw,
      sh, // source crop (camera)
      0,
      0,
      this.viewWidth,
      this.viewHeight // ✅ ONLY screen-visible area
    );

    // if (!results.poseLandmarks) {
    //   this.resetTracking(
    //     'Stand so your whole body is visible, facing the camera'
    //   );
    //   return;
    // }

    if (!results.poseLandmarks) {
      this.resetTracking(
        'Stand so your whole body is visible, facing the camera'
      );
      return;
    }

    const headVisible = this.checkHeadLandmarks(results.poseLandmarks);
    const toesVisible = this.checkToeLandmarks(results.poseLandmarks);

    const poseValid = headVisible && toesVisible;
    this.latestPoseValid = !!poseValid;

    if (!poseValid) {
      this.resetTracking('Make sure head and feet are visible');
      return;
    }

    if (this.firstFrame) this.firstFrame = false;
    this.setError(null);
    this.frameCount++;

    if (this.pendingCapture && this.frameCount >= this.REQUIRE_STABLE_FRAMES) {
      this.pendingCapture = false;
      this.captureImage();
      return;
    }

    if (this.frameCount >= this.REQUIRE_STABLE_FRAMES && this.countdownValue) {
      if (!this.countdownInterval) {
        this.onCountdown?.(this.countdownValue);
        this.countdownInterval = setInterval(() => {
          if (!this.isRunning || this.destroyed) {
            this.clearCountdown(true);
            return;
          }

          if (!this.latestPoseValid) {
            this.clearCountdown(false);
            this.setError('Pose lost — stand properly again');
            return;
          }

          if (this.countdownValue !== null) {
            this.countdownValue--;
            this.onCountdown?.(this.countdownValue);

            if (this.countdownValue <= 0) {
              this.clearCountdown(true);
              this.captureImage();
            }
          }
        }, 1000);
      }
    }
  };

  /* -------------------- LANDMARK CHECKS -------------------- */
  private checkHeadLandmarks(landmarks: NormalizedLandmark[]) {
    return [0, 2, 5, 7, 8].every(
      (i) =>
        landmarks[i]?.visibility &&
        landmarks[i].visibility > this.MIN_VISIBILITY
    );
  }

  private checkToeLandmarks(landmarks: NormalizedLandmark[]) {
    return (
      landmarks[31]?.visibility &&
      landmarks[31].visibility > this.MIN_VISIBILITY &&
      landmarks[32]?.visibility &&
      landmarks[32].visibility > this.MIN_VISIBILITY
    );
  }

  /* -------------------- VIDEO CROP LOGIC -------------------- */
  private getVisibleVideoRect() {
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    const cw = this.viewWidth; // ✅ visible width
    const ch = this.viewHeight; // ✅ visible height

    const videoAspect = vw / vh;
    const canvasAspect = cw / ch;

    let sx = 0,
      sy = 0,
      sw = vw,
      sh = vh;

    if (videoAspect > canvasAspect) {
      sw = vh * canvasAspect;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / canvasAspect;
      sy = (vh - sh) / 2;
    }

    return { sx, sy, sw, sh };
  }

  /* -------------------- CAPTURE (SCREEN ONLY) -------------------- */
  private captureImage = () => {
    if (this.isCapturing || this.destroyed) return;
    this.isCapturing = true;

    // ✅ REAL canvas pixel size
    const srcW = this.canvas.width;
    const srcH = this.canvas.height;

    if (!srcW || !srcH) {
      this.isCapturing = false;
      this.setError('Unable to capture image');
      return;
    }

    // ✅ portrait width from full height
    const outH = srcH;
    const outW = Math.floor(outH * (9 / 16));
    const sx = Math.floor((srcW - outW) / 2);
    const sy = 0;

    const temp = document.createElement('canvas');
    temp.width = outW;
    temp.height = outH;

    const ctx = temp.getContext('2d');
    if (!ctx) {
      this.isCapturing = false;
      this.setError('Unable to capture image');
      return;
    }

    // mirror for front camera
    if (this.facingMode === 'user') {
      ctx.translate(outW, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(
      this.canvas,
      sx,
      sy,
      outW,
      outH, // 👈 SOURCE = real canvas pixels
      0,
      0,
      outW,
      outH // 👈 OUTPUT portrait
    );

    temp.toBlob(
      (blob) => {
        if (!blob) {
          this.isCapturing = false;
          this.setError('Unable to capture image');
          return;
        }
        this.onCapture(
          new File([blob], `center_portrait_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          })
        );
        this.stop();
        this.isCapturing = false;
      },
      'image/jpeg',
      0.95
    );
  };

  private createAbortSignal() {
    this.cameraAbort?.abort();
    this.cameraAbort = new AbortController();
    return this.cameraAbort.signal;
  }

  private ensureAlive(token?: number) {
    if (this.destroyed) return false;
    if (token !== undefined && token !== this.initToken) return false;
    return true;
  }

  /* ================= SNAPSHOT ================= */

  public takeSnapshot() {
    return captureSnapShot(this.video, this.canvas);
  }
}
