import type {
  OnboardingSession,
  OnboardingUserInfo,
  SaveUserInfoPayload,
} from '../../../types/onboarding';
import { getPostUserInfoStep, isUserInfoIncomplete } from '../onboarding.utils';
import type { OnboardingDispatch } from '../hooks/useOnboardingState';

const DEFAULT_SIGNUP_TYPE = 'brand';

interface UserInfoFlowArgs {
  answer: string;
  isCollectingUserInfo: boolean;
  effectiveUserInfoAnswers: Partial<OnboardingUserInfo>;
  dispatch: OnboardingDispatch;
  saveUserInfoMutation: {
    mutateAsync: (payload: SaveUserInfoPayload) => Promise<unknown>;
  };
  session?: OnboardingSession;
}

export const runUserInfoFlow = async ({
  answer,
  isCollectingUserInfo,
  effectiveUserInfoAnswers,
  dispatch,
  saveUserInfoMutation,
  session,
}: UserInfoFlowArgs): Promise<{
  handled: boolean;
  nextUserInfoAnswers?: Partial<OnboardingUserInfo>;
}> => {
  if (!isCollectingUserInfo) return { handled: false };

  dispatch({ type: 'SET_STATUS', payload: 'collecting' });

  const trimmedAnswer = answer.trim();

  if (!effectiveUserInfoAnswers.name) {
    const nextUserInfoAnswers = {
      ...effectiveUserInfoAnswers,
      name: trimmedAnswer,
    };
    dispatch({
      type: 'PATCH_USER_INFO_ANSWERS',
      payload: { name: trimmedAnswer },
    });
    return { handled: true, nextUserInfoAnswers };
  }

  if (!effectiveUserInfoAnswers.location) {
    const nextUserInfoAnswers = {
      ...effectiveUserInfoAnswers,
      location: trimmedAnswer,
    };
    dispatch({
      type: 'PATCH_USER_INFO_ANSWERS',
      payload: { location: trimmedAnswer },
    });
    return { handled: true, nextUserInfoAnswers };
  }

  if (!effectiveUserInfoAnswers.profession) {
    const nextUserInfoAnswers = {
      ...effectiveUserInfoAnswers,
      profession: trimmedAnswer,
    };
    dispatch({
      type: 'PATCH_USER_INFO_ANSWERS',
      payload: { profession: trimmedAnswer },
    });
    return { handled: true, nextUserInfoAnswers };
  }

  const nextUserInfoAnswers = {
    ...effectiveUserInfoAnswers,
    referralSource: trimmedAnswer,
  };
  const payload: SaveUserInfoPayload = {
    name: effectiveUserInfoAnswers.name ?? '',
    location: effectiveUserInfoAnswers.location ?? '',
    profession: effectiveUserInfoAnswers.profession ?? '',
    referralSource: trimmedAnswer,
  };

  dispatch({
    type: 'PATCH_USER_INFO_ANSWERS',
    payload: { referralSource: trimmedAnswer },
  });
  await saveUserInfoMutation.mutateAsync(payload);

  dispatch({
    type: 'SET_PENDING_STEP',
    payload: getPostUserInfoStep(session?.signupType ?? DEFAULT_SIGNUP_TYPE),
  });

  return { handled: true, nextUserInfoAnswers };
};

export const resolveNextStatusAfterUserInfo = (
  nextUserInfoAnswers: Partial<OnboardingUserInfo> | undefined,
  effectiveUserInfoAnswers: Partial<OnboardingUserInfo>
) => {
  const answersForStatus = nextUserInfoAnswers ?? effectiveUserInfoAnswers;
  return isUserInfoIncomplete(answersForStatus) ? 'collecting' : 'idle';
};
