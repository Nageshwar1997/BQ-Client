import { Icon } from '@iconify/react';

import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import type { ITryOnInstruction } from '@/constants/tryon.constants';

interface ITryOnInstructions {
  mode: 'live' | 'upload';
  instructions: ITryOnInstruction[];
  onBack: () => void;
  onAction: () => void;
  className?: string;
}

// Step 2 of the flow - shown after picking Live/Upload, before the engine ever mounts. Live's
// action just advances to step 3 (the engine mounts there and requests the camera); Upload's
// action opens the shared file picker, which advances the flow itself once a file lands (see
// TryOnModal's `handleFileSelected`).
const TryOnInstructions = ({
  mode,
  instructions,
  onAction,
  onBack,
  className = '',
}: ITryOnInstructions) => (
  <div
    className={`mx-auto flex h-full max-w-md flex-col items-center justify-center text-center ${className}`}
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
      <Button pattern="primary" content="Continue" buttonProps={{ onClick: onAction }} />
    </div>
  </div>
);

export default TryOnInstructions;
