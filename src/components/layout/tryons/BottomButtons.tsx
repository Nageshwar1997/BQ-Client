import Button from '@/components/ui/Button';

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
  mode: 'live' | 'upload';
  step: 'tryon' | 'select' | 'instructions';
  isTryOnReady: boolean;
  onModelsClick: (sheet: 'models') => void;
  onModeToggle: (mode: 'live' | 'upload') => void;
}) => {
  return (
    <div className="flex shrink-0 gap-2 lg:hidden">
      <Button
        pattern="secondary"
        content={`Try ${mode === 'live' ? 'Upload' : 'Live'}`}
        buttonProps={{
          onClick: () => {
            onModeToggle(mode === 'live' ? 'upload' : 'live');
          },
        }}
        leftIcon={{
          icon: mode === 'live' ? 'solar:gallery-send-linear' : 'solar:camera-linear',
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
