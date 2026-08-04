import { AUTH_PROVIDER_MAP } from '@beautinique/frontend-constants';
import type { TChangePasswordZodSchema, TSetPasswordZodSchema } from '@beautinique/frontend-types';
import { changePasswordZodSchema, setPasswordZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import BorderGradient from '@/components/layout/containers/BorderGradient';
import AuthBottomInstructions from '@/components/ui/AuthBottomInstructions';
import Button from '@/components/ui/Button';
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
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* ================= HEADER ================= */}
      <GradientText
        type="accent"
        text={hasManualProvider ? 'Change Password' : 'Set Password'}
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />

      {/* ================= FORM CONTAINER ================= */}
      <BorderGradient className="flex flex-col gap-5 py-6 lg:gap-6">
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
                    right: {
                      icon: showPasswords.change[input.name] ? 'lucide:eye-off' : 'lucide:eye',
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

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4">
            {/* -------- Back / Cancel Button -------- */}
            <Button
              pattern="secondary"
              buttonProps={{ onClick: () => navigate(-1) }}
              content="Cancel"
            />

            {/* -------- Submit Button -------- */}
            <Button
              pattern="primary"
              buttonProps={{ type: 'submit', disabled: isPending || !isDirty }}
              content="Submit"
            />
          </div>
        </form>

        {/* ================= EXTRA INFO ================= */}
        <AuthBottomInstructions />
      </BorderGradient>
    </div>
  );
};

export default UpdatePassword;
