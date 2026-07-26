import type { TSetPasswordZodSchema } from '@beautinique/frontend-types';
import { setPasswordZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import BorderGradient from '@/components/layout/containers/BorderGradient';
import AuthBottomInstructions from '@/components/ui/AuthBottomInstructions';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import { PASSWORDS_INPUT_MAP_DATA } from '@/constants/input.constants';
import usePathParams from '@/hooks/usePathParams';
import { useSetPassword } from '@/services/user-service/auth.service.query';
import useUserStore from '@/stores/user.store';
import { setErrorToForm } from '@/utils/form.util';

const SetPassword = () => {
  /* ================= 1. Store Hooks ================= */
  const setUser = useUserStore((s) => s.setUser);

  /* ================= 2. Custom Hooks ================= */
  const { navigate } = usePathParams();

  /* ================= 3. API/Queries Hooks ================= */

  const { isPending, mutateAsync } = useSetPassword();

  /* ================= 4. Forms ================= */

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    setError,
  } = useForm<TSetPasswordZodSchema>({
    resolver: zodResolver(setPasswordZodSchema),
  });

  /* ================= 5. Local State ================= */
  const [showPasswords, setShowPasswords] = useState<Record<keyof TSetPasswordZodSchema, boolean>>({
    password: false,
    confirmPassword: false,
  });

  /* ================= 6. Handlers ================= */

  const handleSetPassword = async (data: TSetPasswordZodSchema) => {
    await mutateAsync(
      { ...data },
      {
        onSuccess: ({ data: user }) => {
          setUser(user ?? null);
          void navigate(-1);
        },
        onError: ({ fieldErrors }) => {
          setErrorToForm(setError, fieldErrors);
        },
      },
    );
  };

  const togglePasswordVisibility = (field: keyof TSetPasswordZodSchema) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /* ================= 7. JSX ================= */

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* ================= HEADER ================= */}
      <GradientText
        type="accent"
        text="Set Password"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />

      {/* ================= FORM CONTAINER ================= */}
      <BorderGradient className="flex flex-col gap-5 lg:gap-6">
        {/* ================= MAIN FORM ================= */}
        <form onSubmit={handleSubmit(handleSetPassword)} className="space-y-5 sm:space-y-6">
          {/* ================= STEP: CHANGE PASSWORD ================= */}
          {PASSWORDS_INPUT_MAP_DATA.map((input) => {
            return (
              <Input
                key={input.name}
                label={input.label}
                inputProps={{
                  name: input.name,
                  type: showPasswords[input.name] ? 'text' : input.type,
                  placeholder: input.placeholder,
                  autoComplete: input.autoComplete,
                  disabled: isPending,
                }}
                icons={{
                  right: {
                    icon: showPasswords[input.name] ? 'lucide:eye-off' : 'lucide:eye',
                    onClick: () => {
                      togglePasswordVisibility(input.name);
                    },
                    className: 'cursor-pointer',
                  },
                }}
                register={register(input.name)}
                error={errors[input.name]?.message}
              />
            );
          })}

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

export default SetPassword;
