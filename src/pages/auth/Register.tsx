import { useState } from 'react';
import { type FieldErrors, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { emailData, PASSWORD_KEYS, REGISTER_INPUT_MAP_DATA } from '../../constants/input';
import type { IInput, TRegister } from '../../types';
import BottomInstructions from './children/BottomInstructions';
import ProfilePicInput from '../../components/ui/ProfilePicInput';
import GradientText from '../../components/ui/GradientText';
import SocialAuth from './children/SocialAuth';
import { Input } from '../../components/input/Input';
import Button from '../../components/ui/Button';
import { EyeIcon, EyeOffIcon } from '../../icons';
import Checkbox from '../../components/input/Checkbox';
import BorderGradient from '../../components/ui/BorderGradient';
import { getFileFromFileList, saveLocalToken, saveSessionToken } from '../../utils';
import { registerSchema, sendOtpSchema } from '../../schemas';
import { service } from '../../classes';
import { useQueryParams } from '../../hooks';
import Resend from '../../components/ui/Resend';

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
      icons={{
        ...(input.name === 'phoneNumber' && { left: { text: '+91' } }),
        ...(PASSWORD_KEYS.includes(input.name) && {
          right: {
            icon:
              PASSWORD_KEYS.includes(input.name) &&
              (showPasswords[input.name] ? (
                <EyeOffIcon className="fill-primary! h-full opacity-50 hover:opacity-100" />
              ) : (
                <EyeIcon className="fill-primary! h-full opacity-50 hover:opacity-100" />
              )),
            onClick: () => togglePasswordVisibility(input.name),
          },
        }),
      }}
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
    service.auth.VerifyOtpAndRegister();
  const { mutateAsync: resendOtpAsync, isPending: isResendingOtp } = service.auth.ResendOtp();

  const { navigate } = useQueryParams();
  //   const { setUser } = useUserStore();

  const {
    watch,
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
      otp: '',
      password: '',
      phoneNumber: '',
      profilePic: undefined,
      remember: false,
    },
  });

  const profilePicFile = getFileFromFileList(watch('profilePic'));

  const profilePicURL =
    profilePicFile instanceof File ? URL.createObjectURL(profilePicFile) : undefined;

  const onSubmit = async (bodyData: TRegister) => {
    const formData = new FormData();

    formData.append('firstName', bodyData.firstName);
    formData.append('lastName', bodyData.lastName);
    formData.append('email', bodyData.email);
    formData.append('password', bodyData.password);
    formData.append('confirmPassword', bodyData.confirmPassword);
    formData.append('phoneNumber', bodyData.phoneNumber);
    formData.append('otp', bodyData.otp);

    if (profilePicFile) {
      formData.append('profilePic', profilePicFile);
    }
    await verifyOtpAsync(
      { otpToken, data: formData },
      {
        onSuccess: (data) => {
          console.log('data', data);
          if (data.user) {
            // setUser(data.user);
          }
          if (bodyData.remember) {
            saveLocalToken(data?.token);
          } else {
            saveSessionToken(data?.token);
          }

          setTimeout(() => navigate('/'), 500);
        },
      },
    );
  };

  const handleResend = async () => {
    await resendOtpAsync(
      { otpToken, email },
      {
        onError: (error) => {
          if (typeof error === 'string' && (error as string).includes('Go Back')) {
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
        <ProfilePicInput
          className="max-w-24!"
          src={profilePicURL}
          error={errors.profilePic?.message}
          register={register('profilePic')}
          fileInputProps={{ name: 'profilePic' }}
        />
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
        {REGISTER_INPUT_MAP_DATA?.slice(2).map((input, index) => (
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
          rightText="Remember me"
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
  const { mutateAsync, isPending, data, reset } = service.auth.SendOtp();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (bodyData: z.infer<typeof sendOtpSchema>) => {
    await mutateAsync(bodyData.email);
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
                name: emailData.name,
                placeholder: emailData.placeholder,
                autoComplete: emailData.autoComplete,
                type: emailData.type,
                disabled: isPending,
              }}
              label={emailData.label}
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
            <BottomInstructions />
          </form>
        )}
      </BorderGradient>
    </div>
  );
};

export default Register;
