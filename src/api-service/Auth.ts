import { useMutation } from '@tanstack/react-query';
import type { TLogin, TParams } from '../types';
import { ApiRequest } from './ApiRequest';
import { toaster } from '../utils';
import { store } from '../store';
import { QUERY_KEYS } from '../constants';

class AuthApi extends ApiRequest {
  protected login = (data: Partial<TLogin>) => {
    return this.request({ ...this.routes.auth.login, data });
  };
  protected logout = (userId?: string) => {
    const { method, url } = this.routes.auth.logout;
    return this.request({ method, url: `${url}/${userId}` });
  };
  protected send_otp = (email: string) => {
    const { method, url } = this.routes.auth.register.send_otp;
    return this.request({ method, url, params: { email } });
  };
  protected resend_otp = (params: TParams) => {
    const { method, url } = this.routes.auth.register.resend_otp;
    return this.request({ method, url, params });
  };
  protected verify_otp_and_register = ({
    otpToken,
    data,
  }: {
    otpToken: string;
    data: FormData;
  }) => {
    const { method, url } = this.routes.auth.register.verify_otp;
    return this.request({ method, url, params: { otpToken }, data });
  };
}

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
