import { useCallback } from 'react';

import { analyzeBrand } from '../../../services/onboarding';
import type { MediaAttachment } from '../../../types/chat';
import type {
  AnalyzeBrandEvent,
  OnboardingCard,
  ExtractPdpResult,
  OnboardingSession,
  OnboardingUserInfo,
  SaveUserInfoPayload,
  CompleteOnboardingStepPayload,
  ValidateProductResult,
} from '../../../types/onboarding';
import type { TTryOn } from '../../../types';
import { BRAND_DNA_LOADING_TEXT } from '../onboarding.constants';
import type {
  BrandKitRawData,
  OnboardingLocalState,
  ProductAnswers,
} from '../onboarding.types';
import {
  getPostUserInfoStep,
  isValidHttpUrl,
  isTerminalProductCategory,
  isValidateProductReady,
  normalizeWebsiteUrl,
} from '../onboarding.utils';
import type { OnboardingDispatch } from './useOnboardingState';
import { useVtonManager } from './useVtonManager';

const DEFAULT_SIGNUP_TYPE = 'brand';
const getIndividualCompletionHoldKey = (sessionId?: string) =>
  sessionId ? `onboarding:individual:hold-complete:${sessionId}` : null;

const looksLikeUrl = (value: string) =>
  /^https?:\/\//i.test(value) || /^www\./i.test(value);

type CosmeticTryOnModalData = {
  productTitle: string;
  subCategory: TTryOn;
  variants: string[];
  productLink?: string;
};

type UserInfoResult = {
  handled: boolean;
  nextUserInfoAnswers?: Partial<OnboardingUserInfo>;
};

type UseOnboardingHandlersArgs = {
  session?: OnboardingSession;
  sessionWithUi?: OnboardingSession;
  state: OnboardingLocalState;
  effectiveUserInfoAnswers: Partial<OnboardingUserInfo>;
  effectiveValidateProductAnswers: ProductAnswers;
  isCollectingUserInfo: boolean;
  dispatch: OnboardingDispatch;
  appendText: (text: string, from: 'ai' | 'user') => void;
  appendCard: (card: OnboardingCard) => void;
  setCosmeticTryOnModalData: (data: CosmeticTryOnModalData | null) => void;
  refetch: () => Promise<unknown>;
  saveUserInfoMutation: {
    mutateAsync: (payload: SaveUserInfoPayload) => Promise<unknown>;
  };
  completeOnboardingStepMutation: {
    mutateAsync: (payload: CompleteOnboardingStepPayload) => Promise<unknown>;
  };
  extractPdpMutation: {
    mutateAsync: (payload: {
      url: string;
      category?: string;
      subCategory?: string;
    }) => Promise<Record<string, unknown>>;
  };
  validateProductMutation: {
    mutateAsync: (payload: {
      product_url: string;
      category: string;
      subCategory: string;
    }) => Promise<Record<string, unknown>>;
  };
  creativeStudioPhotoshootMutation: {
    mutateAsync: (payload: {
      productImage: File;
      personImage?: File;
      prompt: string;
      aspectRatio?: string;
    }) => Promise<{ resultImageUrl: string }>;
  };
  checkVtonHealthMutation: {
    mutateAsync: () => Promise<{ success?: boolean } | null | undefined>;
  };
  generateFashionVtonMutation: {
    mutateAsync: (formData: FormData) => Promise<unknown>;
  };
  waitForGeneratedMediaCompletion: (
    id: string
  ) => Promise<{ outputs: { url?: string }[] }>;
  fetchGeneratedMediaResultUrlWithRetry: (id: string) => Promise<string | null>;
  getQueueDescription: (
    queuePosition?: number,
    estimatedWaitSec?: number
  ) => string;
  isOtherSelection: (value?: string | null) => boolean;
  resolveTryOnSubCategory: (value?: string | null) => TTryOn;
};

