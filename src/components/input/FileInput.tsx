import { ChangeEvent, ReactNode, useState } from "react";
import { InfoIcon } from "../../icons";
import MediaModal from "../../pages/product/productDetails/children/MediaModal";
import MediaCarousel from "../carousels/MediaCarousel";
import { IFileInput } from "../../types";
import { ALLOWED_IMAGE_TYPES } from "../../constants";

const InputWrapper = ({
  children,
  icons,
}: {
  children: ReactNode;
  icons?: IFileInput["icons"];
}) => (
  <>
    {/* Left Icon */}
    {icons?.left?.icon ? (
      <span
        onClick={icons.left.onClick}
        className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden group"
      >
        {icons.left.icon}
      </span>
    ) : icons?.left?.text ? (
      <div className="h-full overflow-hidden">
        <p className="h-full flex items-center justify-center text-sm text-primary-50 border-r border-r-primary-10 p-3 capitalize">
          {icons?.left?.text}
        </p>
      </div>
    ) : null}
    {/* Main Section */}
    {children}
    {/* Right Icon */}
    {icons?.right ? (
      <span
        onClick={icons.right.onClick}
        className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden group"
      >
        {icons.right.icon}
      </span>
    ) : null}
  </>
);

const InputWithoutIconClick = ({
  fileInputProps,
  className,
  children,
  icons,
}: Pick<IFileInput, "fileInputProps" | "className" | "icons"> & {
  children: ReactNode;
}) => (
  <label
    htmlFor={fileInputProps.name}
    className={`w-full h-full flex items-center gap-1 border border-primary-10 bg-smoke-eerie rounded-lg overflow-hidden group ${className}`}
  >
    <InputWrapper icons={icons}>{children}</InputWrapper>
  </label>
);

const InputWithIconClick = ({
  fileInputProps,
  className,
  children,
  icons,
}: Pick<IFileInput, "fileInputProps" | "className" | "icons"> & {
  children: ReactNode;
}) => (
  <div
    className={`w-full h-full flex items-center gap-1 border border-primary-10 bg-smoke-eerie rounded-lg overflow-hidden group ${className}`}
  >
    <InputWrapper icons={icons}>
      <label htmlFor={fileInputProps.name} className="flex-1 h-full">
        {children}
      </label>
    </InputWrapper>
  </div>
);

const CenterContent = ({
  fileInputProps,
  icons,
  register,
}: Pick<IFileInput, "fileInputProps" | "icons" | "register">) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (fileInputProps?.disabled) return;
    fileInputProps.onChange?.(event);
    register?.onChange?.(event);
  };
  return (
    <div
      className={`flex-1 w-full h-full outline-hidden border-none focus:outline-hidden focus:border-none bg-transparent font-normal text-sm p-3 flex items-center justify-start cursor-pointer ${
        icons?.left?.icon
          ? "pl-0"
          : icons?.right?.icon
          ? "pr-0"
          : icons?.left?.text
          ? "pl-2"
          : ""
      }`}
    >
      <p className="text-primary-50 text-sm line-clamp-1">
        {fileInputProps?.placeholder}
      </p>
      {/* Input */}
      <input
        aria-autocomplete="none"
        {...register}
        {...fileInputProps}
        id={fileInputProps.id || fileInputProps.name}
        accept={fileInputProps?.accept ?? ALLOWED_IMAGE_TYPES.join(", ")}
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
}: Pick<IFileInput, "fileInputProps" | "className" | "icons" | "register">) => {
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

const FileInput = ({
  label = "",
  containerClassName = "",
  mediaModalClassName = "",
  mediaCarouselClassName = "",
  errors = [],
  previews = [],
  handleRemoveImage,
  fileInputProps = {},
  ...props
}: IFileInput) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        {label && (
          <label
            htmlFor={fileInputProps.name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 bg-smoke-eerie rounded-sm cursor-pointer`}
          >
            {label}
          </label>
        )}
        <MainSection fileInputProps={fileInputProps} {...props} />
      </div>
      {errors?.length > 0 && (
        <div className="flex flex-col gap-1">
          {errors?.map((error, index) => (
            <p
              key={index}
              className={`w-full text-start flex gap-1 items-center text-[11px] leading-tight text-red-500`}
            >
              <InfoIcon className="min-w-3 min-h-3 w-3 h-3 md:min-w-4 md:min-h-4 md:w-4 md:h-4 fill-red-500" />
              <span className="leading-none line-clamp-2">{error}</span>
            </p>
          ))}
        </div>
      )}
      {previews?.length > 0 && (
        <MediaCarousel
          className={`border border-primary-10 bg-smoke-eerie rounded-lg p-2 [&>div]:justify-start [&>div>div]:w-14 [&>div>div]:h-14 md:[&>div>div]:w-16 md:[&>div>div]:h-16 lg:[&>div>div]:w-20 lg:[&>div>div]:h-20 ${mediaCarouselClassName}`}
          gradientClassName="w-9! lg:w-20!"
          data={previews}
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
          reviewMedia={previews}
          setCurrentIndex={setCurrentIndex}
          handleRemove={handleRemoveImage}
        />
      )}
    </div>
  );
};

export default FileInput;
