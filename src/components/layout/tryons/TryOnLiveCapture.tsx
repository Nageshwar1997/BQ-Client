import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

import type { ILipTryOnState, TLipFinish } from '@/classes/tryon/categories/lip';
import { LipLiveEngine } from '@/classes/tryon/categories/lip';
import Button from '@/components/ui/Button';
import ColorInput from '@/components/ui/inputs/colorInput';
import { TRY_ON_MAP } from '@/constants/temp.constants';

interface ITryOnLiveCaptureProps {
  onBack: () => void;
  initialFinish?: TLipFinish;
}

const LIP_FINISHES = TRY_ON_MAP.LIP;

const TryOnLiveCapture = ({ onBack, initialFinish }: ITryOnLiveCaptureProps) => {
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const engineRef = useRef<LipLiveEngine | null>(null);

  const [state, setState] = useState<ILipTryOnState | null>(null);

  useEffect(() => {
    const canvas1 = canvas1Ref.current;
    const canvas2 = canvas2Ref.current;
    const video = videoRef.current;
    if (!canvas1 || !canvas2 || !video) return;

    const engine = new LipLiveEngine(canvas1, canvas2, { type: initialFinish ?? null });
    engineRef.current = engine;

    const unsubscribe = engine.onChange(setState);
    setState(engine.getState());

    engine.attachVideo(video);
    void engine.startTryOn();
    void engine.startCamera();

    return () => {
      unsubscribe();
      engine.destroy();
      engineRef.current = null;
    };
    // Only ever set up once per mount - `initialFinish` seeds the starting finish, it isn't
    // meant to re-run the whole camera/engine lifecycle if it changes later.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSnapshot = () => {
    const dataUrl = engineRef.current?.takeSnapshot();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'try-on.png';
    link.click();
  };

  const cameraReady = state?.cameraReady ?? false;

  return (
    <div className="flex flex-col gap-3">
      <div className="border-primary/10 bg-primary-invert relative h-80 overflow-hidden rounded-lg border">
        <canvas ref={canvas1Ref} className="absolute inset-0 z-0 size-full object-cover" />
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 z-0 size-full object-cover" />
        {/* Opaque - fully covers the raw video below with the mirrored, makeup-composited frame */}
        <canvas ref={canvas2Ref} className="absolute inset-0 z-1 size-full object-cover" />

        {!cameraReady && (
          <div className="bg-primary-invert absolute inset-0 z-2 flex flex-col items-center justify-center gap-2 p-6 text-center">
            {state?.error ? (
              <>
                <Icon icon="solar:camera-square-linear" className="text-primary-red size-8" />
                <p className="text-primary-red text-xs">{state.error}</p>
              </>
            ) : (
              <>
                <Icon icon="solar:camera-linear" className="text-primary/40 size-8 animate-pulse" />
                <p className="text-tertiary text-xs">Waiting for camera permission...</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {LIP_FINISHES.map((finish) => (
          <button
            key={finish}
            type="button"
            onClick={() => {
              engineRef.current?.setMakeupState({ type: finish });
            }}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-300 ${
              state?.type === finish
                ? 'bg-sky-blue-burst border-transparent text-white'
                : 'border-primary/20 text-secondary hover:border-primary/40'
            }`}
          >
            {finish}
          </button>
        ))}
      </div>

      <ColorInput
        label="Shade"
        value={state?.color ?? undefined}
        placeholder="Pick a shade"
        onChange={(hex) => {
          engineRef.current?.setMakeupState({ color: hex });
        }}
      />

      <div className="flex gap-3">
        <Button pattern="outline" content="Back" buttonProps={{ onClick: onBack }} />
        <Button
          pattern="primary"
          content="Download"
          leftIcon={{ icon: 'solar:download-linear' }}
          buttonProps={{ onClick: handleSnapshot, disabled: !cameraReady || !state?.color }}
        />
      </div>
    </div>
  );
};

export default TryOnLiveCapture;
