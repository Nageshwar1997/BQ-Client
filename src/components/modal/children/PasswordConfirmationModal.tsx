import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordFields } from "../../../constants";
import useQueryParams from "../../../hooks/useQueryParams";
import { updatePasswordSchema } from "../../../pages/auth/helpers/auth.schema";
import Button from "../../button/Button";
import Input from "../../input/Input";
import ConfirmModal from "./ConfirmModal";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "../../../icons";
import { useChangePassword } from "../../../api/user/user.service";

const PasswordConfirmationModal = () => {
  const { queryParams, removeParam } = useQueryParams();
  const { mutateAsync, isPending } = useChangePassword();

  const [showPasswords, setShowPasswords] = useState<
    Record<keyof z.infer<typeof updatePasswordSchema>, boolean>
  >({
    confirmPassword: false,
    newPassword: false,
    oldPassword: false,
  });

  const togglePasswordVisibility = (
    field: keyof z.infer<typeof updatePasswordSchema>
  ) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      confirmPassword: "",
      newPassword: "",
    },
  });

  const handleClose = () => {
    removeParam("confirm");
    reset();
  };

  const onSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
    await mutateAsync(data);
  };

  return (
    <ConfirmModal
      type="custom"
      modalProps={{ isOpen: !!queryParams.confirm, onClose: handleClose }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-6"
      >
        <div className="w-full flex flex-col gap-6 text-center">
          <h4 className="text-lg/5 md:text-xl/6 lg:text-2xl/6 font-semibold bg-clip-text text-transparent bg-silver-duo">
            Enter your passwords
          </h4>
          <hr className="w-full h-px block border-none bg-gradient-line" />
          {updatePasswordFields.map((field) => {
            return (
              <Input
                key={field.name}
                label={field.label}
                register={register(field.name)}
                error={errors[field.name]?.message}
                inputProps={{
                  name: field.name,
                  disabled: isPending,
                  type: showPasswords[field.name] ? "text" : field.type,
                  placeholder: field.placeholder,
                }}
                icons={{
                  right: {
                    icon: showPasswords[field.name] ? (
                      <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                    ) : (
                      <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                    ),
                    onClick: () => togglePasswordVisibility(field.name),
                  },
                }}
              />
            );
          })}
        </div>
        <div className="w-full flex items-center justify-center gap-4">
          <Button
            content="Cancel"
            pattern="secondary"
            className={`max-h-10 !rounded-md`}
            buttonProps={{ type: "button", onClick: handleClose }}
          />
          <Button
            content="Confirm"
            pattern="primary"
            className={`max-h-10 !rounded-md`}
            buttonProps={{ disabled: !isDirty || isPending, type: "submit" }}
          />
        </div>
      </form>
    </ConfirmModal>
  );
};

export default PasswordConfirmationModal;
