import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  FashionTryOnClass,
  type IFashionTryOnState,
  type TFacingMode,
} from '../class';

export interface TryOnHandle {
  requestCaptureWithCountdown: (seconds: number) => void;
  stopCamera: () => void;
  startCamera: () => Promise<void>;
  restartCamera: () => Promise<void>;
  getStream: () => MediaStream | null;
  getState: () => IFashionTryOnState | null;
  takeSnapshot: () => void;
}

interface TryOnProps {
  onCapture: (file: File) => void;
  onError?: (msg: string | null) => void;
  onCountdown?: (val: number | null) => void;
  onStateChange?: (state: IFashionTryOnState) => void;
  facingMode?: TFacingMode;
}

const TryOn = forwardRef<TryOnHandle, TryOnProps>(
  (
    { onCapture, onError, onCountdown, onStateChange, facingMode = 'user' },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const tryOnRef = useRef<FashionTryOnClass | null>(null);

    useEffect(() => {
      if (videoRef.current && canvasRef.current) {
        tryOnRef.current = new FashionTryOnClass(
          videoRef.current,
          canvasRef.current,
          onCapture,
          onError,
          onCountdown,
          facingMode
        );
        const unsubscribe = onStateChange
          ? tryOnRef.current.onChange(onStateChange)
          : undefined;
        tryOnRef.current.start();

        return () => {
          unsubscribe?.();
          tryOnRef.current?.stop();
          tryOnRef.current = null;
        };
      }
      return () => {
        tryOnRef.current?.stop();
        tryOnRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facingMode, onStateChange]);

    useImperativeHandle(ref, () => ({
      requestCaptureWithCountdown: (seconds: number) => {
        tryOnRef.current?.requestCaptureWithCountdown(seconds);
      },
      stopCamera: () => {
        tryOnRef.current?.stopWebCam();
      },
      startCamera: async () => {
        await tryOnRef.current?.startWebCam();
      },
      restartCamera: async () => {
        await tryOnRef.current?.restartWebCam();
      },
      getStream: () => tryOnRef.current?.getStream() ?? null,
      getState: () => tryOnRef.current?.getState() ?? null,
      takeSnapshot: () => tryOnRef.current?.takeSnapshot?.(),
    }));

    return (
      <div
        className={`relative h-full w-full ${
          facingMode === 'user' ? 'scale-x-[-1]' : ''
        }`}
      >
        <video
          ref={videoRef}
          width={DEFAULT_WIDTH}
          height={DEFAULT_HEIGHT}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <canvas
          ref={canvasRef}
          width={DEFAULT_WIDTH}
          height={DEFAULT_HEIGHT}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
    );
  }
);

export default TryOn;
