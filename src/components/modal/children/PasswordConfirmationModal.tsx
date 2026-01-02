import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordFields, updatePasswordFields } from "../../../constants";
import useQueryParams from "../../../hooks/useQueryParams";
import {
  changePasswordSchema,
  updatePasswordSchema,
} from "../../../pages/auth/helpers/auth.schema";
import Button from "../../button/Button";
import Input from "../../input/Input";
import ConfirmModal from "./ConfirmModal";
import { FieldErrors, useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "../../../icons";
import {
  useChangePassword,
  useResetPasswordSendLink,
  useUpdatePassword,
} from "../../../api/user/user.service";
import { useUserStore } from "../../../store/user.store";

const baseDefaultValues = { newPassword: "", confirmPassword: "" };

const PasswordConfirmationModal = () => {
  const { queryParams, removeParam } = useQueryParams();
  const { setUser } = useUserStore();

  const {
    mutateAsync: resetPasswordSendLinkAsync,
    isPending: isResetPasswordSendLinkPending,
  } = useResetPasswordSendLink();

  const {
    mutateAsync: changePasswordAsync,
    isPending: isChangePasswordPending,
  } = useChangePassword();

  const {
    mutateAsync: updatePasswordAsync,
    isPending: isUpdatePasswordPending,
  } = useUpdatePassword();

  const isChangePassword = queryParams.confirm === "change-password";

  const [showPasswords, setShowPasswords] = useState<
    Record<
      keyof (z.infer<typeof changePasswordSchema> &
        z.infer<typeof updatePasswordSchema>),
      boolean
    >
  >({
    confirmPassword: false,
    newPassword: false,
    oldPassword: false,
  });

  const togglePasswordVisibility = (
    field: keyof (z.infer<typeof changePasswordSchema> &
      z.infer<typeof updatePasswordSchema>)
  ) => {
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
  } = useForm<
    z.infer<typeof changePasswordSchema> | z.infer<typeof updatePasswordSchema>
  >({
    resolver: zodResolver(
      isChangePassword ? changePasswordSchema : updatePasswordSchema
    ),
    defaultValues: isChangePassword
      ? { ...baseDefaultValues, oldPassword: "" }
      : baseDefaultValues,
  });

  const handleResetPasswordSendLink = async () => {
    await resetPasswordSendLinkAsync(undefined, { onSuccess: handleClose });
  };

  const handleClose = () => {
    removeParam("confirm");
    reset();
  };

  const onSubmit = async (
    data:
      | z.infer<typeof changePasswordSchema>
      | z.infer<typeof updatePasswordSchema>
  ) => {
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
        <div className="w-full flex flex-col gap-6 text-center">
          <h4 className="text-lg/5 md:text-xl/6 lg:text-2xl/6 font-semibold bg-clip-text text-transparent bg-silver-duo">
            Enter your passwords
          </h4>
          <hr className="w-full h-px block border-none bg-gradient-line" />
          {isChangePassword ? (
            <>
              {changePasswordFields.map((field) => (
                <Input
                  key={field.name}
                  label={field.label}
                  register={register(field.name)}
                  error={
                    (
                      errors as FieldErrors<
                        z.infer<typeof changePasswordSchema>
                      >
                    )[field.name]?.message
                  }
                  inputProps={{
                    name: field.name,
                    disabled: isPending,
                    type: showPasswords[field.name] ? "text" : field.type,
                    placeholder: field.placeholder,
                  }}
                  icons={{
                    right: {
                      icon: showPasswords[field.name] ? (
                        <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                      ) : (
                        <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
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
                className="ml-auto bg-clip-text text-transparent bg-accent-duo text-[10px] sm:text-[13px] md:text-sm mr-2 hover:underline whitespace-nowrap disabled:pointer-events-none"
              >
                Not remembered your password?
              </button>
            </>
          ) : (
            updatePasswordFields.map((field) => (
              <Input
                key={field.name}
                label={field.label}
                register={register(field.name)}
                error={
                  (errors as FieldErrors<z.infer<typeof updatePasswordSchema>>)[
                    field.name
                  ]?.message
                }
                inputProps={{
                  name: field.name,
                  disabled: isPending,
                  type: showPasswords[field.name] ? "text" : field.type,
                  placeholder: field.placeholder,
                }}
                icons={{
                  right: {
                    icon: showPasswords[field.name] ? (
                      <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                    ) : (
                      <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                    ),
                    onClick: () => togglePasswordVisibility(field.name),
                  },
                }}
              />
            ))
          )}
        </div>
        <div className="w-full flex items-center justify-center gap-4">
          <Button
            content="Cancel"
            pattern="secondary"
            className={`max-h-10 !rounded-md`}
            buttonProps={{ type: "button", onClick: handleClose }}
          />
          <Button
            content="Confirm"
            pattern="primary"
            className={`max-h-10 !rounded-md`}
            buttonProps={{ disabled: !isDirty || isPending, type: "submit" }}
          />
        </div>
      </form>
    </ConfirmModal>
  );
};

export default PasswordConfirmationModal;
