import { useMutation } from "@tanstack/react-query";
import {
  login_user,
  logout_user,
  register_user_resend_otp,
  register_user_send_otp,
  register_user_verify_otp,
} from "./auth.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";
import { useUserStore } from "../../store/user.store";

export const useLoginUser = () => {
  return useMutation({
    mutationKey: ["login_user"],
    mutationFn: login_user,
    onSuccess: (data) => toastSuccessMessage(data?.message),
    onError: (error) => toastErrorMessage(error),
  });
};

export const useLogout = () => {
  const { localLogout, user } = useUserStore();

  const { mutateAsync } = useMutation({
    mutationKey: ["logout_user"],
    mutationFn: logout_user,
    onError: (error) => console.log("Error from logout user:", error),
  });
  const logout = async () => {
    try {
      if (user?._id) await mutateAsync(user?._id); // call the backend logout API
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      localLogout();
    }
  };

  return { logout };
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
