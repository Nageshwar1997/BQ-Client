import { Icon } from '@iconify/react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../icons';
import Modal from '../Modal';

type QRModalProps = {
  open: boolean;
  onClose: () => void;
  link: string;
  experienceTitle?: string;
  onShowToast?: (
    title: string,
    state?: 'loading' | 'success' | 'error'
  ) => void;
};

const QRModal = ({
  open,
  onClose,
  link,
  experienceTitle,
  onShowToast,
}: QRModalProps) => {
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(link)}`;

  if (typeof document === 'undefined') return null;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!navigator.clipboard) return;
    void navigator.clipboard.writeText(link);
    onShowToast?.('Link copied to clipboard!');
  };

  const handleOpenLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(link, '_blank');
  };

  return createPortal(
    <Modal
      open={open}
      onClose={onClose}
      className="z-999999999999! bg-black/20 [&>div]:h-min [&>div]:w-105 [&>div]:overflow-visible"
    >
      <div
        className="relative flex w-full flex-col items-center gap-6 p-8"
        data-qr-modal="true"
      >
        <button
          type="button"
          aria-label="Close QR"
          onClick={onClose}
          className="text-neutral-gray-700 hover:text-neutral-gray-900 absolute top-4 right-4 inline-flex size-6 cursor-pointer items-center justify-center"
        >
          <CloseIcon className="size-6" />
        </button>

        <div className="flex flex-col items-center gap-1">
          <h3 className="text-neutral-gray-900 text-xl text-center leading-7 font-bold">
            Scan QR Code to View in Your Space!
          </h3>
          {experienceTitle && (
            <p className="text-neutral-gray-600 text-sm leading-5 font-normal">
              {experienceTitle}
            </p>
          )}
        </div>

        <div
          className="flex items-center justify-center rounded-3xl bg-cover bg-center bg-no-repeat p-8"
          style={{ backgroundImage: 'url(/assets/images/auth-bg.webp)' }}
        >
          <img
            src={qrImageUrl}
            alt="Experience QR code"
            className="h-70 w-70 rounded-2xl bg-white p-4"
          />
        </div>

        <div className="border-neutral-gray-300 flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2.5">
          <Icon
            icon="solar:link-linear"
            className="text-neutral-gray-600 size-5 shrink-0"
          />
          <p className="text-neutral-gray-900 flex-1 truncate text-xs leading-4 font-normal">
            {link}
          </p>
          <button
            type="button"
            aria-label="Open link"
            onClick={handleOpenLink}
            className="text-neutral-gray-600 hover:text-neutral-gray-900 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center"
          >
            <Icon icon="solar:arrow-right-up-linear" className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Copy link"
            onClick={handleCopyLink}
            className="text-neutral-gray-600 hover:text-neutral-gray-900 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center"
          >
            <Icon icon="solar:copy-linear" className="size-4" />
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
};

export default QRModal;
