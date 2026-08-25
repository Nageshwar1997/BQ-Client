import type {
  OnboardingBrandKitData,
  OnboardingChatLine,
  OnboardingStepId,
  OnboardingUserInfo,
  VoiceValue,
} from '../../types/onboarding';
import type { OnboardingHeaderTab } from './components/MemoryHeader';

export type OnboardingStatus = 'idle' | 'collecting' | 'analyzing' | 'pipeline';

export type ProductAnswers = {
  productUrl?: string | null;
  category?: string | null;
  subCategory?: string | null;
};

export type BeautyAnswers = {
  beautySubCategory?: string | null;
  beautyProductUrl?: string | null;
};

export type BrandAdvertisementData = {
  originalImageUrl: string;
  resultUrl: string;
  bgRemovedImage?: string | null;
  originalImageKey?: string | null;
  resultImageKey?: string | null;
  bgRemovedImageKey?: string | null;
};

export type ValidatedProductDetails = {
  productName?: string | null;
  description?: string | null;
  price?: string | null;
  productUrl?: string | null;
  productImages?: string[] | null;
  productColors?: string[] | null;
  subCategory?: string | null;
};

export type BrandKitRawData = {
  brandName?: string;
  logoText?: string;
  primaryColors?: string[];
  secondaryColors?: string[];
  vibe?:
  | string
  | {
    description?: string;
    keywords?: string[];
    voice?: Partial<Record<keyof OnboardingBrandKitData['vibe']['voice'], VoiceValue>>;
  };
  vibeKeywords?: string[];
  typography?: {
    heading?: string;
    body?: string;
    description?: string;
  };
  [key: string]: unknown;
};

export type OnboardingLocalState = {
  status: OnboardingStatus;
  showingPipeline: boolean;
  pipelineComplete: boolean;
  activeTab: OnboardingHeaderTab;
  isBrandKitOpen: boolean;
  confirmedBrandKitData: OnboardingBrandKitData | null;
  isBrandAnalysisLoading: boolean;
  submitError: string | null;
  pendingStep: OnboardingStepId | null;
  userInfoAnswers: Partial<OnboardingUserInfo>;
  validateProductAnswers: ProductAnswers;
  individualBeautyAnswers: BeautyAnswers;
  brandAdvertisementData: BrandAdvertisementData | null;
  pendingBrandKitRawData: BrandKitRawData | null;
  validatedProductDetails: ValidatedProductDetails | null;
  isImmersivePDPOpen: boolean;
  messages: OnboardingChatLine[];
  brandDnaAppended: boolean;
  brandAnalysisCompleted: boolean;
  brandKitHydrated: boolean;
  deploymentSuccessAppended: boolean;
};

export type OnboardingStateAction =
  | { type: 'SET_STATUS'; payload: OnboardingStatus }
  | { type: 'SET_SHOWING_PIPELINE'; payload: boolean }
  | { type: 'SET_PIPELINE_COMPLETE'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: OnboardingHeaderTab }
  | { type: 'SET_BRAND_KIT_OPEN'; payload: boolean }
  | { type: 'SET_CONFIRMED_BRAND_KIT_DATA'; payload: OnboardingBrandKitData | null }
  | { type: 'SET_BRAND_ANALYSIS_LOADING'; payload: boolean }
  | { type: 'SET_SUBMIT_ERROR'; payload: string | null }
  | { type: 'SET_PENDING_STEP'; payload: OnboardingStepId | null }
  | { type: 'SET_USER_INFO_ANSWERS'; payload: Partial<OnboardingUserInfo> }
  | { type: 'PATCH_USER_INFO_ANSWERS'; payload: Partial<OnboardingUserInfo> }
  | { type: 'SET_VALIDATE_PRODUCT_ANSWERS'; payload: ProductAnswers }
  | { type: 'PATCH_VALIDATE_PRODUCT_ANSWERS'; payload: ProductAnswers }
  | { type: 'SET_INDIVIDUAL_BEAUTY_ANSWERS'; payload: BeautyAnswers }
  | { type: 'PATCH_INDIVIDUAL_BEAUTY_ANSWERS'; payload: BeautyAnswers }
  | { type: 'SET_BRAND_ADVERTISEMENT_DATA'; payload: BrandAdvertisementData | null }
  | { type: 'SET_PENDING_BRAND_KIT_RAW_DATA'; payload: BrandKitRawData | null }
  | { type: 'SET_VALIDATED_PRODUCT_DETAILS'; payload: ValidatedProductDetails | null }
  | { type: 'SET_IMMERSIVE_PDP_OPEN'; payload: boolean }
  | { type: 'SET_MESSAGES'; payload: OnboardingChatLine[] }
  | { type: 'APPEND_MESSAGE'; payload: OnboardingChatLine }
  | { type: 'SET_BRAND_DNA_APPENDED'; payload: boolean }
  | { type: 'SET_BRAND_ANALYSIS_COMPLETED'; payload: boolean }
  | { type: 'SET_BRAND_KIT_HYDRATED'; payload: boolean }
  | { type: 'SET_DEPLOYMENT_SUCCESS_APPENDED'; payload: boolean };
