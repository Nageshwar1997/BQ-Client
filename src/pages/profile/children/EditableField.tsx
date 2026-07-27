import { Icon } from '@iconify/react';
import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';

interface IEditableFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  isEditing: boolean;
  isSaving: boolean;
  inputProps?: Pick<InputHTMLAttributes<HTMLInputElement>, 'type' | 'autoComplete'>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditableField = ({
  label,
  register,
  error,
  isEditing,
  isSaving,
  inputProps,
  onEdit,
  onSave,
  onCancel,
}: IEditableFieldProps) => {
  return (
    <Input
      label={label}
      register={register}
      error={error}
      needRef={isEditing}
      inputProps={{
        ...inputProps,
        name: register.name,
        readOnly: !isEditing,
        disabled: isSaving,
      }}
      icons={{
        right: isEditing ? (
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:check-circle-linear"
              onClick={onSave}
              className="text-primary-green size-5 shrink-0 cursor-pointer"
            />
            <Icon
              icon="solar:close-circle-linear"
              onClick={onCancel}
              className="text-red-c size-5 shrink-0 cursor-pointer"
            />
          </div>
        ) : {
          icon: 'solar:pen-2-linear',
          onClick: onEdit,
          className: 'text-primary/50 hover:text-primary size-4.5 shrink-0 cursor-pointer',
        },
      }}
    />
  );
};

export default EditableField;
