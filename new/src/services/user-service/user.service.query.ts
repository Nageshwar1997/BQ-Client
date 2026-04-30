import { userApi } from '@/classes/apis';
import { GATEWAY_USER_SERVICE_QUERY_KEYS } from '@/constants/api.constant';
import useUserStore from '@/stores/user.store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const { session } = GATEWAY_USER_SERVICE_QUERY_KEYS.user;

export const useGetSessionUser = ({ enabled = true }) => {
  const setUser = useUserStore((s) => s.setUser);

  const query = useQuery({
    queryKey: session,
    queryFn: userApi.getSessionUser,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (query.isSuccess && query.data?.user) {
      setUser(query.data.user);
    }

    if (query.isError && !query.data?.user) {
      setUser(null);
    }
  }, [query.isSuccess, query.isError, query.data, setUser]);

  return query;
};
