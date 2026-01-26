import type { TLogin, TParams } from '../../types';
import { ApiRequest } from '../ApiRequest';

export class AuthApi extends ApiRequest {
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
