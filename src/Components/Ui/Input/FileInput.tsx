import type { IFileInput } from '@/Types';
import { useState, type ChangeEvent, type ReactNode } from 'react';
import { InputError, InputIcon, InputLabel } from './Children';
import { ALLOWED_IMAGE_FORMATS } from '@/Constants';
import { MediaCarousel, MediaModal } from '@/Components/Layout';

const InputWrapper = ({
  children,
  icons,
}: {
  children: ReactNode;
  icons?: IFileInput['icons'];
}) => (
  <>
    {/* Left Icon */}
    <InputIcon icon={icons?.left?.icon} text={icons?.left?.text} onClick={icons?.left?.onClick} />
    {/* Main Section */}
    {children}
    {/* Right Icon */}
    <InputIcon icon={icons?.right?.icon} onClick={icons?.right?.onClick} />
  </>
);

const InputWithoutIconClick = ({
  fileInputProps,
  className,
  children,
  icons,
}: Pick<IFileInput, 'fileInputProps' | 'className' | 'icons'> & {
  children: ReactNode;
}) => (
  <label
    htmlFor={fileInputProps.name}
    className={`border-primary/10 bg-smoke-eerie group flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border ${className}`}
  >
    <InputWrapper icons={icons}>{children}</InputWrapper>
  </label>
);

const InputWithIconClick = ({
  fileInputProps,
  className,
  children,
  icons,
}: Pick<IFileInput, 'fileInputProps' | 'className' | 'icons'> & {
  children: ReactNode;
}) => (
  <div
    className={`border-primary/10 bg-smoke-eerie group flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border ${className}`}
  >
    <InputWrapper icons={icons}>
      <label htmlFor={fileInputProps.name} className="h-full flex-1">
        {children}
      </label>
    </InputWrapper>
  </div>
);

const CenterContent = ({
  fileInputProps,
  icons,
  register,
}: Pick<IFileInput, 'fileInputProps' | 'icons' | 'register'>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (fileInputProps?.disabled) return;
    fileInputProps.onChange?.(event);
    register?.onChange?.(event);
  };
  return (
    <div
      className={`flex h-full w-full flex-1 cursor-pointer items-center justify-start border-none bg-transparent p-3 text-sm font-normal outline-hidden focus:border-none focus:outline-hidden ${
        icons?.left?.icon ? 'pl-0' : icons?.right?.icon ? 'pr-0' : icons?.left?.text ? 'pl-2' : ''
      }`}
    >
      <p className="text-primary-50 line-clamp-1 text-sm">{fileInputProps?.placeholder}</p>
      {/* Input */}
      <input
        aria-autocomplete="none"
        {...register}
        {...fileInputProps}
        id={fileInputProps.id || fileInputProps.name}
        accept={fileInputProps?.accept ?? ALLOWED_IMAGE_FORMATS.join(', ')}
        type="file"
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
};

const MainSection = ({
  icons,
  ...props
}: Pick<IFileInput, 'fileInputProps' | 'className' | 'icons' | 'register'>) => {
  return icons?.left?.onClick || icons?.right?.onClick ? (
    <InputWithIconClick {...props} icons={icons}>
      <CenterContent {...props} icons={icons} />
    </InputWithIconClick>
  ) : (
    <InputWithoutIconClick {...props} icons={icons}>
      <CenterContent {...props} icons={icons} />
    </InputWithoutIconClick>
  );
};

export const FileInput = ({
  label = '',
  containerClassName = '',
  mediaModalClassName = '',
  mediaCarouselClassName = '',
  errors = [],
  previews = [],
  handleRemoveImage,
  fileInputProps = {},
  ...props
}: IFileInput) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  return (
    <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        <InputLabel children={label} htmlFor={fileInputProps.name} />
        <MainSection fileInputProps={fileInputProps} {...props} />
      </div>
      {errors?.length > 0 && (
        <div className="flex flex-col gap-1">
          {errors?.map((error, index) => (
            <InputError key={index} error={error} />
          ))}
        </div>
      )}
      {previews?.length > 0 && (
        <MediaCarousel
          className={`border-primary/10 bg-smoke-eerie rounded-lg border p-2 ${mediaCarouselClassName}`}
          gradientClassNames={{ left: 'w-10! lg:w-20!', right: 'w-10! lg:w-20!' }}
          media={previews}
          onClick={(i) => {
            setCurrentIndex(i);
            setShowImageModal(true);
          }}
          handleRemove={handleRemoveImage}
        />
      )}
      {showImageModal && currentIndex !== null && (
        <MediaModal
          className={mediaModalClassName}
          currentIndex={currentIndex}
          onClose={setShowImageModal}
          opened={showImageModal}
          media={previews}
          setCurrentIndex={setCurrentIndex}
          handleRemove={handleRemoveImage}
        />
      )}
    </div>
  );
};
