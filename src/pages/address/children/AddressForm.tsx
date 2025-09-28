import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../../components/input/Input";
import Radio from "../../../components/input/Radio";
import Select from "../../../components/input/Select";
import { addAddressFormMapData, addressInitialValues } from "../data";
import { addAddressSchema } from "../../../schemas/address";
import z from "zod";
import Button from "../../../components/button/Button";
import { useAddAddress } from "../../../api/address/address.service";
import useQueryParams from "../../../hooks/useQueryParams";

const AddressForm = () => {
  const { mutateAsync } = useAddAddress();
  const { removeParam } = useQueryParams();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof addAddressSchema>>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: addressInitialValues,
  });

  const handleReset = () => {
    reset(addressInitialValues);
  };

  const handleAddAddress = (data: z.infer<typeof addAddressSchema>) => {
    mutateAsync(data, {
      onSuccess: () => {
        removeParam("add");
        handleReset();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddAddress)}
      className="flex flex-col gap-6 mt-2"
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
          type="button"
          onClick={handleReset}
        />
        <Button content="Add Address" pattern="primary" type="submit" />
      </div>
    </form>
  );
};

export default AddressForm;
