import { Icon } from '@iconify/react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { IEyeTryOnState } from '@/classes/tryon/categories/eye';
import { EyeUploadEngine } from '@/classes/tryon/categories/eye';
import type { ITryOnStageRef } from '@/types/tryon-types';

interface IEyeUploadStageProps {
  imageUrl: string | null;
  initialState?: Partial<IEyeTryOnState>;
  onStateChange: (state: IEyeTryOnState) => void;
}

// Just the rendered canvas - no file input, no picker UI. `imageUrl` comes from `TryOnModal`
// (either the sidebar's upload button or a clicked model thumbnail feed the same prop), and
// `TryOnModal` drives shade/pattern via the forwarded ref (see EyeTryOnStage.tsx). Mirrors
// LipUploadStage.tsx/FaceUploadStage.tsx exactly.
const EyeUploadStage = forwardRef<ITryOnStageRef<IEyeTryOnState>, IEyeUploadStageProps>(
  ({ imageUrl, initialState, onStateChange }, ref) => {
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const canvas2Ref = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<EyeUploadEngine | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        setMakeupState: (state) => engineRef.current?.setMakeupState(state),
        getState: () => engineRef.current?.getState(),
        takeSnapshot: () => engineRef.current?.takeSnapshot() ?? null,
        // Upload mode has no camera - always null, matches EyeLiveStage's shape so
        // EyeTryOnStage can treat both refs identically.
        getStream: () => null,
        setComparePosition: (value) => engineRef.current?.setComparePosition(value),
        getCanvas: () => engineRef.current?.getCanvas() ?? null,
      }),
      [],
    );

    useEffect(() => {
      const canvas1 = canvas1Ref.current;
      const canvas2 = canvas2Ref.current;
      if (!canvas1 || !canvas2) return;

      const engine = new EyeUploadEngine(canvas1, canvas2, initialState);
      engineRef.current = engine;

      const unsubscribe = engine.onChange(onStateChange);
      onStateChange(engine.getState());

      void engine.startTryOn();

      return () => {
        unsubscribe();
        engine.destroy();
        engineRef.current = null;
      };
      // Same reasoning as EyeLiveStage.tsx's identical effect.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (imageUrl) void engineRef.current?.loadImageUrl(imageUrl);
    }, [imageUrl]);

    return (
      <div className="relative size-full">
        {!!imageUrl && (
          <img src={imageUrl} alt="Background" className="size-full object-cover blur-md" />
        )}
        <canvas
          ref={canvas1Ref}
          className="absolute inset-x-0 inset-y-1/2 z-0 mx-auto size-full -translate-y-1/2 object-contain"
        />
        <canvas
          ref={canvas2Ref}
          className="absolute inset-x-0 inset-y-1/2 z-1 mx-auto size-full -translate-y-1/2 object-contain"
        />
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

EyeUploadStage.displayName = 'EyeUploadStage';

export default EyeUploadStage;
