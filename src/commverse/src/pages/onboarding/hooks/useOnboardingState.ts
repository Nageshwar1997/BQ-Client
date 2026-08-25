import type { Dispatch } from 'react';
import { useReducer } from 'react';

import type { OnboardingHeaderTab } from '../components/MemoryHeader';
import type {
  OnboardingLocalState,
  OnboardingStateAction,
} from '../onboarding.types';

const initialState: OnboardingLocalState = {
  status: 'idle',
  showingPipeline: false,
  pipelineComplete: false,
  activeTab: 'brand-memory' as OnboardingHeaderTab,
  isBrandKitOpen: false,
  confirmedBrandKitData: null,
  isBrandAnalysisLoading: false,
  submitError: null,
  pendingStep: null,
  userInfoAnswers: {},
  validateProductAnswers: {},
  individualBeautyAnswers: {},
  brandAdvertisementData: null,
  pendingBrandKitRawData: null,
  validatedProductDetails: null,
  isImmersivePDPOpen: false,
  messages: [],
  brandDnaAppended: false,
  brandAnalysisCompleted: false,
  brandKitHydrated: false,
  deploymentSuccessAppended: false,
};

function onboardingStateReducer(
  state: OnboardingLocalState,
  action: OnboardingStateAction
): OnboardingLocalState {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_SHOWING_PIPELINE':
      return { ...state, showingPipeline: action.payload };
    case 'SET_PIPELINE_COMPLETE':
      return { ...state, pipelineComplete: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_BRAND_KIT_OPEN':
      return { ...state, isBrandKitOpen: action.payload };
    case 'SET_CONFIRMED_BRAND_KIT_DATA':
      return { ...state, confirmedBrandKitData: action.payload };
    case 'SET_BRAND_ANALYSIS_LOADING':
      return { ...state, isBrandAnalysisLoading: action.payload };
    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.payload };
    case 'SET_PENDING_STEP':
      return { ...state, pendingStep: action.payload };
    case 'SET_USER_INFO_ANSWERS':
      return { ...state, userInfoAnswers: action.payload };
    case 'PATCH_USER_INFO_ANSWERS':
      return {
        ...state,
        userInfoAnswers: { ...state.userInfoAnswers, ...action.payload },
      };
    case 'SET_VALIDATE_PRODUCT_ANSWERS':
      return { ...state, validateProductAnswers: action.payload };
    case 'PATCH_VALIDATE_PRODUCT_ANSWERS':
      return {
        ...state,
        validateProductAnswers: {
          ...state.validateProductAnswers,
          ...action.payload,
        },
      };
    case 'SET_INDIVIDUAL_BEAUTY_ANSWERS':
      return { ...state, individualBeautyAnswers: action.payload };
    case 'PATCH_INDIVIDUAL_BEAUTY_ANSWERS':
      return {
        ...state,
        individualBeautyAnswers: {
          ...state.individualBeautyAnswers,
          ...action.payload,
        },
      };
    case 'SET_BRAND_ADVERTISEMENT_DATA':
      return { ...state, brandAdvertisementData: action.payload };
    case 'SET_PENDING_BRAND_KIT_RAW_DATA':
      return { ...state, pendingBrandKitRawData: action.payload };
    case 'SET_VALIDATED_PRODUCT_DETAILS':
      return { ...state, validatedProductDetails: action.payload };
    case 'SET_IMMERSIVE_PDP_OPEN':
      return { ...state, isImmersivePDPOpen: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'APPEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_BRAND_DNA_APPENDED':
      return { ...state, brandDnaAppended: action.payload };
    case 'SET_BRAND_ANALYSIS_COMPLETED':
      return { ...state, brandAnalysisCompleted: action.payload };
    case 'SET_BRAND_KIT_HYDRATED':
      return { ...state, brandKitHydrated: action.payload };
    case 'SET_DEPLOYMENT_SUCCESS_APPENDED':
      return { ...state, deploymentSuccessAppended: action.payload };
    default:
      return state;
  }
}

export function useOnboardingState() {
  return useReducer(onboardingStateReducer, initialState);
}

export type OnboardingDispatch = Dispatch<OnboardingStateAction>;
