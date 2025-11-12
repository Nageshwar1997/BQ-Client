import { useEffect, useRef, useState } from "react";
import {
  Controller,
  FieldError,
  FieldErrors,
  Path,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/button/Button";
import { InfoIcon } from "../../icons";

import Input from "../../components/input/Input";
import Select from "../../components/input/Select";
import Checkbox from "../../components/input/Checkbox";

import {
  becomeSellerBaseSchema,
  becomeSellerSchema,
} from "../../schemas/seller";

import { IBecomeSellerInput } from "../../types";
import { becomeSellerDefaultValues, becomeSellerFormMapData } from "./data";
import z from "zod";
import { Link } from "react-router-dom";
import useQueryParams from "../../hooks/useQueryParams";
import DocumentInstructionsModal from "./children/DocumentInstructionsModal";
import { ALLOWED_IMAGE_TYPES } from "../../constants";
import FileInput from "../../components/input/FileInput";
import { useUserStore } from "../../store/user.store";
import { useCreateSellerRequest } from "../../api/user/user.service";
import usePathParams from "../../hooks/usePathParams";

type FormValues = z.infer<typeof becomeSellerBaseSchema>;
type TMapObj = typeof becomeSellerFormMapData; // the object type
type TMapKey = keyof TMapObj; // keys
type TMapValue = TMapObj[TMapKey]; // values

function getErrorMessage<
  T extends keyof FormValues,
  K extends keyof FormValues[T]
>(errors: FieldErrors<FormValues>, parentKey: T, fieldName: K) {
  const parentErrors = errors[parentKey];
  if (!parentErrors) return undefined;

  const typedParentErrors = parentErrors as FieldErrors<FormValues[T]>;
  const fieldError = typedParentErrors[fieldName] as FieldError | undefined;

  return fieldError?.message;
}

// =============================
// InputField Component
// =============================
const InputField = ({
  field,
  parentKey,
  control,
  register,
  errors,
  containerClassName,
  registerResetFn,
}: IBecomeSellerInput) => {
  const { setParams } = useQueryParams();
  const [documents, setDocuments] = useState<{
    file: File | null;
    preview: string | null;
  }>({
    file: null,
    preview: null,
  });

  const name = parentKey
    ? (`${parentKey}.${field.name}` as Path<FormValues>)
    : (field.name as Path<FormValues>);

  const errorMessage = parentKey
    ? getErrorMessage(
        errors,
        parentKey as keyof FormValues,
        field.name as keyof FormValues[typeof parentKey] & string
      )
    : undefined;

  // Local reset logic
  const resetDocuments = () => setDocuments({ file: null, preview: null });

  // Register reset function once
  useEffect(() => {
    if (registerResetFn) {
      registerResetFn(resetDocuments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (field.type === "select") {
    return (
      <Controller
        key={name}
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            containerClassName={containerClassName}
            label={field.label}
            options={field.options?.length ? field.options : []}
            selectProps={{
              value: value?.toString(),
              onChange,
              placeholder: field.placeholder,
              disabled: field.disabled,
            }}
            optionsClassName="!max-h-60"
            optionsPosition="bottom"
            error={errorMessage}
          />
        )}
      />
    );
  }

  if (field.type === "file") {
    return (
      <Controller
        key={name}
        name={name}
        control={control}
        render={({ field: controlField }) => (
          <FileInput
            label={field.label}
            previews={
              documents.preview
                ? [{ type: "image", url: documents.preview }]
                : []
            }
            errors={errorMessage ? [errorMessage] : []}
            fileInputProps={{
              name,
              placeholder: field.placeholder,
              accept: ALLOWED_IMAGE_TYPES.join(", "),
              multiple: false,
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const preview = URL.createObjectURL(file);
                setDocuments({ file, preview });
                controlField.onChange(file);
              },
            }}
            icons={{
              right: {
                icon: (
                  <InfoIcon className="fill-primary opacity-50 hover:opacity-100" />
                ),
                onClick: () => setParams({ requiredDocument: field.name }),
              },
            }}
            mediaCarouselClassName="w-fit"
          />
        )}
      />
    );
  }

  return (
    <Input
      key={name}
      label={field.label}
      inputProps={{
        name,
        type: field.type,
        disabled: field.disabled,
        placeholder: field.placeholder,
        autoComplete: field.autoComplete,
        className: ["gst", "pan"].includes(field.name)
          ? "uppercase placeholder:[text-transform:none]"
          : "",
      }}
      containerClassName={containerClassName}
      register={register(name)}
      error={errorMessage}
      icons={{
        ...(field.name === "phoneNumber" && {
          left: { text: "+91" },
        }),
      }}
    />
  );
};

// =============================
// BecomeSeller Component
// =============================
const BecomeSeller = () => {
  const { user, isAuthenticated } = useUserStore();
  const { navigate } = usePathParams();
  const documentFieldsRefs = useRef<{ [key: string]: () => void }>({});
  const { mutateAsync, isPending } = useCreateSellerRequest();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<z.infer<typeof becomeSellerSchema>>({
    resolver: zodResolver(becomeSellerSchema),
    defaultValues: becomeSellerDefaultValues,
  });

  const onSubmit = (data: z.infer<typeof becomeSellerSchema>) => {
    const formData = new FormData();
    formData.append("agreeTerms", String(data.agreeTerms));
    formData.append("businessAddress", JSON.stringify(data.businessAddress));
    // formData.append("personalDetails", JSON.stringify(data.personalDetails));
    formData.append("businessDetails", JSON.stringify(data.businessDetails));

    Object.entries(data.requiredDocuments).forEach(([key, file]) => {
      if (file && file instanceof File) {
        formData.append(key, file);
      }
    });

    mutateAsync(formData, {
      onSuccess: () => {
        onReset();
        setTimeout(() => {
          navigate("/account");
        }, 500);
      },
    });
  };

  const setDefaultPersonalDetails = () => {
    if (isAuthenticated && user) {
      setValue("personalDetails.name", `${user.firstName} ${user.lastName}`);
      setValue("personalDetails.email", user.email);
      setValue("personalDetails.phoneNumber", user.phoneNumber);
    }
  };

  const onReset = () => {
    reset();
    setDefaultPersonalDetails();
    Object.values(documentFieldsRefs.current).forEach((resetFn) => resetFn());
  };

  useEffect(() => {
    setDefaultPersonalDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <DocumentInstructionsModal />
      <header className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Join Beautinique as a Seller
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          Grow your business with Beautinique! Reach thousands of beauty
          enthusiasts by showcasing your products on our platform.
        </p>
      </header>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {(
          Object.entries(becomeSellerFormMapData) as [TMapKey, TMapValue][]
        ).map(([sectionKey, fields]) => (
          <div key={sectionKey as string} className="flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-full h-0.5 bg-accent-duo rounded-full" />
              <div className="w-fit px-2 whitespace-nowrap text-lg text-primary">
                {sectionKey
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </div>
              <div className="w-full h-0.5 bg-accent-duo rounded-full -scale-x-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fields.map((field, index) => (
                <InputField
                  key={index}
                  control={control}
                  field={field}
                  errors={errors}
                  parentKey={sectionKey}
                  register={register}
                  containerClassName={
                    field.label === "Full Name" ? "sm:col-span-2" : ""
                  }
                  registerResetFn={(resetFn) => {
                    documentFieldsRefs.current[`${sectionKey}.${field.name}`] =
                      resetFn;
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        {/* Terms & Conditions Checkbox */}
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
        <div className="flex items-center gap-4">
          <Button
            pattern="secondary"
            content="Reset"
            buttonProps={{
              type: "button",
              onClick: onReset,
              disabled: isPending,
            }}
          />
          <Button
            pattern="primary"
            content="Submit"
            buttonProps={{ type: "submit", disabled: isPending }}
          />
        </div>
      </form>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <p className="text-tertiary text-center mx-auto mb-6">
        Can’t find your business category?{" "}
        <Link
          to="/contact-us"
          className="bg-clip-text bg-accent-duo text-transparent"
        >
          Contact us
        </Link>{" "}
        and we’ll help you.
      </p>
    </div>
  );
};

export default BecomeSeller;
