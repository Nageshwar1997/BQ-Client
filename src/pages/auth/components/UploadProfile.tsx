import { useLocation } from "react-router-dom";
import { CameraIcon, InfoIcon } from "../../../icons";
import { ProfilePicInputProps } from "../../../types";
import { toastErrorMessage } from "../../../utils/toasts";
import { ChangeEvent, useCallback, useState } from "react";

const UploadProfile = ({
  name = "image",
  previewImage = "",
  onChange,
  className,
  errorText,
}: ProfilePicInputProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(previewImage);

  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          toastErrorMessage(
            "Invalid file type. Please upload a JPEG, PNG, JPG or WebP file."
          );
          return;
        }

        const blobUrl = URL.createObjectURL(file);
        setPreviewUrl(blobUrl);

        onChange(file);

        return () => URL.revokeObjectURL(blobUrl);
      }
      setPreviewUrl("");
      onChange(null);
    },
    [onChange]
  );
  const { pathname } = useLocation();
  return (
    <div className="w-full space-y-1.5">
      <div
        className={`w-20 h-20 max-w-20 max-h-20 mx-auto rounded-full shadow-primary-btn-hover overflow-hidden group ${className}`}
      >
        <label htmlFor={name} className="relative cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-inverted via-transparent to-gray-400 rounded-full blur-sm animate-pulse cursor-pointer" />
          <img
            src={
              previewUrl ||
              "https://ctruhcdn.azureedge.net/main-webiste/public/images/products/individuals/ctruh-platfrom/categories/character/image10.webp"
            }
            alt="Profile Picture"
            className="object-cover bg-accent-duo rounded-full w-full h-full shadow-inner"
            loading="lazy"
          />
          {pathname === "/register" && (
            <div className="absolute bottom-0 left-0 right-0 bg-smoke-eerie flex items-center justify-center">
              <CameraIcon className="fill-primary opacity-70 group-hover:opacity-100" />
              <input
                id={name}
                name={name}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          )}
        </label>
      </div>
      {errorText && (
        <span className="w-full flex gap-1 justify-center items-center text-[11px] leading-tight mt-2 text-red-500 border">
          <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
          {errorText}
        </span>
      )}
    </div>
  );
};

export default UploadProfile;
