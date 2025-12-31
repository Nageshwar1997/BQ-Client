import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterTextContent, registerInputMapData } from "./data";
import { TPasswordField } from "../../types";
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
import { registerOtpSchema, registerSchema } from "./helpers/auth.schema";
import {
  useRegisterUserSendOtp,
  useRegisterUserVerifyOtp,
} from "../../api/auth/auth.service";
import LoadingPage from "../../components/loaders/LoadingPage";
import DarkMode from "../../components/DarkMode";
import { PASSWORD_FIELDS } from "../../constants";

const ResendRegisterOtp = ({ email }: { email: string }) => {
  const [counter, setCounter] = useState(60);

  useEffect(() => {
    if (counter <= 0) return;

    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const handleResend = () => {
    if (counter > 0) return;

    // 🔥 call resend OTP API here
    console.log("Resending OTP to:", email);

    setCounter(60); // reset timer after resend
  };

  return (
    <p className="space-x-2">
      <span className="bg-clip-text text-transparent bg-silver-duo text-xs md:text-sm">
        Not received OTP?
      </span>

      {counter > 0 ? (
        <span className="text-xs md:text-sm text-muted">
          <span className="bg-clip-text text-transparent bg-silver-duo">
            Resend in
          </span>{" "}
          <strong className="bg-clip-text text-transparent bg-accent-duo">
            {counter}s
          </strong>
        </span>
      ) : (
        <button
          onClick={handleResend}
          className="bg-clip-text text-transparent bg-accent-duo hover:font-medium text-sm md:text-base"
        >
          Resend
        </button>
      )}
    </p>
  );
};

const RegisterForm = ({
  otpToken = "",
  email = "",
}: {
  otpToken: string;
  email: string;
}) => {
  const { mutateAsync } = useRegisterUserVerifyOtp();

  const [showPasswords, setShowPasswords] = useState<
    Record<TPasswordField, boolean>
  >({
    password: false,
    confirmPassword: false,
    otp: false,
  });

  const {
    watch,
    register,
    setValue,
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

  const togglePasswordVisibility = (field: TPasswordField) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const profilePic = watch("profilePic");

  const onSubmit = async (bodyData: z.infer<typeof registerSchema>) => {
    const formData = new FormData();

    formData.append("firstName", bodyData.firstName);
    formData.append("lastName", bodyData.lastName);
    formData.append("email", bodyData.email.toLowerCase());
    formData.append("password", bodyData.password);
    formData.append("confirmPassword", bodyData.confirmPassword);
    formData.append("phoneNumber", bodyData.phoneNumber);
    formData.append("otp", bodyData.otp);

    const file = bodyData.profilePic;
    if (file instanceof File) {
      formData.append("profilePic", file);
    }
    await mutateAsync({ otpToken, data: formData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <UploadProfile
        name="profilePic"
        className="!h-56"
        errorText={errors?.profilePic?.message}
        previewImage={
          profilePic instanceof File ? URL.createObjectURL(profilePic) : ""
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
              ![
                "firstName",
                "lastName",
                ...PASSWORD_FIELDS.filter((f) => f !== "otp"),
              ].includes(input.name)
                ? "lg:col-span-2"
                : ""
            }`}
          >
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
              }}
              label={input.label}
              register={register(input.name)}
              error={errors[input.name]?.message}
              icons={{
                ...(input.name === "phoneNumber" && { left: { text: "+91" } }),
                ...(PASSWORD_FIELDS.includes(input.name as TPasswordField) && {
                  right: {
                    icon:
                      PASSWORD_FIELDS.includes(input.name as TPasswordField) &&
                      (showPasswords[input.name as TPasswordField] ? (
                        <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                      ) : (
                        <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                      )),
                    onClick: () =>
                      togglePasswordVisibility(input.name as TPasswordField),
                  },
                }),
              }}
            />
          </div>
        ))}
      </div>
      <ResendRegisterOtp email={email} />
      <div className="space-y-3">
        <Checkbox
          register={register("remember")}
          checkboxProps={{ name: "remember" }}
          rightText="Remember me"
        />
        <Button
          pattern="primary"
          buttonProps={{ type: "submit" }}
          content="Register"
          className="!text-base"
        />
      </div>
    </form>
  );
};

const Register = () => {
  const { showGradient, containerRef } = useVerticalScrollable();

  const { mutateAsync, isPending, data } = useRegisterUserSendOtp();

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
      {isPending && <LoadingPage text="Please wait" />}
      <AuthRobot />
      <DarkMode className="border absolute top-5 right-5 h-fit p-2 md:p-3 rounded-full bg-secondary-inverted [&_path]:!stroke-secondary z-10" />
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
            <div className="w-full max-w-[400px] lg:max-w-[500px] sm:w-[90%] lg:w-[500px] border-gradient p-px rounded-3xl mx-auto">
              {/* Send OTP Form */}
              {/* Register Form */}
              <div className="shadow-light-dark-soft bg-platinum-black p-4 base:p-6 md:px-8 rounded-3xl">
                {data?.otpToken && email ? (
                  <RegisterForm otpToken={data?.otpToken} email={email} />
                ) : (
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
                      }}
                      label="Email"
                      register={register("email")}
                      error={errors.email?.message}
                    />
                    <Button
                      pattern="primary"
                      buttonProps={{ type: "submit" }}
                      content="Send OTP"
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
                    <p className="text-xs">
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
