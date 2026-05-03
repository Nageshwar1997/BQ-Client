import BorderGradient from '@/components/layout/containers/BorderGradient';
import AuthBottomInstructions from '@/components/ui/AuthBottomInstructions';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import Resend from '@/components/ui/Resend';
import { FORM_DEFAULT_VALUES } from '@/constants/form.constants';
import {
  EMAIL_INPUT_DATA,
  OTP_INPUT_DATA,
  PASSWORDS_INPUT_MAP_DATA,
} from '@/constants/input.constants';
import usePathParams from '@/hooks/usePathParams';
import { emailSchema, otpSchema, passwordsSchema } from '@/schemas/user.schema';
import {
  useForgotPasswordResendOtp,
  useForgotPasswordSave,
  useForgotPasswordSendOtp,
  useForgotPasswordVerifyOtp,
} from '@/services/user-service/auth.service.query';
import useUserStore from '@/stores/user.store';
import type { TEmail, TOtp, TPasswords } from '@/types/schema.type';
import { toaster } from '@/utils/common.util';
import { setErrorToForm } from '@/utils/form.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ForgotPassword = () => {
  /* ================= 1. Store Hooks ================= */
  const setUser = useUserStore((s) => s.setUser);

  /* ================= 2. Custom Hooks ================= */
  const { navigate } = usePathParams();

  /* ================= 3. API/Queries Hooks ================= */
  const {
    data: sendOtpData,
    isPending: isSendingOtp,
    mutateAsync: sendOtpAsync,
  } = useForgotPasswordSendOtp();
  const {
    data: resendOtpData,
    isPending: isResendingOtp,
    mutateAsync: resendOtpAsync,
  } = useForgotPasswordResendOtp();
  const { isPending: isVerifyingOtp, mutateAsync: verifyOtpAsync } = useForgotPasswordVerifyOtp();
  const { isPending: isRegistering, mutateAsync: registerAndSaveAsync } = useForgotPasswordSave();

  /* ================= 4. Forms ================= */
  const sendOtpForm = useForm<TEmail>({
    resolver: zodResolver(emailSchema),
    defaultValues: FORM_DEFAULT_VALUES.email,
  });

  const verifyOtpForm = useForm<TOtp>({
    resolver: zodResolver(otpSchema),
    defaultValues: FORM_DEFAULT_VALUES.otp,
  });

  const passwordForm = useForm<TPasswords>({
    resolver: zodResolver(passwordsSchema),
    defaultValues: FORM_DEFAULT_VALUES.passwords,
  });

  /* ================= 5. Local State ================= */
  const [currentStep, setCurrentStep] = useState<'send' | 'verify' | 'save'>('send');

  const [showPasswords, setShowPasswords] = useState<Record<keyof TPasswords, boolean>>({
    password: false,
    confirmPassword: false,
  });

  /* ================= 6. Derived Values ================= */
  const token = sendOtpData?.token || '';
  const sendCount = resendOtpData?.sendCount || 1;

  /* ================= 7. Handlers ================= */

  const handleSendOtp = async (data: TEmail) => {
    await sendOtpAsync(data, {
      onSuccess: () => setCurrentStep('verify'),
      onError: ({ fieldErrors }) => setErrorToForm(sendOtpForm.setError, fieldErrors),
    });
  };

  const handleVerifyOtp = async (data: TOtp) => {
    await verifyOtpAsync(
      { ...data, token },
      {
        onSuccess: () => setCurrentStep('save'),
        onError: ({ fieldErrors }) => setErrorToForm(verifyOtpForm.setError, fieldErrors),
      },
    );
  };

  const handleForgotPassword = async (data: TPasswords) => {
    await registerAndSaveAsync(
      { ...data, token },
      {
        onSuccess: ({ user }) => setUser(user),
        onError: ({ fieldErrors }) => setErrorToForm(passwordForm.setError, fieldErrors),
      },
    );
  };

  const handleResendOtp = async () => {
    if (sendCount >= 3) {
      return toaster.error({
        title: 'Resend Failed',
        description: 'You have reached the maximum number of attempts.',
      });
    }

    if (isSendingOtp || isVerifyingOtp || isResendingOtp) return;

    await resendOtpAsync(token);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'verify':
        verifyOtpForm.reset(FORM_DEFAULT_VALUES.otp);
        setCurrentStep('send');
        break;

      case 'save':
        passwordForm.reset(FORM_DEFAULT_VALUES.register);
        setCurrentStep('send');
        break;

      case 'send':
      default:
        sendOtpForm.reset(FORM_DEFAULT_VALUES.email);
        navigate(-1);
        break;
    }
  };

  const togglePasswordVisibility = (field: keyof TPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /* ================= 8. JSX ================= */

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* ================= HEADER ================= */}
      <GradientText
        type="accent"
        text="Forgot Password?"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />

      {/* ================= FORM CONTAINER ================= */}
      <BorderGradient className="flex flex-col gap-5 py-6 lg:gap-6">
        {/* ================= MAIN FORM ================= */}
        <form
          onSubmit={
            currentStep === 'send'
              ? sendOtpForm.handleSubmit(handleSendOtp)
              : currentStep === 'verify'
                ? verifyOtpForm.handleSubmit(handleVerifyOtp)
                : passwordForm.handleSubmit(handleForgotPassword)
          }
          className="space-y-5 sm:space-y-6"
        >
          {/* ================= STEP: SEND / VERIFY ================= */}
          {(currentStep === 'send' || currentStep === 'verify') && (
            <>
              {/* -------- Email Input -------- */}
              <Input
                key={EMAIL_INPUT_DATA.name}
                label={EMAIL_INPUT_DATA.label}
                inputProps={{
                  name: EMAIL_INPUT_DATA.name,
                  type: EMAIL_INPUT_DATA.type,
                  placeholder: EMAIL_INPUT_DATA.placeholder,
                  autoComplete: EMAIL_INPUT_DATA.autoComplete,
                  disabled: isSendingOtp || currentStep === 'verify',
                  readOnly: currentStep === 'verify',
                }}
                register={sendOtpForm.register(EMAIL_INPUT_DATA.name)}
                error={sendOtpForm.formState.errors[EMAIL_INPUT_DATA.name]?.message}
              />

              {/* -------- OTP Section (only in verify step) -------- */}
              {currentStep === 'verify' && (
                <>
                  <Input
                    key={OTP_INPUT_DATA.name}
                    label={OTP_INPUT_DATA.label}
                    inputProps={{
                      name: OTP_INPUT_DATA.name,
                      type: OTP_INPUT_DATA.type,
                      placeholder: OTP_INPUT_DATA.placeholder,
                      autoComplete: OTP_INPUT_DATA.autoComplete,
                      disabled: isVerifyingOtp || isResendingOtp,
                    }}
                    register={verifyOtpForm.register(OTP_INPUT_DATA.name)}
                    error={verifyOtpForm.formState.errors[OTP_INPUT_DATA.name]?.message}
                  />

                  {/* -------- Resend OTP -------- */}
                  <Resend
                    label="Not received OTP?"
                    count={sendCount >= 3 ? 0 : 30}
                    onResend={handleResendOtp}
                  />
                </>
              )}
            </>
          )}

          {/* ================= STEP: REGISTER DETAILS ================= */}
          {currentStep === 'save' &&
            PASSWORDS_INPUT_MAP_DATA.map((input) => {
              return (
                <Input
                  key={input.name}
                  label={input.label}
                  inputProps={{
                    name: input.name,
                    type: showPasswords[input.name] ? 'text' : input.type,
                    placeholder: input.placeholder,
                    autoComplete: input.autoComplete,
                    disabled: isRegistering,
                  }}
                  icons={{
                    right: {
                      icon: showPasswords[input.name] ? 'lucide:eye-off' : 'lucide:eye',
                      onClick: () => togglePasswordVisibility(input.name),
                      className: 'cursor-pointer',
                    },
                  }}
                  register={passwordForm.register(input.name)}
                  error={passwordForm.formState.errors[input.name]?.message}
                />
              );
            })}

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4">
            {/* -------- Back / Cancel Button -------- */}
            <Button
              pattern="secondary"
              buttonProps={{ onClick: handleBack }}
              content={
                currentStep === 'send'
                  ? 'Back'
                  : currentStep === 'verify'
                    ? 'Change Email'
                    : 'Cancel'
              }
            />

            {/* -------- Submit Button -------- */}
            <Button
              pattern="primary"
              buttonProps={{
                type: 'submit',
                disabled:
                  currentStep === 'send'
                    ? isSendingOtp
                    : currentStep === 'verify'
                      ? isVerifyingOtp || isResendingOtp
                      : isRegistering,
              }}
              content={
                currentStep === 'send'
                  ? 'Send OTP'
                  : currentStep === 'verify'
                    ? 'Verify OTP'
                    : 'Register'
              }
            />
          </div>
        </form>

        {/* ================= EXTRA INFO ================= */}
        <AuthBottomInstructions />
      </BorderGradient>
    </div>
  );
};

export default ForgotPassword;
