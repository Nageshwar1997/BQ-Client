import { Controller, useForm } from "react-hook-form";
import Input from "../../../components/input/Input";
import Radio from "../../../components/input/Radio";
import Select from "../../../components/input/Select";
import { STATES_AND_UNION_TERRITORIES } from "../../../constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAddressSchema } from "../../../schemas/address";
import z from "zod";
import Button from "../../../components/button/Button";

const AddressForm = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    // Change it later with IAddress
  } = useForm<z.infer<typeof addAddressSchema>>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      type: "both",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      altPhoneNumber: "",
      city: "",
      country: "India",
      gst: "",
      landmark: "",
      pinCode: "",
      state: "",
    },
  });

  // Change it later with IAddress
  const handleAddAddress = (data: z.infer<typeof addAddressSchema>) => {
    console.log(data);
  };

  console.log("errors", errors);
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
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          label="First Name"
          register={register("firstName")}
          inputProps={{ name: "firstName", type: "text" }}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name"
          register={register("lastName")}
          inputProps={{ name: "lastName", type: "text" }}
          error={errors.lastName?.message}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          label="Phone Number"
          register={register("phoneNumber")}
          inputProps={{ name: "phoneNumber", type: "number" }}
          error={errors.phoneNumber?.message}
        />
        <Input
          label="Alternate Phone Number (Optional)"
          register={register("altPhoneNumber")}
          inputProps={{ name: "altPhoneNumber", type: "number" }}
          error={errors.altPhoneNumber?.message}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          label="Address"
          register={register("address")}
          inputProps={{ name: "address", type: "text" }}
          error={errors.address?.message}
        />
        <Input
          label="Landmark"
          register={register("landmark")}
          inputProps={{ name: "landmark", type: "text" }}
          error={errors.landmark?.message}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          label="City"
          register={register("city")}
          inputProps={{ name: "city", type: "text" }}
          error={errors.city?.message}
        />
        <Input
          label="Email"
          register={register("email")}
          inputProps={{ name: "email", type: "text" }}
          error={errors.email?.message}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          label="Pin Code"
          register={register("pinCode")}
          inputProps={{ name: "pinCode", type: "number" }}
          error={errors.pinCode?.message}
        />
        <Input
          label="GST Number (Optional)"
          register={register("gst")}
          inputProps={{ name: "gst", type: "text" }}
          error={errors.gst?.message}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Select
              label="State/Union Territory"
              options={STATES_AND_UNION_TERRITORIES.map((state) => ({
                name: state,
                value: state,
              }))}
              selectProps={{
                value: field.value,
                onChange: (data) => field.onChange(data.value),
                placeholder: "Select State/Union Territory",
              }}
              optionsClassName="!max-h-60"
              optionsPosition="top"
              error={errors.state?.message}
            />
          )}
        />
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Select
              label="Country"
              options={[{ name: "India", value: "India" }]}
              selectProps={{
                value: field.value,
                onChange: (data) => field.onChange(data.value),
                placeholder: "Select Country",
                disabled: true,
              }}
              optionsClassName="max-h-60"
              optionsPosition="top"
              error={errors.country?.message}
            />
          )}
        />
      </div>
      <Button content="Add Address" pattern="primary" type="submit" />
    </form>
  );
};

export default AddressForm;
