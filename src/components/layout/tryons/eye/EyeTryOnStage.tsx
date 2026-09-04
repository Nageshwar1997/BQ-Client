import { forwardRef, useImperativeHandle, useRef } from 'react';

import type { IEyeTryOnState } from '@/classes/tryon/categories/eye';
import type { ITryOnStageRef } from '@/types/tryon-types';

import EyeLiveStage from './EyeLiveStage';
import EyeUploadStage from './EyeUploadStage';

interface IEyeTryOnStageProps {
  mode: 'live' | 'upload';
  uploadedImageUrl: string | null;
  initialState?: Partial<IEyeTryOnState>;
  onStateChange: (state: IEyeTryOnState) => void;
}

// Mounts whichever of EyeLiveStage/EyeUploadStage matches `mode`, and forwards its ref straight
// through - both expose the identical `ITryOnStageRef` shape, so the parent (`TryOnModal`) never
// needs to know which mode is active to set a shade/pattern or take a snapshot. Mirrors
// LipTryOnStage.tsx/FaceTryOnStage.tsx exactly.
const EyeTryOnStage = forwardRef<ITryOnStageRef<IEyeTryOnState>, IEyeTryOnStageProps>(
  ({ mode, uploadedImageUrl, initialState, onStateChange }, ref) => {
    const liveRef = useRef<ITryOnStageRef<IEyeTryOnState> | null>(null);
    const uploadRef = useRef<ITryOnStageRef<IEyeTryOnState> | null>(null);

    useImperativeHandle(
      ref,
      () => {
        const getActiveRef = () => (mode === 'live' ? liveRef.current : uploadRef.current);

        return {
          setMakeupState: (state) => getActiveRef()?.setMakeupState(state),
          getState: () => getActiveRef()?.getState(),
          takeSnapshot: () => getActiveRef()?.takeSnapshot() ?? null,
          getStream: () => getActiveRef()?.getStream() ?? null,
          setComparePosition: (value) => getActiveRef()?.setComparePosition(value),
          getCanvas: () => getActiveRef()?.getCanvas() ?? null,
        };
      },
      // Rebuilt when `mode` changes so callers always reach the currently-mounted stage.

      [mode],
    );

    return mode === 'live' ? (
      <EyeLiveStage ref={liveRef} initialState={initialState} onStateChange={onStateChange} />
    ) : (
      <EyeUploadStage
        ref={uploadRef}
        imageUrl={uploadedImageUrl}
        initialState={initialState}
        onStateChange={onStateChange}
      />
    );
  },
);

EyeTryOnStage.displayName = 'EyeTryOnStage';

export default EyeTryOnStage;
