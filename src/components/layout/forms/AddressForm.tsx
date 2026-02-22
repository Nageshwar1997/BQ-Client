import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { store } from '../../../store';
import { Service } from '../../../api-service';
import type { IAddress, TAddress, TClassName } from '../../../types';
import { Hook } from '../../../hooks';
import { ADD_ADDRESS_INPUT_MAP_DATA, ADDRESS_DEFAULT_VALUES } from '../../../constants';
import { addressSchema } from '../../../schemas';
import { deepEqual, toaster } from '../../../utils';
import { Button, Checkbox, HR, Input, Radio } from '../../ui';
import Select from '../../ui/Input/Select';

export const AddressForm = ({
  addresses,
  className = '',
}: { addresses?: IAddress[] } & TClassName) => {
  const { user, authenticated } = store.user();
  const { mutateAsync: addAddress } = Service.Address.AddAddress();
  const { mutateAsync: updateAddress } = Service.Address.UpdateAddress();
  const { removeParam, queryParams } = Hook.QueryParams();

  const defaultAddressValues: TAddress = useMemo(() => {
    return {
      ...ADDRESS_DEFAULT_VALUES,
      ...(authenticated && {
        firstName: user?.firstName,
        lastName: user?.lastName,
        phoneNumber: user?.phoneNumber,
        email: user?.email,
      }),
    };
  }, [authenticated, user]);

  const address = (addresses?.find((a) => a._id === queryParams.edit) ||
    defaultAddressValues) as TAddress;

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: address,
  });

  const handleReset = (defaultValues?: TAddress) => {
    reset(defaultValues ? defaultValues : queryParams.edit ? address : defaultAddressValues);
  };

  const handleSubmitAddress = (data: TAddress) => {
    if ('_id' in address && address?._id && typeof address._id === 'string') {
      const changedFields: Partial<TAddress> = {};
      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof TAddress;
        if (!deepEqual(data[typedKey], address[typedKey])) {
          (changedFields[typedKey] as unknown) = data[typedKey];
        }
      });

      const removedOptionalFields: (keyof Pick<TAddress, 'altPhoneNumber' | 'gst' | 'landmark'>)[] =
        [];
      const changedOptionalFields = {
        altPhoneNumber: changedFields.altPhoneNumber,
        landmark: changedFields.landmark,
        gst: changedFields.gst,
      };

      Object.keys(changedOptionalFields).forEach((key) => {
        const typedKey = key as keyof typeof changedOptionalFields;
        if (!changedOptionalFields[typedKey] && address[typedKey]) {
          delete changedFields[typedKey];
          removedOptionalFields.push(typedKey);
        }
      });

      if (!Object.keys(changedFields).length && !removedOptionalFields.length) {
        toaster('error', 'No changes made to update address!');
        return;
      }

      updateAddress(
        {
          _id: address._id,
          ...changedFields,
          ...(removedOptionalFields.length > 0 && { removedOptionalFields }),
        },
        { onSuccess: () => (removeParam('edit'), handleReset(defaultAddressValues)) },
      );
    } else {
      const finalizedData = data;
      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof TAddress;
        if (data[typedKey]) {
          (finalizedData[typedKey] as unknown) = data[typedKey];
        } else {
          delete finalizedData[typedKey];
        }
      });
      addAddress(finalizedData, {
        onSuccess: () => (removeParam('add'), handleReset()),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitAddress)}
      className={`flex flex-col gap-6 ${className}`}
    >
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Radio
            value={field.value}
            onChange={(value) => field.onChange(value)}
            options={[
              { label: 'Billing', value: 'billing' },
              { label: 'Both', value: 'both' },
              { label: 'Shipping', value: 'shipping' },
            ]}
            className="max-w-sm"
          />
        )}
      />
      <HR />
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        {ADD_ADDRESS_INPUT_MAP_DATA.map((input, index) => {
          const { name, placeholder, autoComplete, options, label, type } = input;
          return options ? (
            <Controller
              key={index}
              name={name}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  label={label}
                  options={options}
                  selectProps={{
                    name,
                    value: value?.toString(),
                    onChange,
                    placeholder,
                    autoComplete,
                    disabled: name === 'country',
                  }}
                  optionsClassName="max-h-60!"
                  optionsPosition="top"
                  error={errors?.[name]?.message}
                />
              )}
            />
          ) : (
            <Input
              key={index}
              label={label}
              register={register(name)}
              inputProps={{ name, type, autoComplete, placeholder }}
              error={errors?.[name]?.message}
            />
          );
        })}
      </div>
      <Checkbox
        register={register('isDefaultAddress')}
        checkboxProps={{ name: 'isDefaultAddress' }}
        rightText="Make this my default address"
      />
      <HR />
      <div className="flex items-center justify-between gap-4">
        <Button
          content="Reset"
          pattern="secondary"
          buttonProps={{ type: 'button', onClick: () => handleReset() }}
        />
        <Button
          content={queryParams.edit ? 'Update' : 'Add Address'}
          pattern="primary"
          buttonProps={{ type: 'submit' }}
        />
      </div>
    </form>
  );
};
