import { useEffect, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import type { ModalProps } from '../../types';

const Modal = ({
  open,
  onClose,
  children,
  className = '',
  closeOnOutsideClick = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: modalRef,
    handler: onClose,
    enabled: open && closeOnOutsideClick,
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`bg-overlay-dark font-metropolis fixed inset-0 z-100 flex h-full w-full items-center justify-center ${className}`}
    >
      <div
        ref={modalRef}
        className="bg-neutral-gray-100 max-h-[90vh] w-full max-w-xl overflow-y-scroll rounded-3xl shadow-md backdrop-blur-lg"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
