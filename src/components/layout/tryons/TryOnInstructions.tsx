import { IMAGE_MIMES } from '@beautinique/frontend-constants';
import type { TTryOnCategory } from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import { type ChangeEvent, useMemo, useRef } from 'react';

import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { getTryOnInstructions } from '@/constants/tryon-constants';

interface ITryOnInstructions {
  mode: 'live' | 'upload';
  category: TTryOnCategory;
  onBack: () => void;
  // Live mode only - advances the flow straight to the 'tryon' step (the engine mounts there
  // and requests the camera).
  onStartLive: () => void;
  // Upload mode only - the picked file, handed back so the parent can run it through
  // `useTryOnUpload` and advance the flow to the 'tryon' step. The file input/click-trigger
  // itself has no reason to live outside this screen - nothing else opens it.
  onFileSelected: (file: File) => void;
  className?: string;
}

// Step 2 of the flow - shown after picking Live/Upload, before the engine ever mounts.
const TryOnInstructions = ({
  mode,
  category,
  onStartLive,
  onFileSelected,
  onBack,
  className = '',
}: ITryOnInstructions) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const instructions = useMemo(() => getTryOnInstructions(category, mode), [category, mode]);

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onFileSelected(file);
  };

  return (
    <div
      className={`mx-auto flex h-full max-w-md flex-col items-center justify-center p-4 text-center ${className}`}
    >
      <span className="mb-2 size-8 shrink-0">
        <Icon
          icon={mode === 'live' ? 'solar:camera-linear' : 'solar:gallery-add-linear'}
          className="text-primary/60 size-full"
        />
      </span>
      <GradientText
        type="silver"
        text="Tips for a great result"
        className="mb-3 text-lg font-semibold"
      />
      <ul className="mb-4 space-y-2.5 text-left">
        {instructions.map(({ icon, text }) => (
          <li key={text} className="flex items-start gap-2">
            <span className="size-4 shrink-0">
              <Icon icon={icon} className="text-primary/60 size-full" />
            </span>
            <span className="text-tertiary text-xs lg:text-sm">{text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-1 flex w-full items-center justify-center gap-3">
        <Button pattern="secondary" content="Back" buttonProps={{ onClick: onBack }} />
        <Button
          pattern="primary"
          content="Continue"
          buttonProps={{ onClick: mode === 'live' ? onStartLive : handleChoosePhoto }}
        />
      </div>

      {mode === 'upload' && (
        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_MIMES.join(', ')}
          className="sr-only"
          onChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default TryOnInstructions;
