import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterTextContent, registerInputMapData } from "./data";
import {
  RegisterFormInputProps,
  TPasswordField,
  TPasswordVisibility,
} from "../../types";
import AuthRobot from "./components/AuthRobot";
import UploadProfile from "./components/UploadProfile";
import TextDisplay from "../../components/TextDisplay";
import SocialAuth from "./components/SocialAuth";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { EyeIcon, EyeOffIcon } from "../../icons";
import Checkbox from "../../components/input/Checkbox";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";
import { BottomGradient, TopGradient } from "../../components/Gradients";
import { registerSchema } from "./helpers/auth.schema";
import { useRegisterUser } from "../../api/auth/auth.service";
import LoadingPage from "../../components/loaders/LoadingPage";
import DarkMode from "../../components/DarkMode";
import { saveLocalToken, saveSessionToken } from "../../utils";
import { PASSWORD_FIELDS } from "../../constants";
import { useUserStore } from "../../store/user.store";
import usePathParams from "../../hooks/usePathParams";

const Register = () => {
  const [showGradient, containerRef] = useVerticalScrollable();
  const [showPasswords, setShowPasswords] = useState<TPasswordVisibility>({
    password: false,
    confirmPassword: false,
  });
  const { navigate } = usePathParams();
  const { setUser } = useUserStore();

  const userRegisterMutation = useRegisterUser();

  const {
    control,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputProps>({
    resolver: yupResolver(registerSchema), // Use yup resolver for validation
  });

  const togglePasswordVisibility = (field: TPasswordField) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const onSubmit = async (bodyData: RegisterFormInputProps) => {
    const formData = new FormData();

    formData.append("firstName", bodyData.firstName);
    formData.append("lastName", bodyData.lastName);
    formData.append("email", bodyData.email);
    formData.append("password", bodyData.password);
    formData.append("confirmPassword", bodyData.confirmPassword);
    formData.append("phoneNumber", bodyData.phoneNumber);

    const file = bodyData.profilePic;
    if (file) {
      formData.append("profilePic", file);
    }
    userRegisterMutation.mutateAsync(formData, {
      onSettled(data, error) {
        if (data && !error) {
          if (data.user) {
            setUser(data.user);
          }
          if (bodyData.remember) {
            saveLocalToken(data?.token);
          } else {
            saveSessionToken(data?.token);
          }
          setTimeout(() => navigate("/"), 500);
        }
        if (error) {
          console.error("Error from mutation:", error);
        }
      },
    });
  };

  return (
    <div className="w-full min-h-dvh max-h-dvh h-full p-4 flex gap-4 overflow-hidden relative">
      {userRegisterMutation.isPending && <LoadingPage text="Please wait" />}
      <AuthRobot />
      <DarkMode className="border absolute top-5 right-5 h-fit p-2 md:p-3 rounded-full bg-secondary-inverted [&_path]:!stroke-secondary z-10" />
      <div
        ref={containerRef}
        className={`w-full lg:w-1/2 flex flex-col items-center gap-4 overflow-hidden overflow-y-scroll ${
          !showGradient.bottom && !showGradient.top
            ? "justify-center"
            : "justify-start"
        }`}
      >
        {showGradient.top && <TopGradient />}
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="w-full flex flex-col gap-4"
        >
          <TextDisplay
            content={RegisterTextContent}
            contentClassName="mb-3 font-semibold"
          />
          <SocialAuth />
          <div className="w-full max-w-[400px] lg:max-w-[500px] sm:w-[90%] lg:w-[500px] border-gradient p-px rounded-3xl overflow-hidden mx-auto">
            <div className="shadow-light-dark-soft bg-platinum-black p-6 md:px-8 rounded-3xl space-y-6">
              <UploadProfile
                name="profilePic"
                className="!h-56"
                errorText={errors?.profilePic?.message}
                previewImage={
                  watch("profilePic") instanceof File
                    ? URL.createObjectURL(watch("profilePic") as File)
                    : ""
                }
                onChange={(file) => {
                  if (file) {
                    setValue("profilePic", file, {
                      shouldValidate: true,
                    });
                  }
                }}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-6">
                {registerInputMapData?.map((input, index) => (
                  <div
                    key={index}
                    className={`${
                      !["firstName", "lastName", ...PASSWORD_FIELDS].includes(
                        input.name
                      )
                        ? "lg:col-span-2"
                        : ""
                    }`}
                  >
                    <Input
                      inputProps={{
                        name: input.name,
                        placeholder: input.placeholder,
                        autoComplete: input.autoComplete,
                        type: PASSWORD_FIELDS.includes(
                          input.name as TPasswordField
                        )
                          ? showPasswords[input.name as TPasswordField]
                            ? "text"
                            : input.type
                          : input.type,
                      }}
                      label={input.label}
                      register={register(input.name)}
                      error={errors[input.name]?.message}
                      icons={{
                        ...(input.name === "phoneNumber" && {
                          left: { text: "+91" },
                        }),
                        ...(PASSWORD_FIELDS.includes(
                          input.name as TPasswordField
                        ) && {
                          right: {
                            icon:
                              PASSWORD_FIELDS.includes(
                                input.name as TPasswordField
                              ) &&
                              (showPasswords[input.name as TPasswordField] ? (
                                <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                              ) : (
                                <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                              )),
                            onClick: () =>
                              togglePasswordVisibility(
                                input.name as TPasswordField
                              ),
                          },
                        }),
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <Checkbox register={field} checked={field.value} />
                    )}
                  />
                  <span className="text-sm text-primary-50 font-medium">
                    Remember me
                  </span>
                </div>
                <Button
                  pattern="primary"
                  type="submit"
                  content="Register"
                  className="!text-base"
                />
                <div className="flex items-center justify-center gap-2">
                  <p className="bg-clip-text text-transparent bg-silver-duo text-xs md:text-sm">
                    Already have an account?
                  </p>
                  <Link
                    to={"/login"}
                    className={`bg-clip-text text-transparent bg-accent-duo hover:font-extrabold text-sm md:text-base`}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
        {showGradient.bottom && <BottomGradient />}
      </div>
    </div>
  );
};

export default Register;
