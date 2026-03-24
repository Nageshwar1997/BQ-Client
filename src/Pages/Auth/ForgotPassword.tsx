import { Service } from '@/Api-Service';
import { AuthBottomInstructions, BorderGradient, Button, Resend } from '@/Components/Ui';
import { Input } from '@/Components/Ui/Input';
import { Hook } from '@/Hooks';
import {
  sendForgotPasswordLinkAndOtpSchema,
  verifyForgotPasswordOtpSchema,
} from '@/Schemas/Auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import type z from 'zod';

export const SendForgotPasswordLinkAndOtp = ({ onContinue }: { onContinue: () => void }) => {
  const { setParams } = Hook.QueryParams();

  const {
    mutateAsync: sendAsync,
    isPending: isSendPending,
    data: sendData,
  } = Service.Auth.SendForgotPasswordLinkAndOtp();

  const { mutateAsync: resendAsync, isPending: isResendPending } =
    Service.Auth.ResendForgotPasswordLinkAndOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof sendForgotPasswordLinkAndOtpSchema>>({
    resolver: zodResolver(sendForgotPasswordLinkAndOtpSchema),
    defaultValues: { email: '' },
  });

  const handleSend = async (data: z.infer<typeof sendForgotPasswordLinkAndOtpSchema>) => {
    await sendAsync(data.email, {
      onSuccess: (respData) => {
        return setParams({ otpToken: respData?.token });
      },
    });
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
      <div className="flex w-full flex-col gap-6 text-center">
        <h4 className="bg-silver-duo bg-clip-text text-lg/5 font-semibold text-transparent md:text-xl/6 lg:text-2xl/6">
          Email to send Otp/Link
        </h4>
        <hr className="bg-gradient-line block h-px w-full border-none" />
        <Input
          label="Email"
          register={register('email')}
          error={errors.email?.message}
          inputProps={{
            name: 'email',
            disabled: isSendPending || isResendPending,
            type: 'text',
            placeholder: 'Enter your email',
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
      <div className="flex w-full items-center justify-center gap-4">
        <Link to="/auth" className="w-full">
          <Button
            content="Back"
            pattern="secondary"
            className="max-h-10 rounded-md!"
            buttonProps={{ type: 'button' }}
          />
        </Link>
        <Button
          content={
            isSendPending
              ? 'Sending...'
              : isResendPending
                ? 'Resending...'
                : sendData?.token
                  ? 'Continue'
                  : 'Send'
          }
          pattern="primary"
          className="max-h-10 rounded-md!"
          buttonProps={{
            disabled: !isDirty || isSendPending || isResendPending,
            type: sendData?.token ? 'button' : 'submit',
            onClick: () => sendData?.token && onContinue?.(),
          }}
        />
      </div>
    </form>
  );
};

export const VerifyForgotPasswordOtp = ({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) => {
  const { queryParams } = Hook.QueryParams();
  const {
    mutateAsync: sendAsync,
    isPending: isSendPending,
    data: sendData,
  } = Service.Auth.VerifyForgotPasswordLinkAndOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof verifyForgotPasswordOtpSchema>>({
    resolver: zodResolver(verifyForgotPasswordOtpSchema),
    defaultValues: { otp: '' },
  });

  const handleSend = async (data: z.infer<typeof verifyForgotPasswordOtpSchema>) => {
    await sendAsync({ ...data, otpToken: queryParams.otpToken });
  };

  return (
    <form
      onSubmit={handleSubmit(handleSend)}
      className="flex flex-col items-center justify-center gap-6"
    >
      <div className="flex w-full flex-col gap-6 text-center">
        <h4 className="bg-silver-duo bg-clip-text text-lg/5 font-semibold text-transparent md:text-xl/6 lg:text-2xl/6">
          Verify Otp
        </h4>
        <hr className="bg-gradient-line block h-px w-full border-none" />
        <Input
          label="OTP"
          register={register('otp')}
          error={errors.otp?.message}
          inputProps={{
            name: 'otp',
            disabled: isSendPending,
            type: 'text',
            placeholder: 'Enter your otp',
          }}
        />
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <Button
          content="Back"
          pattern="secondary"
          className="max-h-10 rounded-md!"
          buttonProps={{ type: 'button', onClick: onBack }}
        />
        <Button
          content={isSendPending ? 'Sending...' : 'Submit'}
          pattern="primary"
          className="max-h-10 rounded-md!"
          buttonProps={{
            disabled: !isDirty || isSendPending,
            type: 'submit',
          }}
        />
      </div>
    </form>
  );
};
export const SetForgotPassword = ({ onClose }: { onClose?: () => void }) => {
  const {
    mutateAsync: sendAsync,
    isPending: isSendPending,
    data: sendData,
  } = Service.Auth.SendForgotPasswordLinkAndOtp();

  const { mutateAsync: resendAsync, isPending: isResendPending } =
    Service.Auth.ResendForgotPasswordLinkAndOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<z.infer<typeof sendForgotPasswordLinkAndOtpSchema>>({
    resolver: zodResolver(sendForgotPasswordLinkAndOtpSchema),
    defaultValues: { email: '' },
  });

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleSend = async (data: z.infer<typeof sendForgotPasswordLinkAndOtpSchema>) => {
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
      <div className="flex w-full flex-col gap-6 text-center">
        <h4 className="bg-silver-duo bg-clip-text text-lg/5 font-semibold text-transparent md:text-xl/6 lg:text-2xl/6">
          Email to send Otp/Link
        </h4>
        <hr className="bg-gradient-line block h-px w-full border-none" />
        <Input
          label="Email"
          register={register('email')}
          error={errors.email?.message}
          inputProps={{
            name: 'email',
            disabled: isSendPending || isResendPending,
            type: 'text',
            placeholder: 'Enter your email',
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
      <div className="flex w-full items-center justify-center gap-4">
        <Link to="/auth" className="w-full">
          <Button
            content="Back"
            pattern="secondary"
            className="max-h-10 rounded-md!"
            buttonProps={{ type: 'button' }}
          />
        </Link>
        <Button
          content={isSendPending ? 'Sending...' : isResendPending ? 'Resending...' : 'Submit'}
          pattern="primary"
          className="max-h-10 rounded-md!"
          buttonProps={{
            disabled: !isDirty || isSendPending || isResendPending,
            type: 'submit',
          }}
        />
      </div>
    </form>
  );
};

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<'send' | 'verify' | 'set'>('send');

  return (
    <BorderGradient className="space-y-6">
      {currentStep === 'send' ? (
        <SendForgotPasswordLinkAndOtp onContinue={() => setCurrentStep('verify')} />
      ) : currentStep === 'verify' ? (
        <VerifyForgotPasswordOtp
          onContinue={() => setCurrentStep('set')}
          onBack={() => setCurrentStep('send')}
        />
      ) : currentStep === 'set' ? (
        <SetForgotPassword />
      ) : null}
      <AuthBottomInstructions />
    </BorderGradient>
  );
};

export default ForgotPassword;
