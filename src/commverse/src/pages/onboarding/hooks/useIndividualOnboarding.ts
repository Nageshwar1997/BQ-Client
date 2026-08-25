import { useCallback } from 'react';

import type { MediaAttachment } from '../../../types/chat';
import type { OnboardingSession, OnboardingUserInfo, OnboardingStepId } from '../../../types/onboarding';
import type { OnboardingLocalState } from '../onboarding.types';

export type UseIndividualOnboardingArgs = {
  session?: OnboardingSession;
  state: OnboardingLocalState;
  isSubmitLocked: boolean;
  setIsSubmitLocked: (value: boolean) => void;
  handleUserInfoAnswer: (
    answer: string
  ) => Promise<{ handled: boolean; nextUserInfoAnswers?: Partial<OnboardingUserInfo> }>;
  handleIndividualBeautyAnswer: (answer: string) => Promise<boolean>;
  handleStepAnswer: (
    effectiveStep: OnboardingStepId | undefined,
    answer: string,
    attachments: MediaAttachment[]
  ) => Promise<boolean>;
  handleSubmitError: (error: unknown) => void;
  finalizeSubmitStatus: (nextUserInfoAnswers?: Partial<OnboardingUserInfo>) => void;
  clearSubmitError: () => void;
};

export const useIndividualOnboarding = ({
  session,
  state,
  isSubmitLocked,
  setIsSubmitLocked,
  handleUserInfoAnswer,
  handleIndividualBeautyAnswer,
  handleStepAnswer,
  handleSubmitError,
  finalizeSubmitStatus,
  clearSubmitError,
}: UseIndividualOnboardingArgs) => {
  const handleSubmitAnswer = useCallback(
    async (answer: string, attachments: MediaAttachment[] = []) => {
      if (isSubmitLocked) return;
      setIsSubmitLocked(true);

      const effectiveStep = state.pendingStep ?? session?.currentStep;
      let nextUserInfoAnswers: Partial<OnboardingUserInfo> | undefined;

      try {
        clearSubmitError();
        const userInfoResult = await handleUserInfoAnswer(answer);
        if (userInfoResult?.handled) {
          nextUserInfoAnswers = userInfoResult.nextUserInfoAnswers;
          return;
        }
        if (await handleIndividualBeautyAnswer(answer)) return;
        if (await handleStepAnswer(effectiveStep, answer, attachments)) return;
      } catch (error) {
        handleSubmitError(error);
      } finally {
        setIsSubmitLocked(false);
        finalizeSubmitStatus(nextUserInfoAnswers);
      }
    },
    [
      clearSubmitError,
      finalizeSubmitStatus,
      handleIndividualBeautyAnswer,
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
