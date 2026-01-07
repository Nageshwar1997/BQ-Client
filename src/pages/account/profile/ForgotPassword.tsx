import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import {
  useCheckForgotPasswordTokenValidity,
  useForgotPassword,
  useForgotPasswordResendLink,
  useForgotPasswordSendLink,
} from "../../../api/user/user.service";
import Button from "../../../components/button/Button";
import {
  forgotPasswordSchema,
  updatePasswordSchema,
} from "../../auth/helpers/auth.schema";
import ShowApiStatus from "../../../components/api-status/ShowApiStatus";
import ConfirmModal from "../../../components/modal/children/ConfirmModal";
import Input from "../../../components/input/Input";
import usePathParams from "../../../hooks/usePathParams";
import Resend from "../../../components/Resend";
import useQueryParams from "../../../hooks/useQueryParams";
import { updatePasswordFields } from "../../../constants";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "../../../icons";

const SetPassword = () => {
  const { queryParams, removeParam } = useQueryParams();
  const { mutateAsync, isPending } = useForgotPassword();
  const { isError, isLoading } = useCheckForgotPasswordTokenValidity(
    queryParams.token
  );

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
    if (!queryParams.token) return;

    await mutateAsync(
      { token: queryParams.token, ...data },
      {
        onSuccess: () => {
          setTimeout(() => {
            handleClose();
          }, 1000);
        },
      }
    );
  };

  useEffect(() => {
    if (isError) removeParam("token");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  return isLoading ? (
    <ShowApiStatus
      loadingText="Please wait..."
      headingText=""
      type="loading"
      className="pb-10"
    />
  ) : (
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
          content="Close"
          pattern="secondary"
          className={`max-h-10 !rounded-md`}
          buttonProps={{ type: "button", onClick: handleClose }}
        />
        <Button
          content="Submit"
          pattern="primary"
          className={`max-h-10 !rounded-md`}
          buttonProps={{
            disabled: !isDirty || isPending,
            type: "submit",
          }}
        />
      </div>
    </form>
  );
};

const SendForgotPasswordLink = ({ onClose }: { onClose?: () => void }) => {
  const {
    mutateAsync: sendAsync,
    isPending: isSendPending,
    data: sendData,
  } = useForgotPasswordSendLink();

  const { mutateAsync: resendAsync, isPending: isResendPending } =
    useForgotPasswordResendLink();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleSend = async (data: z.infer<typeof forgotPasswordSchema>) => {
    await sendAsync(data.email);
  };

  const handleResend = async () => {
    if (!sendData?.token) return;

    await resendAsync(sendData.token);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSend)}
      className="flex flex-col items-center justify-center gap-6"
    >
      <div className="w-full flex flex-col gap-6 text-center">
        <h4 className="text-lg/5 md:text-xl/6 lg:text-2xl/6 font-semibold bg-clip-text text-transparent bg-silver-duo">
          Enter your email
        </h4>
        <hr className="w-full h-px block border-none bg-gradient-line" />
        <Input
          label="Email"
          register={register("email")}
          error={errors.email?.message}
          inputProps={{
            name: "email",
            disabled: isSendPending || isResendPending,
            type: "text",
            placeholder: "Enter your email",
          }}
        />
      </div>
      {sendData?.success && (
        <Resend
          label="Not received Mail?"
          count={6}
          onResend={!isResendPending ? handleResend : undefined}
        />
      )}
      <div className="w-full flex items-center justify-center gap-4">
        <Button
          content="Close"
          pattern="secondary"
          className={`max-h-10 !rounded-md`}
          buttonProps={{ type: "button", onClick: handleClose }}
        />
        <Button
          content={
            isSendPending
              ? "Sending..."
              : isResendPending
              ? "Resending..."
              : "Submit"
          }
          pattern="primary"
          className="max-h-10 !rounded-md"
          buttonProps={{
            disabled: !isDirty || isSendPending || isResendPending,
            type: "submit",
          }}
        />
      </div>
    </form>
  );
};

const ForgotPassword = () => {
  const { navigate } = usePathParams();
  const { queryParams } = useQueryParams();

  const handleClose = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center w-dvw h-dvh">
      <ConfirmModal
        type="custom"
        modalProps={{ isOpen: true, onClose: handleClose }}
      >
        {queryParams.token ? (
          <SetPassword />
        ) : (
          <SendForgotPasswordLink onClose={handleClose} />
        )}
      </ConfirmModal>
    </div>
  );
};

export default ForgotPassword;
