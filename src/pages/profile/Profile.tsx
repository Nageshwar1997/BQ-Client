import type { TInfer } from '@beautinique/frontend-zod';
import { imageUnionZodSchema, updateUserSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import { UPDATE_USER_INPUT_MAP_DATA } from '@/constants/input.constants';
import { useUploadSingleMedia } from '@/services/media-service/media.service.query';
import { useUpdateUser } from '@/services/user-service/user.service.query';
import useUserStore from '@/stores/user.store';

import AvatarUpload from './children/AvatarUpload';

const profileFormSchema = updateUserSchema.extend({
  avatar: imageUnionZodSchema,
});

export type TProfileFormSchema = TInfer<typeof profileFormSchema>;

const Profile = () => {
  const user = useUserStore((s) => s.user);
  const uploadMedia = useUploadSingleMedia();
  const updateUser = useUpdateUser();
  const [editableFields, setEditableFields] = useState<Set<keyof TProfileFormSchema>>(new Set());
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { register, handleSubmit, formState, reset } = useForm<TProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      avatar: user?.avatar,
    },
  });

  if (!user) return null;

  const isSubmitting = uploadMedia.isPending || updateUser.isPending;

  const onSubmit = async (values: TProfileFormSchema) => {
    let avatar = values.avatar;

    if (avatarFile) {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('folder', 'avatars');

      const { data } = await uploadMedia.mutateAsync({
        data: formData,
        toasterInfo: { title: 'Please wait...', description: 'Uploading your photo...' },
      });

      avatar = data ?? avatar;
    }

    await updateUser.mutateAsync({ ...values, avatar });

    setAvatarFile(null);
    setEditableFields(new Set());
    reset({ ...values, avatar });
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      className="border-primary/10 bg-secondary-invert flex flex-col gap-6 rounded-2xl border p-4 sm:p-6"
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <AvatarUpload user={user} avatarFile={avatarFile} onFileSelect={setAvatarFile} />
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
            icons={
              editableFields.has(field.name)
                ? undefined
                : {
                    right: {
                      icon: 'solar:pen-2-linear',
                      onClick: () => {
                        setEditableFields((prev) => new Set(prev).add(field.name));
                      },
                      className:
                        'text-primary/50 hover:text-primary size-4.5 shrink-0 cursor-pointer',
                    },
                  }
            }
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
