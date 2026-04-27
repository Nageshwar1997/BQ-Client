import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TRegister, TRegisterEmail, TRegisterOtp } from '@/types/schema.type';
import { registerEmailSchema, registerOtpSchema, registerSchema } from '@/schemas/user.schema';
import Button from '@/components/ui/Button';
import BorderGradient from '@/components/layout/containers/BorderGradient';
import GradientText from '@/components/ui/GradientText';
import SocialAuth from './components/SocialAuth';
import AuthBottomInstructions from './components/AuthBottomInstructions';
import Resend from '@/components/ui/Resend';
import Checkbox from '@/components/ui/inputs/Checkbox';
import Input from '@/components/ui/inputs/Input';
import {
  useRegisterAndSaveUser,
  useRegisterResendOtp,
  useRegisterSendOtp,
  useRegisterVerifyOtp,
} from '@/services/user-service/auth.service.query';
import { setErrorToForm } from '@/utils/form.util';
import {
  EMAIL_INPUT_DATA,
  OTP_INPUT_DATA,
  PASSWORD_KEYS,
  REGISTER_INPUT_MAP_DATA,
} from '@/constants/input.constant';
import { toaster } from '@/utils/common.util';
import usePathParams from '@/hooks/usePathParams';

const DEFAULT_VALUES = {
  email: { email: '' },
  otp: { otp: '' },
  register: {
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: '',
    remember: false,
  },
};

