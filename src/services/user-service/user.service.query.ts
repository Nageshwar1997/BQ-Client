import { useMutation, useQuery } from '@tanstack/react-query';

import { userApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { session, update, password } = API_QUERY_KEYS.user_service.user;

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
  return useMutation({
    mutationKey: update,
    mutationFn: userApi.updateUser,
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: password.change,
    mutationFn: userApi.changePassword,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Changing your password...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useSetPassword = () => {
  return useMutation({
    mutationKey: password.set,
    mutationFn: userApi.setPassword,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Setting your password...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};
