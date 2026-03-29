import type { TLogin, TRegister } from '@/Types/Schema.type';
import type { TParams } from '@/Types/Common.type';
import { ApiRequest } from '../ApiRequest';

export class AuthApi extends ApiRequest {
  protected login = (data: Partial<TLogin>) => {
    return this.request({ ...this.routes.auth.login, data });
  };
  protected logout = (userId?: string) => {
    const { method, url } = this.routes.auth.logout;
    return this.request({ method, url: `${url}/${userId}` });
  };
  protected send_otp = (data: Pick<TRegister, 'email'>) => {
    const { method, url } = this.routes.auth.register.send_otp;
    return this.request({ method, url, data });
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
  protected send_forgot_password_link_and_otp = (email: string) => {
    const { method, url } = this.routes.auth.password.send_forgot_password_link_and_otp;
    return this.request({ method, url, data: { email } });
  };
  protected resend_forgot_password_link_and_otp = (otpLinkToken: string) => {
    const { method, url } = this.routes.auth.password.resend_forgot_password_link_and_otp;
    return this.request({ method, url, headers: { Authorization: otpLinkToken } });
  };
  protected verify_forgot_password_otp = (data: TParams) => {
    return this.request({
      ...this.routes.auth.password.verify_forgot_password_otp,
      data: { otp: data.otp },
      headers: { Authorization: data.token },
    });
  };
  protected validate_forgot_password_token = (token: string) => {
    const { method, url } = this.routes.auth.password.validate_forgot_password_token;
    return this.request({ method, url, headers: { Authorization: token } });
  };
  protected set_forgot_password = (data: TParams) => {
    const { token, ...rest } = data;
    const { method, url } = this.routes.auth.password.set_forgot_password;
    return this.request({ method, url, headers: { Authorization: token }, data: rest });
  };
}
