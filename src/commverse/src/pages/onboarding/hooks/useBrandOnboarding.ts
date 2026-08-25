import { useCallback } from 'react';

import type { MediaAttachment } from '../../../types/chat';
import type { OnboardingSession, OnboardingUserInfo, OnboardingStepId } from '../../../types/onboarding';
import type { OnboardingLocalState } from '../onboarding.types';

export type UseBrandOnboardingArgs = {
  session?: OnboardingSession;
  state: OnboardingLocalState;
  brandAnalysisCompleted: boolean;
  isSubmitLocked: boolean;
  setIsSubmitLocked: (value: boolean) => void;
  handleUserInfoAnswer: (
    answer: string
  ) => Promise<{ handled: boolean; nextUserInfoAnswers?: Partial<OnboardingUserInfo> }>;
  handleStepAnswer: (
    effectiveStep: OnboardingStepId | undefined,
    answer: string,
    attachments: MediaAttachment[]
  ) => Promise<boolean>;
  handleSubmitError: (error: unknown) => void;
  finalizeSubmitStatus: (nextUserInfoAnswers?: Partial<OnboardingUserInfo>) => void;
  clearSubmitError: () => void;
};

export const useBrandOnboarding = ({
  session,
  state,
  brandAnalysisCompleted,
  isSubmitLocked,
  setIsSubmitLocked,
  handleUserInfoAnswer,
  handleStepAnswer,
  handleSubmitError,
  finalizeSubmitStatus,
  clearSubmitError,
}: UseBrandOnboardingArgs) => {
  const handleSubmitAnswer = useCallback(
    async (answer: string, attachments: MediaAttachment[] = []) => {
      if (isSubmitLocked) return;
      setIsSubmitLocked(true);

      const resolvedStep = state.pendingStep ?? session?.currentStep;
      const effectiveStep =
        resolvedStep === 'analyze-brand' && brandAnalysisCompleted
          ? 'validate-product'
          : resolvedStep;

      let nextUserInfoAnswers: Partial<OnboardingUserInfo> | undefined;

      try {
        clearSubmitError();
        const userInfoResult = await handleUserInfoAnswer(answer);
        if (userInfoResult?.handled) {
          nextUserInfoAnswers = userInfoResult.nextUserInfoAnswers;
          return;
        }
        if (await handleStepAnswer(effectiveStep, answer, attachments)) return;
      } catch (error) {
        handleSubmitError(error);
      } finally {
        setIsSubmitLocked(false);
        finalizeSubmitStatus(nextUserInfoAnswers);
      }
    },
    [
      brandAnalysisCompleted,
      clearSubmitError,
      finalizeSubmitStatus,
      handleStepAnswer,
      handleSubmitError,
      handleUserInfoAnswer,
      isSubmitLocked,
      session?.currentStep,
      setIsSubmitLocked,
      state.pendingStep,
    ]
  );

  return { handleSubmitAnswer };
};
