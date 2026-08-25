import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import KajalLive from './try-ons/Kajal/KajalLive';
import KajalUpload from './try-ons/Kajal/KajalUpload';

import type {
  IKajalState,
  ITryOnLiveRef,
  ITryOnUploadRef,
  ITryOnCommonRef,
} from '../../../types';

interface Props {
  mode: 'live' | 'upload';
  uploadedImageUrl: string | null;
  initialState?: Partial<IKajalState>;
  onStateChange: (s: IKajalState) => void;
  className?: string;
}

const KajalTryOn = forwardRef<ITryOnCommonRef, Props>(
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
      <KajalLive
        ref={liveRef}
        initialState={initialState}
        className={className}
        onStateChange={onStateChange}
      />
    ) : (
      <KajalUpload
        ref={uploadRef}
        uploadedImageUrl={uploadedImageUrl}
        initialState={initialState}
        className={className}
        onStateChange={onStateChange}
      />
    );
  },
);

export default KajalTryOn;
