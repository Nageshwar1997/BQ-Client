import { forwardRef, useImperativeHandle, useRef } from 'react';

import type { IFaceTryOnState } from '@/classes/tryon/categories/face';
import type { ITryOnStageRef } from '@/types/tryon-types';

import FaceLiveStage from './FaceLiveStage';
import FaceUploadStage from './FaceUploadStage';

interface IFaceTryOnStageProps {
  mode: 'live' | 'upload';
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
      const getActiveRef = () => (mode === 'live' ? liveRef.current : uploadRef.current);

      return {
        setMakeupState: (state) => getActiveRef()?.setMakeupState(state),
        getState: () => getActiveRef()?.getState(),
        takeSnapshot: () => getActiveRef()?.takeSnapshot() ?? null,
        getStream: () => getActiveRef()?.getStream() ?? null,
        setComparePosition: (value) => getActiveRef()?.setComparePosition(value),
        getCanvas: () => getActiveRef()?.getCanvas() ?? null,
      };
    }, [mode]);

    return mode === 'live' ? (
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
