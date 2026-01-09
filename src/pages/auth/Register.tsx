import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterTextContent, registerInputMapData } from "./data";
import { IInput, RegisterInputMapDataProps, TPasswordField } from "../../types";
import AuthRobot from "./components/AuthRobot";
import ProfilePicInput from "./components/ProfilePicInput";
import TextDisplay from "../../components/TextDisplay";
import SocialAuth from "./components/SocialAuth";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { EyeIcon, EyeOffIcon } from "../../icons";
import Checkbox from "../../components/input/Checkbox";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";
import { BottomGradient, TopGradient } from "../../components/Gradients";
import { registerOtpSchema, registerSchema } from "./helpers/auth.schema";
import {
  useRegisterUserResendOtp,
  useRegisterUserSendOtp,
  useRegisterUserVerifyOtp,
} from "../../api/auth/auth.service";
import usePathParams from "../../hooks/usePathParams";
import DarkMode from "../../components/DarkMode";
import { PASSWORD_FIELDS } from "../../constants";
import { useUserStore } from "../../store/user.store";
import {
  getFileFromFileList,
  saveLocalToken,
  saveSessionToken,
} from "../../utils";
import Resend from "../../components/Resend";

type TRegisterInput = {
  input: RegisterInputMapDataProps;
  isPending: boolean;
  errors: FieldErrors<z.infer<typeof registerSchema>>;
  register: IInput["register"];
};

