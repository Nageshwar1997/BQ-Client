// ================= 1. External Libraries =================
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// ================= 2. Types =================
import type { TRegister, TRegisterEmail, TRegisterOtp } from '@/types/schema.type';

// ================= 3. Schemas =================
import { registerEmailSchema, registerOtpSchema, registerSchema } from '@/schemas/user.schema';

// ================= 4. Services / API (Custom Hooks) =================
import {
  useRegisterAndSaveUser,
  useRegisterResendOtp,
  useRegisterSendOtp,
  useRegisterVerifyOtp,
} from '@/services/user-service/auth.service.query';

// ================= 5. Global State / Store =================
import useUserStore from '@/stores/user.store';

// ================= 6. Custom Hooks =================
import usePathParams from '@/hooks/usePathParams';

// ================= 7. Utilities =================
import { setErrorToForm } from '@/utils/form.util';
import { toaster } from '@/utils/common.util';

// ================= 8. Constants =================
import { FORM_DEFAULT_VALUES } from '@/constants/form.constants';
import {
  EMAIL_INPUT_DATA,
  OTP_INPUT_DATA,
  PASSWORD_KEYS,
  REGISTER_INPUT_MAP_DATA,
} from '@/constants/input.constant';

// ================= 9. UI Components =================
import Button from '@/components/ui/Button';
import Input from '@/components/ui/inputs/Input';
import Resend from '@/components/ui/Resend';
import GradientText from '@/components/ui/GradientText';

// ================= 10. Layout Components =================
import BorderGradient from '@/components/layout/containers/BorderGradient';

// ================= 11. Feature Components =================
import SocialAuth from './components/SocialAuth';
import AuthBottomInstructions from './components/AuthBottomInstructions';

