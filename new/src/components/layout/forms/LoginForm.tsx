import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import Radio from '@/components/ui/inputs/Radio';
import { FORM_DEFAULT_VALUES } from '@/constants/form.constants';
import { LOGIN_INPUT_MAP_DATA, PASSWORD_KEYS } from '@/constants/input.constant';
import AuthBottomInstructions from '@/pages/auth/components/AuthBottomInstructions';
import SocialAuth from '@/pages/auth/components/SocialAuth';
import { loginSchema } from '@/schemas/user.schema';
import { useManualLogin } from '@/services/user-service/auth.service.query';
import useUserStore from '@/stores/user.store';
import type { TLogin } from '@/types/schema.type';
import { setErrorToForm } from '@/utils/form.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import BorderGradient from '../containers/BorderGradient';

const LoginForm = () => {
  /* ================= 1. External / Store Hooks ================= */
  const setUser = useUserStore((s) => s.setUser);

  /* ================= 2. API / Query Hooks ================= */
  const { isPending, mutateAsync } = useManualLogin();

  /* ================= 3. Form Hooks ================= */
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: FORM_DEFAULT_VALUES.login,
  });

  const selectedMethod = useWatch({ control, name: 'loginMethod' });

  /* ================= 4. Local State ================= */
  const [showPassword, setShowPassword] = useState<boolean>(false);

  /* ================= 5. Handlers ================= */

  // -------- Handle Login Submit --------
  const handleManualLogin = async (data: TLogin) => {
    await mutateAsync(data, {
      onSuccess: ({ user }) => setUser(user),
      onError: ({ fieldErrors }) => setErrorToForm(setError, fieldErrors),
    });
  };

  // -------- Toggle Password Visibility --------
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // -------- Handle Login Method Change (Email / Phone) --------
  const handleLoginMethodChange = (method: TLogin['loginMethod']) => {
    reset({
      loginMethod: method,
      email: method === 'email' ? '' : undefined,
      phoneNumber: method === 'phoneNumber' ? '' : undefined,
      password: '',
    });
  };

  /* ================= 6. JSX ================= */
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* ================= HEADER ================= */}
      <GradientText
        type="accent"
        text="Login"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />

      {/* ================= SOCIAL AUTH ================= */}
      <SocialAuth />

      {/* ================= FORM CONTAINER ================= */}
      <BorderGradient className="flex flex-col gap-5 lg:gap-6">
        {/* ================= MAIN FORM ================= */}
        <form onSubmit={handleSubmit(handleManualLogin)} className="space-y-5 sm:space-y-6">
          {/* -------- Login Method Toggle (Radio) -------- */}
          <Controller
            name="loginMethod"
            control={control}
            render={({ field }) => (
              <Radio
                value={field.value}
                onChange={(value) => {
                  handleLoginMethodChange(value);
                  field.onChange(value);
                }}
                options={[
                  { label: 'Email', value: 'email' },
                  { label: 'Phone', value: 'phoneNumber' },
                ]}
                className="w-50!"
                error={errors.loginMethod?.message}
              />
            )}
          />

          {/* ================= INPUTS ================= */}
          {LOGIN_INPUT_MAP_DATA.map((input) => {
            const isPassword = PASSWORD_KEYS.includes(input.name);
            const isPhone = input.name === 'phoneNumber';
            const isEmail = input.name === 'email';
            const isEmailSelected = selectedMethod === 'email';

            // -------- Conditional Rendering --------
            if (isPhone && isEmailSelected) return null;
            if (isEmail && !isEmailSelected) return null;

            return (
              <Input
                key={input.name}
                label={input.label}
                inputProps={{
                  name: input.name,
                  type: isPassword ? (showPassword ? 'text' : input.type) : input.type,
                  placeholder: input.placeholder,
                  autoComplete: input.autoComplete,
                  disabled: isPending,
                }}
                icons={
                  isPhone
                    ? { left: '+91' }
                    : isPassword
                      ? {
                          right: {
                            icon: showPassword ? 'lucide:eye-off' : 'lucide:eye',
                            onClick: togglePasswordVisibility,
                            className: 'cursor-pointer',
                          },
                        }
                      : undefined
                }
                register={register(input.name)}
                error={errors[input.name]?.message}
              />
            );
          })}

          <p className="inline-flex w-full justify-end pr-2">
            <GradientText
              text="Forgot Password?"
              type="accent"
              path="/auth/forgot-password"
              className="text-xs font-semibold whitespace-nowrap hover:underline"
            />
          </p>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-4 sm:col-span-2">
            {/* -------- Back Button -------- */}
            <Link to="/" className="w-full">
              <Button pattern="secondary" content="Back" />
            </Link>

            {/* -------- Submit Button -------- */}
            <Button
              pattern="primary"
              buttonProps={{ type: 'submit', disabled: isPending }}
              content="Login"
            />
          </div>
        </form>

        {/* ================= FOOTER ================= */}
        <div className="flex items-center justify-center gap-2">
          <GradientText
            text="Don't have an account?"
            type="silver"
            className="text-xs md:text-sm"
          />
          <GradientText
            text="Register"
            type="accent"
            path="/auth/register"
            className="text-xs font-semibold md:text-sm"
          />
        </div>

        {/* ================= EXTRA INFO ================= */}
        <AuthBottomInstructions />
      </BorderGradient>
    </div>
  );
};

export default LoginForm;
