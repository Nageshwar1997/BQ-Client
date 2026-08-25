import type { OnboardingCard, OnboardingSession } from '../../../types/onboarding';
import type { OnboardingDispatch } from '../hooks/useOnboardingState';
import { isValidHttpUrl } from '../onboarding.utils';

interface IndividualBeautyFlowArgs {
  answer: string;
  sessionWithUi?: OnboardingSession;
  activeTab: string;
  isCollectingUserInfo: boolean;
  individualBeautyAnswers: {
    beautySubCategory?: string;
    beautyProductUrl?: string;
  };
  dispatch: OnboardingDispatch;
  appendText: (text: string, from: 'ai' | 'user') => void;
  appendCard: (card: OnboardingCard) => void;
  extractPdpMutation: {
    mutateAsync: (payload: { url: string }) => Promise<{
      productImages?: string[];
      productName?: string;
      description?: string;
      price?: string;
    }>;
  };
}

export const runIndividualBeautyFlow = async ({
  answer,
  sessionWithUi,
  activeTab,
  isCollectingUserInfo,
  individualBeautyAnswers,
  dispatch,
  appendText,
  appendCard,
  extractPdpMutation,
}: IndividualBeautyFlowArgs): Promise<boolean> => {
  if (
    sessionWithUi?.signupType !== 'individual' ||
    activeTab !== 'beauty-try-on' ||
    isCollectingUserInfo
  ) {
    return false;
  }

  const trimmedAnswer = answer.trim();

  if (!individualBeautyAnswers.beautySubCategory) {
    dispatch({
      type: 'PATCH_INDIVIDUAL_BEAUTY_ANSWERS',
      payload: { beautySubCategory: trimmedAnswer },
    });
    return true;
  }

  if (!individualBeautyAnswers.beautyProductUrl) {
    if (!trimmedAnswer) {
      throw new Error('Please paste a beauty product link.');
    }
    if (!isValidHttpUrl(trimmedAnswer)) {
      throw new Error('Please enter a valid product URL.');
    }

    dispatch({
      type: 'PATCH_INDIVIDUAL_BEAUTY_ANSWERS',
      payload: { beautyProductUrl: trimmedAnswer },
    });

    const result = await extractPdpMutation.mutateAsync({ url: trimmedAnswer });

    if ((result.productImages?.length ?? 0) > 0) {
      appendCard({
        type: 'product-selection',
        images: result.productImages ?? [],
        productName: result.productName ?? 'Beauty Product',
        description: result.description ?? '',
        price: result.price ?? '',
      });
    }

    appendText(
      'We extracted your beauty product. Select your preferred image and click Next to continue.',
      'ai'
    );
    return true;
  }

  return false;
};
