import { forwardRef, useImperativeHandle, useRef } from 'react';

import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import type { ITryOnStageRef } from '@/types/tryon-engine.type';

import TryOnLiveStage, { TryOnLiveStatusOverlay } from './TryOnLiveStage';
import TryOnUploadStage, { TryOnUploadStatusOverlay } from './TryOnUploadStage';

interface ILipTryOnStageProps {
  mode: 'live' | 'upload';
  uploadedImageUrl: string | null;
  initialState?: Partial<ILipTryOnState>;
  onStateChange: (state: ILipTryOnState) => void;
}

// Mounts whichever of TryOnLiveStage/TryOnUploadStage matches `mode`, and forwards its ref
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
        const getActiveRef = () => (mode === 'live' ? liveRef.current : uploadRef.current);

        return {
          setMakeupState: (state) => getActiveRef()?.setMakeupState(state),
          getState: () => getActiveRef()?.getState(),
          takeSnapshot: () => getActiveRef()?.takeSnapshot() ?? null,
          getStream: () => getActiveRef()?.getStream() ?? null,
        };
      },
      // Rebuilt when `mode` changes so callers always reach the currently-mounted stage.
       
      [mode],
    );

    return mode === 'live' ? (
      <TryOnLiveStage ref={liveRef} initialState={initialState} onStateChange={onStateChange} />
    ) : (
      <TryOnUploadStage
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

// Status/placeholder overlays (permission prompts, processing spinners) for whichever mode is
// active - kept alongside the stage picker so `TryOnModal` doesn't need its own mode switch.
export const LipTryOnStatusOverlay = ({
  mode,
  uploadedImageUrl,
  state,
}: {
  mode: 'live' | 'upload';
  uploadedImageUrl: string | null;
  state: ILipTryOnState | null;
}) =>
  mode === 'live' ? (
    <TryOnLiveStatusOverlay state={state} />
  ) : (
    <TryOnUploadStatusOverlay imageUrl={uploadedImageUrl} state={state} />
  );
