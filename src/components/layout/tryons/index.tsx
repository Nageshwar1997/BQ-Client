import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import type { TTryOnSelection } from '@/types/tryon.type';

import TryOnLiveCapture from './TryOnLiveCapture';
import TryOnModeSelect from './TryOnModeSelect';
import TryOnUploadCapture from './TryOnUploadCapture';

type TTryOnStep = 'select' | 'live' | 'upload';

interface ITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  // The category/subCategory the user is trying on - comes straight from the
  // product API (`product.tryOn`), never picked in this modal.
  tryOn?: TTryOnSelection;
}

const TryOnModal = ({ isOpen, onClose, tryOn }: ITryOnModalProps) => {
  const [step, setStep] = useState<TTryOnStep>('select');

  useEffect(() => {
    if (isOpen) return;

    /**
     * `TryOnModal` itself never unmounts (it's always rendered by the parent page), so the
     * step has to be reset explicitly on close - otherwise the next open would resume
     * mid-flow.
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep('select');
  }, [isOpen]);

  const handleBackToSelect = () => {
    setStep('select');
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      header={{ title: 'Try-On', showCloseIcon: true }}
      className="max-w-2xl"
    >
      {/* Only LIP has a rendering engine built so far - see docs/tryons/README.md. */}
      {tryOn?.category !== 'LIP' ? (
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <Icon icon="solar:hourglass-linear" className="text-primary/40 size-8" />
          <p className="text-tertiary text-sm">
            {tryOn
              ? `Try-on for ${tryOn.category} is coming soon.`
              : 'This product has no try-on configured yet.'}
          </p>
        </div>
      ) : step === 'select' ? (
        <TryOnModeSelect
          onSelect={(mode) => {
            setStep(mode);
          }}
        />
      ) : step === 'live' ? (
        <TryOnLiveCapture onBack={handleBackToSelect} initialFinish={tryOn.subCategory} />
      ) : (
        <TryOnUploadCapture onBack={handleBackToSelect} initialFinish={tryOn.subCategory} />
      )}
    </ModalWrapper>
  );
};

export default TryOnModal;
