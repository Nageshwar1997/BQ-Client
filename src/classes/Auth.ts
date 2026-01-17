import { useMutation } from '@tanstack/react-query';
import type { TLogin, TParams } from '../types';
import Request from './Request';
import { toaster } from '../utils';

class AuthApi extends Request {
  protected login = (data: Partial<TLogin>) => {
    return this.request({ ...this.routes.auth.login, data });
  };
  protected logout = (userId: string) => {
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
  protected register_and_verify_otp = ({
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
      mutationKey: ['login'],
      mutationFn: this.login,
      onSuccess: (data) => toaster('success', data?.message),
      onError: (error) => toaster('error', error),
    });
  };
  public useLogout = () => {};
}
