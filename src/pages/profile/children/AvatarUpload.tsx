import { IMAGE_MIMES } from '@beautinique/frontend-constants';
import { Icon } from '@iconify/react';
import { type ChangeEvent, type InputHTMLAttributes, useEffect, useState } from 'react';

import { InputError } from '@/components/ui/inputs/children';
import useUserStore from '@/stores/user.store';

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

interface IAvatarUploadProps {
  error?: string;
  fileInputProps: Pick<InputHTMLAttributes<HTMLInputElement>, 'disabled'> & {
    value?: File | string;
    onChange?: (value?: File | string) => void;
  };
}

const AvatarUpload = ({ error, fileInputProps }: IAvatarUploadProps) => {
  const user = useUserStore((s) => s.user);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const value = fileInputProps.value;

    if (!value) {
      /**
       * previewUrl is derived from URL.createObjectURL(), an external-system side effect
       * unsafe to run during render, so this branch can't be computed with a plain useMemo.
       */
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }

    if (typeof value === 'string') {
      setPreviewUrl(value);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [fileInputProps.value]);

  if (!user) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (fileInputProps.disabled) return;

    fileInputProps.onChange?.(event.target.files?.[0]);
    event.target.value = '';
  };

  const { value: _value, onChange: _onChange, disabled } = fileInputProps;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-accent-duo border-primary-invert relative size-20 shrink-0 rounded-full border-2 sm:size-24">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-2xl font-semibold text-white sm:text-3xl">
            {getInitials(user.firstName, user.lastName)}
          </div>
        )}
        <label
          htmlFor={!disabled ? 'avatar' : ''}
          className={`bg-accent-duo border-secondary-invert absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 shadow-md disabled:cursor-not-allowed disabled:opacity-70 sm:size-8 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Icon icon="solar:camera-add-linear" className="size-4 text-white sm:size-4.5" />
        </label>
        <input
          disabled={disabled}
          multiple={false}
          aria-autocomplete="none"
          id="avatar"
          accept={IMAGE_MIMES.join(', ')}
          type="file"
          name="avatar"
          className="sr-only"
          onChange={handleChange}
        />
      </div>
      <InputError error={error} />
    </div>
  );
};

export default AvatarUpload;
