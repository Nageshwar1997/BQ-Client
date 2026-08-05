import { Controller, type UseFormReturn } from 'react-hook-form';

import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';

import type { TSellerDocumentsFormZodSchema } from '../schema/seller.schema';

interface IDocumentsStepProps {
  form: UseFormReturn<TSellerDocumentsFormZodSchema>;
  disabled?: boolean;
}

const DocumentsStep = ({ form, disabled = false }: IDocumentsStepProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <Input
          label="Address line 1"
          inputProps={{
            name: 'pickupAddress.addressLine1',
            placeholder: 'Building, street',
            disabled,
          }}
          register={register('pickupAddress.addressLine1')}
          error={errors.pickupAddress?.addressLine1?.message}
          containerClassName="sm:col-span-2"
        />
        <Input
          label="Address line 2 (optional)"
          inputProps={{
            name: 'pickupAddress.addressLine2',
            placeholder: 'Landmark, area',
            disabled,
          }}
          register={register('pickupAddress.addressLine2')}
          error={errors.pickupAddress?.addressLine2?.message}
          containerClassName="sm:col-span-2"
        />
        <Input
          label="City"
          inputProps={{ name: 'pickupAddress.city', placeholder: 'e.g. Mumbai', disabled }}
          register={register('pickupAddress.city')}
          error={errors.pickupAddress?.city?.message}
        />
        <Input
          label="State"
          inputProps={{ name: 'pickupAddress.state', placeholder: 'e.g. Maharashtra', disabled }}
          register={register('pickupAddress.state')}
          error={errors.pickupAddress?.state?.message}
        />
        <Input
          label="Pincode"
          inputProps={{ name: 'pickupAddress.pincode', placeholder: 'e.g. 400001', disabled }}
          register={register('pickupAddress.pincode')}
          error={errors.pickupAddress?.pincode?.message}
        />
        <Input
          label="Country"
          inputProps={{ name: 'pickupAddress.country', placeholder: 'e.g. India', disabled }}
          register={register('pickupAddress.country')}
          error={errors.pickupAddress?.country?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="idProof"
          render={({ field: { onChange, value } }) => (
            <FileInput
              fileInputProps={{ name: 'idProof', value, onChange, disabled }}
              label="ID proof (Aadhaar / Passport)"
              errors={[errors.idProof?.message]}
            />
          )}
        />
        <Controller
          control={control}
          name="addressProof"
          render={({ field: { onChange, value } }) => (
            <FileInput
              fileInputProps={{ name: 'addressProof', value, onChange, disabled }}
              label="Address proof"
              errors={[errors.addressProof?.message]}
            />
          )}
        />
        <Controller
          control={control}
          name="businessLicense"
          render={({ field: { onChange, value } }) => (
            <FileInput
              fileInputProps={{ name: 'businessLicense', value, onChange, disabled }}
              label="Business license"
              errors={[errors.businessLicense?.message]}
            />
          )}
        />
      </div>
    </div>
  );
};

export default DocumentsStep;
