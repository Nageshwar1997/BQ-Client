import { useRef } from 'react';
import { Icon } from '@iconify/react';
import Button from '../../../components/Button';
import useQueryParams from '../../../hooks/useQueryParams';

export const SelectionScreen = () => {
  const { updateParams } = useQueryParams();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <span className="text-neutral-gray-900 text-sm font-medium">
        Add Products to the Try-On Experience
      </span>
      <Button
        content="Select a Product"
        variant="tertiary"
        size="sm"
        className="h-10! w-auto! text-sm!"
        leftIcon={
          <Icon
            icon="solar:box-minimalistic-linear"
            className="size-5 text-neutral-100"
          />
        }
        onClick={() => updateParams({ set: { product: 'select' } })}
      />
    </div>
  );
};

export const ShowPreviewScreen = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <p className="text-sm/[17px] font-medium">
        Preview the changes in real-time
      </p>
      <p className="text-sm text-gray-600">You can hide/show preview anytime</p>
      <Button
        content="Show Preview"
        variant="tertiary"
        size="sm"
        className="h-10! w-fit!"
        onClick={onClick}
      />
    </div>
  );
};

export const AllowCameraScreen = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-6">
      <p className="text-sm/[17px] font-medium">
        Allow commverse to access your camera
      </p>
      <div className="bg-neutral-gray-400 relative h-2 w-60 overflow-hidden rounded-full">
        <div className="bg-neutral-gray-900 absolute h-full w-15 animate-[slideLoader_1.5s_ease-in-out_infinite] rounded-full" />
      </div>
      <Button
        content="Try Again"
        variant="outline"
        size="sm"
        className="h-10! w-fit!"
        onClick={onClick}
      />
    </div>
  );
};

export const LoadingUploadScreen = () => {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-6">
      <p className="text-sm/[17px] font-medium">Please wait until load image</p>
      <div className="bg-neutral-gray-400 relative h-2 w-60 overflow-hidden rounded-full">
        <div className="bg-neutral-gray-900 absolute h-full w-15 animate-[slideLoader_1.5s_ease-in-out_infinite] rounded-full" />
      </div>
    </div>
  );
};

export const PhotoUploadScreen = ({
  onClick,
}: {
  onClick: (file: File) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { updateParams } = useQueryParams();

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onClick(file);
    updateParams({ set: { product: 'tryon' } });

    // optional: reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <span className="text-neutral-gray-900 text-sm font-medium">
        Upload a photo of your choice
      </span>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        content="Upload"
        variant="tertiary"
        size="sm"
        className="h-10! w-auto! text-sm!"
        leftIcon={
          <Icon
            icon="solar:gallery-send-linear"
            className="text-neutral-gray-100 size-5"
          />
        }
        onClick={handleButtonClick}
      />
    </div>
  );
};
