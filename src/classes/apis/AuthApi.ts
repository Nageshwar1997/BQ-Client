import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type {
  TChangePassword,
  TEmail,
  TLogin,
  TOtp,
  TPasswords,
  TRegister,
  TSetPassword,
} from '@/typess/schema.type';
import { ApiRequest } from '../ApiRequest';

export class AuthApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.gateway.user_service.auth;

  constructor() {
    super('gateway-user-service');
  }

  /* ===================== REGISTER API ===================== */

  public registerSendOtp = (data: TEmail) => {
    return this.request({ ...this.routes.register.send_otp, data });
  };

  public registerResendOtp = (token: string) => {
    return this.request({
      ...this.routes.register.resend_otp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public registerVerifyOtp = ({ token, ...data }: TOtp & { token: string }) => {
    return this.request({
      ...this.routes.register.verify_otp,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public registerSaveUser = ({ token, ...data }: TRegister & { token: string }) => {
    return this.request({
      ...this.routes.register.save_user,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  /* ===================== LOGIN API ===================== */

  public manualLogin = (data: TLogin) => {
    return this.request({ ...this.routes.login.manual, data });
  };

  /* ===================== PASSWORD API ===================== */

  public forgotPasswordSendOtp = (data: TEmail) => {
    return this.request({ ...this.routes.password.forgot.send_otp, data });
  };

  public forgotPasswordResendOtp = (token: string) => {
    return this.request({
      ...this.routes.password.forgot.resend_otp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordVerifyOtp = ({ token, ...data }: TOtp & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.verify_otp,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordSave = ({ token, ...data }: TPasswords & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.save,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public changePassword = (data: TChangePassword) => {
    return this.request({ ...this.routes.password.change, data });
  };

  public setPassword = (data: TSetPassword) => {
    return this.request({ ...this.routes.password.set, data });
  };

  /* ===================== USER ===================== */

  // public getMe = () => {
  //   return this.request({
  //     method: 'GET',
  //     url: '/auth/me',
  //   });
  // };

  // public logout = () => {
  //   return this.request({
  //     method: 'POST',
  //     url: '/auth/logout',
  //   });
  // };
}
