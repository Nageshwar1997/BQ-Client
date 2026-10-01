import { forwardRef, useImperativeHandle, useRef } from 'react';

import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import { TRYON_MODE_MAP } from '@/constants/tryon-constants';
import type { ITryOnStageRef, TTryOnMode } from '@/types/tryon-types';

import LipLiveStage from './LipLiveStage';
import LipUploadStage from './LipUploadStage';

interface ILipTryOnStageProps {
  mode: TTryOnMode;
  uploadedImageUrl: string | null;
  initialState?: Partial<ILipTryOnState>;
  onStateChange: (state: ILipTryOnState) => void;
}

// Mounts whichever of LipLiveStage/LipUploadStage matches `mode`, and forwards its ref
// straight through - both expose the identical `ITryOnStageRef` shape, so the parent
// (`TryOnModal`) never needs to know which mode is active to set a shade or take a snapshot.
// Mirrors the reference implementation's per-category `<Category>TryOn.tsx` (e.g.
// `LipstickTryOn.tsx`).
const LipTryOnStage = forwardRef<ITryOnStageRef<ILipTryOnState>, ILipTryOnStageProps>(
  ({ mode, uploadedImageUrl, initialState, onStateChange }, ref) => {
    const liveRef = useRef<ITryOnStageRef<ILipTryOnState> | null>(null);
    const uploadRef = useRef<ITryOnStageRef<ILipTryOnState> | null>(null);

    useImperativeHandle(
      ref,
      () => {
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
      },
      // Rebuilt when `mode` changes so callers always reach the currently-mounted stage.

      [mode],
    );

    return mode === TRYON_MODE_MAP.LIVE ? (
      <LipLiveStage ref={liveRef} initialState={initialState} onStateChange={onStateChange} />
    ) : (
      <LipUploadStage
        ref={uploadRef}
        imageUrl={uploadedImageUrl}
        initialState={initialState}
        onStateChange={onStateChange}
      />
    );
  },
);

LipTryOnStage.displayName = 'LipTryOnStage';

export default LipTryOnStage;
