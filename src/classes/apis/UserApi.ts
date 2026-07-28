import type {
  TChangePasswordZodSchema,
  TEmailZodSchema,
  TLoginZodSchema,
  TOtpZodSchema,
  TPasswordsZodSchema,
  TRegisterZodSchema,
  TSetPasswordZodSchema,
  TUpdateUserZodSchema,
} from '@beautinique/frontend-types';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type { IUser } from '@/types/api.type';

import { ApiRequest } from '../ApiRequest';

export class AuthApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.user_service.auth;

  /* ===================== REGISTER API ===================== */

  public registerSendOtp = (data: TEmailZodSchema) => {
    return this.request<string>({ ...this.routes.register.sendOtp, data });
  };

  public registerResendOtp = (token: string) => {
    return this.request<number>({
      ...this.routes.register.resendOtp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public registerVerifyOtp = ({ token, ...data }: TOtpZodSchema & { token: string }) => {
    return this.request<never>({
      ...this.routes.register.verifyOtp,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public registerSaveUser = ({ token, ...data }: TRegisterZodSchema & { token: string }) => {
    return this.request<IUser>({
      ...this.routes.register.saveUser,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  /* ===================== LOGIN API ===================== */

  public login = (data: TLoginZodSchema) => {
    return this.request<IUser>({ ...this.routes.login.manual, data });
  };

  /* ===================== PASSWORD API ===================== */

  public forgotPasswordSendOtp = (data: TEmailZodSchema) => {
    return this.request<string>({ ...this.routes.password.forgot.sendOtp, data });
  };

  public forgotPasswordResendOtp = (token: string) => {
    return this.request<number>({
      ...this.routes.password.forgot.resendOtp,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordVerifyOtp = ({ token, ...data }: TOtpZodSchema & { token: string }) => {
    return this.request({
      ...this.routes.password.forgot.verifyOtp,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public forgotPasswordSave = ({ token, ...data }: TPasswordsZodSchema & { token: string }) => {
    return this.request<IUser>({
      ...this.routes.password.forgot.save,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  public changePassword = (data: TChangePasswordZodSchema) => {
    return this.request<IUser>({ ...this.routes.password.change, data });
  };

  public setPassword = (data: TSetPasswordZodSchema) => {
    return this.request<IUser>({ ...this.routes.password.set, data });
  };

  /* ===================== LOGOUT API ===================== */

  public logout = () => {
    return this.request(this.routes.logout);
  };
}
export class UserApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.user_service.user;

  /* ===================== GET API ===================== */

  public getSessionUser = async () => {
    return this.request<IUser>(this.routes.session);
  };

  /* ===================== UPDATE API ===================== */

  public updateUser = (data: TUpdateUserZodSchema) => {
    return this.request<IUser>({ ...this.routes.update, data });
  };
}
