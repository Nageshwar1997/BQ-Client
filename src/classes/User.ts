import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiRequest } from '.';

class UserApi extends ApiRequest {
  protected get_user_details = () => {
    return this.request({
      ...this.routes.users.user.details,
      headers: { Authorization: this.token },
    });
  };
}

export class UserService extends UserApi {
  public Details = (enabled: boolean = true) => {
    return useQuery({
      queryKey: ['get_user_details', !!this.token],
      queryFn: this.get_user_details,
      retry: false,
      staleTime: Infinity,
      gcTime: Infinity,
      enabled,
      placeholderData: keepPreviousData,
    });
  };
}
