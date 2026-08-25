import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { IEyelinerState, ITryOnLiveRef } from '../../../../../types';
import { EyelinerLiveClass } from '../../../classes/Eyeliner/EyelinerLiveClass';

interface Props {
  initialState?: Partial<IEyelinerState>;
  onStateChange?: (state: IEyelinerState) => void;
  className?: string;
}

const EyelinerLive = forwardRef<ITryOnLiveRef, Props>(
  ({ initialState, onStateChange, className }, ref) => {
    const canvas1Ref = useRef<HTMLCanvasElement>(null!);
    const canvas2Ref = useRef<HTMLCanvasElement>(null!);
    const videoRef = useRef<HTMLVideoElement>(null!);

    const tryOnRef = useRef<EyelinerLiveClass | null>(null);

    /* ================= IMPERATIVE API ================= */

    useImperativeHandle(
      ref,
      () => ({
        setMakeupState: (s) => tryOnRef.current?.updateState.set(s as IEyelinerState),
        getState: () => tryOnRef.current?.currentState,
        takeSnapShot: () => tryOnRef.current?.takeSnapshot(),
        resetState: () => tryOnRef.current?.updateState.internalReset(),
        setComparePosition: (value: number | null) => tryOnRef.current?.setComparePosition(value),

        // camera controls
        stopCamera: () => tryOnRef.current?.stopWebCam(),
        startCamera: async () => await tryOnRef.current?.startWebCam(),
        restartCamera: async () => await tryOnRef.current?.restartWebCam(),
        getStream: () => tryOnRef.current?.getStream() ?? null,
        getCanvas: () => tryOnRef.current?.getCanvas() ?? null,

        // source change intent
        onSourceChange: () => tryOnRef.current?.onSourceChange(),
      }),
      [],
    );

    /* ================= LIFECYCLE ================= */

    useEffect(() => {
      const tryOn = new EyelinerLiveClass(
        canvas1Ref.current,
        canvas2Ref.current,
        videoRef.current,
        initialState,
      );

      tryOnRef.current = tryOn;
      const unsubscribe = onStateChange ? tryOn.onChange(onStateChange) : undefined;
      tryOn.startTryOn();

      return () => {
        unsubscribe?.();
        tryOn.destroy();
        tryOnRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ================= RENDER ================= */

    return (
      <div
        className={`relative flex size-full scale-100 items-center justify-center overflow-hidden ${className ?? ''}`}
      >
        <canvas ref={canvas1Ref} className="absolute inset-0 z-0 size-full! object-cover" />
        <canvas ref={canvas2Ref} className="absolute inset-0 z-1 size-full! object-cover" />
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 size-full! object-cover"
        />
      </div>
    );
  },
);

export default EyelinerLive;
