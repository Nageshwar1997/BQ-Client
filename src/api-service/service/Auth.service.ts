import { useMutation } from '@tanstack/react-query';
import { AuthApi } from '../api';
import { QUERY_KEYS } from '../../constants';
import { toaster } from '../../utils';
import { store } from '../../store';

export class AuthService extends AuthApi {
  public Login = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.login,
      mutationFn: this.login,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };
  public SendOtp = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.register.send_otp,
      mutationFn: this.send_otp,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };
  public ResendOtp = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.register.resend_otp,
      mutationFn: this.resend_otp,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => {
        if (typeof error === 'string') {
          toaster('error', (error as string).replace(' Go Back', ''));
        } else {
          toaster('error', error);
        }
      },
    });
  };
  public VerifyOtpAndRegister = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.auth.register.verify_otp,
      mutationFn: this.verify_otp_and_register,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };
  public Logout = () => {
    const { user } = store.user();
    return useMutation({
      mutationKey: QUERY_KEYS.auth.logout,
      mutationFn: () => this.logout(user?._id),
      onError: (error) => console.log('Error from logout user:', error),
    });
  };
}
