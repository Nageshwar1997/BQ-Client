import { Icon } from '@iconify/react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { INailTryOnState } from '@/classes/tryon/categories/nail';
import { NailUploadEngine } from '@/classes/tryon/categories/nail';
import type { ITryOnStageRef } from '@/types/tryon-types';

interface INailUploadStageProps {
  imageUrl: string | null;
  initialState?: Partial<INailTryOnState>;
  onStateChange: (state: INailTryOnState) => void;
}

// Mirrors ../hair/HairUploadStage.tsx exactly, just wired to NailUploadEngine.
const NailUploadStage = forwardRef<ITryOnStageRef<INailTryOnState>, INailUploadStageProps>(
  ({ imageUrl, initialState, onStateChange }, ref) => {
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const canvas2Ref = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<NailUploadEngine | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        setMakeupState: (state) => engineRef.current?.setMakeupState(state),
        getState: () => engineRef.current?.getState(),
        takeSnapshot: () => engineRef.current?.takeSnapshot() ?? null,
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

      const engine = new NailUploadEngine(canvas1, canvas2, initialState);
      engineRef.current = engine;

      const unsubscribe = engine.onChange(onStateChange);
      onStateChange(engine.getState());

      void engine.startTryOn();

      return () => {
        unsubscribe();
        engine.destroy();
        engineRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (imageUrl) void engineRef.current?.loadImageUrl(imageUrl);
    }, [imageUrl]);

    return (
      <div className="relative size-full">
        {!!imageUrl && (
          <img
            src={imageUrl}
            alt="Background"
            className="absolute inset-0 size-full object-cover blur-md"
          />
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

NailUploadStage.displayName = 'NailUploadStage';

export default NailUploadStage;
