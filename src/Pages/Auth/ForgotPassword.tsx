import { useEffect, useRef, useState, type RefObject } from 'react';
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

export const SendForgotPasswordLinkAndOtp = ({
  onContinue,
  otpTokenRef,
}: {
  onContinue: () => void;
  otpTokenRef: RefObject<string | null>;
}) => {
  const { mutateAsync: sendAsync, isPending: isSendPending } =
    Service.Auth.SendForgotPasswordLinkAndOtp();

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
      onSuccess: (respData) => {
        otpTokenRef.current = respData?.token;
        onContinue();
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
          Email to send Otp/Link
        </h4>
        <Hr />
        <Input
          label={EMAIL_INPUT_DATA.label}
          register={register(EMAIL_INPUT_DATA.name)}
          error={errors[EMAIL_INPUT_DATA.name]?.message}
          inputProps={{
            name: EMAIL_INPUT_DATA.name,
            disabled: isSendPending,
            type: EMAIL_INPUT_DATA.type,
            placeholder: EMAIL_INPUT_DATA.placeholder,
            autoComplete: EMAIL_INPUT_DATA.autoComplete,
          }}
        />
      </div>
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
          content={isSendPending ? 'Sending...' : 'Send'}
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

export const VerifyForgotPasswordOtp = ({
  onContinue,
  onBack,
  otpTokenRef,
}: {
  onContinue: () => void;
  onBack: () => void;
  otpTokenRef: RefObject<string | null>;
}) => {
  const { setParams } = Hook.QueryParams();

  const { mutateAsync: resendAsync, isPending: isResending } =
    Service.Auth.ResendForgotPasswordLinkAndOtp();
  const { mutateAsync: verifyAsync, isPending: isVerifying } =
    Service.Auth.VerifyForgotPasswordOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TVerifyForgotPasswordOtp>({
    resolver: zodResolver(verifyForgotPasswordOtpSchema),
    defaultValues: { otp: '' },
  });

  const onVerify = async (data: TVerifyForgotPasswordOtp) => {
    if (!otpTokenRef.current) return;
    await verifyAsync(
      {
        ...data,
        token: otpTokenRef.current,
      },
      {
        onSuccess: (_, variables) => {
          setParams({ token: variables.token });
          onContinue();
        },
      },
    );
  };

  const handleResend = async () => {
    if (!otpTokenRef.current) return;

    await resendAsync(otpTokenRef.current);
  };

  const isDisabled = isResending || isVerifying;

  return (
    <form
      onSubmit={handleSubmit(onVerify)}
      className="flex flex-col items-center justify-center gap-6"
    >
      <div className="flex w-full flex-col gap-6 text-center">
        <h4 className="bg-silver-duo bg-clip-text text-lg/5 font-semibold text-transparent md:text-xl/6 lg:text-2xl/6">
          Verify Otp
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
          buttonProps={{ onClick: onBack }}
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
  const { queryParams } = Hook.QueryParams();
  const { mutateAsync: setPasswordAsync, isPending: isSendPending } =
    Service.Auth.SetForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TSetPassword>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: TSetPassword) => {
    await setPasswordAsync({ ...data, token: queryParams.token });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center gap-6"
    >
      <div className="flex w-full flex-col gap-6 text-center">
        <h4 className="bg-silver-duo bg-clip-text text-lg/5 font-semibold text-transparent md:text-xl/6 lg:text-2xl/6">
          Email to send Otp/Link
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
              disabled: isSendPending,
              type: input.type,
              placeholder: input.placeholder,
              autoComplete: input.autoComplete,
            }}
          />
        ))}
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <Link to="/auth" className="w-full">
          <Button content="Back" pattern="secondary" className="max-h-10 rounded-md!" />
        </Link>
        <Button
          content={isSendPending ? 'Submitting...' : 'Submit'}
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

const ForgotPassword = () => {
  const { queryParams } = Hook.QueryParams();
  const [currentStep, setCurrentStep] = useState<'send' | 'verify' | 'set'>('send');
  const { data: isValidToken, isLoading: isValidatingToken } =
    Service.Auth.ValidateForgotPasswordToken(currentStep === 'set' ? queryParams.token || '' : '');
  const otpTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (isValidToken) {
      setCurrentStep('set');
    }
  }, [isValidToken]);

  return (
    <BorderGradient className="space-y-6">
      {currentStep === 'set' || queryParams.token ? (
        isValidatingToken ? (
          <LoadingRings text="Validating Token..." />
        ) : (
          <SetForgotPassword />
        )
      ) : currentStep === 'send' ? (
        <SendForgotPasswordLinkAndOtp
          otpTokenRef={otpTokenRef}
          onContinue={() => setCurrentStep('verify')}
        />
      ) : currentStep === 'verify' ? (
        <VerifyForgotPasswordOtp
          otpTokenRef={otpTokenRef}
          onContinue={() => setCurrentStep('set')}
          onBack={() => setCurrentStep('send')}
        />
      ) : null}
      {!isValidatingToken && <AuthBottomInstructions />}
    </BorderGradient>
  );
};

export default ForgotPassword;
