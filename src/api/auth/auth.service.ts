import { useMutation } from "@tanstack/react-query";
import {
  login_user,
  register_user_send_otp,
  register_user_verify_otp,
} from "./auth.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";

export const useLoginUser = () => {
  return useMutation({
    mutationFn: login_user,
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

export const useRegisterUserSendOtp = () => {
  return useMutation({
    mutationFn: register_user_send_otp,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Registration successful!");
    },
    onError: (error) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Something went wrong!"
      );
    },
  });
};

export const useRegisterUserVerifyOtp = () => {
  return useMutation({
    mutationFn: register_user_verify_otp,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Registration successful!");
    },
    onError: (error) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Something went wrong!"
      );
    },
  });
};
