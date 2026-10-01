import { forwardRef, useImperativeHandle, useRef } from 'react';

import type { INailTryOnState } from '@/classes/tryon/categories/nail';
import { TRYON_MODE_MAP } from '@/constants/tryon-constants';
import type { ITryOnStageRef, TTryOnMode } from '@/types/tryon-types';

import NailLiveStage from './NailLiveStage';
import NailUploadStage from './NailUploadStage';

interface INailTryOnStageProps {
  mode: TTryOnMode;
  uploadedImageUrl: string | null;
  initialState?: Partial<INailTryOnState>;
  onStateChange: (state: INailTryOnState) => void;
}

// Mirrors ../hair/HairTryOnStage.tsx exactly, over the NAIL stage pair instead.
const NailTryOnStage = forwardRef<ITryOnStageRef<INailTryOnState>, INailTryOnStageProps>(
  ({ mode, uploadedImageUrl, initialState, onStateChange }, ref) => {
    const liveRef = useRef<ITryOnStageRef<INailTryOnState> | null>(null);
    const uploadRef = useRef<ITryOnStageRef<INailTryOnState> | null>(null);

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
      <NailLiveStage ref={liveRef} initialState={initialState} onStateChange={onStateChange} />
    ) : (
      <NailUploadStage
        ref={uploadRef}
        imageUrl={uploadedImageUrl}
        initialState={initialState}
        onStateChange={onStateChange}
      />
    );
  },
);

NailTryOnStage.displayName = 'NailTryOnStage';

export default NailTryOnStage;
