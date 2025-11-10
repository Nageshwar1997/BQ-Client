import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import * as z from "zod";
import {
  ALLOWED_BUSINESSES,
  ALLOWED_COUNTRIES,
  STATES_AND_UNION_TERRITORIES,
} from "../../constants";
import Input from "../../components/input/Input";
import Select from "../../components/input/Select";
import Checkbox from "../../components/input/Checkbox";
import { becomeSellerSchema } from "../../schemas/seller";
import { TPasswordField } from "../../types";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "../../icons";

const BecomeSeller = () => {
  const [showPasswords, setShowPasswords] = useState<
    Record<TPasswordField, boolean>
  >({
    password: false,
    confirmPassword: false,
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof becomeSellerSchema>>({
    resolver: zodResolver(becomeSellerSchema),
  });

  const onSubmit = (data: z.infer<typeof becomeSellerSchema>) => {
    // TODO: Send data to backend API
    console.log("Seller data:", data);
    alert("Form submitted successfully!");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Become a Seller</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-full h-0.5 bg-accent-duo rounded-full" />
          <div className="w-fit px-5 whitespace-nowrap text-lg text-primary">
            Personal Details
          </div>
          <div className="w-full h-0.5 bg-accent-duo rounded-full -scale-x-100" />
        </div>
        <Input
          label="Full Name"
          inputProps={{
            name: "personalDetails.name",
            type: "text",
            placeholder: "Enter your full name",
          }}
          register={register("personalDetails.name")}
          error={errors.personalDetails?.name?.message}
        />
        <Input
          label="Personal Email"
          inputProps={{
            name: "personalDetails.email",
            type: "text",
            placeholder: "Enter your email address",
          }}
          register={register("personalDetails.email")}
          error={errors.personalDetails?.email?.message}
        />
        <Input
          label="Personal Number"
          inputProps={{
            name: "personalDetails.phoneNumber",
            type: "number",
            placeholder: "Enter your phone number",
          }}
          register={register("personalDetails.phoneNumber")}
          error={errors.personalDetails?.phoneNumber?.message}
          icons={{ left: { text: "+91" } }}
        />
        <Input
          label="Password"
          inputProps={{
            name: "personalDetails.password",
            type: "text",
            placeholder: "Enter new password",
          }}
          icons={{
            right: {
              icon: showPasswords.password ? (
                <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
              ) : (
                <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
              ),
              onClick: () =>
                setShowPasswords((prev) => ({
                  ...prev,
                  password: !prev.password,
                })),
            },
          }}
          register={register("personalDetails.password")}
          error={errors.personalDetails?.password?.message}
        />
        <Input
          label="Confirm Password"
          inputProps={{
            name: "personalDetails.confirmPassword",
            type: "text",
            placeholder: "Enter confirm password",
          }}
          icons={{
            right: {
              icon: showPasswords.confirmPassword ? (
                <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
              ) : (
                <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
              ),
              onClick: () =>
                setShowPasswords((prev) => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword,
                })),
            },
          }}
          register={register("personalDetails.confirmPassword")}
          error={errors.personalDetails?.confirmPassword?.message}
        />
        <div className="flex items-center gap-4">
          <div className="w-full h-0.5 bg-accent-duo rounded-full" />
          <div className="w-fit px-5 whitespace-nowrap text-lg text-primary">
            Business Details
          </div>
          <div className="w-full h-0.5 bg-accent-duo rounded-full -scale-x-100" />
        </div>
        <Input
          label="Full Name"
          inputProps={{
            name: "businessDetails.name",
            type: "text",
            placeholder: "Enter business name",
          }}
          register={register("businessDetails.name")}
          error={errors.businessDetails?.name?.message}
        />
        <Input
          label="Business Email"
          inputProps={{
            name: "businessDetails.email",
            type: "text",
            placeholder: "Enter business email address",
          }}
          register={register("businessDetails.email")}
          error={errors.businessDetails?.email?.message}
        />
        <Input
          label="Business Contact Number"
          inputProps={{
            name: "businessDetails.phoneNumber",
            type: "number",
            placeholder: "Enter business contact number",
          }}
          register={register("businessDetails.phoneNumber")}
          error={errors.businessDetails?.phoneNumber?.message}
          icons={{ left: { text: "+91" } }}
        />
        <Controller
          name={"businessDetails.category"}
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              label={"Business Category"}
              options={ALLOWED_BUSINESSES.map((name) => ({
                name,
                value: name,
              }))}
              selectProps={{
                value: value?.toString(),
                onChange,
                placeholder: "Select business category",
              }}
              optionsClassName="!max-h-60"
              optionsPosition="bottom"
              error={errors.businessDetails?.category?.message}
            />
          )}
        />
        <div className="flex items-center gap-4">
          <div className="w-full h-0.5 bg-accent-duo rounded-full" />
          <div className="w-fit px-5 whitespace-nowrap text-lg text-primary">
            Business Address
          </div>
          <div className="w-full h-0.5 bg-accent-duo rounded-full -scale-x-100" />
        </div>
        <Input
          label="Address"
          inputProps={{
            name: "businessDetails.address.address",
            type: "text",
            placeholder: "Enter business address",
          }}
          register={register("businessDetails.address.address")}
          error={errors.businessDetails?.address?.address?.message}
        />
        <Input
          label="Landmark (Optional)"
          inputProps={{
            name: "businessDetails.address.landmark",
            type: "text",
            placeholder: "Enter landmark",
          }}
          register={register("businessDetails.address.landmark")}
          error={errors.businessDetails?.address?.landmark?.message}
        />
        <Input
          label="City"
          inputProps={{
            name: "businessDetails.address.city",
            type: "text",
            placeholder: "Enter city",
          }}
          register={register("businessDetails.address.city")}
          error={errors.businessDetails?.address?.city?.message}
        />
        <Controller
          name={"businessDetails.address.state"}
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              label={"State/Province"}
              options={STATES_AND_UNION_TERRITORIES.map((name) => ({
                name,
                value: name,
              }))}
              selectProps={{
                value: value?.toString(),
                onChange,
                placeholder: "Select state",
              }}
              optionsClassName="!max-h-60"
              optionsPosition="bottom"
              error={errors.businessDetails?.address?.state?.message}
            />
          )}
        />
        <Input
          label="Pin/Zip Code"
          inputProps={{
            name: "businessDetails.address.pinCode",
            type: "number",
            placeholder: "Enter Pin/Zip Code",
          }}
          register={register("businessDetails.address.pinCode")}
          error={errors.businessDetails?.address?.pinCode?.message}
        />
        <Controller
          name={"businessDetails.address.country"}
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              label={"Country"}
              options={ALLOWED_COUNTRIES.map((name) => ({
                name,
                value: name,
              }))}
              selectProps={{
                value: value?.toString(),
                onChange,
                placeholder: "Select Country",
                disabled: value === "India",
              }}
              optionsClassName="!max-h-60"
              optionsPosition="bottom"
              error={errors.businessDetails?.address?.country?.message}
            />
          )}
        />
        <Input
          label="PAN Number"
          inputProps={{
            name: "businessDetails.address.pan",
            type: "text",
            placeholder: "Enter PAN number",
          }}
          register={register("businessDetails.address.pan")}
          error={errors.businessDetails?.address?.pan?.message}
        />
        <Input
          label="GST Number"
          inputProps={{
            name: "businessDetails.address.gst",
            type: "text",
            placeholder: "Enter GST number",
          }}
          register={register("businessDetails.address.gst")}
          error={errors.businessDetails?.address?.gst?.message}
        />
        <Checkbox
          register={register("agreeTerms")}
          checkboxProps={{ name: "agreeTerms" }}
          error={errors.agreeTerms?.message}
          rightText={
            <>
              I agree to the{" "}
              <Link
                to="/terms-conditions"
                className="bg-clip-text bg-accent-duo text-transparent"
              >
                Terms & Conditions
              </Link>
            </>
          }
        />
        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BecomeSeller;
