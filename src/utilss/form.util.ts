import type { TFieldErrors } from '@/typess/api.type';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export const setErrorToForm = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors?: TFieldErrors,
) => {
  if (!errors || Object.keys(errors).length === 0) return;

  // field errors
  Object.entries(errors).forEach(([field, messages]) => {
    setError(field as Path<T>, {
      type: 'server',
      message: messages.join('\n'),
    });
  });
};
