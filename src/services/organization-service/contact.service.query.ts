import { useMutation } from '@tanstack/react-query';

import { contactApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { create } = API_QUERY_KEYS.organization_service.contact;

export const useCreateContactQuery = () => {
  return useMutation({
    mutationKey: create,
    mutationFn: contactApi.createContactQuery,
    onMutate: () => {
      const toastId = toaster.loading({ title: 'Please wait...', description: 'Logging in...' });
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
