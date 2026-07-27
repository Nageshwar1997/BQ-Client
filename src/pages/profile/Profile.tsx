import type { TUpdateUserZodSchema } from '@beautinique/frontend-types';
import { updateUserSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import GradientText from '@/components/ui/GradientText';
import { useUpdateUser } from '@/services/user-service/user.service.query';
import useUserStore from '@/stores/user.store';

import AvatarUpload from './children/AvatarUpload';
import EditableField from './children/EditableField';

type TProfileField = keyof TUpdateUserZodSchema;

const PROFILE_FIELDS: {
  key: TProfileField;
  label: string;
  type: string;
  autoComplete: string;
}[] = [
  { key: 'firstName', label: 'First Name', type: 'text', autoComplete: 'given-name' },
  { key: 'lastName', label: 'Last Name', type: 'text', autoComplete: 'family-name' },
  { key: 'email', label: 'Email', type: 'text', autoComplete: 'email' },
  { key: 'phoneNumber', label: 'Phone Number', type: 'number', autoComplete: 'tel' },
];

const Profile = () => {
  const user = useUserStore((s) => s.user);
  const updateUser = useUpdateUser();
  const [editingField, setEditingField] = useState<TProfileField | null>(null);

  const { register, formState, trigger, getValues, resetField } = useForm<TUpdateUserZodSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
    },
  });

  if (!user) return null;

  const handleEdit = (field: TProfileField) => {
    if (editingField && editingField !== field) {
      resetField(editingField);
    }
    setEditingField(field);
  };

  const handleSave = async (field: TProfileField) => {
    const isValid = await trigger(field);
    if (!isValid) return;

    await updateUser.mutateAsync({ [field]: getValues(field) });
    setEditingField(null);
  };

  const handleCancel = (field: TProfileField) => {
    resetField(field);
    setEditingField(null);
  };

  return (
    <div className="border-primary/10 bg-secondary-invert flex flex-col gap-6 rounded-2xl border p-4 sm:p-6">
      <div className="flex items-center gap-4 sm:gap-6">
        <AvatarUpload user={user} />
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
        {PROFILE_FIELDS.map((field) => (
          <EditableField
            key={field.key}
            label={field.label}
            register={register(field.key)}
            error={formState.errors[field.key]?.message}
            isEditing={editingField === field.key}
            isSaving={updateUser.isPending && editingField === field.key}
            inputProps={{ type: field.type, autoComplete: field.autoComplete }}
            onEdit={() => {
              handleEdit(field.key);
            }}
            onSave={() => {
              void handleSave(field.key);
            }}
            onCancel={() => {
              handleCancel(field.key);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
