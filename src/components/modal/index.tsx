import { JSX, useEffect } from "react";
import { CloseIcon } from "../../icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  containerClassName?: string;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  containerClassName = "",
  className = "",
}: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary-10 p-8 backdrop-blur-sm ${containerClassName}`}
      onClick={onClose}
    >
      <div
        className={`bg-primary-inverted rounded-xl shadow-[var(--primary-8)_0px_4px_16px,_var(--primary-10)_0px_8px_32px] px-6 py-8 w-full max-w-md max-h-[90vh] overflow-y-scroll overflow-hidden relative ${className}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <CloseIcon
          onClick={onClose}
          className="absolute top-2.5 right-2.5 w-4 h-4 sm:w-5 sm:h-5 stroke-tertiary hover:stroke-primary cursor-pointer"
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
