import { ApiRequest } from '../ApiRequest';

export class AuthApi extends ApiRequest {
  constructor() {
    super('gateway-user-service');
  }

  /* ===================== REGISTER API ===================== */
  public registerSendOtp() {
    return this.request(this.routes.gateway.user_service.auth.register.send_otp);
  }
  public registerResendOtp() {
    return this.request(this.routes.gateway.user_service.auth.register.resend_otp);
  }

  public registerVerifyOtp() {
    return this.request(this.routes.gateway.user_service.auth.register.verify_otp);
  }

  public registerSaveUser() {
    return this.request(this.routes.gateway.user_service.auth.register.save_user);
  }

  /* ===================== LOGIN API ===================== */
}
