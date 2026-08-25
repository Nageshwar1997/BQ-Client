import { useEffect, useState, type ReactNode } from 'react';
import Modal from '../../../components/Modal';

type LoadingOverlayProps = {
  title?: string;
  subtitles?: string[];
};

type LoadingOverlayModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOutsideClick?: boolean;
  className?: string;
};

export const LoadingOverlayModal = ({
  open,
  onClose,
  children,
  closeOnOutsideClick = false,
  className = '',
}: LoadingOverlayModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnOutsideClick={closeOnOutsideClick}
      className={`z-[100000] !bg-black/10 [&>div]:h-[min(790px,90vh)] [&>div]:w-[min(1280px,95vw)] [&>div]:max-w-none [&>div]:overflow-hidden [&>div]:rounded-[24px] [&>div]:bg-white [&>div]:shadow-none ${className}`}
    >
      {children}
    </Modal>
  );
};

const DEFAULT_SUBTITLES = [
  'Analyzing the product…',
  'Extracting product details…',
  'Preparing your experience…',
  'Almost ready...',
];

const LoadingOverlay = ({
  title = 'Preparing your experience',
  subtitles = DEFAULT_SUBTITLES,
}: LoadingOverlayProps) => {
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [subtitles.length]);

  return (
    <Modal
      open
      onClose={() => {}}
      closeOnOutsideClick={false}
      className="[&>div]:border-neutral-gray-300 z-[100000] !bg-black/10 [&>div]:h-[550px] [&>div]:w-[min(1040px,90vw)] [&>div]:max-w-none [&>div]:overflow-hidden [&>div]:border [&>div]:shadow-none"
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-white p-10">
        {/* Commverse icon */}
        <img
          src="/assets/icons/logo-icon.svg"
          alt="Commverse"
          className="size-12 animate-spin object-contain"
        />

        {/* Title */}
        <p className="text-neutral-gray-900 text-2xl leading-[1.2] font-bold whitespace-nowrap">
          {title}
        </p>

        {/* Cycling subtitle with gradient sweep */}
        <p
          key={subtitleIndex}
          className="animate-thinking-sweep inline-block [background-image:linear-gradient(90deg,#797a80_0%,#797a80_30%,#b6b7bf_50%,#797a80_70%,#797a80_100%)] [background-size:260%_100%] bg-clip-text [background-position:130%_50%] text-sm leading-[1.25] text-transparent italic [will-change:background-position] [-webkit-text-fill-color:transparent]"
        >
          {subtitles[subtitleIndex]}
        </p>
      </div>
    </Modal>
  );
};

export default LoadingOverlay;
