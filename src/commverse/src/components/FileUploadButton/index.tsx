import { Icon } from '@iconify/react';
import { memo, useRef, useId } from 'react';

interface FileUploadButtonProps {
  className?: string;
  isUploaded?: boolean;
  uploadedLabel?: string | null;
  allowedFileTypes: string[];
  maxFileSize?: number; // in bytes
  onFileUpload: (url: string, fileName: string) => void;
  onClose: () => void;
  onClick?: () => void;
  buttonLabel?: string;
  isActive?: boolean;
}

const FileUploadButton = memo(
  ({
    className,
    isUploaded = false,
    uploadedLabel,
    allowedFileTypes,
    maxFileSize,
    onFileUpload,
    onClose,
    onClick,
    buttonLabel = 'Upload File',
    isActive = false,
  }: FileUploadButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadId = useId();

    const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
      if (isUploaded) {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      }
    };

    const handleClose = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      onClose();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (maxFileSize && file.size > maxFileSize) {
          const sizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
          alert(
            `File size exceeds ${sizeMB}MB limit. Please upload a smaller file.`
          );
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }

        const url = URL.createObjectURL(file);
        onFileUpload(url, file.name);
      }
    };

    const acceptAttribute = allowedFileTypes.join(',');

    return (
      <label
        htmlFor={isUploaded ? undefined : uploadId}
        onClick={handleLabelClick}
        className={`font-metropolis flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-[14px] ${className} ${
          isActive
            ? 'bg-neutral-gray-300 border-neutral-gray-900 font-semibold'
            : 'bg-neutral-gray-400 border-neutral-gray-500'
        } `}
      >
        <span
          className={`max-w-3/4 truncate ${
            isUploaded ? '' : 'decoration- underline'
          }`}
        >
          {isUploaded && uploadedLabel ? uploadedLabel : buttonLabel}
        </span>

        {!isUploaded ? (
          <Icon
            icon="solar:upload-minimalistic-linear"
            className="size-5 cursor-pointer"
          />
        ) : (
          <Icon
            icon="lucide:x"
            className="text-neutral-gray-900 size-5 cursor-pointer"
            onClick={handleClose}
          />
        )}

        <input
          ref={fileInputRef}
          id={uploadId}
          type="file"
          accept={acceptAttribute}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    );
  }
);

FileUploadButton.displayName = 'FileUploadButton';

export default FileUploadButton;
