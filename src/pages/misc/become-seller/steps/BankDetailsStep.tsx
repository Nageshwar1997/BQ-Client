import type { UseFormReturn } from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';
import type { TSellerBankDetailsZodSchema } from '@/schemas/seller.schema';

interface IBankDetailsStepProps {
  form: UseFormReturn<TSellerBankDetailsZodSchema>;
  disabled?: boolean;
}

const BankDetailsStep = ({ form, disabled = false }: IBankDetailsStepProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
      <Input
        label="Account holder name"
        inputProps={{ name: 'accountHolderName', placeholder: 'As per bank records', disabled }}
        register={register('accountHolderName')}
        error={errors.accountHolderName?.message}
        containerClassName="sm:col-span-2"
      />

      <Input
        label="Account number"
        inputProps={{ name: 'accountNumber', placeholder: 'e.g. 000123456789', disabled }}
        register={register('accountNumber')}
        error={errors.accountNumber?.message}
      />

      <Input
        label="IFSC code"
        inputProps={{
          name: 'ifscCode',
          placeholder: 'e.g. HDFC0001234',
          disabled,
          className: 'uppercase',
        }}
        register={register('ifscCode')}
        error={errors.ifscCode?.message}
      />

      <Input
        label="Bank name (optional)"
        inputProps={{ name: 'bankName', placeholder: 'e.g. HDFC Bank', disabled }}
        register={register('bankName')}
        error={errors.bankName?.message}
        containerClassName="sm:col-span-2"
      />
    </div>
  );
};

export default BankDetailsStep;
