import { ChangeEvent, useState } from "react";
import { InfoIcon } from "../../icons";
import MediaModal from "../../pages/product/productDetails/children/MediaModal";
import MediaCarousel from "../carousels/MediaCarousel";
import { IFileInput } from "../../types";
import { ALLOWED_IMAGE_TYPES } from "../../constants";
const FileInput = ({
  label = "",
  icons,
  className = "",
  containerClassName = "",
  errors = [],
  previews = [],
  register,
  handleRemoveImage,
  fileInputProps = {
    type: "file" as const,
    accept: ALLOWED_IMAGE_TYPES.join(", "),
    multiple: false,
  },
}: IFileInput) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    fileInputProps.onChange?.(event);
    register?.onChange?.(event);
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        {label && (
          <label
            htmlFor={fileInputProps.name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 bg-smoke-eerie rounded cursor-pointer`}
          >
            {label}
          </label>
        )}
        <label
          htmlFor={fileInputProps.name}
          className={`w-full h-full flex items-center gap-1 border border-primary-10 bg-smoke-eerie rounded-lg overflow-hidden group ${className}`}
        >
          {/* Left Icon */}
          {icons?.left?.icon && !icons.right?.icon ? (
            <span
              onClick={icons.left.onClick}
              className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden"
            >
              {icons.left.icon}
            </span>
          ) : !icons?.left?.icon && icons?.left?.text ? (
            <div className="h-full overflow-hidden">
              <p className="h-full flex items-center justify-center text-sm text-primary-50 border-r border-r-primary-10 p-3 capitalize">
                {icons?.left?.text}
              </p>
            </div>
          ) : null}
          <div
            className={`flex-1 w-full h-full outline-none border-none focus:outline-none focus:border-none bg-transparent font-normal text-sm p-3 flex items-center justify-start cursor-pointer ${
              icons?.left?.icon && !icons?.right?.icon
                ? "pl-0"
                : !icons?.left?.icon && icons?.right?.icon
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
              id={fileInputProps.name}
              disabled={fileInputProps?.readOnly}
              onChange={handleChange}
              className="sr-only"
            />
          </div>
          {/* Right Icon */}
          {!icons?.left && icons?.right && (
            <span
              onClick={icons.right.onClick}
              className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden"
            >
              {icons.right.icon}
            </span>
          )}
        </label>
      </div>
      {!fileInputProps.readOnly && errors && errors.length > 0 && (
        <div className="flex flex-col gap-1">
          {errors?.map((error, index) => (
            <p
              key={index}
              className={`w-full text-start flex gap-1 items-center text-[11px] leading-tight mt-2 text-red-500`}
            >
              <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
              <span className="leading-none">{error}</span>
            </p>
          ))}
        </div>
      )}
      {previews.length > 0 && (
        <MediaCarousel
          className="border border-primary-10 bg-smoke-eerie rounded-lg p-2 [&>div]:justify-start [&>div>div]:w-14 [&>div>div]:h-14 [&>div>div]:md:w-16 [&>div>div]:md:h-16 [&>div>div]:lg:w-20 [&>div>div]:lg:h-20"
          gradientClassName="!w-9 lg:!w-20"
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
