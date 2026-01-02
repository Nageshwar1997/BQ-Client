import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordFields } from "../../../constants";
import { updatePasswordSchema } from "../../../pages/auth/helpers/auth.schema";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "../../../icons";
import {
  useCheckResetPasswordTokenValidity,
  useResetPassword,
} from "../../../api/user/user.service";
import ConfirmModal from "../../../components/modal/children/ConfirmModal";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";
import useQueryParams from "../../../hooks/useQueryParams";
import { toastErrorMessage } from "../../../utils/toasts";
import ShowApiStatus from "../../../components/api-status/ShowApiStatus";

const ResetPassword = () => {
  const { queryParams } = useQueryParams();
  const { isLoading, isError, error } = useCheckResetPasswordTokenValidity(
    queryParams.token
  );

  const { mutateAsync, isPending } = useResetPassword();

  const [showPasswords, setShowPasswords] = useState<
    Record<keyof z.infer<typeof updatePasswordSchema>, boolean>
  >({
    confirmPassword: false,
    newPassword: false,
  });

  const togglePasswordVisibility = (
    field: keyof z.infer<typeof updatePasswordSchema>
  ) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleClose = () => {
    reset();
    window.close();
  };

  const onSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
    await mutateAsync(
      { token: queryParams.token, ...data },
      { onSuccess: () => handleClose() }
    );
  };

  useEffect(() => {
    if (!queryParams.token) {
      toastErrorMessage("Invalid URL");
      setTimeout(() => window.close(), 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-dvw h-dvh">
      {isError || isLoading || !queryParams.token ? (
        <ShowApiStatus
          headingText="Something went wrong"
          type={isLoading ? "loading" : isError ? "error" : "empty"}
          descriptionText={
            error instanceof Error
              ? error.message
              : typeof error === "string"
              ? error
              : !queryParams.token
              ? "Invalid URL"
              : "Something went wrong"
          }
          loadingText="Please wait..."
        />
      ) : (
        <ConfirmModal
          type="custom"
          modalProps={{ isOpen: true, onClose: handleClose }}
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
              {updatePasswordFields.map((field) => (
                <Input
                  key={field.name}
                  label={field.label}
                  register={register(field.name)}
                  error={errors[field.name]?.message}
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
                buttonProps={{
                  disabled: !isDirty || isPending,
                  type: "submit",
                }}
              />
            </div>
          </form>
        </ConfirmModal>
      )}
    </div>
  );
};

export default ResetPassword;
