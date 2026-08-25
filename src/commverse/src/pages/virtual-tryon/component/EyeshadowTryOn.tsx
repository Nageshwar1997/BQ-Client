import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import EyeshadowLive from './try-ons/Eyeshadow/EyeshadowLive';
import EyeshadowUpload from './try-ons/Eyeshadow/EyeshadowUpload';

import type {
  IEyeshadowState,
  ITryOnLiveRef,
  ITryOnUploadRef,
  ITryOnCommonRef,
} from '../../../types';

interface Props {
  mode: 'live' | 'upload';
  uploadedImageUrl: string | null;
  initialState?: Partial<IEyeshadowState>;
  onStateChange: (s: IEyeshadowState) => void;
  className?: string;
}

const EyeshadowTryOn = forwardRef<ITryOnCommonRef, Props>(
  ({ mode, uploadedImageUrl, initialState, onStateChange, className }, ref) => {
    const liveRef = useRef<ITryOnLiveRef | null>(null);
    const uploadRef = useRef<ITryOnUploadRef | null>(null);

    const getActiveRef = () => (mode === 'upload' ? uploadRef.current : liveRef.current);

    /* ================= MODE SWITCH CLEANUP ================= */

    useEffect(() => {
      // Reset only the inactive source to avoid clearing active upload readiness.
      if (mode === 'upload') {
        liveRef.current?.onSourceChange();
      } else {
        uploadRef.current?.onSourceChange();
      }
    }, [mode]);

    /* ================= IMPERATIVE API ================= */

    useImperativeHandle(
      ref,
      () => ({
        /* ===== CORE ===== */
        setMakeupState: (s) => getActiveRef()?.setMakeupState(s),
        resetState: () => getActiveRef()?.resetState(),
        onSourceChange: () => getActiveRef()?.onSourceChange(),
        takeSnapshot: () => getActiveRef()?.takeSnapShot(),

        setComparePosition: (value: number | null) => getActiveRef()?.setComparePosition(value),
        getCanvas: () => getActiveRef()?.getCanvas?.() ?? null,

        /* ===== CAMERA (LIVE ONLY) ===== */
        startCamera: () => liveRef.current?.startCamera(),
        stopCamera: () => liveRef.current?.stopCamera(),
        restartCamera: () => liveRef.current?.restartCamera(),
        getStream: () => liveRef.current?.getStream() ?? null,
      }),
      [mode],
    );

    return mode === 'live' ? (
      <EyeshadowLive
        ref={liveRef}
        initialState={initialState}
        className={className}
        onStateChange={onStateChange}
      />
    ) : (
      <EyeshadowUpload
        ref={uploadRef}
        uploadedImageUrl={uploadedImageUrl}
        initialState={initialState}
        className={className}
        onStateChange={onStateChange}
      />
    );
  },
);

export default EyeshadowTryOn;
