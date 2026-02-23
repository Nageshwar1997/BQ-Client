import { QUERY_KEYS } from '@/Constants';
import { useMutation } from '@tanstack/react-query';
import { AuthApi } from '../Api';
import { toaster } from '@/Utils';
import { Store } from '@/Stores';

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
    const { user } = Store.User();
    return useMutation({
      mutationKey: QUERY_KEYS.auth.logout,
      mutationFn: () => this.logout(user?._id),
      onError: (error) => console.log('Error from logout user:', error),
    });
  };
}
