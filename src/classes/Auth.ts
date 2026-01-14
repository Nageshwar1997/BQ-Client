import { useMutation } from '@tanstack/react-query';
import type { TQueryParams } from '../types';
import Request from './Request';

export class AuthApi extends Request {
  protected login = () => {
    return this.request({ ...this.routes.auth.login });
  };
  protected logout = (userId: string) => {
    const { method, url } = this.routes.auth.logout;
    return this.request({ method, url: `${url}/${userId}` });
  };
  protected send_otp = (email: string) => {
    const { method, url } = this.routes.auth.register.send_otp;
    return this.request({ method, url, params: { email } });
  };
  protected resend_otp = (params: TQueryParams) => {
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
    this._toast('Registering...', 'success');
    return this.request({ method, url, params: { otpToken }, data });
  };
}

export class AuthService extends AuthApi {
  public useLogin = () => {
    return useMutation({
      mutationKey: ['login'],
      mutationFn: this.login,
      onSuccess: (data) => this._toast(data?.message, 'success'), // data.message
      onError: (error) => this._toast(error, 'error'), // error
    });
  };
}
