import { useState } from "react";
import { Link } from "react-router-dom";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginInputMapData, LoginTextContent } from "../../pages/auth/data";
import { LoginFormInputProps, LoginTypes } from "../../types";
import { loginSchema } from "../../pages/auth/helpers/auth.schema";
import { useLoginUser } from "../../api/auth/auth.service";
import { saveLocalToken, saveSessionToken } from "../../utils";
import TextDisplay from "../TextDisplay";
import SocialAuth from "../../pages/auth/components/SocialAuth";
import Radio from "../input/Radio";
import Input from "../input/Input";
import { EyeIcon, EyeOffIcon } from "../../icons";
import Checkbox from "../input/Checkbox";
import Button from "../button/Button";
import useQueryParams from "../../hooks/useQueryParams";
import LoadingPage from "../loaders/LoadingPage";
import { useUserStore } from "../../store/user.store";
import usePathParams from "../../hooks/usePathParams";

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess?: () => void }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { removeParam, queryParams } = useQueryParams();
  const { paths } = usePathParams();
  const { setUser } = useUserStore();

  const { mutateAsync, isPending } = useLoginUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
    watch,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginMethod: "email",
      email: "",
      phoneNumber: "",
      password: "",
      remember: false, // ✅ Default value set to false
    },
  });

  const selectedMethod = watch("loginMethod");

  const handleLoginMethodChange = (method: LoginTypes) => {
    reset({
      loginMethod: method,
      email: method === "email" ? "" : undefined,
      phoneNumber: method === "phoneNumber" ? "" : undefined,
      password: "",
      remember: false,
    });
  };

  const onSubmit = async (bodyData: z.infer<typeof loginSchema>) => {
    const finalData: Partial<LoginFormInputProps> = {
      password: bodyData.password,
    };

    if (bodyData.loginMethod === "email" && bodyData.email) {
      finalData.email = bodyData.email;
    } else if (bodyData.loginMethod === "phoneNumber" && bodyData.phoneNumber) {
      finalData.phoneNumber = bodyData.phoneNumber;
    }

    mutateAsync(finalData, {
      onSettled(data, error) {
        if (data && !error) {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          if (data.user) {
            setUser(data.user);
          }
          if (bodyData.remember) {
            saveLocalToken(data?.token);
          } else {
            saveSessionToken(data?.token);
          }
          if (queryParams.login === "true") {
            removeParam("login");
          }
        }
        if (error) {
          console.error("Error from mutation:", error);
        }
      },
    });
  };
  return (
    <>
      {isPending && <LoadingPage text="Please wait" />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <TextDisplay
          content={LoginTextContent}
          contentClassName="mb-3 font-semibold"
        />
        <SocialAuth />
        <div className="w-full border-gradient p-px rounded-3xl overflow-hidden mx-auto">
          <div
            className={`shadow-light-dark-soft bg-platinum-black p-4 base:p-6 md:px-8 rounded-3xl space-y-6 mx-auto ${
              paths.includes("login")
                ? "max-w-[400px] lg:max-w-[500px] sm:w-[90%] lg:w-[500px]"
                : ""
            }`}
          >
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
                  className="!w-40"
                />
              )}
            />
            <div className="flex flex-col gap-5 lg:gap-6">
              {loginInputMapData?.map((item, index) => {
                const isPassword = item.name === "password";
                const isPhone = item.name === "phoneNumber";
                const isEmail = item.name === "email";
                const isEmailSelected = selectedMethod === "email";
                if (isPhone && isEmailSelected) return null;
                if (isEmail && !isEmailSelected) return null;
                return (
                  <div key={index}>
                    <Input
                      label={item.label}
                      register={register(item.name)}
                      inputProps={{
                        name: item.name,
                        placeholder: item.placeholder,
                        autoComplete: item.autoComplete,
                        type: isPassword
                          ? showPassword
                            ? "text"
                            : item.type
                          : item.type,
                      }}
                      icons={{
                        ...(isPassword && {
                          right: {
                            icon: showPassword ? (
                              <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                            ) : (
                              <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                            ),
                            onClick: () => setShowPassword((prev) => !prev),
                          },
                        }),

                        ...(isPhone && { left: { text: "+91" } }),
                      }}
                      error={errors?.[item.name]?.message}
                    />
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between gap-2 items-center">
                <Checkbox
                  register={register("remember")}
                  checkboxProps={{ name: "remember" }}
                  rightText="Remember"
                />
                <Link
                  to={"/forgot-password"}
                  className={`bg-clip-text text-transparent bg-accent-duo text-[10px] sm:text-[13px] md:text-sm mr-2 hover:underline whitespace-nowrap`}
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                pattern="primary"
                buttonProps={{ type: "submit" }}
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
    </>
  );
};

export default LoginForm;
