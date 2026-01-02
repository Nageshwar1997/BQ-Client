import FileInput from "../../../components/input/FileInput";
import { ImageUpIcon, InfoIcon, UserCircleIcon } from "../../../icons";
import { ProfilePicInputProps } from "../../../types";

const ProfilePicInput = ({
  src,
  error,
  register,
  className = "",
  fileInputProps,
}: ProfilePicInputProps) => {
  return (
    <label
      htmlFor={fileInputProps.name || "profilePic"}
      className={`max-w-40 w-full flex flex-col group cursor-pointer ${className}`}
    >
      <div className="w-full h-full aspect-square relative border border-tertiary-50 overflow-hidden rounded-lg">
        {src ? (
          <img
            src={src}
            alt="Profile Pic"
            className="w-full h-full object-cover"
          />
        ) : (
          <UserCircleIcon className="stroke-tertiary w-full h-full p-5" />
        )}

        <div className="absolute bottom-0 right-0 p-1 bg-tertiary rounded-tl-lg">
          <ImageUpIcon className="stroke-tertiary-inverted group-hover:stroke-primary-inverted" />
        </div>
      </div>

      {error && (
        <p className="mt-2 w-full text-start flex gap-1 items-center text-[11px] leading-tight text-red-500">
          <InfoIcon className="min-w-3 min-h-3 w-3 h-3 md:min-w-4 md:min-h-4 md:w-4 md:h-4 fill-red-500" />
          <span className="leading-none line-clamp-2 text-wrap">{error}</span>
        </p>
      )}
      <FileInput
        register={register}
        fileInputProps={fileInputProps}
        containerClassName="hidden"
      />
    </label>
  );
};

export default ProfilePicInput;
