import GradientText from '@/components/ui/GradientText';
import AuthBottomInstructions from './AuthBottomInstructions';
import Button from '@/components/ui/Button';
import { applyServerErrorsToFormFields } from '@/utils/form.util';
import type { TRegisterOtp } from '@/types/schema.type';
import { registerOtpSchema } from '@/schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useRegisterResendOtp,
  useRegisterVerifyOtp,
} from '@/services/user-service/auth.service.query';
import { Input } from '@/components/ui/inputs/Input';
import { OTP_INPUT_DATA } from '@/constants/input.constant';
import { Resend } from '@/components/ui/Resend';

const RegisterVerifyOtp = ({
  email,
  otpToken,
  sendCount,
}: {
  email: string;
  otpToken: string;
  sendCount: number;
}) => {
  const { mutateAsync: verifyAsync, isPending: isVerifyPending } = useRegisterVerifyOtp();
  const { mutateAsync: resendAsync, isPending: isResendPending } = useRegisterResendOtp();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(registerOtpSchema),
    defaultValues: { otp: '' },
  });

  const handleVerify = async (data: TRegisterOtp) => {
    await verifyAsync(data, {
      onError: ({ fieldErrors }) => applyServerErrorsToFormFields(setError, fieldErrors),
    });
  };

  const handleResend = async () => {
    if (isVerifyPending || isResendPending) return;
    await resendAsync({ email, otpToken });
  };

  return (
    <form onSubmit={handleSubmit(handleVerify)} className="flex flex-col gap-4">
      <Input
        inputProps={{
          name: OTP_INPUT_DATA.name,
          placeholder: OTP_INPUT_DATA.placeholder,
          autoComplete: OTP_INPUT_DATA.autoComplete,
          type: OTP_INPUT_DATA.type,
          disabled: isVerifyPending || isResendPending,
        }}
        label={OTP_INPUT_DATA.label}
        register={register(OTP_INPUT_DATA.name)}
        error={errors[OTP_INPUT_DATA.name]?.message}
      />
      <Button pattern="secondary" content="Back" />
      <Button
        pattern="primary"
        buttonProps={{ type: 'submit', disabled: isVerifyPending || !isDirty || isResendPending }}
        content={isVerifyPending ? 'Sending...' : 'Send Otp'}
      />
      <Resend label="Not received OTP?" count={60} onResend={handleResend} />
      <AuthBottomInstructions />
    </form>
  );
};

export default RegisterVerifyOtp;
