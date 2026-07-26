import { useQuery } from '@tanstack/react-query';

import { userApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';

const { session } = API_QUERY_KEYS.user_service.user;

export const useGetSessionUser = ({ enabled = true }) => {
  return useQuery({
    queryKey: session,
    queryFn: userApi.getSessionUser,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min
    enabled,
    placeholderData: (prev) => prev,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    select: (data) => data.data,
  });
};
