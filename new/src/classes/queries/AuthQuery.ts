import { useMutation } from '@tanstack/react-query';
import { AuthApi } from '../apis/AuthApi';
import { QUERY_KEYS } from '@/constants/api.constant';
import { toaster } from '@/utils/common.util';
export class AuthQuery {
  private api = new AuthApi();
  private queryKeys = QUERY_KEYS.gateway.user_service.auth;
  public registerSendOtp() {
    return useMutation({
      mutationKey: this.queryKeys.register.send_otp,
      mutationFn: this.api.registerSendOtp,
      onSuccess: ({ message }) => toaster.success({ title: 'OTP Sent', description: message }),
      onError: ({ globalErrors, message }) => {
        if (globalErrors?.length) {
          globalErrors.forEach((error) => {
            toaster.error({ title: 'Failed to send OTP', description: error });
          });
        } else {
          toaster.error({ title: 'Failed to send OTP', description: message });
        }
      },
    });
  }
}
