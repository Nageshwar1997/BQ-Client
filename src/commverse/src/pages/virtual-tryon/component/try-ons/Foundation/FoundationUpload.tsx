import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { IFoundationState, ITryOnUploadRef } from '../../../../../types';
import { FoundationUploadClass } from '../../../classes/Foundation/FoundationUploadClass';

interface Props {
  uploadedImageUrl?: string | null;
  initialState?: Partial<IFoundationState>;
  onStateChange?: (state: IFoundationState) => void;
  className?: string;
}

const FoundationUpload = forwardRef<ITryOnUploadRef, Props>(
  ({ uploadedImageUrl, initialState, onStateChange, className }, ref) => {
    const canvas1Ref = useRef<HTMLCanvasElement>(null!);
    const canvas2Ref = useRef<HTMLCanvasElement>(null!);
    const tryOnRef = useRef<FoundationUploadClass | null>(null);

    /* ================= IMPERATIVE API ================= */

    useImperativeHandle(
      ref,
      () => ({
        setMakeupState: (s) =>
          tryOnRef.current?.updateState.set(s as IFoundationState),
        getState: () => tryOnRef.current?.currentState,
        takeSnapShot: () => tryOnRef.current?.takeSnapshot(),
        resetState: () => tryOnRef.current?.updateState.internalReset(),
        setComparePosition: (value: number | null) =>
          tryOnRef.current?.setComparePosition(value),

        // image load
        loadImage: (url) => tryOnRef.current?.loadImageUrl(url),

        // source / mode change intent
        onSourceChange: () => tryOnRef.current?.onSourceChange(),
        getCanvas: () => tryOnRef.current?.getCanvas() ?? null,
      }),
      []
    );

    /* ================= INIT ================= */

    useEffect(() => {
      const tryOn = new FoundationUploadClass(
        canvas1Ref.current,
        canvas2Ref.current,
        initialState
      );

      tryOnRef.current = tryOn;
      const unsubscribe = onStateChange
        ? tryOn.onChange(onStateChange)
        : undefined;

      tryOn.startTryOn();

      return () => {
        unsubscribe?.();
        tryOn.destroy();
        tryOnRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ================= IMAGE LOAD ================= */

    useEffect(() => {
      const instance = tryOnRef.current;
      if (!uploadedImageUrl || !instance) return;

      (async () => {
        try {
          await instance.loadImageUrl(uploadedImageUrl);
        } catch (err) {
          console.error('Image load failed', err);
          instance.updateState.setImageReady(false);
        }
      })();
    }, [uploadedImageUrl]);

    /* ================= RENDER ================= */

    return (
      <div
        className={`relative flex size-full scale-100 items-center justify-center overflow-hidden ${className ?? ''}`}
      >
        <canvas
          ref={canvas1Ref}
          className="absolute inset-0 z-0 size-full! object-cover"
        />
        <canvas ref={canvas2Ref} className="absolute inset-0 z-1 mx-auto" />
      </div>
    );
  }
);

export default FoundationUpload;
