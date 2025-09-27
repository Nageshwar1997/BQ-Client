import { JSX, useEffect } from "react";
import { CloseIcon } from "../../icons";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";
import { BottomGradient, TopGradient } from "../Gradients";

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
        className={`bg-primary-inverted rounded-xl shadow-[var(--primary-8)_0px_4px_16px,_var(--primary-10)_0px_8px_32px] w-full max-w-md max-h-[90vh] relative ${className}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Scrollable area */}
        {showGradient.top && (
          <TopGradient className={`h-8 ${heading ? "!top-16" : ""}`} />
        )}
        <div
          ref={containerRef}
          className={`max-h-[90dvh] overflow-y-auto scroll-smooth px-6 ${
            heading ? "pb-4" : "py-6"
          }`}
        >
          {/* Sticky Header */}
          <div
            className={`z-20 ${
              heading
                ? "border-b border-b-primary-50 h-16 flex items-center justify-between sticky top-0 bg-primary-inverted"
                : ""
            }`}
          >
            {heading && (
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold flex-1 text-center bg-clip-text text-transparent bg-silver-duo">
                {heading}
              </h2>
            )}
            <CloseIcon
              onClick={onClose}
              className={`w-4 h-4 sm:w-5 sm:h-5 stroke-tertiary hover:stroke-primary cursor-pointer ${
                !heading ? "absolute top-2.5 right-2.5" : ""
              }`}
            />
          </div>
          <div className="py-2">{children}</div>
        </div>
        {/* Content */}
        {showGradient.bottom && <BottomGradient className="h-8" />}
      </div>
    </div>
  );
};

export default Modal;
