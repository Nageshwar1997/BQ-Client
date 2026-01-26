import type { IAddress, TAddress } from '../../types';
import { ApiRequest } from '../ApiRequest';

export class AddressApi extends ApiRequest {
  protected get_user_addresses = () => {
    return this.request(this.routes.addresses.get);
  };
  protected add_address = (data: TAddress) => {
    return this.request({ ...this.routes.addresses.add, data });
  };
  protected update_address = (data: Partial<IAddress> & { removedOptionalFields?: string[] }) => {
    const { _id, ...restBody } = data;

    const { method, url } = this.routes.addresses.update;
    return this.request({ method, url: `${url}/${_id}`, data: restBody });
  };
  protected delete_address = (id: string) => {
    const { method, url } = this.routes.addresses.delete;
    return this.request({ method, url: `${url}/${id}` });
  };
}
