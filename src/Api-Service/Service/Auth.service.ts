import { QUERY_KEYS } from '@/Constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthApi } from '../Api/Auth.api';
import { toaster } from '@/Utils/Common.util';
import { UserStore } from '@/Stores';

export class AuthService extends AuthApi {
  public Login = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.login,
      mutationFn: this.login,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };
  public SendOtp = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.register.send_otp,
      mutationFn: this.send_otp,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };
  public ResendOtp = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.register.resend_otp,
      mutationFn: this.resend_otp,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message.replace(' Go Back', '')),
    });
  };
  public VerifyOtpAndRegister = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.register.verify_otp,
      mutationFn: this.verify_otp_and_register,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };
  public Logout = () => {
    const { user } = UserStore();
    return useMutation({
      mutationKey: QUERY_KEYS.auth.logout,
      mutationFn: () => this.logout(user?._id),
      onError: (error) => console.log('Error from logout user:', error),
    });
  };
  public SendForgotPasswordLinkAndOtp = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.password.send_forgot_password_link_and_otp,
      mutationFn: this.send_forgot_password_link_and_otp,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };
  public ResendForgotPasswordLinkAndOtp = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.password.resend_forgot_password_link_and_otp,
      mutationFn: this.resend_forgot_password_link_and_otp,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };
  public VerifyForgotPasswordOtp = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.password.verify_forgot_password_otp,
      mutationFn: this.verify_forgot_password_otp,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };
  public ValidateForgotPasswordToken = (token: string) => {
    return useQuery({
      queryKey: QUERY_KEYS.auth.password.validate_forgot_password_token,
      queryFn: () => this.validate_forgot_password_token(token),
      enabled: !!token,
      retry: false,
    });
  };
  public SetForgotPassword = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.password.set_forgot_password,
      mutationFn: this.set_forgot_password,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
    });
  };
}
