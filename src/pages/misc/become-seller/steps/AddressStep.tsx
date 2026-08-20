import type { TSellerAddressZodSchema } from '@beautinique/frontend-types';
import { Controller, type UseFormReturn } from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { SELLER_ADDRESS_INPUT_MAP_DATA } from '@/constants/input.constants';

interface IAddressStepProps {
  form: UseFormReturn<TSellerAddressZodSchema>;
  disabled?: boolean;
}

const AddressStep = ({ form, disabled = false }: IAddressStepProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
      {SELLER_ADDRESS_INPUT_MAP_DATA.map((input) =>
        input.type === 'select' ? (
          <Controller
            key={input.name}
            control={form.control}
            name={input.name}
            render={({ field: { onChange, value } }) => {
              return (
                <Select
                  label={input.label}
                  selectProps={{
                    value,
                    onChange,
                    placeholder: input.placeholder,
                    disabled: disabled || form.formState.isSubmitting,
                  }}
                  options={input.options}
                  error={form.formState.errors[input.name]?.message}
                  containerClassName="sm:col-span-3"
                />
              );
            }}
          />
        ) : (
          <Input
            key={input.name}
            label={input.label}
            inputProps={{
              name: input.name,
              placeholder: input.placeholder,
              disabled: disabled || form.formState.isSubmitting,
              type: input.type,
              autoComplete: input.autoComplete,
            }}
            register={form.register(input.name)}
            error={form.formState.errors[input.name]?.message}
            containerClassName="sm:col-span-3"
          />
        ),
      )}
    </div>
  );
};

export default AddressStep;
