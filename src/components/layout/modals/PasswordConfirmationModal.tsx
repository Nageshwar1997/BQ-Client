import { zodResolver } from '@hookform/resolvers/zod';
import { Hook } from '../../../hooks';
import { Store } from '../../../store';
import { Service } from '../../../api-service';
import { useState } from 'react';
import type { TChangePassword, TUpdatePassword } from '../../../types';
import { changePasswordSchema, updatePasswordSchema } from '../../../schemas/user.schema';
import { useForm, type FieldErrors } from 'react-hook-form';
import { EyeIcon, EyeOffIcon } from '../../../icons';
import { ConfirmModal } from './ConfirmModal';
import { changePasswordFields, updatePasswordFields } from '../../../constants';
import { Button, GradientText, HR, Input } from '../../ui';

const baseDefaultValues = { newPassword: '', confirmPassword: '' };

export const PasswordConfirmationModal = () => {
  const { queryParams, removeParam } = Hook.QueryParams();
  const { setUser } = Store.User();

  const { mutateAsync: resetPasswordSendLinkAsync, isPending: isResetPasswordSendLinkPending } =
    Service.User.ResetPasswordSendLink();

  const { mutateAsync: changePasswordAsync, isPending: isChangePasswordPending } =
    Service.User.ChangePassword();

  const { mutateAsync: updatePasswordAsync, isPending: isUpdatePasswordPending } =
    Service.User.UpdatePassword();

  const isChangePassword = queryParams.confirm === 'change-password';

  const [showPasswords, setShowPasswords] = useState<
    Record<keyof (TChangePassword & TUpdatePassword), boolean>
  >({
    confirmPassword: false,
    newPassword: false,
    oldPassword: false,
  });

  const togglePasswordVisibility = (field: keyof (TChangePassword & TUpdatePassword)) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TChangePassword | TUpdatePassword>({
    resolver: zodResolver(isChangePassword ? changePasswordSchema : updatePasswordSchema),
    defaultValues: isChangePassword ? { ...baseDefaultValues, oldPassword: '' } : baseDefaultValues,
  });

  const handleResetPasswordSendLink = async () => {
    await resetPasswordSendLinkAsync(undefined, { onSuccess: handleClose });
  };

  const handleClose = () => {
    removeParam('confirm');
    reset();
  };

  const onSubmit = async (data: TChangePassword | TUpdatePassword) => {
    if (isChangePassword) {
      await changePasswordAsync(data);
    } else {
      await updatePasswordAsync(data, {
        onSuccess: (data) => setUser(data.user),
      });
    }
    handleClose();
  };

  const isPending = isChangePasswordPending || isUpdatePasswordPending;

  return (
    <ConfirmModal
      type="custom"
      modalProps={{ isOpen: !!queryParams.confirm, onClose: handleClose }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-6"
      >
        <div className="flex w-full flex-col gap-6 text-center">
          <GradientText
            text="Enter your passwords"
            type="silver"
            className="text-lg/5 font-semibold md:text-xl/6 lg:text-2xl/6"
          />
          <HR />
          {isChangePassword ? (
            <>
              {changePasswordFields.map((field) => (
                <Input
                  key={field.name}
                  label={field.label}
                  register={register(field.name)}
                  error={(errors as FieldErrors<TChangePassword>)[field.name]?.message}
                  inputProps={{
                    name: field.name,
                    disabled: isPending,
                    type: showPasswords[field.name] ? 'text' : field.type,
                    placeholder: field.placeholder,
                  }}
                  icons={{
                    right: {
                      icon: showPasswords[field.name] ? (
                        <EyeOffIcon className="fill-primary h-full opacity-50 hover:opacity-100" />
                      ) : (
                        <EyeIcon className="fill-primary h-full opacity-50 hover:opacity-100" />
                      ),
                      onClick: () => togglePasswordVisibility(field.name),
                    },
                  }}
                />
              ))}
              <button
                onClick={handleResetPasswordSendLink}
                type="button"
                disabled={isResetPasswordSendLinkPending}
                className="mr-2 ml-auto hover:underline disabled:pointer-events-none"
              >
                <GradientText
                  text="Not remembered your password?"
                  type="accent"
                  className="m:text-[13px] text-[10px] whitespace-nowrap md:text-sm"
                />
              </button>
            </>
          ) : (
            updatePasswordFields.map((field) => (
              <Input
                key={field.name}
                label={field.label}
                register={register(field.name)}
                error={(errors as FieldErrors<TUpdatePassword>)[field.name]?.message}
                inputProps={{
                  name: field.name,
                  disabled: isPending,
                  type: showPasswords[field.name] ? 'text' : field.type,
                  placeholder: field.placeholder,
                }}
                icons={{
                  right: {
                    icon: showPasswords[field.name] ? (
                      <EyeOffIcon className="fill-primary! h-full opacity-50 hover:opacity-100" />
                    ) : (
                      <EyeIcon className="fill-primary! h-full opacity-50 hover:opacity-100" />
                    ),
                    onClick: () => togglePasswordVisibility(field.name),
                  },
                }}
              />
            ))
          )}
        </div>
        <div className="flex w-full items-center justify-center gap-4">
          <Button
            content="Cancel"
            pattern="secondary"
            className="max-h-10 rounded-md!"
            buttonProps={{ type: 'button', onClick: handleClose }}
          />
          <Button
            content="Confirm"
            pattern="primary"
            className="max-h-10 rounded-md!"
            buttonProps={{ disabled: !isDirty || isPending, type: 'submit' }}
          />
        </div>
      </form>
    </ConfirmModal>
  );
};
