import { useEffect } from 'react';
import type { IModalWrapper } from '../../../types';
import { CloseIcon } from '../../../icons';
import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';
import GradientText from '../../ui/GradientText';

const ModalWrapper = ({
  isOpen,
  onClose,
  children,
  containerProps,
  className = '',
  heading = '',
}: IModalWrapper) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      {...containerProps}
      className={`bg-primary-inverted/50 fixed inset-0 z-100 flex items-center justify-center p-8 backdrop-blur-xs ${
        containerProps?.className || ''
      }`}
    >
      <div
        className={`bg-primary-invert border-primary/20 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl border shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-primary-invert border-b-primary/50 sticky top-0 z-20 flex h-16 items-center justify-between border-b px-6">
          {heading && (
            <h2 className="flex-1 text-center text-lg font-semibold">
              <GradientText text={heading} type="silver" />
            </h2>
          )}
          <CloseIcon
            onClick={onClose}
            className="stroke-tertiary hover:stroke-primary ml-auto h-4 w-4 cursor-pointer sm:h-5 sm:w-5"
          />
        </div>
        <ScrollableGradientContainer
          direction="vertical"
          containerClassName="flex-1"
          className="p-4"
          gradientClassNames={{ top: 'h-8!', bottom: 'h-8!' }}
        >
          {children}
        </ScrollableGradientContainer>
      </div>
    </div>
  );
};

export default ModalWrapper;
