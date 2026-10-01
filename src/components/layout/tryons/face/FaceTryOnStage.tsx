import { forwardRef, useImperativeHandle, useRef } from 'react';

import type { IFaceTryOnState } from '@/classes/tryon/categories/face';
import { TRYON_MODE_MAP } from '@/constants/tryon-constants';
import type { ITryOnStageRef, TTryOnMode } from '@/types/tryon-types';

import FaceLiveStage from './FaceLiveStage';
import FaceUploadStage from './FaceUploadStage';

interface IFaceTryOnStageProps {
  mode: TTryOnMode;
  uploadedImageUrl: string | null;
  initialState?: Partial<IFaceTryOnState>;
  onStateChange: (state: IFaceTryOnState) => void;
}

// Mirrors LipTryOnStage.tsx exactly, over the FACE stage pair instead.
const FaceTryOnStage = forwardRef<ITryOnStageRef<IFaceTryOnState>, IFaceTryOnStageProps>(
  ({ mode, uploadedImageUrl, initialState, onStateChange }, ref) => {
    const liveRef = useRef<ITryOnStageRef<IFaceTryOnState> | null>(null);
    const uploadRef = useRef<ITryOnStageRef<IFaceTryOnState> | null>(null);

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
      <FaceLiveStage ref={liveRef} initialState={initialState} onStateChange={onStateChange} />
    ) : (
      <FaceUploadStage
        ref={uploadRef}
        imageUrl={uploadedImageUrl}
        initialState={initialState}
        onStateChange={onStateChange}
      />
    );
  },
);

FaceTryOnStage.displayName = 'FaceTryOnStage';

export default FaceTryOnStage;
