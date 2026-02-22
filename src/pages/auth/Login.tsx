import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveLocalToken, saveSessionToken } from '../../utils';
import type { TLogin } from '../../types';
import { loginSchema } from '../../schemas';
import { store } from '../../store';
import { Service } from '../../api-service';
import { Hook } from '../../hooks';
import { BorderGradient, Button, Checkbox, GradientText, Input, Radio } from '../../components';
import { LOGIN_INPUT_MAP_DATA } from '../../constants/input';
import { EyeIcon, EyeOffIcon } from '../../icons';
import { BottomInstructions, SocialAuth } from './children';

export const Login = ({ onLoginSuccess }: { onLoginSuccess?: () => void }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { removeParam, queryParams } = Hook.QueryParams();
  const { setUser } = store.user();
  const { mutateAsync, isPending } = Service.Auth.Login();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    register,
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginMethod: 'email',
      email: '',
      phoneNumber: '',
      password: '',
      remember: false,
    },
  });

  const selectedMethod = watch('loginMethod');

  const handleLoginMethodChange = (method: TLogin['loginMethod']) => {
    reset({
      loginMethod: method,
      email: method === 'email' ? '' : undefined,
      phoneNumber: method === 'phoneNumber' ? '' : undefined,
      password: '',
      remember: false,
    });
  };

  const onSubmit = async (bodyData: TLogin) => {
    const finalData: Partial<TLogin> = {
      password: bodyData.password,
    };

    if (bodyData.loginMethod === 'email' && bodyData.email) {
      finalData.email = bodyData.email;
    } else if (bodyData.loginMethod === 'phoneNumber' && bodyData.phoneNumber) {
      finalData.phoneNumber = bodyData.phoneNumber;
    }

    mutateAsync(finalData, {
      onSuccess(data) {
        onLoginSuccess?.();
        if (data.user) {
          setUser(data.user);
        }
        if (bodyData.remember) {
          saveLocalToken(data?.token);
        } else {
          saveSessionToken(data?.token);
        }
        if (queryParams.login === 'true') {
          removeParam('login');
        }
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
      <GradientText
        type="accent"
        text="Login"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />
      <SocialAuth />
      <BorderGradient className="space-y-6">
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
              className="w-40!"
            />
          )}
        />
        <div className="flex flex-col gap-5 lg:gap-6">
          {LOGIN_INPUT_MAP_DATA?.map((item, index) => {
            const isPassword = item.name === 'password';
            const isPhone = item.name === 'phoneNumber';
            const isEmail = item.name === 'email';
            const isEmailSelected = selectedMethod === 'email';
            if (isPhone && isEmailSelected) return null;
            if (isEmail && !isEmailSelected) return null;
            return (
              <div key={index}>
                <Input
                  label={item.label}
                  register={register(item.name)}
                  inputProps={{
                    name: item.name,
                    placeholder: item.placeholder,
                    autoComplete: item.autoComplete,
                    type: isPassword ? (showPassword ? 'text' : item.type) : item.type,
                    disabled: isPending,
                  }}
                  icons={{
                    ...(isPassword && {
                      right: {
                        icon: showPassword ? (
                          <EyeOffIcon className="fill-primary h-full opacity-50 hover:opacity-100" />
                        ) : (
                          <EyeIcon className="fill-primary h-full opacity-50 hover:opacity-100" />
                        ),
                        onClick: () => setShowPassword((prev) => !prev),
                      },
                    }),

                    ...(isPhone && { left: { text: '+91' } }),
                  }}
                  error={errors?.[item.name]?.message}
                />
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Checkbox
              register={register('remember')}
              checkboxProps={{ name: 'remember' }}
              rightText="Remember"
            />
            <GradientText
              text="Forgot Password?"
              type="accent"
              path="/forgot-password"
              className="mr-2 text-[10px] whitespace-nowrap hover:underline sm:text-[13px] md:text-sm"
            />
          </div>
          <Button
            pattern="primary"
            buttonProps={{ type: 'submit', disabled: isPending || !isDirty }}
            content="Login"
          />
        </div>
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
            className="text-sm hover:font-medium md:text-base"
          />
        </div>
        <BottomInstructions />
      </BorderGradient>
    </form>
  );
};
