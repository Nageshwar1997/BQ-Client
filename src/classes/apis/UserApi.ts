import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type {
  TChangePassword,
  TEmail,
  TLogin,
  TOtp,
  TPasswords,
  TRegister,
  TSetPassword,
} from '@/types/schema.type';
import { ApiRequest } from '../ApiRequest';

export class AuthApi extends ApiRequest {
  private readonly routes = API_METHODS_AND_URLS.user_service.auth;

  /* ===================== REGISTER API ===================== */

  public registerSendOtp = (data: TEmail) => {
    return this.request({ ...this.routes.register.sendOtp, data });
  };

  public registerResendOtp = (token: string) => {
    return this.request({
      ...this.routes.register.resendOtp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public registerVerifyOtp = ({ token, ...data }: TOtp & { token: string }) => {
    return this.request({
      ...this.routes.register.verifyOtp,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public registerSaveUser = ({ token, ...data }: TRegister & { token: string }) => {
    return this.request({
      ...this.routes.register.saveUser,
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
    return this.request({ ...this.routes.password.forgot.sendOtp, data });
  };

  public forgotPasswordResendOtp = (token: string) => {
    return this.request({
      ...this.routes.password.forgot.resendOtp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordVerifyOtp = ({ token, ...data }: TOtp & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.verifyOtp,
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

  // public logout = () => {
  //   return this.request({
  //     method: 'POST',
  //     url: '/auth/logout',
  //   });
  // };
}

export class UserApi extends ApiRequest {
  private readonly routes = API_METHODS_AND_URLS.user_service.user;

  /* ===================== GET API ===================== */

  public getSessionUser = async () => {
    return this.request(this.routes.session);
  };
}
