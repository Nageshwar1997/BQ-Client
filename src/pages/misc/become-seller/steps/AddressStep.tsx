import { Controller, type UseFormReturn } from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { SELLER_ADDRESS_INPUT_MAP_DATA } from '@/constants/input.constants';

import type { TSellerAddressZodSchema } from '../schema/seller.schema';

interface IAddressStepProps {
  form: UseFormReturn<TSellerAddressZodSchema>;
  disabled?: boolean;
}

const AddressStep = ({ form, disabled = false }: IAddressStepProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
      {SELLER_ADDRESS_INPUT_MAP_DATA.map((input) =>
        input.type === 'select' ? (
          <Controller
            key={input.name}
            control={control}
            name={input.name}
            render={({ field: { onChange, value } }) => {
              return (
                <Select
                  label={input.label}
                  selectProps={{
                    value,
                    onChange,
                    placeholder: input.placeholder,
                    disabled,
                  }}
                  options={input.options}
                  error={errors[input.name]?.message}
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
              disabled,
              type: input.type,
              autoComplete: input.autoComplete,
            }}
            register={register(input.name)}
            error={errors[input.name]?.message}
            containerClassName="sm:col-span-3"
          />
        ),
      )}
    </div>
  );
};

export default AddressStep;
