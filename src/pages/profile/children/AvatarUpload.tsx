import { Icon } from '@iconify/react';
import { type ChangeEvent, useRef } from 'react';

import { useUploadSingleMedia } from '@/services/media-service/media.service.query';
import { useUpdateUser } from '@/services/user-service/user.service.query';
import type { IUser } from '@/types/api.type';
import { toaster } from '@/utils/common.util';

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const AvatarUpload = ({ user }: { user: IUser }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadMedia = useUploadSingleMedia();
  const updateUser = useUpdateUser();

  const isPending = uploadMedia.isPending || updateUser.isPending;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toaster.error({ title: 'Invalid file', description: 'Please select an image file.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'avatars');

    const { data: avatarUrl } = await uploadMedia.mutateAsync({
      data: formData,
      toasterInfo: { title: 'Please wait...', description: 'Uploading your photo...' },
    });

    if (!avatarUrl) return;

    await updateUser.mutateAsync({ avatar: avatarUrl });
  };

  return (
    <div className="relative size-20 shrink-0 sm:size-24">
      {user.avatar ? (
        <img
          src={user.avatar}
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
            disabled={isPending}
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="bg-accent-duo border-secondary-invert absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 shadow-md disabled:cursor-not-allowed disabled:opacity-70 sm:size-8"
          >
            <Icon
              icon={isPending ? 'svg-spinners:ring-resize' : 'solar:camera-add-linear'}
              className="size-4 text-white sm:size-4.5"
            />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              void handleFileChange(event);
            }}
          />
        </>
      )}
    </div>
  );
};

export default AvatarUpload;
