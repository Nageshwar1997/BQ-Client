import type { TLogin, TRegister, TRegisterEmail, TRegisterOtp } from '@/types/schema.type';
import { ApiRequest } from '../ApiRequest';
import { API_METHODS_AND_URLS } from '@/constants/api.constant';

export class AuthApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.gateway.user_service.auth;

  constructor() {
    super('gateway-user-service');
  }

  /* ===================== REGISTER API ===================== */

  public registerSendOtp = (data: TRegisterEmail) => {
    return this.request({ ...this.routes.register.send_otp, data });
  };

  public registerResendOtp = ({ otpToken, ...data }: TRegisterEmail & { otpToken: string }) => {
    return this.request({
      ...this.routes.register.resend_otp,
      data,
      headers: { Authorization: `Bearer ${otpToken}` },
    });
  };

  public registerVerifyOtp = ({ otpToken, ...data }: TRegisterOtp & { otpToken: string }) => {
    return this.request({
      ...this.routes.register.verify_otp,
      data,
      headers: { Authorization: `Bearer ${otpToken}` },
    });
  };

  public registerSaveUser = ({ otpToken, ...data }: TRegister & { otpToken: string }) => {
    return this.request({
      ...this.routes.register.save_user,
      data,
      headers: { Authorization: `Bearer ${otpToken}` },
    });
  };

  /* ===================== LOGIN API ===================== */

  public manualLogin = (data: TLogin) => {
    return this.request({ ...this.routes.login.manual, data });
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
