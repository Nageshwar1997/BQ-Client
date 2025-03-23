import { RefObject, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "./helpers/auth.schema";
import { loginInputMapData, LoginTextContent } from "./data";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";
import {
  LoginFormInputProps,
  LoginTypes,
  VerticalScrollType,
} from "../../types";
import { BottomGradient, TopGradient } from "../../components/Gradients";
import AuthRobot from "./components/AuthRobot";
import TextDisplay from "../../components/TextDisplay";
import SocialAuth from "./components/SocialAuth";
import PhoneInput from "../../components/input/PhoneInput";
import Input from "../../components/input/Input";
import { EyeIcon, EyeOffIcon } from "../../icons";
import Radio from "../../components/input/Radio";
import Button from "../../components/button/Button";
import Checkbox from "../../components/input/Checkbox";
import { saveUserLocal, saveUserSession } from "../../utils";
import { useLoginUser } from "../../api/user/auth.service";
import LoadingPage from "../../components/loaders/LoadingPage";
import DarkMode from "../../components/DarkMode";

const Login = () => {
  const [showGradient, containerRef] = useVerticalScrollable();
  const [loginMethod, setLoginMethod] = useState<LoginTypes>("email");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const userLoginMutation = useLoginUser();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      loginMethod: loginMethod,
      email: "",
      phoneNumber: "",
      password: "",
      remember: false, // ✅ Default value set to false
    },
  });

  const selectedMethod = watch("loginMethod");

  const handleLoginMethodChange = (method: "email" | "phoneNumber") => {
    setLoginMethod(method);
    reset({
      loginMethod: method,
      email: method === "email" ? "" : undefined,
      phoneNumber: method === "phoneNumber" ? "" : undefined,
      password: "",
      remember: false,
    });
  };

  const onSubmit = (bodyData: LoginFormInputProps) => {
    const formData = new FormData();

    if (bodyData.loginMethod === "email" && bodyData.email) {
      formData.append("email", bodyData.email);
    } else if (bodyData.loginMethod === "phoneNumber" && bodyData.phoneNumber) {
      formData.append("phoneNumber", bodyData.phoneNumber);
    }

    formData.append("password", bodyData.password);

    userLoginMutation.mutate(formData, {
      onSettled(data, error) {
        if (data && !error) {
          if (bodyData.remember) {
            saveUserLocal(data?.token);
          } else {
            saveUserSession(data?.token);
          }
          navigate("/");
        }
        if (error) {
          console.error("Error from mutation:", error);
        }
      },
    });
  };

  return (
    <div className="w-full min-h-dvh max-h-dvh h-full p-4 flex gap-4 overflow-hidden relative">
      {userLoginMutation.isPending && <LoadingPage text="Please wait" />}
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
            content={LoginTextContent}
            contentClassName="mb-3 font-semibold"
          />
          <SocialAuth />
          <div className="w-full max-w-[400px] lg:max-w-[500px] sm:w-[90%] lg:w-[500px] border-gradient p-px rounded-3xl overflow-hidden mx-auto">
            <div className="shadow-light-dark-soft bg-platinum-black p-6 md:px-8 rounded-3xl space-y-6">
              <Controller
                name="loginMethod"
                control={control}
                render={({ field }) => (
                  <Radio
                    value={field.value}
                    onChange={(value) => {
                      handleLoginMethodChange(value as LoginTypes);
                      field.onChange(value);
                    }}
                    options={[
                      { label: "Email", value: "email" },
                      { label: "Phone", value: "phoneNumber" },
                    ]}
                  />
                )}
              />
              <div className="flex flex-col gap-5 lg:gap-6">
                {loginInputMapData?.map((item, index) => {
                  if (
                    item.name === "phoneNumber" &&
                    selectedMethod !== "phoneNumber"
                  ) {
                    return null;
                  }

                  if (item.name === "email" && selectedMethod !== "email") {
                    return null;
                  }
                  return (
                    <div key={index}>
                      {item.name === "phoneNumber" ? (
                        <PhoneInput
                          label={item.label}
                          register={register(item.name)}
                          name={item.name}
                          type={item.type}
                          placeholder={item.placeholder}
                          errorText={errors?.[item.name]?.message}
                        />
                      ) : (
                        <Input
                          label={item.label}
                          register={register(item.name)}
                          name={item.name}
                          placeholder={item.placeholder}
                          errorText={errors?.[item.name]?.message}
                          type={
                            item.name === "password"
                              ? showPassword
                                ? "text"
                                : item.type
                              : item.type
                          }
                          icon={
                            item.name === "password" &&
                            (showPassword ? (
                              <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                            ) : (
                              <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                            ))
                          }
                          iconClick={
                            item.name === "password"
                              ? () => setShowPassword((prev) => !prev)
                              : undefined
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center space-x-3">
                    <Controller
                      name="remember"
                      control={control}
                      render={({ field }) => <Checkbox register={field} />}
                    />
                    <span className="text-[13px] md:text-sm text-primary-50 font-medium whitespace-nowrap">
                      Remember
                    </span>
                  </div>
                  <Link
                    to={"/forgot-password"}
                    className={`bg-clip-text text-transparent bg-accent-duo text-[13px] md:text-sm mr-2 hover:underline whitespace-nowrap`}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  pattern="primary"
                  type="submit"
                  content="Login"
                  className="!text-base"
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <p className="bg-clip-text text-transparent bg-silver-duo text-xs md:text-sm">
                  Don't have an account?
                </p>
                <Link
                  to={"/register"}
                  className={`bg-clip-text text-transparent bg-accent-duo hover:font-extrabold text-sm md:text-base`}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </form>
        {(showGradient as VerticalScrollType).bottom && <BottomGradient />}
      </div>
    </div>
  );
};

export default Login;
