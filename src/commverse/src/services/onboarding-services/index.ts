import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { syncUserSessionFromCurrentToken } from '../../lib/syncUserSession';
import {
  brandAdvertisement,
  creativeStudioPhotoshoot,
  completeOnboarding,
  completeOnboardingStep,
  extractPdp,
  getOnboardingSession,
  removeBackground,
  resolveOnboardingUserType,
  saveUserInfo,
  startOnboarding,
  validateProduct,
} from '../onboarding';

export const useGetOnboardingSession = (options?: {
  refetchInterval?: number | false;
}) => {
  return useQuery({
    queryKey: ['onboarding-session'],
    queryFn: getOnboardingSession,
    retry: false,
    refetchInterval: (query) => {
      if (query.state.status === 'error') return false;
      return options?.refetchInterval ?? false;
    },
  });
};

export const useStartOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['start-onboarding'],
    mutationFn: startOnboarding,
    onSuccess: (data) => {
      queryClient.setQueryData(['onboarding-session'], data);
    },
  });
};

export const useResolveOnboardingUserType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['resolve-onboarding-user-type'],
    mutationFn: resolveOnboardingUserType,
    onSuccess: (data) => {
      queryClient.setQueryData(['onboarding-session'], data);
    },
  });
};

export const useSaveUserInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['save-onboarding-user-info'],
    mutationFn: saveUserInfo,
    onSuccess: (data) => {
      queryClient.setQueryData(['onboarding-session'], data);
    },
  });
};

export const useValidateProduct = () => {
  return useMutation({
    mutationKey: ['validate-onboarding-product'],
    mutationFn: validateProduct,
  });
};

export const useExtractPdp = () => {
  return useMutation({
    mutationKey: ['extract-onboarding-pdp'],
    mutationFn: extractPdp,
  });
};

export const useRemoveBackground = () => {
  return useMutation({
    mutationKey: ['remove-onboarding-background'],
    mutationFn: removeBackground,
  });
};

export const useBrandAdvertisement = () => {
  return useMutation({
    mutationKey: ['brand-onboarding-advertisement'],
    mutationFn: brandAdvertisement,
  });
};

export const useCreativeStudioPhotoshoot = () => {
  return useMutation({
    mutationKey: ['creative-studio-photoshoot'],
    mutationFn: creativeStudioPhotoshoot,
  });
};

export const useCompleteOnboardingStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['complete-onboarding-step'],
    mutationFn: completeOnboardingStep,
    onSuccess: async (data) => {
      queryClient.setQueryData(['onboarding-session'], data);
      const profile = await syncUserSessionFromCurrentToken();
      if (profile !== undefined) {
        queryClient.setQueryData(['get-user-detail'], profile);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['get-user-detail'] });
      }
    },
  });
};

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['complete-onboarding'],
    mutationFn: completeOnboarding,
    onSuccess: async (data) => {
      queryClient.setQueryData(['onboarding-session'], data);
      const profile = await syncUserSessionFromCurrentToken();
      if (profile !== undefined) {
        queryClient.setQueryData(['get-user-detail'], profile);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['get-user-detail'] });
      }
    },
  });
};
