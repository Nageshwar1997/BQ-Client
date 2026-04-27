import type { TRegister, TRegisterEmail, TRegisterOtp } from '@/types/schema.type';
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
      headers: { Authorization: otpToken },
    });
  };

  public registerVerifyOtp = ({ otpToken, ...data }: TRegisterOtp & { otpToken: string }) => {
    return this.request({
      ...this.routes.register.verify_otp,
      data,
      headers: { Authorization: otpToken },
    });
  };

  public registerSaveUser = (data: TRegister) => {
    return this.request({
      ...this.routes.register.save_user,
      data,
    });
  };

  /* ===================== LOGIN API ===================== */
}
