import { RefObject, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterTextContent, registerInputMapData } from "./data";
import { VerticalScrollType, RegisterFormInputProps } from "../../types";
import AuthRobot from "./components/AuthRobot";
import UploadProfile from "./components/UploadProfile";
import TextDisplay from "../../components/TextDisplay";
import SocialAuth from "./components/SocialAuth";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { EyeIcon, EyeOffIcon } from "../../icons";
import PhoneInput from "../../components/input/PhoneInput";
import Checkbox from "../../components/input/Checkbox";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";
import { BottomGradient, TopGradient } from "../../components/Gradients";
import { registerSchema } from "./helpers/auth.schema";
import { useRegisterUser } from "../../api/user/auth.service";
import LoadingPage from "../../components/loaders/LoadingPage";
import DarkMode from "../../components/DarkMode";
import { saveUserLocal, saveUserSession } from "../../utils";

interface PasswordVisibilityType {
  password: boolean;
  confirmPassword: boolean;
}
const Register = () => {
  const [showGradient, containerRef] = useVerticalScrollable();
  const [showPasswords, setShowPasswords] = useState<PasswordVisibilityType>({
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  const userRegisterMutation = useRegisterUser();

  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputProps>({
    resolver: yupResolver(registerSchema), // Use yup resolver for validation
  });

  const togglePasswordVisibility = (field: keyof PasswordVisibilityType) => {
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
    userRegisterMutation.mutate(formData, {
      onSettled(data, error) {
        if (data && !error) {
          if (bodyData.remember) {
            saveUserLocal(data?.token);
          } else {
            saveUserSession(data?.token);
          }
          setTimeout(() => navigate("/"), 600);
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
        ref={containerRef as RefObject<HTMLDivElement>}
        className={`w-full lg:w-1/2 flex flex-col items-center gap-4 overflow-hidden overflow-y-scroll ${
          !(showGradient as VerticalScrollType).bottom &&
          !(showGradient as VerticalScrollType).top
            ? "justify-center"
            : "justify-start"
        }`}
      >
        {(showGradient as VerticalScrollType).top && <TopGradient />}
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
              <div className="">
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
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-6">
                {registerInputMapData?.map((field, index) => {
                  const { label, name, type, placeholder } = field;
                  return (
                    <div
                      key={index}
                      className={`${
                        ![
                          "firstName",
                          "lastName",
                          "password",
                          "confirmPassword",
                        ].includes(name) && "lg:col-span-2"
                      }`}
                    >
                      {name === "phoneNumber" ? (
                        <PhoneInput
                          label={label}
                          type={type}
                          placeholder={placeholder}
                          name={name}
                          register={{ ...register(name) }}
                          errorText={errors[name]?.message}
                        />
                      ) : (
                        <Input
                          type={
                            ["password", "confirmPassword"].includes(name)
                              ? showPasswords[
                                  name as keyof PasswordVisibilityType
                                ]
                                ? "text"
                                : type
                              : type
                          }
                          label={label}
                          placeholder={placeholder}
                          name={name}
                          register={{ ...register(name) }}
                          errorText={errors[name]?.message}
                          icon={
                            ["password", "confirmPassword"].includes(name) &&
                            (showPasswords[
                              name as keyof PasswordVisibilityType
                            ] ? (
                              <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                            ) : (
                              <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                            ))
                          }
                          iconClick={() =>
                            togglePasswordVisibility(
                              name as keyof PasswordVisibilityType
                            )
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox register={{ ...register("remember") }} />
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
        {(showGradient as VerticalScrollType).bottom && <BottomGradient />}
      </div>
    </div>
  );
};

export default Register;
