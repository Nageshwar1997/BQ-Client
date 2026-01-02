import { useMutation } from "@tanstack/react-query";
import {
  login_user,
  register_user_resend_otp,
  register_user_send_otp,
  register_user_verify_otp,
} from "./auth.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";

export const useLoginUser = () => {
  return useMutation({
    mutationKey: ["login_user"],
    mutationFn: login_user,
    onSuccess: (data) => toastSuccessMessage(data?.message),
    onError: (error) => toastErrorMessage(error),
  });
};

export const useRegisterUserSendOtp = () => {
  return useMutation({
    mutationKey: ["register_user_send_otp"],
    mutationFn: register_user_send_otp,
    onSuccess: (data) => toastSuccessMessage(data?.message),
    onError: (error) => toastErrorMessage(error),
  });
};

export const useRegisterUserResendOtp = () => {
  return useMutation({
    mutationKey: ["register_user_resend_otp"],
    mutationFn: register_user_resend_otp,
    onSuccess: (data) => toastSuccessMessage(data?.message),
    onError: (error) => {
      if (typeof error === "string") {
        toastErrorMessage((error as string).replace(" Go Back", ""));
      } else {
        toastErrorMessage(error);
      }
    },
  });
};

export const useRegisterUserVerifyOtp = () => {
  return useMutation({
    mutationKey: ["register_user_verify_otp"],
    mutationFn: register_user_verify_otp,
    onSuccess: (data) => toastSuccessMessage(data?.message),
    onError: (error) => toastErrorMessage(error),
  });
};
