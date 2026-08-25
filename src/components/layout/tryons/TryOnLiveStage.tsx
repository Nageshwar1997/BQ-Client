import { Icon } from '@iconify/react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import { LipLiveEngine } from '@/classes/tryon/categories/lip';
import type { ITryOnStageRef } from '@/types/tryon-engine.type';

interface ITryOnLiveStageProps {
  initialState?: Partial<ILipTryOnState>;
  onStateChange: (state: ILipTryOnState) => void;
}

// Just the camera + rendered canvas - no picker UI. `TryOnModal` drives shade/finish via the
// forwarded ref (only the trimmed `ITryOnStageRef` surface - see LipTryOnStage.tsx) and
// renders its own overlays (shade swatches, sidebar) around this.
const TryOnLiveStage = forwardRef<ITryOnStageRef<ILipTryOnState>, ITryOnLiveStageProps>(
  ({ initialState, onStateChange }, ref) => {
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const canvas2Ref = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const engineRef = useRef<LipLiveEngine | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        // Every method reads `engineRef.current` fresh on each call (not captured once here) -
        // the engine instance itself is only created later, in the effect below, so this handle
        // has to stay lazy about it rather than closing over a snapshot.
        setMakeupState: (state) => engineRef.current?.setMakeupState(state),
        getState: () => engineRef.current?.getState(),
        takeSnapshot: () => engineRef.current?.takeSnapshot() ?? null,
        getStream: () => engineRef.current?.getStream() ?? null,
      }),
      [],
    );

    useEffect(() => {
      const canvas1 = canvas1Ref.current;
      const canvas2 = canvas2Ref.current;
      const video = videoRef.current;
      if (!canvas1 || !canvas2 || !video) return;

      const engine = new LipLiveEngine(canvas1, canvas2, initialState);
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
          className="absolute inset-0 z-0 size-full object-cover"
        />
        {/* Opaque - fully covers the raw video above with the mirrored, makeup-composited frame */}
        <canvas ref={canvas2Ref} className="absolute inset-0 z-1 size-full! object-cover" />
      </div>
    );
  },
);

TryOnLiveStage.displayName = 'TryOnLiveStage';

export default TryOnLiveStage;

export const TryOnLiveStatusOverlay = ({ state }: { state: ILipTryOnState | null }) => {
  if (state?.cameraReady) return null;

  return (
    <div className="bg-primary-invert absolute inset-0 z-2 flex flex-col items-center justify-center gap-2 p-6 text-center">
      {state?.error ? (
        <>
          <Icon icon="solar:camera-square-linear" className="text-primary-red size-8" />
          <p className="text-primary-red text-xs">{state.error}</p>
        </>
      ) : (
        <>
          <Icon icon="solar:camera-linear" className="text-primary/40 size-8 animate-pulse" />
          <p className="text-tertiary text-xs">Waiting for camera permission...</p>
        </>
      )}
    </div>
  );
};
