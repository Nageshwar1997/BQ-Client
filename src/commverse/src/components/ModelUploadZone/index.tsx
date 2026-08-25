import { useId, useRef } from 'react';
import { useModelStore } from '../../lib/store';

interface ModelUploadZoneProps {
  onModelUpload: (file: File) => void;
  children:
    | React.ReactNode
    | ((helpers: { openFileDialog: () => void }) => React.ReactNode);
  allowedExtensions?: string[];
  accept?: string;
  className?: string;
  dropzoneClassName?: string;
  validationText: string;
}

const ModelUploadZone = ({
  onModelUpload,
  children,
  allowedExtensions = ['.glb', '.gltf'],
  accept,
  className,
  dropzoneClassName,
  validationText,
}: ModelUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadId = useId();
  const { setStatus, setValidationError, reset } = useModelStore();

  const normalizedExtensions = allowedExtensions.map((ext) =>
    ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`
  );

  const isAllowedFile = (file: File) =>
    normalizedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    reset();
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isAllowedFile(file)) {
        reset();
        onModelUpload(file);
      } else {
        setStatus('invalid');
        setValidationError({
          title: 'Wrong File Format',
          description: validationText,
        });
      }
    }
    // e.dataTransfer.clearData();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isAllowedFile(file)) {
        reset();
        onModelUpload(file);
      } else {
        setStatus('invalid');
        setValidationError({
          title: 'Wrong File Format',
          description: validationText,
        });
      }
      e.target.value = '';
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();
  const acceptAttribute = accept || normalizedExtensions.join(',');

  return (
    <div
      className={`font-metropolis text-neutral-gray-900 flex h-full w-full flex-col items-center justify-center gap-6 ${
        className || ''
      }`}
    >
      <div className="border-neutral-gray-500 bg-neutral-gray-150 h-full w-full rounded-xl border-2 border-dashed">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex h-full w-full flex-col items-center justify-center gap-8 ${
            dropzoneClassName || ''
          }`}
        >
          {typeof children === 'function'
            ? children({ openFileDialog })
            : children}
          <input
            ref={fileInputRef}
            id={uploadId}
            type="file"
            accept={acceptAttribute}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ModelUploadZone;
