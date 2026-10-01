import { forwardRef, useImperativeHandle, useRef } from 'react';

import type { IHairTryOnState } from '@/classes/tryon/categories/hair';
import { TRYON_MODE_MAP } from '@/constants/tryon-constants';
import type { ITryOnStageRef, TTryOnMode } from '@/types/tryon-types';

import HairLiveStage from './HairLiveStage';
import HairUploadStage from './HairUploadStage';

interface IHairTryOnStageProps {
  mode: TTryOnMode;
  uploadedImageUrl: string | null;
  initialState?: Partial<IHairTryOnState>;
  onStateChange: (state: IHairTryOnState) => void;
}

// Mirrors ../face/FaceTryOnStage.tsx exactly, over the HAIR stage pair instead.
const HairTryOnStage = forwardRef<ITryOnStageRef<IHairTryOnState>, IHairTryOnStageProps>(
  ({ mode, uploadedImageUrl, initialState, onStateChange }, ref) => {
    const liveRef = useRef<ITryOnStageRef<IHairTryOnState> | null>(null);
    const uploadRef = useRef<ITryOnStageRef<IHairTryOnState> | null>(null);

    useImperativeHandle(ref, () => {
      const getActiveRef = () =>
        mode === TRYON_MODE_MAP.LIVE ? liveRef.current : uploadRef.current;

      return {
        setMakeupState: (state) => getActiveRef()?.setMakeupState(state),
        getState: () => getActiveRef()?.getState(),
        takeSnapshot: () => getActiveRef()?.takeSnapshot() ?? null,
        getStream: () => getActiveRef()?.getStream() ?? null,
        setComparePosition: (value) => getActiveRef()?.setComparePosition(value),
        getCanvas: () => getActiveRef()?.getCanvas() ?? null,
      };
    }, [mode]);

    return mode === TRYON_MODE_MAP.LIVE ? (
      <HairLiveStage ref={liveRef} initialState={initialState} onStateChange={onStateChange} />
    ) : (
      <HairUploadStage
        ref={uploadRef}
        imageUrl={uploadedImageUrl}
        initialState={initialState}
        onStateChange={onStateChange}
      />
    );
  },
);

HairTryOnStage.displayName = 'HairTryOnStage';

export default HairTryOnStage;