const Register = () => {
  /* ================= 1. Store Hooks ================= */
  const setUser = useUserStore((s) => s.setUser);

  /* ================= 2. Custom Hooks ================= */
  const { navigate } = usePathParams();

  /* ================= 3. API/Queries Hooks ================= */
  const sendOtpQuery = useRegisterSendOtp();
  const resendOtpQuery = useRegisterResendOtp();
  const verifyOtpQuery = useRegisterVerifyOtp();
  const registerAndSaveQuery = useRegisterAndSaveUser();

  /* ================= 4. Forms ================= */
  const sendOtpForm = useForm({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: FORM_DEFAULT_VALUES.email,
  });

  const verifyOtpForm = useForm({
    resolver: zodResolver(registerOtpSchema),
    defaultValues: FORM_DEFAULT_VALUES.otp,
  });

  const registerAndSaveForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: FORM_DEFAULT_VALUES.register,
  });

  /* ================= 5. Local State ================= */
  const [currentStep, setCurrentStep] = useState<'send' | 'verify' | 'save'>('send');

  const [showPasswords, setShowPasswords] = useState<Partial<Record<keyof TRegister, boolean>>>({
    password: false,
    confirmPassword: false,
  });

  /* ================= 6. Derived Values ================= */
  const token = sendOtpQuery.data?.token || '';
  const sendCount = resendOtpQuery.data?.sendCount || 1;

  const isSendingOtp = sendOtpQuery.isPending;
  const isVerifyingOtp = verifyOtpQuery.isPending;
  const isResendingOtp = resendOtpQuery.isPending;
  const isRegistering = registerAndSaveQuery.isPending;

  /* ================= 7. Handlers ================= */

  const handleSendOtp = async (data: TRegisterEmail) => {
    await sendOtpQuery.mutateAsync(data, {
      onSuccess: () => setCurrentStep('verify'),
      onError: ({ fieldErrors }) => setErrorToForm(sendOtpForm.setError, fieldErrors),
    });
  };

  const handleVerifyOtp = async (data: TRegisterOtp) => {
    await verifyOtpQuery.mutateAsync(
      { ...data, token },
      {
        onSuccess: () => setCurrentStep('save'),
        onError: ({ fieldErrors }) => setErrorToForm(verifyOtpForm.setError, fieldErrors),
      },
    );
  };

  const handleRegisterAndSave = async (data: TRegister) => {
    await registerAndSaveQuery.mutateAsync(
      { ...data, token },
      {
        onSuccess: ({ user }) => setUser(user),
        onError: ({ fieldErrors }) => setErrorToForm(registerAndSaveForm.setError, fieldErrors),
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

    await resendOtpQuery.mutateAsync(token);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'verify':
        verifyOtpForm.reset(FORM_DEFAULT_VALUES.otp);
        setCurrentStep('send');
        break;

      case 'save':
        registerAndSaveForm.reset(FORM_DEFAULT_VALUES.register);
        setCurrentStep('send');
        break;

      case 'send':
      default:
        sendOtpForm.reset(FORM_DEFAULT_VALUES.email);
        navigate('/');
        break;
    }
  };

  const togglePasswordVisibility = (field: keyof TRegister) => {
    if (!PASSWORD_KEYS.includes(field)) return;

    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /* ================= 8. JSX ================= */

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* ================= HEADER ================= */}
      <GradientText
        type="accent"
        text="Register"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />

      {/* ================= SOCIAL AUTH ================= */}
      <SocialAuth />

      {/* ================= FORM CONTAINER ================= */}
      <BorderGradient className="flex flex-col gap-5 py-6 lg:gap-6">
        {/* ================= MAIN FORM ================= */}
        <form
          onSubmit={
            currentStep === 'send'
              ? sendOtpForm.handleSubmit(handleSendOtp)
              : currentStep === 'verify'
                ? verifyOtpForm.handleSubmit(handleVerifyOtp)
                : registerAndSaveForm.handleSubmit(handleRegisterAndSave)
          }
          className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-y-6"
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
                containerClassName="sm:col-span-2"
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
                    containerClassName="sm:col-span-2"
                  />

                  {/* -------- Resend OTP -------- */}
                  <Resend
                    className="sm:col-span-2"
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
            REGISTER_INPUT_MAP_DATA.map((input) => {
              const isPassword = PASSWORD_KEYS.includes(input.name);
              const isPhone = input.name === 'phoneNumber';
              return (
                <Input
                  key={input.name}
                  label={input.label}
                  inputProps={{
                    name: input.name,
                    type: isPassword
                      ? showPasswords[input.name]
                        ? 'text'
                        : input.type
                      : input.type,
                    placeholder: input.placeholder,
                    autoComplete: input.autoComplete,
                    disabled: isRegistering,
                  }}
                  icons={
                    input.name === 'phoneNumber'
                      ? { left: '+91' }
                      : PASSWORD_KEYS.includes(input.name)
                        ? {
                            right: {
                              icon: showPasswords[input.name] ? 'lucide:eye-off' : 'lucide:eye',
                              onClick: () => togglePasswordVisibility(input.name),
                            },
                          }
                        : undefined
                  }
                  register={registerAndSaveForm.register(input.name)}
                  error={registerAndSaveForm.formState.errors[input.name]?.message}
                  containerClassName={isPhone ? 'sm:col-span-2' : ''}
                />
              );
            })}

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4 sm:col-span-2">
            {/* -------- Back / Cancel Button -------- */}
            <Button
              pattern="secondary"
              buttonProps={{ onClick: handleBack }}
              content={
                currentStep === 'send'
                  ? 'Home'
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

        {/* ================= FOOTER ================= */}
        <div className="flex items-center justify-center gap-2">
          <GradientText
            text="Already have an account?"
            type="silver"
            className="text-xs md:text-sm"
          />
          <GradientText
            text="Login"
            type="accent"
            path="/auth"
            className="text-xs font-semibold md:text-sm"
          />
        </div>

        {/* ================= EXTRA INFO ================= */}
        <AuthBottomInstructions />
      </BorderGradient>
    </div>
  );
};

export default Register;
