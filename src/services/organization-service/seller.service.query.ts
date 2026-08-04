import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sellerApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type { IGetSellerApplicationsQuery } from '@/types/api.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { draft, me, get, approve, reject } = API_QUERY_KEYS.organization_service.seller;

/* -------------------------------------------------------------------------- */
/*                          SELLER-FACING (APPLICANT)                         */
/* -------------------------------------------------------------------------- */

export const useSaveDraftSellerApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: draft.save,
    mutationFn: sellerApi.saveDraftSellerApplication,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your application...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: draft.get });
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

export const useSubmitSellerApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: draft.submit,
    mutationFn: sellerApi.submitSellerApplication,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Sending your application for review...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: draft.get });
      await queryClient.invalidateQueries({ queryKey: me });
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

export const useGetDraftSellerApplication = ({ enabled = true } = {}) => {
  return useQuery({
    queryKey: draft.get,
    queryFn: sellerApi.getDraftSellerApplication,
    enabled,
    retry: false,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// Drives the /become-seller status screens: no application yet vs. draft/pending/approved/rejected.
export const useGetMySellerApplication = () => {
  return useQuery({
    queryKey: me,
    queryFn: sellerApi.getMySellerApplication,
    retry: false,
    select: (data) => data.data,
    staleTime: 60 * 1000, // Short — status can change as soon as an admin reviews it.
    gcTime: 15 * 60 * 1000,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

/* -------------------------------------------------------------------------- */
/*                               ADMIN REVIEW                                 */
/* -------------------------------------------------------------------------- */

export const useGetSellerApplications = (
  params: Omit<IGetSellerApplicationsQuery, 'page' | 'limit'>,
) => {
  return useInfiniteQuery({
    queryKey: [...get.dashboard.applications, ...Object.values(params)],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      sellerApi.getSellerApplications({ ...params, page: pageParam.toString(), limit: '15' }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;

      if (!pagination) return undefined;

      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },

    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,

    placeholderData: (prev) => prev,

    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    select: (data) => ({
      applications: data.pages.flatMap((page) => page.data?.applications ?? []),
      counts: data.pages[0]?.data?.counts,
    }),
  });
};

export const useGetSellerApplicationById = (sellerId: string) => {
  return useQuery({
    queryKey: [...get.dashboard.bySellerId({ sellerId }), sellerId],
    queryFn: () => sellerApi.getSellerApplicationById(sellerId),
    enabled: !!sellerId,
    select: (data) => data.data,
  });
};

export const useApproveSellerApplication = ({ sellerId = '' }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: approve({ sellerId }),
    mutationFn: sellerApi.approveSellerApplication,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Approving seller application...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: get.dashboard.applications });
      await queryClient.invalidateQueries({ queryKey: get.dashboard.bySellerId({ sellerId }) });
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

export const useRejectSellerApplication = ({ sellerId = '' }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: reject({ sellerId }),
    mutationFn: sellerApi.rejectSellerApplication,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Rejecting seller application...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: get.dashboard.applications });
      await queryClient.invalidateQueries({ queryKey: get.dashboard.bySellerId({ sellerId }) });
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
