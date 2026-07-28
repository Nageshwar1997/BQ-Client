import type { TUpdateUserZodSchema } from '@beautinique/frontend-types';
import { updateUserZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import { UPDATE_USER_INPUT_MAP_DATA } from '@/constants/input.constants';
import { useUploadSingleMedia } from '@/services/media-service/media.service.query';
import { useUpdateUser } from '@/services/user-service/user.service.query';
import useUserStore from '@/stores/user.store';
import { getUpdatedFields, toaster } from '@/utils/common.util';

import AvatarUpload from './children/AvatarUpload';

const Profile = () => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const uploadMedia = useUploadSingleMedia();
  const updateUser = useUpdateUser();
  const [editableFields, setEditableFields] = useState<Set<keyof TUpdateUserZodSchema>>(new Set());

  const { control, register, handleSubmit, formState, reset } = useForm<TUpdateUserZodSchema>({
    resolver: zodResolver(updateUserZodSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      avatar: user?.avatar,
    },
  });

  const avatar = useWatch({ control, name: 'avatar', defaultValue: user?.avatar });

  if (!user) return null;

  const isSubmitting = uploadMedia.isPending || updateUser.isPending;

  const onSubmit = async (values: TUpdateUserZodSchema) => {
    const body = values;
    if (avatar instanceof File) {
      const formData = new FormData();
      formData.append('file', avatar);
      formData.append('folder', 'Avatars');

      const { data } = await uploadMedia.mutateAsync({
        data: formData,
        toasterInfo: { title: 'Please wait...', description: 'Uploading your photo...' },
      });

      body.avatar = data ?? avatar;
    }

    const updatedFields = getUpdatedFields(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
      },
      body,
    );

    if (!updatedFields) {
      toaster.error({ title: 'No changes', description: 'You have not made any changes.' });
      return;
    }

    await updateUser.mutateAsync(updatedFields, {
      onSuccess: ({ data: updatedUser }) => {
        setUser(updatedUser ?? null);
        setEditableFields(new Set());
        reset();
      },
    });
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      className="border-primary/10 bg-secondary-invert flex flex-col gap-6 rounded-2xl border p-4 sm:p-6"
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <Controller
          control={control}
          name="avatar"
          render={({ field: { onChange } }) => (
            <AvatarUpload
              error={formState.errors.avatar?.message}
              fileInputProps={{
                value: avatar,
                onChange: onChange,
                disabled: isSubmitting,
              }}
            />
          )}
        />
        <div>
          <GradientText
            type="accent"
            text={`${user.firstName} ${user.lastName}`}
            className="text-lg font-semibold sm:text-xl"
          />
          <p className="text-secondary text-xs sm:text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        {UPDATE_USER_INPUT_MAP_DATA.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            register={register(field.name)}
            error={formState.errors[field.name]?.message}
            needRef={editableFields.has(field.name)}
            inputProps={{
              type: field.type,
              autoComplete: field.autoComplete,
              name: field.name,
              readOnly: !editableFields.has(field.name),
              disabled: isSubmitting,
            }}
            icons={{
              ...(field.name === 'phoneNumber' && {
                left: (
                  <span className="text-primary/50 border-r-primary/30 items-center border-r py-2 pr-3 text-[13px] leading-0 capitalize">
                    +91
                  </span>
                ),
              }),
              ...(!editableFields.has(field.name) && {
                right: {
                  icon: 'solar:pen-2-linear',
                  onClick: () => {
                    setEditableFields((prev) => new Set(prev).add(field.name));
                  },
                  className: 'text-primary/50 hover:text-primary size-4.5 shrink-0 cursor-pointer',
                },
              }),
            }}
          />
        ))}
      </div>

      <Button
        pattern="primary"
        content="Save Changes"
        className="sm:w-fit sm:self-end"
        buttonProps={{ type: 'submit', disabled: isSubmitting }}
      />
    </form>
  );
};

export default Profile;
