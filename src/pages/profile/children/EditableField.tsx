import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';

interface IEditableFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  isEditing: boolean;
  isDisabled?: boolean;
  inputProps?: Pick<InputHTMLAttributes<HTMLInputElement>, 'type' | 'autoComplete'>;
  onEdit: () => void;
}

const EditableField = ({
  label,
  register,
  error,
  isEditing,
  isDisabled,
  inputProps,
  onEdit,
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
        disabled: isDisabled,
      }}
      icons={
        isEditing
          ? undefined
          : {
              right: {
                icon: 'solar:pen-2-linear',
                onClick: onEdit,
                className: 'text-primary/50 hover:text-primary size-4.5 shrink-0 cursor-pointer',
              },
            }
      }
    />
  );
};

export default EditableField;
