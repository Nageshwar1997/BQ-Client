import type { TStringRecord } from '@/Types/Common.type';
import { ApiRequest } from '../ApiRequest';

export class UserApi extends ApiRequest {
  protected get_user = () => {
    return this.request(this.routes.users.user.details, { isPrivateRoute: true });
  };

  protected update_user = (data: FormData) => {
    return this.request({ ...this.routes.users.user.update, data }, { isPrivateRoute: true });
  };

  protected change_password = (data: TStringRecord) => {
    return this.request(
      { ...this.routes.users.user.password.change, data },
      { isPrivateRoute: true },
    );
  };

  protected update_password = (data: TStringRecord) => {
    return this.request(
      { ...this.routes.users.user.password.update, data },
      { isPrivateRoute: true },
    );
  };

  protected reset_password_token_validity_check = (token: string) => {
    return this.request({
      ...this.routes.users.user.password.token_validity.reset_password_check,
      headers: { Authorization: token },
    });
  };

  protected forgot_password_token_validity_check = (token: string) => {
    return this.request({
      ...this.routes.users.user.password.token_validity.forgot_password_check,
      headers: { Authorization: token },
    });
  };

  protected reset_password_send_link = () => {
    return this.request(this.routes.users.user.password.link.reset_password_send, {
      isPrivateRoute: true,
    });
  };

  protected forgot_password_send_link = (email: string) => {
    return this.request({
      ...this.routes.users.user.password.link.forgot_password_send,
      data: { email },
    });
  };

  protected forgot_password_resend_link = (token: string) => {
    return this.request({
      ...this.routes.users.user.password.link.forgot_password_resend,
      headers: { Authorization: token },
    });
  };

  protected reset_password = (data: TStringRecord) => {
    const { token, ...restData } = data;

    return this.request({
      ...this.routes.users.user.password.reset,
      headers: { Authorization: token },
      data: restData,
    });
  };

  protected forgot_password = (data: TStringRecord) => {
    const { token, ...restData } = data;

    return this.request({
      ...this.routes.users.user.password.forgot,
      headers: { Authorization: token },
      data: restData,
    });
  };

  protected apply_seller = (data: FormData) => {
    return this.request({ ...this.routes.users.seller.apply, data }, { isPrivateRoute: true });
  };

  protected get_wishlist = () => {
    return this.request(this.routes.users.wishlist.get, { isPrivateRoute: true });
  };

  protected add_product_to_wishlist = (productId: string) => {
    const { method, url } = this.routes.users.wishlist.add;
    return this.request({ method, url: `${url}/${productId}` }, { isPrivateRoute: true });
  };

  protected remove_product_from_wishlist = (productId: string) => {
    const { method, url } = this.routes.users.wishlist.remove;
    return this.request({ method, url: `${url}/${productId}` }, { isPrivateRoute: true });
  };
}
