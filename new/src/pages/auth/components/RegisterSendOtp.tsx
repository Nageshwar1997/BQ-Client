import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerEmailSchema } from '@/schemas/user.schema';
import { applyServerErrorsToFormFields } from '@/utils/form.util';
import type { TRegisterEmail } from '@/types/schema.type';
import { Input } from '@/components/ui/inputs/Input';
import { EMAIL_INPUT_DATA } from '@/constants/input.constant';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import AuthBottomInstructions from './AuthBottomInstructions';
import { useRegisterSendOtp } from '@/services/user-service/auth.service.query';

const RegisterSendOtp = () => {
  const { mutateAsync, isPending } = useRegisterSendOtp();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: TRegisterEmail) => {
    await mutateAsync(data, {
      onError: ({ fieldErrors }) => applyServerErrorsToFormFields(setError, fieldErrors),
    });
  };

  return (
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
        register={register(EMAIL_INPUT_DATA.name)}
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
  );
};

export default RegisterSendOtp;
