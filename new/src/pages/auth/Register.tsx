import { useState } from 'react';
import { type FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TRegister, TRegisterEmail } from '@/types/schema.type';
import { registerSchema } from '@/schemas/user.schema';
import Button from '@/components/ui/Button';
import BorderGradient from '@/components/layout/containers/BorderGradient';
import GradientText from '@/components/ui/GradientText';
import SocialAuth from './components/SocialAuth';
import AuthBottomInstructions from './components/AuthBottomInstructions';
import {
  EMAIL_INPUT_DATA,
  PASSWORD_KEYS,
  REGISTER_INPUT_MAP_DATA,
} from '@/constants/input.constant';
import type { IInput } from '@/types/input.type';
import { Input } from '@/components/ui/inputs/Input';
import { saveLocalToken, saveSessionToken } from '@/utils/common.util';
import { Resend } from '@/components/ui/Resend';
import { Checkbox } from '@/components/ui/inputs/Checkbox';
import { applyServerErrorsToFormFields } from '@/utils/form.util';

type TRegisterInput = {
  input: (typeof REGISTER_INPUT_MAP_DATA)[number];
  isPending: boolean;
  errors: FieldErrors<TRegister>;
  register: IInput['register'];
};

const RegisterInput = ({ input, register, isPending, errors }: TRegisterInput) => {
  const [showPasswords, setShowPasswords] = useState<Partial<Record<keyof TRegister, boolean>>>({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: keyof TRegister) => {
    if (!PASSWORD_KEYS.includes(field)) return;
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  return (
    <Input
      inputProps={{
        name: input.name,
        placeholder: input.placeholder,
        autoComplete: input.autoComplete,
        type: PASSWORD_KEYS.includes(input.name)
          ? showPasswords[input.name]
            ? 'text'
            : input.type
          : input.type,
        disabled: isPending,
      }}
      label={input.label}
      register={register}
      error={errors[input.name]?.message}
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
    />
  );
};

const RegisterForm = ({
  otpToken = '',
  email = '',
  onReset,
}: {
  otpToken: string;
  email: string;
  onReset?: () => void;
}) => {
  const { mutateAsync: verifyOtpAsync, isPending: isVerifyingOtp } =
    Service.Auth.VerifyOtpAndRegister();
  const { mutateAsync: resendOtpAsync, isPending: isResendingOtp } = Service.Auth.ResendOtp();

  const { setUser } = UserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      confirmPassword: '',
      email,
      firstName: '',
      lastName: '',
      password: '',
      phoneNumber: '',
      remember: false,
    },
  });

  const onSubmit = async (bodyData: TRegister) => {
    const formData = new FormData();

    formData.append('firstName', bodyData.firstName);
    formData.append('lastName', bodyData.lastName);
    formData.append('email', bodyData.email);
    formData.append('password', bodyData.password);
    formData.append('confirmPassword', bodyData.confirmPassword);
    formData.append('phoneNumber', bodyData.phoneNumber);

    await verifyOtpAsync(
      { otpToken, data: formData },
      {
        onSuccess: (data) => {
          if (data.user) {
            setUser(data.user);
          }
          if (bodyData.remember) {
            saveLocalToken(data?.token);
          } else {
            saveSessionToken(data?.token);
          }
        },
      },
    );
  };

  const handleResend = async () => {
    await resendOtpAsync(
      { otpToken, email },
      {
        onError: ({ statusCode }) => {
          if (statusCode === 410) {
            onReset?.();
          }
        },
      },
    );
  };

  const isPending = isVerifyingOtp || isResendingOtp;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 pt-2.5 pb-2">
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          {REGISTER_INPUT_MAP_DATA?.slice(0, 2).map((input, index) => (
            <RegisterInput
              key={index}
              register={register(input.name)}
              errors={errors}
              input={input}
              isPending={isPending}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 lg:grid-cols-2 lg:gap-y-6">
        {REGISTER_INPUT_MAP_DATA.slice(2).map((input, index) => (
          <div
            key={index}
            className={`${
              !['firstName', 'lastName', ...PASSWORD_KEYS].includes(input.name)
                ? 'lg:col-span-2'
                : ''
            }`}
          >
            <RegisterInput
              register={register(input.name)}
              errors={errors}
              input={input}
              isPending={isPending}
            />
          </div>
        ))}
      </div>
      <Resend
        label="Not received OTP?"
        count={60}
        onResend={!isPending ? handleResend : undefined}
      />
      <div className="space-y-3">
        <Checkbox
          register={register('remember')}
          checkboxProps={{ name: 'remember' }}
          content="Remember me"
        />
        <div className="flex gap-4">
          <Button
            pattern="secondary"
            buttonProps={{ type: 'button', disabled: isPending, onClick: onReset }}
            content="Go Back"
          />
          <Button
            pattern="primary"
            buttonProps={{ type: 'submit', disabled: isPending || !isDirty }}
            content={isPending ? 'Submitting...' : 'Submit'}
          />
        </div>
      </div>
    </form>
  );
};

const Register = () => {
  const { mutateAsync, isPending, data, reset } = Service.Auth.SendOtp();

  const {
    watch,
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: TRegisterEmail) => {
    await mutateAsync(data, {
      onError: ({ fieldErrors }) => applyServerErrorsToFormFields(setError, fieldErrors),
    });
  };
  const email = watch('email');
  const detailsPage = !!(data?.otpToken && email);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <GradientText
        type="accent"
        text="Register"
        className="mx-auto text-2xl leading-tight font-semibold sm:text-3xl md:text-4xl lg:text-5xl"
      />
      {!detailsPage && <SocialAuth />}
      <BorderGradient>
        {detailsPage ? (
          <RegisterForm otpToken={data.otpToken} email={email} onReset={reset} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              inputProps={{
                name: EMAIL_INPUT_DATA.name,
                placeholder: EMAIL_INPUT_DATA.placeholder,
                autoComplete: EMAIL_INPUT_DATA.autoComplete,
                type: EMAIL_INPUT_DATA.type,
                disabled: isPending,
              }}
              label={EMAIL_INPUT_DATA.label}
              register={register('email')}
              error={errors.email?.message}
            />
            <Button
              pattern="primary"
              buttonProps={{ type: 'submit', disabled: isPending || !isDirty }}
              content={isPending ? 'Sending...' : 'Send Otp'}
            />
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
          </form>
        )}
      </BorderGradient>
    </div>
  );
};

export default Register;
