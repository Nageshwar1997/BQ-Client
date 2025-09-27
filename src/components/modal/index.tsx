import { JSX, useEffect } from "react";
import { CloseIcon } from "../../icons";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  containerClassName?: string;
  heading?: string;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  containerClassName = "",
  className = "",
  heading = "",
}: ModalProps) => {
  const { showGradient, containerRef } = useVerticalScrollable();
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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary-inverted-50 p-8 backdrop-blur-sm ${containerClassName}`}
      onClick={onClose}
    >
      <div
        className={`bg-primary-inverted rounded-xl shadow-[var(--primary-8)_0px_4px_16px,_var(--primary-10)_0px_8px_32px] px-6 w-full max-w-md max-h-[90vh] overflow-y-scroll scroll-smooth overflow-hidden relative border border-[red] ${className}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-primary-inverted flex items-center justify-between py-4 z-50 border-b border-b-primary-50">
          {heading && <h2 className="text-2xl font-semibold">{heading}</h2>}
          <CloseIcon
            onClick={onClose}
            className="w-4 h-4 sm:w-5 sm:h-5 stroke-tertiary hover:stroke-primary cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
