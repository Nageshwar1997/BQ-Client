import { Controller, type UseFormReturn } from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { SELLER_BUSINESS_DETAILS_INPUT_MAP_DATA } from '@/constants/input.constants';

import type { TSellerBusinessDetailsZodSchema } from '../schema/seller.schema';

interface IBusinessDetailsStepProps {
  form: UseFormReturn<TSellerBusinessDetailsZodSchema>;
  disabled?: boolean;
}

const BusinessDetailsStep = ({ form, disabled = false }: IBusinessDetailsStepProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
      {SELLER_BUSINESS_DETAILS_INPUT_MAP_DATA.map((input) => {
        return input.type === 'select' ? (
          <Controller
            key={input.name}
            control={control}
            name={input.name}
            render={({ field }) => (
              <Select
                label={input.label}
                selectProps={{
                  value: field.value,
                  onChange: field.onChange,
                  placeholder: input.placeholder,
                  disabled,
                }}
                options={input.options}
                error={errors[input.name]?.message}
              />
            )}
          />
        ) : (
          <Input
            key={input.name}
            label={input.label}
            inputProps={{
              name: input.name,
              placeholder: input.placeholder,
              disabled,
              className: ['gstin', 'pan'].includes(input.name)
                ? 'not-placeholder-shown:uppercase'
                : '',
            }}
            register={register(input.name)}
            error={errors[input.name]?.message}
          />
        );
      })}
    </div>
  );
};

export default BusinessDetailsStep;