export const useOnboardingHandlers = ({
  session,
  sessionWithUi,
  state,
  effectiveUserInfoAnswers,
  effectiveValidateProductAnswers,
  isCollectingUserInfo,
  dispatch,
  appendText,
  appendCard,
  setCosmeticTryOnModalData,
  refetch,
  saveUserInfoMutation,
  completeOnboardingStepMutation,
  extractPdpMutation,
  validateProductMutation,
  creativeStudioPhotoshootMutation,
  checkVtonHealthMutation,
  generateFashionVtonMutation,
  waitForGeneratedMediaCompletion,
  fetchGeneratedMediaResultUrlWithRetry,
  getQueueDescription,
  isOtherSelection,
  resolveTryOnSubCategory,
}: UseOnboardingHandlersArgs) => {
  const { runVton } = useVtonManager({
    checkVtonHealthMutation,
    generateFashionVtonMutation,
    waitForGeneratedMediaCompletion,
    fetchGeneratedMediaResultUrlWithRetry,
    getQueueDescription,
  });

  const handleAnalyzeBrand = useCallback(
    async (answer: string) => {
      if (!isValidHttpUrl(answer)) {
        throw new Error('Please enter a valid website URL.');
      }

      dispatch({ type: 'SET_STATUS', payload: 'analyzing' });
      dispatch({ type: 'SET_BRAND_ANALYSIS_LOADING', payload: true });

      const phasesHandled = new Set<string>();
      let latestBrandMeta: BrandKitRawData | null = null;
      let brandDnaMessageShown = false;

      try {
        const analyzedSession = await analyzeBrand(
          { url: normalizeWebsiteUrl(answer) },
          {
            onEvent: (event: AnalyzeBrandEvent) => {
              if (phasesHandled.has(event.phase)) return;
              phasesHandled.add(event.phase);

              const shouldShowBrandDnaLoadingMessage =
                event.phase === 'validating' ||
                event.phase === 'scraping' ||
                event.phase === 'logo' ||
                event.phase === 'brand_meta';

              if (shouldShowBrandDnaLoadingMessage) {
                if (event.phase === 'brand_meta') {
                  latestBrandMeta = event as BrandKitRawData;
                }
                if (brandDnaMessageShown) return;
                brandDnaMessageShown = true;
                appendText(BRAND_DNA_LOADING_TEXT, 'ai');
                return;
              }

              if (event.phase === 'error') {
                throw new Error(
                  event.message ?? 'Brand analysis failed. Please try again.'
                );
              }
            },
          }
        );

        dispatch({ type: 'SET_BRAND_ANALYSIS_COMPLETED', payload: true });
        dispatch({
          type: 'SET_PENDING_BRAND_KIT_RAW_DATA',
          payload:
            latestBrandMeta ??
            (analyzedSession.rawData as BrandKitRawData | undefined) ??
            null,
        });
        dispatch({ type: 'SET_BRAND_KIT_OPEN', payload: true });
        dispatch({ type: 'SET_ACTIVE_TAB', payload: 'brand-memory' });
        dispatch({ type: 'SET_PENDING_STEP', payload: 'validate-product' });
        await refetch();
      } catch (error) {
        appendText(
          'Retry and paste your website link again so we can continue.',
          'ai'
        );
        throw error;
      } finally {
        dispatch({
          type: 'SET_STATUS',
          payload: isCollectingUserInfo ? 'collecting' : 'idle',
        });
        dispatch({ type: 'SET_BRAND_ANALYSIS_LOADING', payload: false });
      }
    },
    [appendText, dispatch, isCollectingUserInfo, refetch]
  );

  const handleValidateProductStep = useCallback(
    async (answer: string, attachments: MediaAttachment[]) => {
      if (
        sessionWithUi?.signupType === 'individual' &&
        state.activeTab === 'cloth-try-on'
      ) {
        if (
          isOtherSelection(effectiveValidateProductAnswers.category) ||
          isOtherSelection(effectiveValidateProductAnswers.subCategory)
        ) {
          appendText(
            'Try-on is not available for the selected category. Type Next to enter the app.',
            'ai'
          );
          dispatch({ type: 'SET_PENDING_STEP', payload: 'complete' });
          return;
        }

        const { resultUrl } = await runVton({
          answer,
          attachments,
          category: effectiveValidateProductAnswers.category,
          subCategory: effectiveValidateProductAnswers.subCategory,
          onQueue: (message) => appendText(message, 'ai'),
        });

        appendCard({
          type: 'vton-result',
          resultUrl,
        });
        await completeOnboardingStepMutation.mutateAsync({
          stepKey: 'cloth_try_on',
          data: {
            resultUrl,
            category: effectiveValidateProductAnswers.category ?? null,
            subCategory: effectiveValidateProductAnswers.subCategory ?? null,
          },
        });
        dispatch({ type: 'SET_ACTIVE_TAB', payload: 'product-ad' });
        return;
      }

      if (
        sessionWithUi?.signupType === 'individual' &&
        state.activeTab === 'product-ad'
      ) {
        if (
          isOtherSelection(effectiveValidateProductAnswers.category) ||
          isOtherSelection(effectiveValidateProductAnswers.subCategory)
        ) {
          appendText(
            'Try-on is not available for the selected category. Type Next to enter the app.',
            'ai'
          );
          dispatch({ type: 'SET_PENDING_STEP', payload: 'complete' });
          return;
        }

        const imageFiles = attachments
          .filter(
            (attachment) => attachment.type === 'image' && attachment.file
          )
          .map((attachment) => attachment.file as File);

        if (imageFiles.length < 2) {
          throw new Error(
            'Please upload both images (a product image and your photo).'
          );
        }

        const prompt = answer.trim() ? answer.trim() : '';

        const personImage = imageFiles[0];
        const productImage = imageFiles[1];

        const { resultImageUrl } =
          await creativeStudioPhotoshootMutation.mutateAsync({
            productImage,
            personImage,
            prompt,
            aspectRatio: '1:1',
          });
        const isInlineBase64Result = resultImageUrl.startsWith('data:');
        const persistedResultUrl = isInlineBase64Result ? null : resultImageUrl;

        appendText(
          "And that's a wrap.\n\nYou just created a product campaign with yourself as the model.",
          'ai'
        );
        appendCard({
          type: 'individual-completion',
          resultUrl: resultImageUrl,
        });
        const completionHoldKey = getIndividualCompletionHoldKey(
          sessionWithUi?.sessionId
        );
        if (completionHoldKey) {
          sessionStorage.setItem(completionHoldKey, '1');
        }
        await completeOnboardingStepMutation.mutateAsync({
          stepKey: 'product_ad',
          data: {
            ...(persistedResultUrl ? { resultUrl: persistedResultUrl } : {}),
            prompt,
            category: effectiveValidateProductAnswers.category ?? null,
            subCategory: effectiveValidateProductAnswers.subCategory ?? null,
          },
        });
        // Hold must be set before mutateAsync: onSuccess updates the session cache
        // synchronously; if the backend marks session.status=completed for this step,
        // useOnboardingManager would navigate to /dashboard before this handler resumes.
        // Do not call completeOnboarding here: PATCH /onboarding/complete is for Continue.
        dispatch({ type: 'SET_PENDING_STEP', payload: 'complete' });
        return;
      }

      const trimmedAnswer = answer.trim();

      if (
        sessionWithUi?.signupType === 'brand' &&
        effectiveValidateProductAnswers.productUrl &&
        effectiveValidateProductAnswers.category &&
        effectiveValidateProductAnswers.subCategory
      ) {
        const nextInputLooksLikeUrl = /^https?:\/\//i.test(trimmedAnswer);

        if (nextInputLooksLikeUrl) {
          dispatch({
            type: 'SET_VALIDATE_PRODUCT_ANSWERS',
            payload: {
              productUrl: trimmedAnswer,
              category: '',
              subCategory: '',
            },
          });
          appendText('Great. What category does this product belong to?', 'ai');
          return;
        }

        if (sessionWithUi?.signupType === 'brand') {
          dispatch({
            type: 'SET_ACTIVE_TAB',
            payload: 'immersive-product-page',
          });
        }
        const result = (await validateProductMutation.mutateAsync({
          product_url: effectiveValidateProductAnswers.productUrl,
          category: effectiveValidateProductAnswers.category,
          subCategory: effectiveValidateProductAnswers.subCategory,
        })) as ValidateProductResult;
        // if (result.valid === false) {
        //   throw new Error(
        //     'Unable to validate this product. Please try another product URL.'
        //   );

        // }
        const productImages = result.productImages ?? [];

        if (result) {
          const productUrl =
            result.productUrl ??
            result.product_url ??
            effectiveValidateProductAnswers.productUrl ??
            '';
          const productName =
            result.productName ??
            result.product_name ??
            result.name ??
            'Your Product';
          const productShades =
            result.product_shades?.map((shade) => shade.hex).filter(Boolean) ??
            [];

          setCosmeticTryOnModalData({
            productTitle: productName,
            subCategory: resolveTryOnSubCategory(result.subCategory),
            variants: productShades,
            productLink: productUrl,
          });
          dispatch({
            type: 'SET_VALIDATED_PRODUCT_DETAILS',
            payload: {
              productName: productName || '',
              description: result.description || '',
              price: result.price || '',
              productUrl: productUrl,
              productImages: result.productImages || [],
              productColors: productShades,
              subCategory: result.subCategory || '',
            },
          });
        }

        if (productImages.length > 0) {
          appendCard({
            type: 'product-selection',
            images: productImages,
            productName:
              result.productName ??
              result.product_name ??
              result.name ??
              'Your Product',
            description: result.description ?? '',
            price: result.price ?? '',
          });
          return;
        }

        appendText(
          'Unable to fetch product images yet. Paste a different product URL or type "Retry" again.',
          'ai'
        );
        return;
      }

      if (!effectiveValidateProductAnswers.productUrl) {
        if (!trimmedAnswer) {
          throw new Error('Please paste a product page URL.');
        }
        if (!isValidHttpUrl(trimmedAnswer)) {
          throw new Error('Please enter a valid product URL.');
        }
        dispatch({
          type: 'PATCH_VALIDATE_PRODUCT_ANSWERS',
          payload: { productUrl: trimmedAnswer },
        });
        return;
      }

      if (!effectiveValidateProductAnswers.category) {
        const isTerminalCategory = isTerminalProductCategory(trimmedAnswer);
        const nextAnswers = {
          ...effectiveValidateProductAnswers,
          category: trimmedAnswer,
          subCategory: isTerminalCategory ? 'Others' : '',
        };

        dispatch({
          type: 'SET_VALIDATE_PRODUCT_ANSWERS',
          payload: nextAnswers,
        });

        if (!isTerminalCategory) return;
        if (!isValidateProductReady(nextAnswers)) return;

        if (sessionWithUi?.signupType === 'brand') {
          dispatch({
            type: 'SET_ACTIVE_TAB',
            payload: 'immersive-product-page',
          });
        }

        const result = (await validateProductMutation.mutateAsync({
          product_url: nextAnswers.productUrl!,
          category: nextAnswers.category!,
          subCategory: nextAnswers.subCategory!,
        })) as ValidateProductResult;

        // if (result.valid === false) {
        //   throw new Error(
        //     'Unable to validate this product. Please try another product URL.'
        //   );
        // }
        const productImages = result.productImages ?? [];

        if (result) {
          const productUrl =
            result.productUrl ??
            result.product_url ??
            effectiveValidateProductAnswers.productUrl ??
            '';
          const productName =
            result.productName ??
            result.product_name ??
            result.name ??
            'Your Product';
          const productShades =
            result.product_shades?.map((shade) => shade.hex).filter(Boolean) ??
            [];
          setCosmeticTryOnModalData({
            productTitle: productName,
            subCategory: resolveTryOnSubCategory(result.subCategory),
            variants: productShades,
            productLink: productUrl,
          });
          dispatch({
            type: 'SET_VALIDATED_PRODUCT_DETAILS',
            payload: {
              productName: productName || '',
              description: result.description || '',
              price: result.price || '',
              productUrl: productUrl,
              productImages: result.productImages || [],
              productColors: productShades,
              subCategory: result.subCategory || '',
            },
          });
        }

        if (productImages.length > 0) {
          appendCard({
            type: 'product-selection',
            images: productImages,
            productName: result.productName || 'Your Product',
            description: result.description ?? '',
            price: result.price ?? '',
          });
        }

        if (sessionWithUi?.signupType === 'brand') {
          return;
        }
        const resultUrl = result.advertisement?.resultUrl;

        if (resultUrl) {
          appendCard({
            type: 'brand-advertisement',
            resultUrl: resultUrl,
          });
        }

        dispatch({ type: 'SET_PENDING_STEP', payload: 'complete' });
        return;
      }

      if (!effectiveValidateProductAnswers.subCategory) {
        const nextAnswers = {
          ...effectiveValidateProductAnswers,
          subCategory: trimmedAnswer,
        };

        dispatch({
          type: 'SET_VALIDATE_PRODUCT_ANSWERS',
          payload: nextAnswers,
        });

        if (!isValidateProductReady(nextAnswers)) return;

        if (sessionWithUi?.signupType === 'brand') {
          dispatch({
            type: 'SET_ACTIVE_TAB',
            payload: 'immersive-product-page',
          });
        }

        const result = (await validateProductMutation.mutateAsync({
          product_url: nextAnswers.productUrl!,
          category: nextAnswers.category!,
          subCategory: nextAnswers.subCategory!,
        })) as ValidateProductResult;
        // if (result.valid === false) {
        //   throw new Error(
        //     'Unable to validate this product. Please try another product URL.'
        //   );
        // }
        const productImages = result.productImages ?? [];

        if (result) {
          const productUrl =
            result.productUrl ??
            result.product_url ??
            nextAnswers.productUrl ??
            '';
          const productName =
            result.productName ??
            result.product_name ??
            result.name ??
            'Your Product';
          const productShades =
            result.product_shades?.map((shade) => shade.hex).filter(Boolean) ??
            [];

          setCosmeticTryOnModalData({
            productTitle: productName,
            subCategory: resolveTryOnSubCategory(result.subCategory),
            variants: productShades,
            productLink: productUrl,
          });
          console.log(
            '🚀 ~ useOnboardingHandlers ~ productShades:',
            productShades
          );

          dispatch({
            type: 'SET_VALIDATED_PRODUCT_DETAILS',
            payload: {
              productName: productName || '',
              description: result.description || '',
              price: result.price || '',
              productUrl: productUrl,
              productImages: result.productImages || [],
              productColors: productShades,
              subCategory: result.subCategory || '',
            },
          });
        }
        if (productImages.length > 0) {
          appendCard({
            type: 'product-selection',
            images: productImages,
            productName:
              result.productName ??
              result.product_name ??
              result.name ??
              'Your Product',
            description: result.description ?? '',
            price: result.price ?? '',
          });
        }

        if (sessionWithUi?.signupType === 'brand') {
          return;
        }

        const advertisementUrl = result.advertisement?.resultUrl;
        if (advertisementUrl) {
          appendCard({
            type: 'brand-advertisement',
            resultUrl: advertisementUrl,
          });
        }

        dispatch({ type: 'SET_PENDING_STEP', payload: 'complete' });
      }
    },
    [
      appendCard,
      appendText,
      completeOnboardingStepMutation,
      creativeStudioPhotoshootMutation,
      dispatch,
      effectiveValidateProductAnswers,
      isOtherSelection,
      resolveTryOnSubCategory,
      runVton,
      sessionWithUi,
      setCosmeticTryOnModalData,
      state.activeTab,
      validateProductMutation,
    ]
  );

  const handleUserInfoAnswer = useCallback(
    async (answer: string): Promise<UserInfoResult> => {
      if (!isCollectingUserInfo) return { handled: false };

      dispatch({ type: 'SET_STATUS', payload: 'collecting' });

      const trimmedAnswer = answer.trim();

      if (!effectiveUserInfoAnswers.name) {
        if (looksLikeUrl(trimmedAnswer)) {
          throw new Error('Please enter your name, not a website URL.');
        }
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
        payload: getPostUserInfoStep(
          session?.signupType ?? DEFAULT_SIGNUP_TYPE
        ),
      });
      return { handled: true, nextUserInfoAnswers };
    },
    [
      dispatch,
      effectiveUserInfoAnswers,
      isCollectingUserInfo,
      saveUserInfoMutation,
      session?.signupType,
    ]
  );

  const handleIndividualBeautyAnswer = useCallback(
    async (answer: string): Promise<boolean> => {
      if (
        sessionWithUi?.signupType !== 'individual' ||
        state.activeTab !== 'beauty-try-on' ||
        isCollectingUserInfo
      ) {
        return false;
      }

      const trimmedAnswer = answer.trim();

      if (!state.individualBeautyAnswers.beautySubCategory) {
        dispatch({
          type: 'PATCH_INDIVIDUAL_BEAUTY_ANSWERS',
          payload: { beautySubCategory: trimmedAnswer },
        });
        return true;
      }

      if (!state.individualBeautyAnswers.beautyProductUrl) {
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

        const result = (await extractPdpMutation.mutateAsync({
          url: trimmedAnswer,
          category: 'Cosmetics',
          subCategory:
            state.individualBeautyAnswers.beautySubCategory ?? 'Others',
        })) as ExtractPdpResult;

        appendCard({
          type: 'product-selection',
          images: result.productImages ?? [],
          productName: result.productName ?? 'Beauty Product',
          description: result.description ?? '',
          price: result.price ?? '',
        });

        const resolvedSubCategory = resolveTryOnSubCategory(
          result.subCategory ?? state.individualBeautyAnswers.beautySubCategory
        );
        const variants =
          result.product_shades?.map((shade) => shade.hex).filter(Boolean) ??
          [];

        setCosmeticTryOnModalData({
          productTitle: result.productName ?? 'Beauty Product',
          subCategory: resolvedSubCategory,
          variants,
          productLink: trimmedAnswer,
        });
        return true;
      }

      return false;
    },
    [
      appendCard,
      dispatch,
      extractPdpMutation,
      isCollectingUserInfo,
      resolveTryOnSubCategory,
      sessionWithUi?.signupType,
      setCosmeticTryOnModalData,
      state.activeTab,
      state.individualBeautyAnswers.beautyProductUrl,
      state.individualBeautyAnswers.beautySubCategory,
    ]
  );

  return {
    handleAnalyzeBrand,
    handleValidateProductStep,
    handleUserInfoAnswer,
    handleIndividualBeautyAnswer,
  };
};
