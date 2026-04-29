import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TLogin } from '@/types/schema.type';
import { loginSchema } from '@/schemas/user.schema';
import Button from '@/components/ui/Button';
import BorderGradient from '@/components/layout/containers/BorderGradient';
import GradientText from '@/components/ui/GradientText';
import SocialAuth from './components/SocialAuth';
import AuthBottomInstructions from './components/AuthBottomInstructions';
import Input from '@/components/ui/inputs/Input';
import { useManualLogin } from '@/services/user-service/auth.service.query';
import { setErrorToForm } from '@/utils/form.util';
import { LOGIN_INPUT_MAP_DATA, PASSWORD_KEYS } from '@/constants/input.constant';
import { Link } from 'react-router-dom';
import Radio from '@/components/ui/inputs/Radio';

const DEFAULT_VALUES = {
  loginMethod: 'email',
  email: undefined,
  phoneNumber: undefined,
  password: '',
};

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const manualLoginQuery = useManualLogin();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const selectedMethod = useWatch({ control, name: 'loginMethod' });
  console.log('🚀 ~ Login ~ selectedMethod:', selectedMethod);

  const handleManualLogin = async (data: TLogin) => {
    await manualLoginQuery.mutateAsync(data, {
      onError: ({ fieldErrors }) => setErrorToForm(setError, fieldErrors),
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginMethodChange = (method: TLogin['loginMethod']) => {
    reset({
      loginMethod: method,
      email: method === 'email' ? '' : undefined,
      phoneNumber: method === 'phoneNumber' ? '' : undefined,
      password: '',
    });
  };

  console.log('errors', errors);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <GradientText
        type="accent"
        text="Login"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />
      <SocialAuth />
      <BorderGradient className="flex flex-col gap-5 lg:gap-6">
        <form onSubmit={handleSubmit(handleManualLogin)} className="space-y-5 sm:space-y-6">
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
          {/* ================= LOGIN ================= */}
          {LOGIN_INPUT_MAP_DATA.map((input) => {
            const isPassword = PASSWORD_KEYS.includes(input.name);
            const isPhone = input.name === 'phoneNumber';
            const isEmail = input.name === 'email';
            const isEmailSelected = selectedMethod === 'email';
            if (isPhone && isEmailSelected) return null;
            if (isEmail && !isEmailSelected) return null;
            return (
              <Input
                key={input.name}
                label={input.label}
                inputProps={{
                  name: input.name,
                  type: PASSWORD_KEYS.includes(input.name)
                    ? showPassword
                      ? 'text'
                      : input.type
                    : input.type,
                  placeholder: input.placeholder,
                  autoComplete: input.autoComplete,
                  disabled: manualLoginQuery.isPending,
                }}
                icons={
                  input.name === 'phoneNumber'
                    ? { left: '+91' }
                    : isPassword
                      ? {
                          right: {
                            icon: showPassword ? 'lucide:eye-off' : 'lucide:eye',
                            onClick: togglePasswordVisibility,
                          },
                        }
                      : undefined
                }
                register={register(input.name)}
                error={errors[input.name]?.message}
              />
            );
          })}

          {/* ================= BUTTONS ================= */}
          <div className="flex gap-4 sm:col-span-2">
            <Link to="/" className="w-full">
              <Button pattern="secondary" content="Back" />
            </Link>
            <Button
              pattern="primary"
              buttonProps={{ type: 'submit', disabled: manualLoginQuery.isPending }}
              content="Login"
            />
          </div>
        </form>
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
        <AuthBottomInstructions />
      </BorderGradient>
    </div>
  );
};

export default Login;
