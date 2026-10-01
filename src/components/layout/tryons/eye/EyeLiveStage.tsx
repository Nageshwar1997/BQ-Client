import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { IEyeTryOnState } from '@/classes/tryon/categories/eye';
import { EyeLiveEngine } from '@/classes/tryon/categories/eye';
import type { ITryOnStageRef } from '@/types/tryon-types';

interface IEyeLiveStageProps {
  initialState?: Partial<IEyeTryOnState>;
  onStateChange: (state: IEyeTryOnState) => void;
}

// Just the camera + rendered canvas - no picker UI. `TryOnModal` drives shade/pattern via the
// forwarded ref (only the trimmed ref surface - see EyeTryOnStage.tsx) and renders its own
// overlays (shade swatches, pattern picker, sidebar) around this. Mirrors LipLiveStage.tsx/
// FaceLiveStage.tsx exactly - same shared engine machinery, only the concrete engine differs.
const EyeLiveStage = forwardRef<ITryOnStageRef<IEyeTryOnState>, IEyeLiveStageProps>(
  ({ initialState, onStateChange }, ref) => {
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const canvas2Ref = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const engineRef = useRef<EyeLiveEngine | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        setMakeupState: (state) => engineRef.current?.setMakeupState(state),
        getState: () => engineRef.current?.getState(),
        takeSnapshot: () => engineRef.current?.takeSnapshot() ?? null,
        getStream: () => engineRef.current?.getStream() ?? null,
        setComparePosition: (value) => engineRef.current?.setComparePosition(value),
        getCanvas: () => engineRef.current?.getCanvas() ?? null,
      }),
      [],
    );

    useEffect(() => {
      const canvas1 = canvas1Ref.current;
      const canvas2 = canvas2Ref.current;
      const video = videoRef.current;
      if (!canvas1 || !canvas2 || !video) return;

      const engine = new EyeLiveEngine(canvas1, canvas2, initialState);
      engineRef.current = engine;

      const unsubscribe = engine.onChange(onStateChange);
      onStateChange(engine.getState());

      engine.attachVideo(video);
      void engine.startTryOn();
      void engine.startCamera();

      return () => {
        unsubscribe();
        engine.destroy();
        engineRef.current = null;
      };
      // Set up once per mount - `TryOnModal` remounts this component (via `key` or conditional
      // rendering) rather than expecting it to react to prop changes mid-life.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="relative size-full">
        <canvas ref={canvas1Ref} className="absolute inset-0 z-0 size-full! object-cover" />
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 z-0 size-full scale-x-[-1] object-cover"
        />
        {/* Opaque - fully covers the raw video above with the mirrored, makeup-composited frame */}
        <canvas ref={canvas2Ref} className="absolute inset-0 z-1 size-full! object-cover" />
      </div>
    );
  },
);

EyeLiveStage.displayName = 'EyeLiveStage';

export default EyeLiveStage;
