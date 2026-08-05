import { Controller, type UseFormReturn } from 'react-hook-form';

import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';

import { SELLER_BUSINESS_TYPE_OPTIONS } from '../constants';
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
      <Input
        label="Business name"
        inputProps={{
          name: 'businessName',
          placeholder: 'e.g. Glow & Co.',
          disabled,
        }}
        register={register('businessName')}
        error={errors.businessName?.message}
      />

      <Controller
        control={control}
        name="businessType"
        render={({ field }) => (
          <Select
            label="Business type"
            selectProps={{
              value: field.value,
              onChange: field.onChange,
              placeholder: 'Select business type',
              disabled,
            }}
            options={SELLER_BUSINESS_TYPE_OPTIONS}
            error={errors.businessType?.message}
          />
        )}
      />

      <Input
        label="GSTIN"
        inputProps={{
          name: 'gstin',
          placeholder: 'e.g. 22AAAAA0000A1Z5',
          disabled,
          className: 'uppercase',
        }}
        register={register('gstin')}
        error={errors.gstin?.message}
      />

      <Input
        label="PAN"
        inputProps={{
          name: 'pan',
          placeholder: 'e.g. AAAAA0000A',
          disabled,
          className: 'uppercase',
        }}
        register={register('pan')}
        error={errors.pan?.message}
      />
    </div>
  );
};

export default BusinessDetailsStep;