const RegisterInput = ({
  input,
  register,
  isPending,
  errors,
}: TRegisterInput) => {
  const [showPasswords, setShowPasswords] = useState<
    Record<TPasswordField, boolean>
  >({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: TPasswordField) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  return (
    <Input
      inputProps={{
        name: input.name,
        placeholder: input.placeholder,
        autoComplete: input.autoComplete,
        type: PASSWORD_FIELDS.includes(input.name as TPasswordField)
          ? showPasswords[input.name as TPasswordField]
            ? "text"
            : input.type
          : input.type,
        disabled: isPending,
      }}
      label={input.label}
      register={register}
      error={errors[input.name]?.message}
      icons={{
        ...(input.name === "phoneNumber" && {
          left: { text: "+91" },
        }),
        ...(PASSWORD_FIELDS.includes(input.name as TPasswordField) && {
          right: {
            icon:
              PASSWORD_FIELDS.includes(input.name as TPasswordField) &&
              (showPasswords[input.name as TPasswordField] ? (
                <EyeOffIcon className="fill-primary! opacity-50 hover:opacity-100 h-full" />
              ) : (
                <EyeIcon className="fill-primary! opacity-50 hover:opacity-100 h-full" />
              )),
            onClick: () =>
              togglePasswordVisibility(input.name as TPasswordField),
          },
        }),
      }}
    />
  );
};

const RegisterForm = ({
  otpToken = "",
  email = "",
  onReset,
}: {
  otpToken: string;
  email: string;
  onReset?: () => void;
}) => {
  const { mutateAsync: verifyOtpAsync, isPending: isVerifyingOtp } =
    useRegisterUserVerifyOtp();
  const { mutateAsync: resendOtpAsync, isPending: isResendingOtp } =
    useRegisterUserResendOtp();

  const { navigate } = usePathParams();
  const { setUser } = useUserStore();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      confirmPassword: "",
      email,
      firstName: "",
      lastName: "",
      otp: "",
      password: "",
      phoneNumber: "",
      profilePic: undefined,
      remember: false,
    },
  });

  const profilePicFile = getFileFromFileList(watch("profilePic"));

  const profilePicURL =
    profilePicFile instanceof File
      ? URL.createObjectURL(profilePicFile)
      : undefined;

  const onSubmit = async (bodyData: z.infer<typeof registerSchema>) => {
    const formData = new FormData();

    formData.append("firstName", bodyData.firstName);
    formData.append("lastName", bodyData.lastName);
    formData.append("email", bodyData.email.toLowerCase());
    formData.append("password", bodyData.password);
    formData.append("confirmPassword", bodyData.confirmPassword);
    formData.append("phoneNumber", bodyData.phoneNumber);
    formData.append("otp", bodyData.otp);

    if (profilePicFile) {
      formData.append("profilePic", profilePicFile);
    }
    await verifyOtpAsync(
      { otpToken, data: formData },
      {
        onSuccess: (data) => {
          console.log("data", data);
          if (data.user) {
            setUser(data.user);
          }
          if (bodyData.remember) {
            saveLocalToken(data?.token);
          } else {
            saveSessionToken(data?.token);
          }

          setTimeout(() => navigate("/"), 500);
        },
      }
    );
  };

  const handleResend = async () => {
    await resendOtpAsync(
      { otpToken, email },
      {
        onError: (error) => {
          if (
            typeof error === "string" &&
            (error as string).includes("Go Back")
          ) {
            onReset?.();
          }
        },
      }
    );
  };

  const isPending = isVerifyingOtp || isResendingOtp;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-6">
          <ProfilePicInput
            className="max-w-24!"
            src={profilePicURL}
            error={errors.profilePic?.message}
            register={register("profilePic")}
            fileInputProps={{ name: "profilePic" }}
          />
          <div className="space-y-6 flex-1">
            {registerInputMapData?.slice(0, 2).map((input, index) => (
              <RegisterInput
                key={index}
                register={register(input.name)}
                errors={errors}
                input={input}
                isPending={isPending}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-5 lg:gap-y-6">
          {registerInputMapData?.slice(2).map((input, index) => (
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
              <RegisterInput
                register={register(input.name)}
                errors={errors}
                input={input}
                isPending={isPending}
              />
            </div>
          ))}
        </div>
        <Resend
          label="Not received OTP?"
          count={60}
          onResend={!isPending ? handleResend : undefined}
        />
        <div className="space-y-3">
          <Checkbox
            register={register("remember")}
            checkboxProps={{ name: "remember" }}
            rightText="Remember me"
          />
          <div className="flex gap-4">
            <Button
              pattern="secondary"
              buttonProps={{
                type: "button",
                disabled: isPending,
                onClick: onReset,
              }}
              content="Go Back"
            />
            <Button
              pattern="primary"
              buttonProps={{ type: "submit", disabled: isPending }}
              content={isPending ? "Registering..." : "Register"}
            />
          </div>
        </div>
      </form>
    </>
  );
};

const Register = () => {
  const { showGradient, containerRef } = useVerticalScrollable();

  const { mutateAsync, isPending, data, reset } = useRegisterUserSendOtp();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerOtpSchema>>({
    resolver: zodResolver(registerOtpSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (bodyData: z.infer<typeof registerOtpSchema>) => {
    await mutateAsync(bodyData.email);
  };

  const email = watch("email");

  return (
    <div className="w-full min-h-dvh max-h-dvh h-full p-4 flex gap-4">
      <AuthRobot />
      <DarkMode className="border absolute top-5 right-5 h-fit p-2 md:p-3 rounded-full bg-secondary-inverted [&_path]:stroke-secondary! z-10" />
      <div
        className={`flex-1 flex flex-col items-center gap-4 relative ${
          !showGradient.bottom && !showGradient.top
            ? "justify-center"
            : "justify-start"
        }`}
      >
        <div
          ref={containerRef}
          className="w-full overflow-y-scroll scroll-smooth"
        >
          {showGradient.top && <TopGradient />}
          <div className="w-full flex flex-col gap-4">
            <TextDisplay
              content={RegisterTextContent}
              contentClassName="mb-3 font-semibold"
            />
            <SocialAuth />
            <div className="w-full max-w-100 lg:max-w-125 sm:w-[90%] lg:w-125 border-gradient p-px rounded-3xl mx-auto">
              <div className="shadow-light-dark-soft bg-platinum-black p-4 base:p-6 md:px-8 rounded-3xl">
                {/* Register Form */}
                {data?.otpToken && email ? (
                  <RegisterForm
                    otpToken={data.otpToken}
                    email={email}
                    onReset={reset}
                  />
                ) : (
                  // Send OTP Form
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 py-4"
                  >
                    <Input
                      inputProps={{
                        name: "email",
                        placeholder: "Enter email address",
                        autoComplete: "email",
                        type: "text",
                        disabled: isPending,
                      }}
                      label="Email"
                      register={register("email")}
                      error={errors.email?.message}
                    />
                    <Button
                      pattern="primary"
                      buttonProps={{ type: "submit", disabled: isPending }}
                      content={isPending ? "Sending..." : "Send Otp"}
                    />
                    <div className="flex items-center justify-start gap-2">
                      <p className="bg-clip-text text-transparent bg-silver-duo text-xs md:text-sm">
                        Already have an account?
                      </p>
                      <Link
                        to={"/login"}
                        className="bg-clip-text text-transparent bg-accent-duo hover:font-medium text-sm md:text-bas"
                      >
                        Login
                      </Link>
                    </div>
                    <p className="text-xs text-tertiary">
                      Your entry or registration on the site means acceptance of
                      the{" "}
                      <Link
                        to="/terms-conditions"
                        className="bg-clip-text text-transparent bg-accent-duo text-nowrap font-medium"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      of use It is one of Flytoday services and{" "}
                      <Link
                        to="/privacy-policy"
                        className="bg-clip-text text-transparent bg-accent-duo text-nowrap font-medium"
                      >
                        Privacy Policy
                      </Link>{" "}
                      rules.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
          {showGradient.bottom && <BottomGradient />}
        </div>
      </div>
    </div>
  );
};

export default Register;
