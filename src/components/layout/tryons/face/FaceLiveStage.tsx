import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { IFaceTryOnState } from '@/classes/tryon/categories/face';
import { FaceLiveEngine } from '@/classes/tryon/categories/face';
import type { ITryOnStageRef } from '@/types/tryon-types';

interface IFaceLiveStageProps {
  initialState?: Partial<IFaceTryOnState>;
  onStateChange: (state: IFaceTryOnState) => void;
}

// Mirrors ../lip/LipLiveStage.tsx exactly, just wired to FaceLiveEngine instead of LipLiveEngine
// - LipLiveStage/LipUploadStage are LIP-specific components (hardcode `LipLiveEngine`, not
// generic over an engine class), so FACE needs its own pair rather than reusing them as-is.
// Deliberate, temporary duplication - worth generalizing those into a shared,
// engine-class-as-prop component once a third category needs the same pair again (premature
// abstraction off of two examples is as much a risk as too much duplication).
const FaceLiveStage = forwardRef<ITryOnStageRef<IFaceTryOnState>, IFaceLiveStageProps>(
  ({ initialState, onStateChange }, ref) => {
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const canvas2Ref = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const engineRef = useRef<FaceLiveEngine | null>(null);

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

      const engine = new FaceLiveEngine(canvas1, canvas2, initialState);
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
        <canvas ref={canvas2Ref} className="absolute inset-0 z-1 size-full! object-cover" />
      </div>
    );
  },
);

FaceLiveStage.displayName = 'FaceLiveStage';

export default FaceLiveStage;
