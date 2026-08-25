import { useRef } from 'react';
import { Icon } from '@iconify/react';
import Button from '../../../components/Button';
import useQueryParams from '../../../hooks/useQueryParams';
import type { ButtonProps } from '../../../types';

export const SelectionScreen = () => {
  const { updateParams } = useQueryParams();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <span className="text-neutral-gray-900 text-sm font-medium">
          Create try-on for a product from inventory
        </span>
        <Button
          content="Select a Product"
          variant="tertiary"
          size="sm"
          className="h-10! w-auto! px-4 text-sm!"
          leftIcon={
            <Icon
              icon="solar:box-minimalistic-linear"
              className="size-5 text-neutral-100"
            />
          }
          onClick={() => updateParams({ set: { product: 'select' } })}
        />
      </div>
      <div className="flex items-center gap-4">
        <hr className="bg-neutral-gray-500 h-px w-36.75 border-none" />
        <span className="text-neutral-gray-700 text-sm">or</span>
        <hr className="bg-neutral-gray-500 h-px w-36.75 border-none" />
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium">Start from Scratch</span>

          <div className="inline-flex gap-3">
            <Button
              content="Add a New Product"
              variant="outline"
              leftIcon={<Icon icon="lucide:plus" className="size-5" />}
              className="h-10! px-4"
              size="sm"
              onClick={() => updateParams({ set: { product: 'add-new' } })}
            />

            <Button
              content="Get Started"
              variant="primary"
              leftIcon={
                <Icon
                  icon="solar:round-arrow-right-linear"
                  className="size-5"
                />
              }
              className="h-10! px-4"
              size="sm"
              onClick={() => updateParams({ set: { product: 'preview' } })}
            />
          </div>
        </div>
      </div>
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
        className="h-10! w-fit! px-4"
        onClick={onClick}
      />
    </div>
  );
};

export const AllowCameraScreen = ({
  onClick,
  showRetry = false,
}: {
  onClick: () => void;
  showRetry?: boolean;
}) => {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-6">
      <p className="text-sm/[17px] font-medium">
        Allow commverse to access your camera
      </p>
      <div className="bg-neutral-gray-400 relative h-2 w-60 overflow-hidden rounded-full">
        <div className="bg-neutral-gray-900 absolute h-full w-15 animate-[slideLoader_1.5s_ease-in-out_infinite] rounded-full" />
      </div>
      {showRetry && (
        <Button
          content="Try Again"
          variant="outline"
          size="sm"
          className="z-2 h-10! w-fit! px-4"
          onClick={onClick}
        />
      )}
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

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onClick(file);

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
        className="h-10! w-auto! px-4 text-sm!"
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

export const TryOnControls = ({
  compareProps,
  captureProps,
  resetProps,
  className = '',
}: {
  captureProps?: ButtonProps;
  compareProps?: ButtonProps & { isCompareActive?: boolean };
  resetProps?: ButtonProps;
  className?: string;
}) => {
  const { isCompareActive, ...restCompareProps } = compareProps ?? {};

  return (
    <div
      className={`absolute inset-x-5 top-4 z-2 flex flex-col gap-2 ${className}`}
    >
      <div className="ml-auto flex items-center gap-2">
        {captureProps && (
          <Button
            variant="ghost"
            size="sm"
            className="size-8!"
            title="Download Snapshot"
            aria-label="Download Snapshot"
            leftIcon={
              <Icon
                icon="solar:gallery-download-linear"
                className="text-neutral-gray-900 size-5"
              />
            }
            {...captureProps}
          />
        )}
        {compareProps && (
          <Button
            variant={isCompareActive ? 'tertiary' : 'ghost'}
            size="sm"
            className="size-8!"
            title={isCompareActive ? 'Hide Compare' : 'Compare Before/After'}
            aria-label={
              isCompareActive ? 'Hide Compare' : 'Compare Before/After'
            }
            leftIcon={
              <Icon
                icon="lucide:square-split-horizontal"
                className={`size-5 [&_path]:stroke-[1.5] ${isCompareActive ? 'text-neutral-gray-100' : 'text-neutral-gray-900'}`}
              />
            }
            {...restCompareProps}
          />
        )}
        {resetProps && (
          <Button
            variant="ghost"
            size="sm"
            className="size-8!"
            title="Reset"
            aria-label="Reset"
            leftIcon={
              <Icon
                icon="solar:refresh-linear"
                className="text-neutral-gray-900 size-5"
              />
            }
            {...resetProps}
          />
        )}
      </div>
      {isCompareActive && (
        <div className="font-metropolis flex justify-between gap-4 text-[10px]/3.25 font-semibold [&>span]:h-4.5 [&>span]:rounded-sm [&>span]:px-1 [&>span]:py-0.5">
          <span className="bg-neutral-gray-300 text-neutral-gray-900">
            Before
          </span>
          <span className="bg-brand text-neutral-gray-100">After</span>
        </div>
      )}
    </div>
  );
};
