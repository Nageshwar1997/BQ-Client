import type { TSellerAddressZodSchema } from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { SELLER_ADDRESS_INPUT_MAP_DATA } from '@/constants/input.constants';
import useDebounce from '@/hooks/useDebounce';
import type { ISelectedLocation } from '@/hooks/useLocationPicker';
import { verifyPincodeMatchesState } from '@/utils/olaMaps.util';

import LocationPickerModal from './LocationPickerModal';

interface IAddressStepProps {
  form: UseFormReturn<TSellerAddressZodSchema>;
  disabled?: boolean;
}

const AddressStep = ({ form, disabled = false }: IAddressStepProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Best-effort, non-blocking (mirrors the server-side check in
  // `organization-service`) - `undefined` = couldn't verify either way,
  // never shown as a warning. Only a confirmed `false` shows one, and it
  // never stops the applicant from saving/continuing.
  const [pincodeStateMismatch, setPincodeStateMismatch] = useState(false);

  const runPincodeCheck = useDebounce({
    callback: async (pincode: string, state: TSellerAddressZodSchema['state']) => {
      const matches = await verifyPincodeMatchesState(pincode, state);
      setPincodeStateMismatch(matches === false);
    },
    delay: 600,
  });

  const checkPincodeAgainstState = (pincode: string, state?: TSellerAddressZodSchema['state']) => {
    if (pincode.length !== 6 || !state) {
      setPincodeStateMismatch(false);
      return;
    }

    runPincodeCheck(pincode, state);
  };

  const handleLocationConfirm = (location: ISelectedLocation) => {
    form.setValue('line1', location.line1, { shouldValidate: true, shouldDirty: true });
    if (location.line2) {
      form.setValue('line2', location.line2, { shouldValidate: true, shouldDirty: true });
    }
    if (location.city)
      form.setValue('city', location.city, { shouldValidate: true, shouldDirty: true });
    if (location.state) {
      form.setValue('state', location.state, { shouldValidate: true, shouldDirty: true });
    }
    if (location.pincode) {
      form.setValue('pincode', location.pincode, { shouldValidate: true, shouldDirty: true });
    }
    if (location.country) {
      form.setValue('country', location.country, { shouldValidate: true, shouldDirty: true });
    }

    checkPincodeAgainstState(location.pincode ?? form.getValues('pincode'), location.state);
    setIsPickerOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <Button
        pattern="secondary"
        content="Pick location on map"
        leftIcon={{ icon: 'solar:map-point-linear' }}
        buttonProps={{
          type: 'button',
          disabled: disabled || form.formState.isSubmitting,
          onClick: () => {
            setIsPickerOpen(true);
          },
        }}
        className="w-auto! self-start px-4! py-2.5!"
      />

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
        {SELLER_ADDRESS_INPUT_MAP_DATA.map((input) => {
          if (input.type === 'select') {
            return (
              <Controller
                key={input.name}
                control={form.control}
                name={input.name}
                render={({ field: { onChange, value } }) => (
                  <Select
                    label={input.label}
                    selectProps={{
                      value,
                      onChange: (nextValue) => {
                        onChange(nextValue);
                        if (input.name === 'state') {
                          checkPincodeAgainstState(
                            form.getValues('pincode'),
                            nextValue as TSellerAddressZodSchema['state'],
                          );
                        }
                      },
                      placeholder: input.placeholder,
                      disabled: disabled || form.formState.isSubmitting,
                    }}
                    options={input.options}
                    error={form.formState.errors[input.name]?.message}
                    containerClassName="sm:col-span-3"
                  />
                )}
              />
            );
          }

          return (
            <div key={input.name} className="sm:col-span-3">
              <Input
                label={input.label}
                inputProps={{
                  name: input.name,
                  placeholder: input.placeholder,
                  disabled: disabled || form.formState.isSubmitting,
                  type: input.type,
                  autoComplete: input.autoComplete,
                  onChange:
                    input.name === 'pincode'
                      ? (event) => {
                          checkPincodeAgainstState(event.target.value, form.getValues('state'));
                        }
                      : undefined,
                }}
                register={form.register(input.name)}
                error={form.formState.errors[input.name]?.message}
              />
              {input.name === 'pincode' && pincodeStateMismatch && (
                <p className="text-primary-yellow mt-1.5 flex items-center gap-1 text-xs">
                  <Icon icon="solar:danger-triangle-linear" className="size-3.5 shrink-0" />
                  This pincode doesn&apos;t look like it&apos;s in the selected state - double-check
                  before submitting.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <LocationPickerModal
        isOpen={isPickerOpen}
        onClose={() => {
          setIsPickerOpen(false);
        }}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
};

export default AddressStep;
