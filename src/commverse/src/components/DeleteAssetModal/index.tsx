import { Icon } from '@iconify/react';
import { useState } from 'react';
import Button from '../Button';
import Modal from '../Modal';
import type { DeleteAssetModalProps } from '../../types';
import SuccessStatePanel from '../SuccessStatePanel';

const DeleteAssetModal: React.FC<DeleteAssetModalProps> = ({
  open,
  onClose,
  title,
  image,
  onConfirm,
  isLoading = false,
  confirmTitle = 'Are you sure you want to delete this item?',
  confirmButtonLabel = 'Delete',
  confirmButtonLoadingLabel = 'Deleting...',
  successTitle = 'Deleted successfully',
  closeButtonLabel = 'Close',
  showSuccessStep = true,
  className = '',
}) => {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');

  const handleConfirm = async () => {
    await onConfirm();
    if (showSuccessStep) {
      setStep('success');
      return;
    }
    handleClose();
  };

  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  const handleSuccess = () => {
    setStep('confirm');
    onClose();
  };

  const spriteSize = 512 / 2;
  const frames = 15;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className={`${step === 'confirm' ? '[&>div]:max-w-260' : '[&>div]:h-[60vh] [&>div]:max-w-130!'} ${className}`}
    >
      {step === 'confirm' && (
        <div className="flex w-full gap-10 p-10">
          <div className="group flex h-117.5 w-116 items-center justify-center rounded-2xl bg-[#EFF0F6]">
            <div
              className={`group-hover:animate-ghost h-full w-65 bg-left bg-no-repeat`}
              style={
                {
                  backgroundSize: `${spriteSize * frames}px ${spriteSize}px`,
                  backgroundImage: `url(${image})`,
                  backgroundPositionY: '50%',
                  transform: 'scale(2)',
                  ['--to-x']: `${-(spriteSize * frames)}px`,
                  ['--from-x']: `0px`,
                  ['--to-y']: `50%`,
                  ['--from-y']: `50%`,
                  ['--frameRate']: `steps(${frames})`,
                } as React.CSSProperties
              }
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex grow flex-col items-center justify-center gap-2 text-center">
              <div className="bg-ui-warning-light rounded-full p-2">
                <Icon
                  icon="solar:danger-circle-bold"
                  className="text-ui-warning size-24"
                />
              </div>
              <h2 className="font-metropolis text-neutral-gray-900 mt-2 text-2xl font-bold">
                {confirmTitle}
              </h2>
              <span className="text-neutral-gray-600 text-sm font-normal">
                {title}
              </span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                content="Cancel"
                onClick={handleClose}
              />
              <Button
                variant="outline"
                content={
                  isLoading ? confirmButtonLoadingLabel : confirmButtonLabel
                }
                className="border-ui-error! text-ui-error! disabled:opacity-35"
                onClick={handleConfirm}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {step === 'success' && (
        <SuccessStatePanel
          title={successTitle}
          buttonLabel={closeButtonLabel}
          onButtonClick={handleSuccess}
        />
      )}
    </Modal>
  );
};

export default DeleteAssetModal;
