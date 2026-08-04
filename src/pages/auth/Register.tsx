import type {
  TEmailZodSchema,
  TOtpZodSchema,
  TPasswordsZodSchema,
  TRegisterZodSchema,
} from '@beautinique/frontend-types';
import { emailZodSchema, otpZodSchema, registerZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import BorderGradient from '@/components/layout/containers/BorderGradient';
import AuthBottomInstructions from '@/components/ui/AuthBottomInstructions';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import Resend from '@/components/ui/Resend';
import SocialAuth from '@/components/ui/SocialAuth';
import {
  BASE_PASSWORD_KEYS,
  BASE_PASSWORDS_VISIBILITY,
  EMAIL_INPUT_DATA,
  OTP_INPUT_DATA,
  REGISTER_INPUT_MAP_DATA,
} from '@/constants/input.constants';
import { ROUTES } from '@/constants/routes.constants';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import {
  useRegisterAndSaveUser,
  useRegisterResendOtp,
  useRegisterSendOtp,
  useRegisterVerifyOtp,
} from '@/services/user-service/auth.service.query';
import useUserStore from '@/stores/user.store';
import { toaster } from '@/utils/common.util';
import { setErrorToForm } from '@/utils/form.util';

const Register = () => {
  /* ================= 1. Store Hooks ================= */
  const setUser = useUserStore((s) => s.setUser);

  /* ================= 2. Custom Hooks ================= */
  const { navigate } = usePathParams();
  const { queryParams } = useQueryParams();

  /* ================= 3. API/Queries Hooks ================= */
  const sendOtp = useRegisterSendOtp();
  const resendOtp = useRegisterResendOtp();
  const verifyOtp = useRegisterVerifyOtp();
  const registerAndSave = useRegisterAndSaveUser();

  /* ================= 4. Forms ================= */
  const sendOtpForm = useForm<TEmailZodSchema>({ resolver: zodResolver(emailZodSchema) });

  const verifyOtpForm = useForm<TOtpZodSchema>({ resolver: zodResolver(otpZodSchema) });

  const registerAndSaveForm = useForm<TRegisterZodSchema>({
    resolver: zodResolver(registerZodSchema),
  });

  /* ================= 5. Local State ================= */
  const [currentStep, setCurrentStep] = useState<'send' | 'verify' | 'save'>('save');

  const [showPasswords, setShowPasswords] =
    useState<Record<keyof TPasswordsZodSchema, boolean>>(BASE_PASSWORDS_VISIBILITY);

  /* ================= 6. Derived Values ================= */
  const token = sendOtp.data?.data ?? '';
  const sendCount = resendOtp.data?.data ?? 1;
  const email = useWatch({ control: sendOtpForm.control, name: 'email' });

  /* ================= 7. Handlers ================= */

  const handleSendOtp = async (data: TEmailZodSchema) => {
    await sendOtp.mutateAsync(data, {
      onSuccess: () => {
        registerAndSaveForm.setValue('email', email);
        setCurrentStep('verify');
      },
      onError: ({ fieldErrors }) => {
        setErrorToForm(sendOtpForm.setError, fieldErrors);
      },
    });
  };

  const handleVerifyOtp = async (data: TOtpZodSchema) => {
    await verifyOtp.mutateAsync(
      { ...data, token },
      {
        onSuccess: () => {
          registerAndSaveForm.setValue('email', email);
          setCurrentStep('save');
        },
        onError: ({ fieldErrors }) => {
          setErrorToForm(verifyOtpForm.setError, fieldErrors);
        },
      },
    );
  };

  const handleRegisterAndSave = async (data: TRegisterZodSchema) => {
    await registerAndSave.mutateAsync(
      { ...data, token },
      {
        onSuccess: ({ data: user }) => {
          setUser(user ?? null);

          // Same as login: if a private route bounced the user here, send them back to it.
          void navigate(queryParams.redirect ?? ROUTES.HOME);
        },
        onError: ({ fieldErrors }) => {
          setErrorToForm(registerAndSaveForm.setError, fieldErrors);
        },
      },
    );
  };

  const handleResendOtp = async () => {
    if (sendCount >= 3) {
      toaster.error({
        title: 'Resend Failed',
        description: 'You have reached the maximum number of attempts.',
      });
      return;
    }

    if (sendOtp.isPending || verifyOtp.isPending || resendOtp.isPending) return;

    await resendOtp.mutateAsync(token);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'verify':
        verifyOtpForm.reset();
        setCurrentStep('send');
        break;

      case 'save':
        registerAndSaveForm.reset();
        setCurrentStep('send');
        break;

      case 'send':
      default:
        sendOtpForm.reset();
        void navigate(ROUTES.HOME);
        break;
    }
  };

  const togglePasswordVisibility = (field: keyof TPasswordsZodSchema) => {
    if (!BASE_PASSWORD_KEYS.includes(field)) return;

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
      <BorderGradient className="flex flex-col gap-5 lg:gap-6">
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
          {currentStep !== 'send' && (
            <div className="mx-auto space-x-2 sm:col-span-2">
              <GradientText text="Email:" type="silver" className="text-sm" />
              <GradientText text={email} type="accent" className="text-sm" />
            </div>
          )}
          {/* ================= STEP: SEND  ================= */}
          {currentStep === 'send' && (
            <Input
              key={EMAIL_INPUT_DATA.name}
              label={EMAIL_INPUT_DATA.label}
              inputProps={{
                name: EMAIL_INPUT_DATA.name,
                type: EMAIL_INPUT_DATA.type,
                placeholder: EMAIL_INPUT_DATA.placeholder,
                autoComplete: EMAIL_INPUT_DATA.autoComplete,
                disabled: sendOtp.isPending,
              }}
              register={sendOtpForm.register(EMAIL_INPUT_DATA.name)}
              error={sendOtpForm.formState.errors[EMAIL_INPUT_DATA.name]?.message}
              containerClassName="sm:col-span-2"
            />
          )}
          {/* ================= STEP: VERIFY ================= */}
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
                  disabled: verifyOtp.isPending || resendOtp.isPending,
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
          {/* ================= STEP: REGISTER DETAILS ================= */}
          {currentStep === 'save' &&
            REGISTER_INPUT_MAP_DATA.map((input) => {
              const isPassword = BASE_PASSWORD_KEYS.includes(
                input.name as keyof TPasswordsZodSchema,
              );
              const isPhone = input.name === 'phoneNumber';
              return (
                <Input
                  key={input.name}
                  label={input.label}
                  inputProps={{
                    name: input.name,
                    type: isPassword
                      ? showPasswords[input.name as keyof TPasswordsZodSchema]
                        ? 'text'
                        : input.type
                      : input.type,
                    placeholder: input.placeholder,
                    autoComplete: input.autoComplete,
                    disabled: registerAndSave.isPending,
                  }}
                  icons={
                    isPhone
                      ? {
                          left: (
                            <span className="text-primary/50 border-r-primary/30 items-center border-r py-2 pr-3 text-[13px] leading-0 capitalize">
                              +91
                            </span>
                          ),
                        }
                      : isPassword
                        ? {
                            right: {
                              icon: showPasswords[input.name as keyof TPasswordsZodSchema]
                                ? 'lucide:eye-off'
                                : 'lucide:eye',
                              onClick: () => {
                                togglePasswordVisibility(input.name as keyof TPasswordsZodSchema);
                              },
                              className: 'cursor-pointer',
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
                    ? sendOtp.isPending
                    : currentStep === 'verify'
                      ? verifyOtp.isPending || resendOtp.isPending
                      : registerAndSave.isPending,
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
