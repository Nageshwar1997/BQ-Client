import { ImageUpIcon, UserCircleIcon } from '@/Icons';
import type { IBaseInput, IFileInput } from '@/Types';
import { FileInput, InputError } from './Input';

interface ProfilePicInputProps extends Pick<IBaseInput, 'register' | 'error' | 'className'> {
  fileInputProps: Omit<IFileInput['fileInputProps'], 'value'>;
  src?: string;
}

export const ProfilePicInput = ({
  src,
  error,
  register,
  className = '',
  fileInputProps,
}: ProfilePicInputProps) => {
  return (
    <label
      htmlFor={fileInputProps.name || 'profilePic'}
      className={`group flex w-full max-w-40 cursor-pointer flex-col ${className}`}
    >
      <div className="border-tertiary/50 relative aspect-square h-full w-full overflow-hidden rounded-lg border">
        {src ? (
          <img src={src} alt="Profile Pic" className="h-full w-full object-cover" />
        ) : (
          <UserCircleIcon className="stroke-tertiary h-full w-full p-5" />
        )}

        <div className="bg-tertiary absolute right-0 bottom-0 rounded-tl-lg p-1">
          <ImageUpIcon className="stroke-tertiary-invert group-hover:stroke-primary-invert" />
        </div>
      </div>
      <InputError error={error} className="mt-2 [&>span]:line-clamp-none" />
      <FileInput register={register} fileInputProps={fileInputProps} containerClassName="hidden" />
    </label>
  );
};
