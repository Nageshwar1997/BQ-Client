import Button from '@/components/ui/Button';
import { TRYON_MODE_MAP } from '@/constants/tryon-constants';
import type { TTryOnMode } from '@/types/tryon-types';

{
  /* Mobile/tablet only - stands in for the sidebar above. The mode button toggles
directly (matching the desktop sidebar's own mode-toggle icons) - no picker UI
needed for a straight either/or choice; Models still opens a sheet since there
are more than two of those to choose from. */
}
const BottomButtons = ({
  mode,
  step,
  isTryOnReady,
  onModeToggle,
  onModelsClick,
}: {
  mode: TTryOnMode;
  step: 'tryon' | 'select' | 'instructions';
  isTryOnReady: boolean;
  onModelsClick: (sheet: 'models') => void;
  onModeToggle: (mode: TTryOnMode) => void;
}) => {
  return (
    <div className="flex shrink-0 gap-2 lg:hidden">
      <Button
        pattern="secondary"
        content={`Try ${mode === TRYON_MODE_MAP.LIVE ? 'Upload' : 'Live'}`}
        buttonProps={{
          onClick: () => {
            onModeToggle(
              mode === TRYON_MODE_MAP.LIVE ? TRYON_MODE_MAP.UPLOAD : TRYON_MODE_MAP.LIVE,
            );
          },
        }}
        leftIcon={{
          icon: mode === TRYON_MODE_MAP.LIVE ? 'solar:gallery-send-linear' : 'solar:camera-linear',
        }}
      />
      <Button
        pattern="secondary"
        content="Models"
        buttonProps={{
          onClick: () => {
            onModelsClick('models');
          },
          disabled: step === 'tryon' && !isTryOnReady,
        }}
        leftIcon={{ icon: 'solar:gallery-linear' }}
      />
    </div>
  );
};

export default BottomButtons;
