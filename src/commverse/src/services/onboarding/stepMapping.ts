import type {
  OnboardingFlowStep,
  OnboardingFlowStepKey,
  OnboardingSignupType,
  OnboardingStepId,
} from '../../types/onboarding';

export const LEGACY_BRAND_PRODUCT_STEP_KEY = 'product_link_and_generation';

export const mapFlowStepKeyToUiStep = (
  stepKey: OnboardingFlowStepKey | null,
  signupType: OnboardingSignupType
): OnboardingStepId | null => {
  if (!stepKey) return null;

  switch (stepKey) {
    case 'user_info':
      return 'user-info';
    case 'brand_analysis':
      return 'analyze-brand';
    case 'product_link':
    case 'marketing_image':
    case LEGACY_BRAND_PRODUCT_STEP_KEY:
      return 'validate-product';
    case 'immersive_product_page':
      return 'creation-pipeline';
    case 'beauty_try_on':
    case 'cloth_try_on':
    case 'product_ad':
      return signupType === 'individual' ? 'validate-product' : 'complete';
    default:
      return null;
  }
};

export const getProductStepDataFromFlow = (
  flowSteps: OnboardingFlowStep[]
): Record<string, unknown> => {
  const step = flowSteps.find(
    (item) =>
      item.stepKey === 'product_link' ||
      item.stepKey === LEGACY_BRAND_PRODUCT_STEP_KEY
  );
  return step?.data && typeof step.data === 'object' ? step.data : {};
};

export const isImmersiveProductPageStep = (
  stepKey: OnboardingFlowStepKey | null | undefined
) => stepKey === 'immersive_product_page';
