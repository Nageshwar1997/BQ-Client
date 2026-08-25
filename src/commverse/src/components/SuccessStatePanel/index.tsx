import { Icon } from '@iconify/react';
import Button from '../Button';

interface SuccessStatePanelProps {
  title: string;
  buttonLabel?: string;
  onButtonClick: () => void;
}

const SuccessStatePanel = ({
  title,
  buttonLabel = 'Close',
  onButtonClick,
}: SuccessStatePanelProps) => {
  return (
    <div className="flex h-full flex-col justify-between p-10 text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="bg-neutral-gray-200 rounded-full p-2">
          <Icon
            icon="solar:check-circle-bold"
            className="text-neutral-gray-600 size-24"
          />
        </div>
        <h2 className="font-metropolis text-neutral-gray-900 text-2xl font-bold">
          {title}
        </h2>
      </div>
      <div className="flex justify-center">
        <Button
          variant="secondary"
          content={buttonLabel}
          className="min-w-60"
          onClick={onButtonClick}
        />
      </div>
    </div>
  );
};

export default SuccessStatePanel;
