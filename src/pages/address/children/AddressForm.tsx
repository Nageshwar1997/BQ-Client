import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../../components/input/Input";
import Radio from "../../../components/input/Radio";
import Select from "../../../components/input/Select";
import { addAddressFormMapData, addressInitialValues } from "../data";
import { addressSchema } from "../../../schemas/address";
import z from "zod";
import Button from "../../../components/button/Button";
import {
  useAddAddress,
  useUpdateAddress,
} from "../../../api/address/address.service";
import useQueryParams from "../../../hooks/useQueryParams";
import { ClassName, IAddress, IBaseAddress } from "../../../types";
import { deepEqual } from "../../../utils";
import { toastErrorMessage } from "../../../utils/toasts";

const AddressForm = ({
  addresses,
  className = "",
}: { addresses?: IAddress[] } & ClassName) => {
  const { mutateAsync: addAddress } = useAddAddress();
  const { mutateAsync: updateAddress } = useUpdateAddress();
  const { removeParam, queryParams } = useQueryParams();

  const address =
    addresses?.find((a) => a._id === queryParams.edit) || addressInitialValues;

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: address,
  });

  const handleReset = (defaultValues?: z.infer<typeof addressSchema>) => {
    reset(
      defaultValues
        ? defaultValues
        : queryParams.edit
        ? address
        : addressInitialValues
    );
  };

  const handleAddAddress = (data: z.infer<typeof addressSchema>) => {
    if ("_id" in address && address?._id) {
      const changedFields: Partial<IBaseAddress> = {};
      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof IBaseAddress;
        if (!deepEqual(data[typedKey], address[typedKey])) {
          changedFields[typedKey] = data[typedKey];
        }
      });

      const removedOptionalFields: (keyof Pick<
        IBaseAddress,
        "altPhoneNumber" | "gst" | "landmark"
      >)[] = [];
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
        toastErrorMessage("No changes made to update address!");
        return;
      }

      updateAddress(
        {
          _id: address._id,
          ...(removedOptionalFields.length > 0 && { removedOptionalFields }),
          ...changedFields,
        },
        {
          onSuccess: () => (
            removeParam("edit"), handleReset(addressInitialValues)
          ),
        }
      );
    } else {
      const finalizedData = data;
      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof IBaseAddress;
        if (data[typedKey]) {
          finalizedData[typedKey] = data[typedKey];
        } else {
          delete finalizedData[typedKey];
        }
      });
      addAddress(finalizedData, {
        onSuccess: () => (removeParam("add"), handleReset()),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddAddress)}
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
              { label: "Billing", value: "billing" },
              { label: "Both", value: "both" },
              { label: "Shipping", value: "shipping" },
            ]}
            className="max-w-sm"
          />
        )}
      />
      <hr className="h-px block border-none bg-gradient-line" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        {addAddressFormMapData?.map((input, index) => {
          const { name, placeholder, autoComplete, options, label, type } =
            input;
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
                    value,
                    onChange,
                    placeholder,
                    autoComplete,
                    disabled: name === "country",
                  }}
                  optionsClassName="!max-h-60"
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
      <hr className="h-px block border-none bg-gradient-line" />
      <div className="flex items-center justify-between gap-4">
        <Button
          content="Reset"
          pattern="secondary"
          buttonProps={{ type: "button", onClick: () => handleReset() }}
        />
        <Button
          content={queryParams.edit ? "Update" : "Add Address"}
          pattern="primary"
          buttonProps={{ type: "submit" }}
        />
      </div>
    </form>
  );
};

export default AddressForm;
