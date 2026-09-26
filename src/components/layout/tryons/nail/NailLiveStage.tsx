import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { INailTryOnState } from '@/classes/tryon/categories/nail';
import { NailLiveEngine } from '@/classes/tryon/categories/nail';
import type { ITryOnStageRef } from '@/types/tryon-types';

interface INailLiveStageProps {
  initialState?: Partial<INailTryOnState>;
  onStateChange: (state: INailTryOnState) => void;
}

// Mirrors ../hair/HairLiveStage.tsx exactly, just wired to NailLiveEngine - see FaceLiveStage.tsx's
// comment for why this duplicates rather than reuses another category's stage components.
const NailLiveStage = forwardRef<ITryOnStageRef<INailTryOnState>, INailLiveStageProps>(
  ({ initialState, onStateChange }, ref) => {
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const canvas2Ref = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const engineRef = useRef<NailLiveEngine | null>(null);

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

      const engine = new NailLiveEngine(canvas1, canvas2, initialState);
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

NailLiveStage.displayName = 'NailLiveStage';

export default NailLiveStage;
