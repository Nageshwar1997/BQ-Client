import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sellerApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster } from '@/utils/api.util';

const { draft, me } = API_QUERY_KEYS.organization_service.seller;

/* ================== SAVE DRAFT STEP ================== */
export const useSaveDraftSeller = () => {
  return useMutation({
    mutationKey: draft.save,
    mutationFn: sellerApi.saveDraftSeller,
    onError: (error) => {
      handleApiErrorToaster(error);
    },
  });
};

/* ================== GET DRAFT (resume) ================== */
export const useGetDraftSeller = (enabled: boolean) => {
  return useQuery({
    queryKey: draft.get,
    queryFn: sellerApi.getDraftSeller,
    enabled,

    staleTime: 0, // always fresh on the one mount that needs it - never refetched after
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,

    select: (data) => data.data,
  });
};

/* ================== SUBMIT DRAFT ================== */
export const useSubmitSellerDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: draft.submit,
    mutationFn: sellerApi.submitSellerDraft,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: me });
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
  });
};

/* ================== MY APPLICATION (status tracking) ================== */
export const useGetMySeller = () => {
  return useQuery({
    queryKey: me,
    queryFn: sellerApi.getMySeller,

    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,

    select: (data) => data.data,
  });
};