const Register = () => {
  const [currentStep, setCurrentStep] = useState<'send' | 'verify' | 'save'>('send');
  const [showPasswords, setShowPasswords] = useState<Partial<Record<keyof TRegister, boolean>>>({
    password: false,
    confirmPassword: false,
  });

  const { navigate } = usePathParams();

  const sendOtpQuery = useRegisterSendOtp();
  const resendOtpQuery = useRegisterResendOtp();
  const verifyOtpQuery = useRegisterVerifyOtp();
  const registerAndSaveQuery = useRegisterAndSaveUser();

  const otpToken =
    verifyOtpQuery.data?.data?.otpToken ||
    resendOtpQuery.data?.data?.otpToken ||
    sendOtpQuery.data?.data?.otpToken ||
    '';
  const sendCount = resendOtpQuery.data?.data?.sendCount || sendOtpQuery.data?.data?.sendCount || 1;

  const sendOtpForm = useForm({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: DEFAULT_VALUES.email,
  });
  const verifyOtpForm = useForm({
    resolver: zodResolver(registerOtpSchema),
    defaultValues: DEFAULT_VALUES.otp,
  });
  const registerAndSaveForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: DEFAULT_VALUES.register,
  });

  const handleSendOtp = async (data: TRegisterEmail) => {
    await sendOtpQuery.mutateAsync(data, {
      onSuccess: ({ data }) => {
        registerAndSaveForm.setValue('email', data.email);
        setCurrentStep('verify');
      },
      onError: ({ fieldErrors }) => setErrorToForm(sendOtpForm.setError, fieldErrors),
    });
  };
  const handleVerifyOtp = async (data: TRegisterOtp) => {
    await verifyOtpQuery.mutateAsync(
      { ...data, otpToken },
      {
        onSuccess: ({ data }) => {
          registerAndSaveForm.setValue('email', data.email);
          setCurrentStep('save');
        },
        onError: ({ fieldErrors }) => setErrorToForm(verifyOtpForm.setError, fieldErrors),
      },
    );
  };
  const handleRegisterAndSave = async (data: TRegister) => {
    await registerAndSaveQuery.mutateAsync(data, {
      onError: ({ fieldErrors }) => setErrorToForm(registerAndSaveForm.setError, fieldErrors),
    });
  };

  const handleResendOtp = async () => {
    const { email } = sendOtpQuery.data?.data ?? {};
    if (sendCount >= 3) {
      return toaster.error({
        title: 'Resend Failed',
        description: 'You have reached the maximum number of attempts.',
      });
    }
    if (verifyOtpQuery.isPending || resendOtpQuery.isPending || sendOtpQuery.isPending) return;

    await resendOtpQuery.mutateAsync({ email, otpToken });
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'verify': {
        verifyOtpForm.reset(DEFAULT_VALUES.otp);
        setCurrentStep('send');
        break;
      }

      case 'save': {
        registerAndSaveForm.reset(DEFAULT_VALUES.register);
        setCurrentStep('send');
        break;
      }

      case 'send':
      default: {
        sendOtpForm.reset(DEFAULT_VALUES.email);
        navigate('/');
        break;
      }
    }
  };

  const togglePasswordVisibility = (field: keyof TRegister) => {
    if (!PASSWORD_KEYS.includes(field)) return;
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <GradientText
        type="accent"
        text="Register"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />
      <SocialAuth />
      <BorderGradient className="flex flex-col gap-5 lg:gap-6">
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
          {/* ================= SEND / VERIFY ================= */}
          {(currentStep === 'send' || currentStep === 'verify') && (
            <>
              <Input
                key={EMAIL_INPUT_DATA.name}
                label={EMAIL_INPUT_DATA.label}
                inputProps={{
                  name: EMAIL_INPUT_DATA.name,
                  type: EMAIL_INPUT_DATA.type,
                  placeholder: EMAIL_INPUT_DATA.placeholder,
                  autoComplete: EMAIL_INPUT_DATA.autoComplete,
                  disabled: sendOtpQuery.isPending || currentStep === 'verify',
                  readOnly: currentStep === 'verify',
                }}
                register={sendOtpForm.register(EMAIL_INPUT_DATA.name)}
                error={sendOtpForm.formState.errors[EMAIL_INPUT_DATA.name]?.message}
                containerClassName="sm:col-span-2"
              />
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
                      disabled: verifyOtpQuery.isPending || resendOtpQuery.isPending,
                    }}
                    register={verifyOtpForm.register(OTP_INPUT_DATA.name)}
                    error={verifyOtpForm.formState.errors[OTP_INPUT_DATA.name]?.message}
                    containerClassName="sm:col-span-2"
                  />
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

          {/* ================= REGISTER ================= */}
          {currentStep === 'save' && (
            <>
              {REGISTER_INPUT_MAP_DATA.map((input) => {
                const isFullWidth = ['email', 'phoneNumber'].includes(input.name);
                return (
                  <Input
                    key={input.name}
                    label={input.label}
                    inputProps={{
                      name: input.name,
                      type: PASSWORD_KEYS.includes(input.name)
                        ? showPasswords[input.name]
                          ? 'text'
                          : input.type
                        : input.type,
                      placeholder: input.placeholder,
                      autoComplete: input.autoComplete,
                      disabled: registerAndSaveQuery.isPending || input.name === 'email',
                    }}
                    icons={
                      input.name === 'phoneNumber'
                        ? { left: '+91' }
                        : PASSWORD_KEYS.includes(input.name)
                          ? {
                              right: {
                                icon: showPasswords[input.name] ? 'lucide:eye' : 'lucide:eye-off',
                                onClick: () => togglePasswordVisibility(input.name),
                              },
                            }
                          : undefined
                    }
                    register={registerAndSaveForm.register(input.name)}
                    error={registerAndSaveForm.formState.errors[input.name]?.message}
                    containerClassName={isFullWidth ? 'sm:col-span-2' : ''}
                  />
                );
              })}
              <Checkbox
                register={registerAndSaveForm.register('remember')}
                checkboxProps={{ name: 'remember', disabled: registerAndSaveQuery.isPending }}
                content="Remember me"
                containerClassName="sm:col-span-2"
              />
            </>
          )}

          {/* ================= BUTTONS ================= */}
          <div className="flex gap-4 sm:col-span-2">
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
            <Button
              pattern="primary"
              buttonProps={{ type: 'submit' }}
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
            className="text-sm hover:font-medium md:text-base"
          />
        </div>
        <AuthBottomInstructions />
      </BorderGradient>
    </div>
  );
};

export default Register;
