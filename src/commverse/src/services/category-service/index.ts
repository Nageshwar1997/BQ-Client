import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api';
import type { TQueryParams } from '../../types';

export const useGetCategories = (params?: TQueryParams) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
    select: (data) => {
      return data?.data;
    },
  });
};
