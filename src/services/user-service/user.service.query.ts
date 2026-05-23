import { userApi } from '@/classes/apis';
import { USER_SERVICE_QUERY_KEYS } from '@/constants/api.constants';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const { session } = USER_SERVICE_QUERY_KEYS.user;

export const useGetSessionUser = ({ enabled = true }) => {
  return useQuery({
    queryKey: session,
    queryFn: userApi.getSessionUser,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min
    enabled,
    placeholderData: keepPreviousData,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
