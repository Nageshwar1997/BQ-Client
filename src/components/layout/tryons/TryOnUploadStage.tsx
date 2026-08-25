import { Icon } from '@iconify/react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import { LipUploadEngine } from '@/classes/tryon/categories/lip';
import type { ITryOnStageRef } from '@/types/tryon-engine.type';

interface ITryOnUploadStageProps {
  imageUrl: string | null;
  initialState?: Partial<ILipTryOnState>;
  onStateChange: (state: ILipTryOnState) => void;
}

// Just the rendered canvas - no file input, no picker UI. `imageUrl` comes from `TryOnModal`
// (either the sidebar's upload button or a clicked model thumbnail feed the same prop), and
// `TryOnModal` drives shade/finish via the forwarded ref (see LipTryOnStage.tsx).
const TryOnUploadStage = forwardRef<ITryOnStageRef<ILipTryOnState>, ITryOnUploadStageProps>(
  ({ imageUrl, initialState, onStateChange }, ref) => {
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const canvas2Ref = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<LipUploadEngine | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        setMakeupState: (state) => engineRef.current?.setMakeupState(state),
        getState: () => engineRef.current?.getState(),
        takeSnapshot: () => engineRef.current?.takeSnapshot() ?? null,
        // Upload mode has no camera - always null, matches TryOnLiveStage's shape so
        // LipTryOnStage can treat both refs identically.
        getStream: () => null,
      }),
      [],
    );

    useEffect(() => {
      const canvas1 = canvas1Ref.current;
      const canvas2 = canvas2Ref.current;
      if (!canvas1 || !canvas2) return;

      const engine = new LipUploadEngine(canvas1, canvas2, initialState);
      engineRef.current = engine;

      const unsubscribe = engine.onChange(onStateChange);
      onStateChange(engine.getState());

      void engine.startTryOn();

      return () => {
        unsubscribe();
        engine.destroy();
        engineRef.current = null;
      };
      // Same reasoning as TryOnLiveStage.tsx's identical effect.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (imageUrl) void engineRef.current?.loadImageUrl(imageUrl);
    }, [imageUrl]);

    return (
      <div className="relative size-full">
        <canvas ref={canvas1Ref} className="absolute inset-0 z-0 size-full object-cover" />
        <canvas ref={canvas2Ref} className="absolute inset-0 z-1 size-full object-cover" />
        {!imageUrl && (
          <div className="absolute inset-0 z-2 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <Icon icon="solar:gallery-add-linear" className="text-primary/40 size-8" />
            <p className="text-tertiary text-xs">Upload a photo or pick a model to try it on</p>
          </div>
        )}
      </div>
    );
  },
);

TryOnUploadStage.displayName = 'TryOnUploadStage';

export default TryOnUploadStage;

export const TryOnUploadStatusOverlay = ({
  imageUrl,
  state,
}: {
  imageUrl: string | null;
  state: ILipTryOnState | null;
}) => {
  if (!imageUrl || state?.imageReady) return null;

  return (
    <div className="bg-primary-invert absolute inset-0 z-2 flex flex-col items-center justify-center gap-2 p-6 text-center">
      {state?.error ? (
        <>
          <Icon icon="solar:gallery-remove-linear" className="text-primary-red size-8" />
          <p className="text-primary-red text-xs">{state.error}</p>
        </>
      ) : (
        <>
          <Icon icon="solar:gallery-linear" className="text-primary/40 size-8 animate-pulse" />
          <p className="text-tertiary text-xs">Processing photo...</p>
        </>
      )}
    </div>
  );
};
