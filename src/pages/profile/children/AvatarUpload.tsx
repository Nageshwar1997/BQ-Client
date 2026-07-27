import { Icon } from '@iconify/react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

import type { IUser } from '@/types/api.type';
import { toaster } from '@/utils/common.util';

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

interface IAvatarUploadProps {
  user: IUser;
  avatarFile: File | null;
  onFileSelect: (file: File) => void;
}

const AvatarUpload = ({ user, avatarFile, onFileSelect }: IAvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!avatarFile) return;

    const url = URL.createObjectURL(avatarFile);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [avatarFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toaster.error({ title: 'Invalid file', description: 'Please select an image file.' });
      return;
    }

    onFileSelect(file);
  };

  const displayUrl = avatarFile ? previewUrl : user.avatar;

  return (
    <div className="relative size-20 shrink-0 sm:size-24">
      {displayUrl ? (
        <img
          src={displayUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="border-primary/10 size-full rounded-full border object-cover"
        />
      ) : (
        <div className="bg-accent-duo border-primary/10 flex size-full items-center justify-center rounded-full border text-2xl font-semibold text-white sm:text-3xl">
          {getInitials(user.firstName, user.lastName)}
        </div>
      )}
      {!user.avatar && (
        <>
          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="bg-accent-duo border-secondary-invert absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 shadow-md sm:size-8"
          >
            <Icon icon="solar:camera-add-linear" className="size-4 text-white sm:size-4.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

export default AvatarUpload;
