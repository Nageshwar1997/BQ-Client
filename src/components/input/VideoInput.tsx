import { ChangeEvent, ReactNode, useState } from "react";
import { CloseIcon, InfoIcon } from "../../icons";
import MediaModal from "../../pages/product/productDetails/children/MediaModal";
import VideoPlayer from "../videoPlayers/VideoPlayer";
import { InputProps } from "../../types";
import { ALLOWED_IMAGE_TYPES } from "../../constants";

const VideoInput = ({
  name = "",
  label = "",
  leftIcon,
  rightIcon,
  leftIconClick,
  rightIconClick,
  className = "",
  readOnly = false,
  placeholder = "",
  containerClassName = "",
  leftText = "",
  errors = [],
  previews = [],
  register,
  isSingleFile = true,
  onChange,
  acceptableFiles = ALLOWED_IMAGE_TYPES,
  handleRemoveImage,
}: Omit<InputProps, "onChange"> & {
  name: string;
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconClick?: () => void;
  rightIconClick?: () => void;
  className?: string;
  readOnly?: boolean;
  placeholder?: string;
  containerClassName?: string;
  leftText?: string;
  errors?: string[];
  handleRemoveImage?: (index: number) => void;
  previews?: { url: string; type: "image" | "video" }[];
  isSingleFile?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  acceptableFiles?: string[];
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    register?.onChange?.(event);
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        {label && (
          <label
            htmlFor={name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 bg-smoke-eerie rounded cursor-pointer`}
          >
            {label}
          </label>
        )}
        <label
          htmlFor={name}
          className={`w-full h-full flex items-center gap-1 border border-primary-10 bg-smoke-eerie rounded-lg overflow-hidden group ${className}`}
        >
          {/* Left Icon */}
          {leftIcon && !rightIcon ? (
            <span
              onClick={leftIconClick && leftIconClick}
              className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden"
            >
              {leftIcon}
            </span>
          ) : !leftIcon && leftText ? (
            <div className="h-full overflow-hidden">
              <p className="h-full flex items-center justify-center text-sm text-primary-50 border-r border-r-primary-10 p-3 capitalize">
                {leftText}
              </p>
            </div>
          ) : null}
          <div
            className={`flex-1 w-full h-full outline-none border-none focus:outline-none focus:border-none bg-transparent font-normal text-sm p-3 flex items-center justify-start cursor-pointer ${
              leftIcon && !rightIcon
                ? "pl-0"
                : !leftIcon && rightIcon
                ? "pr-0"
                : leftText
                ? "pl-2"
                : ""
            }`}
          >
            <p className="text-primary-50 text-sm line-clamp-1">
              {placeholder}
            </p>
            {/* Input */}
            <input
              aria-autocomplete="none"
              multiple={isSingleFile}
              accept={acceptableFiles?.join(", ")}
              id={name}
              type="file"
              name={name}
              {...register}
              readOnly={readOnly}
              disabled={readOnly}
              onChange={handleChange}
              className="sr-only"
            />
          </div>
          {/* Right Icon */}
          {!leftIcon && rightIcon && (
            <span
              onClick={rightIconClick}
              className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden"
            >
              {rightIcon}
            </span>
          )}
        </label>
      </div>
      {!readOnly && errors && errors.length > 0 && (
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
        <div className="border border-primary-10 bg-smoke-eerie rounded-lg p-2 !mt-4 grid gap-4 grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(5rem,1fr))]">
          {previews.map((item, index) => (
            <div
              key={index}
              className="w-full aspect-square relative group rounded overflow-hidden border border-primary-30 shadow-sm"
            >
              <div
                className="w-full h-full"
                onClick={() => {
                  setCurrentIndex(index);
                  setShowImageModal(true);
                }}
              >
                {item.type === "video" ? (
                  <VideoPlayer
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    videoProps={{ src: item.url, autoPlay: false }}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  />
                )}
              </div>

              {handleRemoveImage && (
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="absolute top-0.5 right-0.5 bg-tertiary rounded-full p-0.5 flex items-center justify-center text-xs"
                >
                  <CloseIcon className="w-3 h-3 [&>path]:stroke-primary-inverted" />
                </button>
              )}
            </div>
          ))}
        </div>
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

export default VideoInput;
