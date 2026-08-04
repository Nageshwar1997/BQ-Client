import type { TUpdateUserZodSchema } from '@beautinique/frontend-types';
import { updateUserZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';

import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import { PROVIDER_ICON_MAP } from '@/constants/common.constants';
import { UPDATE_USER_INPUT_MAP_DATA } from '@/constants/input.constants';
import { ROUTES } from '@/constants/routes.constants';
import { useUploadSingleMedia } from '@/services/media-service/media.service.query';
import { useUpdateUser } from '@/services/user-service/user.service.query';
import useUserStore from '@/stores/user.store';
import { formatDate, getUpdatedFields, toaster } from '@/utils/common.util';

import AvatarUpload from './children/AvatarUpload';

const getGreeting = (hour: number) => {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Profile = () => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const uploadMedia = useUploadSingleMedia();
  const updateUser = useUpdateUser();
  const [editableFields, setEditableFields] = useState<Set<keyof TUpdateUserZodSchema>>(new Set());

  const defaultValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    ...(user?.avatar && { avatar: user.avatar }),
  };

  const { control, register, handleSubmit, formState, reset } = useForm<TUpdateUserZodSchema>({
    resolver: zodResolver(updateUserZodSchema),
    defaultValues,
  });

  const avatar = useWatch({ control, name: 'avatar' });

  if (!user) return null;

  const isSubmitting = uploadMedia.isPending || updateUser.isPending;

  const handleReset = (values?: TUpdateUserZodSchema) => {
    reset(values ?? defaultValues);
    setEditableFields(new Set());
  };

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

    const compare = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar?.charAt(0) ? user.avatar : undefined,
    };

    const updatedFields = getUpdatedFields(compare, body);

    if (!updatedFields) {
      toaster.error({ title: 'No changes', description: 'You have not made any changes.' });
      return;
    }

    await updateUser.mutateAsync(updatedFields, {
      onSuccess: ({ data: updatedUser }) => {
        setUser(updatedUser ?? null);

        handleReset(body);
      },
    });
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      className="flex flex-col gap-6 p-4 sm:p-6"
    >
      <div className="flex flex-col gap-1.5">
        <GradientText
          type="accent"
          text={`${getGreeting(new Date().getHours())}, ${user.firstName}!`}
          className="text-2xl font-semibold sm:text-3xl"
        />
        <p className="text-secondary text-xs sm:text-sm">
          This is your personal space. Keep your details accurate so orders, delivery updates, and
          support always reach the right place. Click the{' '}
          <Icon
            icon="solar:pen-2-linear"
            className="text-primary/70 inline size-3.5 align-text-bottom"
          />{' '}
          icon next to any field to edit it, then hit{' '}
          <GradientText type="accent" text="Save Changes" className="font-medium" /> when
          you&apos;re done.
        </p>
      </div>
      <Divider />
      <div className="flex items-center gap-6">
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
        <Button
          pattern="secondary"
          content="Reset"
          buttonProps={{
            disabled: isSubmitting,
            onClick: () => {
              handleReset();
            },
          }}
        />
        <Button
          pattern="primary"
          content="Save Changes"
          buttonProps={{ type: 'submit', disabled: isSubmitting }}
        />
      </div>

      <Divider />

      <div className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Account Details"
          className="text-base font-semibold sm:text-lg"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-primary/10 bg-secondary-invert flex items-center gap-3 rounded-xl border p-3">
            <Icon icon="solar:calendar-linear" className="text-primary/60 size-5 shrink-0" />
            <div>
              <p className="text-primary/50 text-[11px]">Member Since</p>
              <p className="text-secondary text-sm font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>

          <div className="border-primary/10 bg-secondary-invert flex items-center gap-3 rounded-xl border p-3">
            <Icon icon="solar:calendar-linear" className="text-primary/60 size-5 shrink-0" />
            <div>
              <p className="text-primary/50 text-[11px]">Last Updated</p>
              <p className="text-secondary text-sm font-medium">{formatDate(user.updatedAt)}</p>
            </div>
          </div>

          <div className="border-primary/10 bg-secondary-invert flex items-center gap-3 rounded-xl border p-3">
            <Icon icon="solar:shield-user-linear" className="text-primary/60 size-5 shrink-0" />
            <div>
              <p className="text-primary/50 text-[11px]">Account Type</p>
              <p className="text-secondary text-sm font-medium capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="border-primary/10 bg-secondary-invert flex items-center gap-3 rounded-xl border p-3">
            <div className="flex shrink-0 -space-x-1">
              {user.providers.map((provider) => (
                <span
                  key={provider}
                  className="bg-secondary-invert border-primary/50 flex size-6 items-center justify-center rounded-full border"
                >
                  <Icon icon={PROVIDER_ICON_MAP[provider]} className="size-3.5" />
                </span>
              ))}
            </div>
            <div>
              <p className="text-primary/50 text-[11px]">Signed In Via</p>
              <p className="text-secondary text-sm font-medium capitalize">
                {user.providers.map((provider) => provider.toLowerCase()).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-primary text-sm font-semibold sm:text-base">Password &amp; Security</p>
          <p className="text-secondary text-xs sm:text-sm">
            Update your password regularly to keep your account secure.
          </p>
        </div>
        <Link to={ROUTES.PROFILE.UPDATE_PASSWORD}>
          <Button pattern="secondary" content="Update Password" />
        </Link>
      </div>
    </form>
  );
};

export default Profile;
