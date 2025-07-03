import { useMutation } from "@tanstack/react-query";
import { login_user, register_user } from "./auth.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";
import { LoginFormInputProps } from "../../types";

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (bodyData: Partial<LoginFormInputProps>) =>
      login_user(bodyData),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Login successful!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Something went wrong!"
      );
    },
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (bodyData: FormData) => register_user(bodyData),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Registration successful!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Something went wrong!"
      );
    },
  });
};
