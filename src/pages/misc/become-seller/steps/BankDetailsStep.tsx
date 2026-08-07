import type { UseFormReturn } from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';
import { SELLER_BANK_DETAILS_INPUT_MAP_DATA } from '@/constants/input.constants';

import type { TSellerBankDetailsZodSchema } from '../schema/seller.schema';

interface IBankDetailsStepProps {
  form: UseFormReturn<TSellerBankDetailsZodSchema>;
  disabled?: boolean;
}

const BankDetailsStep = ({ form, disabled = false }: IBankDetailsStepProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
      {SELLER_BANK_DETAILS_INPUT_MAP_DATA.map((input) => {
        return (
          <Input
            key={input.name}
            label={input.label}
            inputProps={{
              name: input.name,
              type: input.type,
              placeholder: input.placeholder,
              autoComplete: input.autoComplete,
              disabled,
              ...(input.name === 'ifscCode' && { className: 'not-placeholder-shown:uppercase' }),
            }}
            register={form.register(input.name)}
            error={form.formState.errors[input.name]?.message}
          />
        );
      })}
    </div>
  );
};

export default BankDetailsStep;
