import type { MutableRefObject } from 'react';

import type { MediaAttachment } from '../../../types/chat';
import type {
  OnboardingCard,
  OnboardingSession,
} from '../../../types/onboarding';
import {
  inferGarmentType,
  isValidHttpUrl,
  isTerminalProductCategory,
  isValidateProductReady,
} from '../onboarding.utils';
import type { OnboardingDispatch } from '../hooks/useOnboardingState';

interface ValidateProductFlowArgs {
  answer: string;
  attachments: MediaAttachment[];
  sessionWithUi?: OnboardingSession;
  activeTab: string;
  effectiveValidateProductAnswers: {
    productUrl?: string | null;
    category?: string | null;
    subCategory?: string | null;
  };
  dispatch: OnboardingDispatch;
  appendText: (text: string, from: 'ai' | 'user') => void;
  appendCard: (card: OnboardingCard) => void;
  validateProductMutation: {
    mutateAsync: (payload: {
      product_url: string;
      category: string;
      subCategory: string;
    }) => Promise<{
      productImages: string[];
      product_name?: string;
      description?: string;
      advertisement?: { resultUrl?: string };
    }>;
  };
  extractPdpMutation: {
    mutateAsync: (payload: { url: string }) => Promise<{
      productImages?: string[];
      productName?: string;
      description?: string;
      price?: string;
    }>;
  };
  generateVtonMutation: {
    mutateAsync: (payload: {
      personImage: File;
      garmentImage: File;
      garmentType: string;
    }) => Promise<{ resultUrl: string }>;
  };
  brandDnaAppendedRef: MutableRefObject<boolean>;
}

export const runValidateProductFlow = async ({
  answer,
  attachments,
  sessionWithUi,
  activeTab,
  effectiveValidateProductAnswers,
  dispatch,
  appendText,
  appendCard,
  validateProductMutation,
  extractPdpMutation,
  generateVtonMutation,
  brandDnaAppendedRef,
}: ValidateProductFlowArgs) => {
  if (
    sessionWithUi?.signupType === 'individual' &&
    activeTab === 'cloth-try-on'
  ) {
    const imageFiles = attachments
      .filter((attachment) => attachment.type === 'image')
      .map((attachment) => attachment.file)
      .filter((file): file is File => file instanceof File);

    if (imageFiles.length < 2) {
      throw new Error(
        'Upload your photo and one garment image to generate a virtual try-on.'
      );
    }

    const inferredGarmentType =
      inferGarmentType(answer) ??
      inferGarmentType(
        `${effectiveValidateProductAnswers.category ?? ''} ${effectiveValidateProductAnswers.subCategory ?? ''}`
      ) ??
      'dress';

    const result = await generateVtonMutation.mutateAsync({
      personImage: imageFiles[0],
      garmentImage: imageFiles[1],
      garmentType: inferredGarmentType,
    });

    appendCard({
      type: 'vton-result',
      resultUrl: result.resultUrl,
    });
    appendText(
      'Your virtual try-on is ready. Type Next to enter the app.',
      'ai'
    );
    dispatch({ type: 'SET_PENDING_STEP', payload: 'complete' });
    return;
  }

  if (
    sessionWithUi?.signupType === 'individual' &&
    activeTab === 'product-ad'
  ) {
    const result = await extractPdpMutation.mutateAsync({
      url: answer.trim(),
    });

    if ((result.productImages?.length ?? 0) > 0) {
      appendCard({
        type: 'product-selection',
        images: result.productImages ?? [],
        productName: result.productName ?? 'Your Product',
        description: result.description ?? '',
        price: result.price ?? '',
      });
    }

    appendText(
      (result.productImages?.length ?? 0) > 0
        ? 'We extracted your product details. Select your preferred image and click Next to enter the app.'
        : 'We extracted your product details. Type Next to enter the app.',
      'ai'
    );
    dispatch({ type: 'SET_PENDING_STEP', payload: 'complete' });
    return;
  }

  const trimmedAnswer = answer.trim();

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


    const result = await validateProductMutation.mutateAsync({
      product_url: nextAnswers.productUrl!,
      category: nextAnswers.category!,
      subCategory: nextAnswers.subCategory!,
    });

    if (result.productImages.length > 0) {
      appendCard({
        type: 'product-selection',
        images: result.productImages,
        productName: result.product_name ?? 'Your Product',
        description: result.description ?? '',
        price: '',
      });
    }

    if (sessionWithUi?.signupType === 'brand') {
      return;
    }

    if (result.advertisement?.resultUrl) {
      appendCard({
        type: 'brand-advertisement',
        resultUrl: result.advertisement.resultUrl,
      });
    }

    if (!brandDnaAppendedRef.current) {
      appendCard({ type: 'brand-dna-ready' });
      brandDnaAppendedRef.current = true;
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


    const result = await validateProductMutation.mutateAsync({
      product_url: nextAnswers.productUrl!,
      category: nextAnswers.category!,
      subCategory: nextAnswers.subCategory!,
    });

    if (result.productImages.length > 0) {
      appendCard({
        type: 'product-selection',
        images: result.productImages,
        productName: result.product_name ?? 'Your Product',
        description: result.description ?? '',
        price: '',
      });
    }

    if (sessionWithUi?.signupType === 'brand') {
      return;
    }

    if (result.advertisement?.resultUrl) {
      appendCard({
        type: 'brand-advertisement',
        resultUrl: result.advertisement.resultUrl,
      });
    }

    if (!brandDnaAppendedRef.current) {
      appendCard({ type: 'brand-dna-ready' });
      brandDnaAppendedRef.current = true;
    }

    dispatch({ type: 'SET_PENDING_STEP', payload: 'complete' });
  }
};
