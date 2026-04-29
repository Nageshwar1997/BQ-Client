import { userApi } from '@/classes/apis';
import { GATEWAY_USER_SERVICE_QUERY_KEYS } from '@/constants/api.constant';
import useUserStore from '@/stores/user.store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const { session } = GATEWAY_USER_SERVICE_QUERY_KEYS.user;

export const useGetSessionUser = () => {
  const setUser = useUserStore((s) => s.setUser);

  const query = useQuery({
    queryKey: session,
    queryFn: userApi.getSessionUser,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    console.log('query.data useEffect', query.data);
    // if (query.isSuccess) {
    //   setUser(query.data);
    // }

    // if (query.isError) {
    //   setUser(null);
    // }
  }, [query.isSuccess, query.isError, query.data, setUser]);

  return query;
};
