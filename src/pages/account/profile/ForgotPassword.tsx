import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { useForgotPassword } from "../../../api/user/user.service";
import Button from "../../../components/button/Button";
import { forgotPasswordSchema } from "../../auth/helpers/auth.schema";
import ShowApiStatus from "../../../components/api-status/ShowApiStatus";
import ConfirmModal from "../../../components/modal/children/ConfirmModal";
import Input from "../../../components/input/Input";
import usePathParams from "../../../hooks/usePathParams";

const ForgotPassword = () => {
  const { navigate } = usePathParams();
  const { mutateAsync, isPending, isError, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleClose = () => {
    reset();
    navigate("/login");
  };

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    await mutateAsync(data.email, { onSuccess: () => handleClose() });
  };

  return (
    <div className="flex flex-col items-center justify-center w-dvw h-dvh">
      {isError || isPending ? (
        <ShowApiStatus
          headingText="Something went wrong"
          type={isPending ? "loading" : isError ? "error" : "empty"}
          descriptionText={
            error instanceof Error
              ? error.message
              : typeof error === "string"
              ? error
              : "Something went wrong"
          }
          loadingText="Please wait..."
        />
      ) : (
        <ConfirmModal
          type="custom"
          modalProps={{ isOpen: true, onClose: handleClose }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-6"
          >
            <div className="w-full flex flex-col gap-6 text-center">
              <h4 className="text-lg/5 md:text-xl/6 lg:text-2xl/6 font-semibold bg-clip-text text-transparent bg-silver-duo">
                Enter your email
              </h4>
              <hr className="w-full h-px block border-none bg-gradient-line" />
              <Input
                label="Email"
                register={register("email")}
                error={errors.email?.message}
                inputProps={{
                  name: "email",
                  disabled: isPending,
                  type: "text",
                  placeholder: "Enter your email",
                }}
              />
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
                buttonProps={{
                  disabled: !isDirty || isPending,
                  type: "submit",
                }}
              />
            </div>
          </form>
        </ConfirmModal>
      )}
    </div>
  );
};

export default ForgotPassword;
