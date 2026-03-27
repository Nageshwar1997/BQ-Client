import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddressApi } from '../Api/Address.api';
import { InvalidateQueries } from '../InvalidateQueries';
import { QUERY_KEYS } from '@/Constants';
import { oldToaster } from '@/Utils/Common.util';

export class AddressService extends AddressApi {
  public GetAddresses = () => {
    return useQuery({
      queryKey: QUERY_KEYS.addresses.get,
      queryFn: this.get_user_addresses,
      retry: false,
      staleTime: Infinity,
      gcTime: Infinity,
      placeholderData: keepPreviousData,
    });
  };

  public AddAddress = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.addresses.add,
      mutationFn: this.add_address,
      onSuccess: ({ message }) => (oldToaster('success', message), invalidate.addresses()),
      onError: ({ message }) => oldToaster('error', message),
    });
  };

  public UpdateAddress = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.addresses.update,
      mutationFn: this.update_address,
      onSuccess: ({ message }) => (oldToaster('success', message), invalidate.addresses()),
      onError: ({ message }) => oldToaster('error', message.replace(' Go Back', '')),
    });
  };

  public DeleteAddress = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.addresses.delete,
      mutationFn: this.delete_address,
      onSuccess: ({ message }) => (oldToaster('success', message), invalidate.addresses()),
      onError: ({ message }) => oldToaster('error', message),
    });
  };
}
