import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddressApi } from '../api';
import { QUERY_KEYS } from '../../constants';
import { toaster } from '../../utils';
import { InvalidateQueries } from '../InvalidateQueries';

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
      onSuccess: (data) => (toaster('success', data?.message), invalidate.addresses()),
      onError: (error) => toaster('error', error),
    });
  };

  public UpdateAddress = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.addresses.update,
      mutationFn: this.update_address,
      onSuccess: (data) => (toaster('success', data?.message), invalidate.addresses()),
      onError: (error) => {
        if (typeof error === 'string') {
          toaster('error', (error as string).replace(' Go Back', ''));
        } else {
          toaster('error', error);
        }
      },
    });
  };

  public DeleteAddress = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);
    return useMutation({
      mutationKey: QUERY_KEYS.addresses.delete,
      mutationFn: this.delete_address,
      onSuccess: (data) => (toaster('success', data?.message), invalidate.addresses()),
      onError: (error) => toaster('error', error),
    });
  };
}
