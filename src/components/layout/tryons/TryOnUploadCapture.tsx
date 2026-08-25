import { IMAGE_MIMES } from '@beautinique/frontend-constants';
import { Icon } from '@iconify/react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

import type { ILipTryOnState, TLipFinish } from '@/classes/tryon/categories/lip';
import { LipUploadEngine } from '@/classes/tryon/categories/lip';
import Button from '@/components/ui/Button';
import ColorInput from '@/components/ui/inputs/colorInput';
import { TRY_ON_MAP } from '@/constants/temp.constants';
import useTryOnUpload from '@/hooks/useTryOnUpload';

interface ITryOnUploadCaptureProps {
  onBack: () => void;
  initialFinish?: TLipFinish;
}

const LIP_FINISHES = TRY_ON_MAP.LIP;

const TryOnUploadCapture = ({ onBack, initialFinish }: ITryOnUploadCaptureProps) => {
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<LipUploadEngine | null>(null);

  const [state, setState] = useState<ILipTryOnState | null>(null);
  const { previewUrl, error, setFile } = useTryOnUpload();

  useEffect(() => {
    const canvas1 = canvas1Ref.current;
    const canvas2 = canvas2Ref.current;
    if (!canvas1 || !canvas2) return;

    const engine = new LipUploadEngine(canvas1, canvas2, { type: initialFinish ?? null });
    engineRef.current = engine;

    const unsubscribe = engine.onChange(setState);
    setState(engine.getState());

    void engine.startTryOn();

    return () => {
      unsubscribe();
      engine.destroy();
      engineRef.current = null;
    };
    // Same reasoning as TryOnLiveCapture.tsx's identical effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (previewUrl) void engineRef.current?.loadImageUrl(previewUrl);
  }, [previewUrl]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (selected) setFile(selected);
  };

  const handleSnapshot = () => {
    const dataUrl = engineRef.current?.takeSnapshot();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'try-on.png';
    link.click();
  };

  const imageReady = state?.imageReady ?? false;

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="tryon-upload"
        className="border-primary/10 bg-secondary-invert hover:border-primary/30 relative flex h-80 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border transition-colors duration-300"
      >
        <canvas ref={canvas1Ref} className="absolute inset-0 z-0 size-full object-cover" />
        <canvas ref={canvas2Ref} className="absolute inset-0 z-1 size-full object-cover" />

        {!previewUrl && (
          <div className="z-2 flex flex-col items-center gap-2">
            <Icon icon="solar:gallery-add-linear" className="text-primary/40 size-8" />
            <p className="text-tertiary text-xs">Click to choose a photo</p>
          </div>
        )}

        {previewUrl && !imageReady && (
          <div className="bg-primary-invert absolute inset-0 z-2 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <Icon icon="solar:gallery-linear" className="text-primary/40 size-8 animate-pulse" />
            <p className="text-tertiary text-xs">Processing photo...</p>
          </div>
        )}

        <input
          id="tryon-upload"
          type="file"
          accept={IMAGE_MIMES.join(', ')}
          className="sr-only"
          onChange={handleChange}
        />
      </label>

      {(error || state?.error) && <p className="text-primary-red text-xs">{error || state?.error}</p>}

      {state && previewUrl && state.imageReady && (
        <>
          <div className="flex flex-wrap gap-2">
            {LIP_FINISHES.map((finish) => (
              <button
                key={finish}
                type="button"
                onClick={() => {
                  engineRef.current?.setMakeupState({ type: finish });
                }}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-300 ${
                  state.type === finish
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
            value={state.color ?? undefined}
            placeholder="Pick a shade"
            onChange={(hex) => {
              engineRef.current?.setMakeupState({ color: hex });
            }}
          />
        </>
      )}

      <div className="flex gap-3">
        <Button pattern="outline" content="Back" buttonProps={{ onClick: onBack }} />
        <Button
          pattern="primary"
          content="Download"
          leftIcon={{ icon: 'solar:download-linear' }}
          buttonProps={{ onClick: handleSnapshot, disabled: !imageReady || !state?.color }}
        />
      </div>
    </div>
  );
};

export default TryOnUploadCapture;
