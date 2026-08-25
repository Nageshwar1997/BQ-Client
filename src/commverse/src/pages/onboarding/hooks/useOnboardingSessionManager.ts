import { useMemo } from 'react';

import { useGetOnboardingSession } from '../../../services/onboarding-services';
import type { OnboardingSession } from '../../../types/onboarding';

type UseOnboardingSessionManagerParams = {
  refetchInterval: number | false;
};

type OnboardingSessionState = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  session: OnboardingSession | undefined;
  sessionId: string | undefined;
  currentStep: OnboardingSession['currentStep'] | undefined;
  signupType: OnboardingSession['signupType'] | undefined;
  status: OnboardingSession['status'] | undefined;
  refetch: () => Promise<unknown>;
};

export function useOnboardingSessionManager({
  refetchInterval,
}: UseOnboardingSessionManagerParams): OnboardingSessionState {
  const { data: session, isLoading, isError, error, refetch } =
    useGetOnboardingSession({
      refetchInterval,
    });

  const sessionId = session?.sessionId;
  const currentStep = session?.currentStep;
  const signupType = session?.flow?.userType ?? session?.signupType;
  const status = session?.flow?.status ?? session?.status;
  const errorMessage = error instanceof Error ? error.message : null;

  return useMemo(
    () => ({
      isLoading,
      isError,
      errorMessage,
      session,
      sessionId,
      currentStep,
      signupType,
      status,
      refetch,
    }),
    [
      isError,
      isLoading,
      errorMessage,
      currentStep,
      refetch,
      session,
      sessionId,
      signupType,
      status,
    ]
  );
}
