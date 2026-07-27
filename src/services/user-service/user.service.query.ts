import { useMutation, useQuery } from '@tanstack/react-query';

import { userApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import useUserStore from '@/stores/user.store';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';

const { session, update } = API_QUERY_KEYS.user_service.user;

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

export const useUpdateUser = () => {
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationKey: update,
    mutationFn: userApi.updateUser,
    onSuccess: ({ data, message }) => {
      if (data) setUser(data);
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
  });
};
