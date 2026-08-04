import { AUTH_PROVIDER_MAP } from '@beautinique/frontend-constants';
import type { TChangePasswordZodSchema, TSetPasswordZodSchema } from '@beautinique/frontend-types';
import { changePasswordZodSchema, setPasswordZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import BorderGradient from '@/components/layout/containers/BorderGradient';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import AuthBottomInstructions from '@/components/ui/AuthBottomInstructions';
import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import {
  BASE_PASSWORDS_VISIBILITY,
  CHANGE_PASSWORD_INPUT_MAP_DATA,
  PASSWORDS_INPUT_MAP_DATA,
} from '@/constants/input.constants';
import usePathParams from '@/hooks/usePathParams';
import { useChangePassword, useSetPassword } from '@/services/user-service/user.service.query';
import useUserStore from '@/stores/user.store';
import { setErrorToForm } from '@/utils/form.util';

const SECURITY_HIGHLIGHTS = [
  { icon: 'solar:lock-keyhole-linear', text: 'Encrypted' },
  { icon: 'solar:eye-closed-linear', text: 'Private' },
  { icon: 'solar:shield-check-linear', text: 'Secure' },
] as const;

// Accounts with a MANUAL provider already have a password, so they change it.
// OAuth-only accounts (Google/LinkedIn/GitHub, no MANUAL provider) never set one, so they set it.
const UpdatePassword = () => {
  /* ================= 1. Store Hooks ================= */
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const hasManualProvider = !!user?.providers.includes(AUTH_PROVIDER_MAP.MANUAL);

  /* ================= 2. Custom Hooks ================= */
  const { navigate } = usePathParams();

  /* ================= 3. API/Queries Hooks ================= */

  const changePassword = useChangePassword();
  const setPassword = useSetPassword();

  const isPending = hasManualProvider ? changePassword.isPending : setPassword.isPending;

  /* ================= 4. Forms ================= */

  const changePasswordForm = useForm<TChangePasswordZodSchema>({
    resolver: zodResolver(changePasswordZodSchema),
  });

  const setPasswordForm = useForm<TSetPasswordZodSchema>({
    resolver: zodResolver(setPasswordZodSchema),
  });

  /* ================= 5. Local State ================= */
  const [showPasswords, setShowPasswords] = useState<{
    change: Record<keyof TChangePasswordZodSchema, boolean>;
    set: Record<keyof TSetPasswordZodSchema, boolean>;
  }>({
    change: { ...BASE_PASSWORDS_VISIBILITY, currentPassword: false },
    set: BASE_PASSWORDS_VISIBILITY,
  });

  /* ================= 6. Handlers ================= */

  const handleChangePassword = async (data: TChangePasswordZodSchema) => {
    await changePassword.mutateAsync(data, {
      onSuccess: ({ data: user }) => {
        if (user) {
          setUser(user);
          void navigate(-1);
        }
      },
      onError: ({ fieldErrors }) => {
        setErrorToForm(changePasswordForm.setError, fieldErrors);
      },
    });
  };
  const handleSetPassword = async (data: TSetPasswordZodSchema) => {
    await setPassword.mutateAsync(data, {
      onSuccess: ({ data: user }) => {
        if (user) {
          setUser(user);
          void navigate(-1);
        }
      },
      onError: ({ fieldErrors }) => {
        setErrorToForm(setPasswordForm.setError, fieldErrors);
      },
    });
  };

  /* ================= 7. CONSTANTS ================= */
  const isDirty = hasManualProvider
    ? changePasswordForm.formState.isDirty
    : setPasswordForm.formState.isDirty;

  return (
    <div className="relative flex w-full gap-4 p-4 outline-hidden lg:h-[87dvh]">
      {/* ================= FORM PANEL ================= */}
      <ScrollableGradientContainer direction="vertical" className="mx-auto max-w-lg">
        <div className="mx-auto flex w-full flex-col items-center gap-6 p-4 sm:p-6">
          {/* ================= HEADER ================= */}
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="bg-accent-duo shadow-secondary-btn flex size-14 items-center justify-center rounded-full sm:size-16">
              <Icon
                icon={hasManualProvider ? 'solar:lock-password-linear' : 'solar:shield-plus-linear'}
                className="size-7 text-white sm:size-8"
              />
            </span>
            <GradientText
              type="accent"
              text={hasManualProvider ? 'Change Password' : 'Set Password'}
              className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl"
            />
            <p className="text-secondary max-w-sm text-xs sm:text-sm">
              {hasManualProvider
                ? 'Update your password regularly to keep your account safe and secure.'
                : 'You signed in with a social account — set a password so you can also log in with your email.'}
            </p>
          </div>

          {/* ================= FORM CONTAINER ================= */}
          <BorderGradient className="flex flex-col gap-5 py-6 lg:gap-6" containerClassName="w-full">
            {/* ================= MAIN FORM ================= */}
            <form
              onSubmit={
                hasManualProvider
                  ? changePasswordForm.handleSubmit(handleChangePassword)
                  : setPasswordForm.handleSubmit(handleSetPassword)
              }
              className="space-y-5 sm:space-y-6"
            >
              {/* ================= STEP: PASSWORD FIELDS ================= */}
              <div className="flex flex-col gap-4 sm:gap-5">
                {hasManualProvider
                  ? CHANGE_PASSWORD_INPUT_MAP_DATA.map((input) => (
                      <Input
                        key={input.name}
                        label={input.label}
                        inputProps={{
                          name: input.name,
                          type: showPasswords.change[input.name] ? 'text' : input.type,
                          placeholder: input.placeholder,
                          autoComplete: input.autoComplete,
                          disabled: isPending,
                        }}
                        icons={{
                          left: {
                            icon: 'solar:lock-keyhole-minimalistic-linear',
                            className: 'text-primary/40',
                          },
                          right: {
                            icon: showPasswords.change[input.name]
                              ? 'lucide:eye-off'
                              : 'lucide:eye',
                            onClick: () => {
                              setShowPasswords((prev) => ({
                                ...prev,
                                set: { ...prev.set, [input.name]: !prev.change[input.name] },
                              }));
                            },
                            className: 'cursor-pointer',
                          },
                        }}
                        register={changePasswordForm.register(input.name)}
                        error={changePasswordForm.formState.errors[input.name]?.message}
                      />
                    ))
                  : PASSWORDS_INPUT_MAP_DATA.map((input) => (
                      <Input
                        key={input.name}
                        label={input.label}
                        inputProps={{
                          name: input.name,
                          type: showPasswords.set[input.name] ? 'text' : input.type,
                          placeholder: input.placeholder,
                          autoComplete: input.autoComplete,
                          disabled: isPending,
                        }}
                        icons={{
                          left: {
                            icon: 'solar:lock-keyhole-minimalistic-linear',
                            className: 'text-primary/40',
                          },
                          right: {
                            icon: showPasswords.set[input.name] ? 'lucide:eye-off' : 'lucide:eye',
                            onClick: () => {
                              setShowPasswords((prev) => ({
                                ...prev,
                                set: { ...prev.set, [input.name]: !prev.set[input.name] },
                              }));
                            },
                            className: 'cursor-pointer',
                          },
                        }}
                        register={setPasswordForm.register(input.name)}
                        error={setPasswordForm.formState.errors[input.name]?.message}
                      />
                    ))}
              </div>

              {/* ================= PASSWORD TIP ================= */}
              <div className="border-primary/10 bg-secondary-invert flex items-start gap-2.5 rounded-xl border p-3">
                <Icon
                  icon="solar:shield-check-linear"
                  className="text-primary-green mt-0.5 size-4.5 shrink-0"
                />
                <p className="text-secondary text-[11px] leading-relaxed sm:text-xs">
                  Use at least 8 characters with a mix of letters, numbers, and symbols for a
                  stronger password.
                </p>
              </div>

              <Divider />

              {/* ================= ACTION BUTTONS ================= */}
              <div className="flex gap-4">
                {/* -------- Back / Cancel Button -------- */}
                <Button
                  pattern="secondary"
                  buttonProps={{ onClick: () => navigate(-1) }}
                  content="Cancel"
                  leftIcon={{ icon: 'lucide:arrow-left' }}
                />

                {/* -------- Submit Button -------- */}
                <Button
                  pattern="primary"
                  buttonProps={{ type: 'submit', disabled: isPending || !isDirty }}
                  content="Submit"
                  rightIcon={{ icon: 'solar:check-circle-linear' }}
                />
              </div>
            </form>

            {/* ================= EXTRA INFO ================= */}
            <AuthBottomInstructions />
          </BorderGradient>
        </div>
      </ScrollableGradientContainer>

      {/* ================= RIGHT SHOWCASE PANEL ================= */}
      <div className="from-blue-crayola-c via-dodger-blue-c hidden w-full rounded-2xl -bg-linear-90 to-transparent lg:flex lg:flex-col lg:items-center lg:justify-between lg:gap-6 lg:p-8">
        {/* -------- Copy -------- */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            {hasManualProvider ? 'Keep Your Account Secure' : 'One Password, One Login'}
          </h1>
          <p className="max-w-sm text-sm text-white/80 sm:text-base">
            {hasManualProvider
              ? 'A strong, regularly updated password is your first line of defense on Beautinique.'
              : 'Set a password once, and sign in with either your email or your social account, whichever you prefer.'}
          </p>
        </div>

        {/* -------- Illustration -------- */}
        <img
          src="/images/auth/auth-left-side.webp"
          className="max-h-[45dvh] w-auto object-contain drop-shadow-2xl"
          alt="Account security illustration"
          loading="eager"
          fetchPriority="high"
        />

        {/* -------- Trust Highlights -------- */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SECURITY_HIGHLIGHTS.map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:text-sm"
            >
              <Icon icon={item.icon} className="size-4 shrink-0" />
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
