import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Service } from '@/Api-Service';
import { LoadingRings } from '@/Components/Layout';
import { AuthBottomInstructions, BorderGradient, Button, Hr, Resend } from '@/Components/Ui';
import { Input } from '@/Components/Ui/Input';
import { EMAIL_INPUT_DATA, OTP_INPUT_DATA, SET_PASSWORDS_FIELDS } from '@/Constants/Input.constant';
import { Hook } from '@/Hooks';
import {
  sendForgotPasswordLinkAndOtpSchema,
  setPasswordSchema,
  verifyForgotPasswordOtpSchema,
} from '@/Schemas/Auth.schema';
import type {
  TSendForgotPasswordLinkAndOtp,
  TSetPassword,
  TVerifyForgotPasswordOtp,
} from '@/Types/Schema.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { oldToaster } from '@/Utils/Common.util';
import { saveSessionToken } from '@/Utils/Storage.util';
import { UserStore } from '@/Stores';

export const SendForgotPasswordLinkAndOtp = () => {
  const { goToVerify } = Hook.ForgotPasswordFlow();
  const { mutateAsync: sendAsync, isPending } = Service.Auth.SendForgotPasswordLinkAndOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TSendForgotPasswordLinkAndOtp>({
    resolver: zodResolver(sendForgotPasswordLinkAndOtpSchema),
    defaultValues: { email: '' },
  });

  const handleSend = async (data: TSendForgotPasswordLinkAndOtp) => {
    await sendAsync(data.email, {
      onSuccess: (resp) => {
        goToVerify(resp?.token);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleSend)}
      className="flex flex-col items-center justify-center gap-6"
    >
      <div className="flex w-full flex-col gap-6 text-center">
        <h4 className="bg-silver-duo bg-clip-text text-lg/5 font-semibold text-transparent md:text-xl/6 lg:text-2xl/6">
          Email to send OTP/Link
        </h4>
        <Hr />
        <Input
          label={EMAIL_INPUT_DATA.label}
          register={register(EMAIL_INPUT_DATA.name)}
          error={errors[EMAIL_INPUT_DATA.name]?.message}
          inputProps={{
            name: EMAIL_INPUT_DATA.name,
            disabled: isPending,
            type: EMAIL_INPUT_DATA.type,
            placeholder: EMAIL_INPUT_DATA.placeholder,
            autoComplete: EMAIL_INPUT_DATA.autoComplete,
          }}
        />
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <Link to="/auth" className="w-full">
          <Button content="Back" pattern="secondary" className="max-h-10 rounded-md!" />
        </Link>
        <Button
          content={isPending ? 'Sending...' : 'Send'}
          pattern="primary"
          className="max-h-10 rounded-md!"
          buttonProps={{
            disabled: !isDirty || isPending,
            type: 'submit',
          }}
        />
      </div>
    </form>
  );
};

export const VerifyForgotPasswordOtp = () => {
  const { token, goToSend, goToSet } = Hook.ForgotPasswordFlow();

  const { mutateAsync: verifyAsync, isPending: isVerifying } =
    Service.Auth.VerifyForgotPasswordOtp();
  const { mutateAsync: resendAsync, isPending: isResending } =
    Service.Auth.ResendForgotPasswordLinkAndOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TVerifyForgotPasswordOtp>({
    resolver: zodResolver(verifyForgotPasswordOtpSchema),
    defaultValues: { otp: '' },
  });

  const onVerify = async (data: TVerifyForgotPasswordOtp) => {
    if (!token) return;

    await verifyAsync(
      { ...data, token },
      {
        onSuccess: () => goToSet(),
      },
    );
  };

  const handleResend = async () => {
    if (!token) return;
    await resendAsync(token);
  };

  const isDisabled = isVerifying || isResending;

  return (
    <form
      onSubmit={handleSubmit(onVerify)}
      className="flex flex-col items-center justify-center gap-6"
    >
      <div className="flex w-full flex-col gap-6 text-center">
        <h4 className="bg-silver-duo bg-clip-text text-lg/5 font-semibold text-transparent md:text-xl/6 lg:text-2xl/6">
          Verify OTP
        </h4>
        <Hr />
        <Input
          label={OTP_INPUT_DATA.label}
          register={register(OTP_INPUT_DATA.name)}
          error={errors[OTP_INPUT_DATA.name]?.message}
          inputProps={{
            name: OTP_INPUT_DATA.name,
            disabled: isDisabled,
            type: OTP_INPUT_DATA.type,
            placeholder: OTP_INPUT_DATA.placeholder,
          }}
        />
        <Resend
          label="Not received Mail?"
          count={30}
          onResend={!isDisabled ? handleResend : undefined}
        />
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <Button
          content="Back"
          pattern="secondary"
          className="max-h-10 rounded-md!"
          buttonProps={{ onClick: goToSend }}
        />
        <Button
          content={isVerifying ? 'Verifying...' : isResending ? 'Resending...' : 'Continue'}
          pattern="primary"
          className="max-h-10 rounded-md!"
          buttonProps={{
            disabled: !isDirty || isDisabled,
            type: 'submit',
          }}
        />
      </div>
    </form>
  );
};

export const SetForgotPassword = () => {
  const { setUser } = UserStore();
  const { token, goToSend } = Hook.ForgotPasswordFlow();
  const { mutateAsync, isPending } = Service.Auth.SetForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TSetPassword>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: TSetPassword) => {
    if (!token) return;

    await mutateAsync(
      { ...data, token },
      {
        onSuccess: (data) => {
          saveSessionToken(data.token);
          setUser(data.user);
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center gap-6"
    >
      <div className="flex w-full flex-col gap-6 text-center">
        <h4 className="bg-silver-duo bg-clip-text text-lg/5 font-semibold text-transparent md:text-xl/6 lg:text-2xl/6">
          Set New Password
        </h4>
        <Hr />

        {SET_PASSWORDS_FIELDS.map((input) => (
          <Input
            key={input.name}
            label={input.label}
            register={register(input.name)}
            error={errors[input.name]?.message}
            inputProps={{
              name: input.name,
              disabled: isPending,
              type: input.type,
              placeholder: input.placeholder,
              autoComplete: input.autoComplete,
            }}
          />
        ))}
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <Button
          content="Back"
          pattern="secondary"
          className="max-h-10 rounded-md!"
          buttonProps={{ onClick: goToSend }}
        />
        <Button
          content={isPending ? 'Submitting...' : 'Submit'}
          pattern="primary"
          buttonProps={{ disabled: !isDirty || isPending, type: 'submit' }}
        />
      </div>
    </form>
  );
};

const ForgotPassword = () => {
  const { step, token, goToSend } = Hook.ForgotPasswordFlow();

  const {
    data: isValidToken,
    isLoading,
    isError,
    error,
  } = Service.Auth.ValidateForgotPasswordToken(step === 'set' && token ? token : '');

  useEffect(() => {
    if ((step === 'verify' || step === 'set') && !token) {
      oldToaster('error', 'Session expired. Please start again.');
      goToSend();
      return;
    }

    if (step === 'set') {
      if (isValidToken) return;

      if (isError) {
        oldToaster('error', error?.message);
        goToSend();
      }
    }
  }, [step, token, isValidToken, isError]);

  return (
    <BorderGradient className="space-y-6">
      {(step === 'verify' || step === 'set') && !token ? (
        <SendForgotPasswordLinkAndOtp />
      ) : step === 'set' ? (
        isLoading ? (
          <LoadingRings text="Validating Token..." />
        ) : (
          <SetForgotPassword />
        )
      ) : step === 'verify' ? (
        <VerifyForgotPasswordOtp />
      ) : (
        <SendForgotPasswordLinkAndOtp />
      )}

      {!isLoading && <AuthBottomInstructions />}
    </BorderGradient>
  );
};

export default ForgotPassword;
