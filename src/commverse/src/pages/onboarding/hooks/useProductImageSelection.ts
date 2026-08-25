import { useCallback, useRef } from 'react';
import type { OnboardingCard, OnboardingSession } from '../../../types/onboarding';
import type { OnboardingLocalState } from '../onboarding.types';
import type { OnboardingDispatch } from './useOnboardingState';
import {
  createImmersivePipeline,
  createMarketingPipeline,
} from '../components/pipeline/pipeline.config';
import type { usePipeline } from '../components/pipeline/usePipeline';
import { getOnboardingQuestionByStep } from '../../../services/onboarding';
import { getImmersivePipelineRequirements } from '../onboarding.utils';
import type {
  BrandAdvertisementPayload,
  BrandAdvertisementResult,
  ExtractPdpPayload,
  ExtractPdpResult,
  // RemoveBackgroundPayload,
  // RemoveBackgroundResult
} from '../../../types/onboarding';

type UseProductImageSelectionArgs = {
  session?: OnboardingSession;
  state: OnboardingLocalState;
  dispatch: OnboardingDispatch;
  refetch: () => Promise<unknown>;

  marketingPipeline: ReturnType<typeof usePipeline>;
  immersivePipeline: ReturnType<typeof usePipeline>;

  appendText: (text: string, from: 'ai' | 'user') => void;
  appendCard: (card: OnboardingCard) => void;

  effectiveValidateProductAnswers: {
    productUrl?: string | null;
    category?: string | null;
    subCategory?: string | null;
  };

  extractPdpMutation: {
    mutateAsync: (payload: ExtractPdpPayload) => Promise<ExtractPdpResult>;
  };

  brandAdvertisementMutation: {
    mutateAsync: (
      payload: BrandAdvertisementPayload
    ) => Promise<BrandAdvertisementResult>;
  };

};

export const useProductImageSelection = ({
  session,
  state,
  dispatch,
  refetch,
  marketingPipeline,
  immersivePipeline,
  appendText,
  appendCard,
  effectiveValidateProductAnswers,
  extractPdpMutation,
  brandAdvertisementMutation,
}: UseProductImageSelectionArgs) => {
  const isProcessingSelectionRef = useRef(false);

  const handleProductImageSelected = useCallback(
    async (selectedImage: string) => {
      if (isProcessingSelectionRef.current) return;
      isProcessingSelectionRef.current = true;

      try {
      dispatch({ type: 'SET_SUBMIT_ERROR', payload: null });
      dispatch({ type: 'SET_STATUS', payload: 'pipeline' });

      const fallbackAdWithoutBrand =
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600&h=600';
      const fallbackAdWithBrand =
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=600&h=600';

      const latestProductSelection = [...state.messages]
        .reverse()
        .find(
          (
            message
          ): message is Extract<
            (typeof state.messages)[number],
            { kind: 'card' }
          > =>
            message.kind === 'card' && message.card.type === 'product-selection'
        );

      if (
        latestProductSelection?.kind === 'card' &&
        latestProductSelection.card.type === 'product-selection'
      ) {
        appendCard({
          type: 'product-display',
          image: selectedImage,
          productName: latestProductSelection.card.productName,
          description: latestProductSelection.card.description,
          price: latestProductSelection.card.price,
        });
      }

      appendText('Let’s create your first marketing visual.', 'ai');
      appendCard({ type: 'creation-pipeline', phase: 'marketing' });

      const productUrl =
        effectiveValidateProductAnswers.productUrl ??
        session?.answers?.productUrl ??
        '';

      if (!productUrl) {
        throw new Error(
          'Missing product URL. Please validate the product again.'
        );
      }

      const category =
        effectiveValidateProductAnswers.category ??
        session?.answers?.category ??
        '';
      const subCategory =
        effectiveValidateProductAnswers.subCategory ??
        session?.answers?.subCategory ??
        '';

      let extracted: ExtractPdpResult | null = null;
      if (session?.signupType !== 'brand') {
        extracted = await extractPdpMutation.mutateAsync({
          url: productUrl,
          category,
          subCategory,
        });
      }

      const resolvedCategory = extracted?.category ?? category;
      const resolvedSubCategory = extracted?.subCategory ?? subCategory;
      if (!resolvedCategory || !resolvedSubCategory) {
        throw new Error('Missing product category details. Please try again.');
      }

      dispatch({ type: 'SET_ACTIVE_TAB', payload: 'immersive-product-page' });

      const brandKit = state.confirmedBrandKitData;
      const brandColors = brandKit?.colors ?? session?.brand?.colors ?? null;
      const brandVibe = brandKit?.vibe ?? session?.brand?.vibe ?? null;
      const brandFonts = brandKit?.fonts ?? session?.brand?.fonts ?? [];
      const brandLogos = brandKit?.logos ?? session?.brand?.logos ?? [];

      const brandVoice = brandKit?.vibe?.voice
        ? Object.entries(brandKit.vibe.voice).map(([word, rating]) => ({
            word,
            rating,
          }))
        : [];

      let advertisement: Partial<BrandAdvertisementResult> | undefined;
      let brandAdvertisementSucceeded = false;

      const logoUrl =
        brandKit?.profilePhoto ??
        session?.brand?.profilePhoto ??
        brandLogos[0] ??
        undefined;

      marketingPipeline.reset(createMarketingPipeline('Generating your marketing image...'));
      marketingPipeline.startStep('marketing-image');

      try {
        advertisement = await brandAdvertisementMutation.mutateAsync({
          product_image_url: selectedImage,
          category: resolvedCategory,
          subCategory: resolvedSubCategory || undefined,
          product_name: extracted?.productName ?? undefined,
          description: extracted?.description ?? undefined,
          features: extracted?.features ?? undefined,
          logo_url: logoUrl,
          brand_name: session?.brand?.name ?? undefined,
          primary_colors: brandColors?.primary ?? undefined,
          secondary_colors: brandColors?.secondary ?? undefined,
          vibe: brandVibe?.description ?? undefined,
          brand_voice: brandVoice,
          brand_archetype: brandVibe?.archetype ?? undefined,
          archetype_description: brandVibe?.description ?? undefined,
          typography_description:
            brandFonts.length > 0 ? brandFonts.join(', ') : undefined,
        });
        brandAdvertisementSucceeded = true;
      } catch {
        // best-effort
      }

      const resolvedAdWithoutBrand =
        advertisement?.adWithoutBrandMemory ?? fallbackAdWithoutBrand;
      const resolvedAdWithBrand =
        advertisement?.adWithBrandMemory ?? fallbackAdWithBrand;

      const brandAdvertisementData = {
        originalImageUrl: resolvedAdWithoutBrand,
        resultUrl: resolvedAdWithBrand,
        bgRemovedImage: advertisement?.bgRemovedImage ?? null,
        originalImageKey: advertisement?.adWithoutBrandMemoryKey ?? null,
        resultImageKey: advertisement?.adWithBrandMemoryKey ?? null,
        bgRemovedImageKey: advertisement?.bgRemovedImageKey ?? null,
      };

      dispatch({
        type: 'SET_BRAND_ADVERTISEMENT_DATA',
        payload: brandAdvertisementData,
      });

      marketingPipeline.setStepLabel(
        'marketing-image',
        brandAdvertisementSucceeded
          ? 'Generated your marketing image'
          : 'Generating your marketing image...'
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      marketingPipeline.completeStep('marketing-image');

      const brandAdvertisementQuestion = getOnboardingQuestionByStep(
        'brand-advertisement'
      );
      if (brandAdvertisementQuestion) {
        appendText(brandAdvertisementQuestion, 'ai');
      }
      appendCard({
        type: 'brand-advertisement',
        originalImageUrl: brandAdvertisementData.originalImageUrl,
        resultUrl: brandAdvertisementData.resultUrl,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      dispatch({ type: 'SET_SHOWING_PIPELINE', payload: true });
      dispatch({ type: 'SET_PIPELINE_COMPLETE', payload: false });
      immersivePipeline.reset(
        createImmersivePipeline(
          getImmersivePipelineRequirements({
            category: resolvedCategory,
            subCategory: resolvedSubCategory,
          })
        )
      );

      appendText(
        'Creating your immersive product page. This may take a moment.',
        'ai'
      );
      appendCard({ type: 'creation-pipeline', phase: 'immersive' });

      // Critical: force a session refresh so `flow.currentStepKey` becomes `immersive_product_page`
      // and the image-to-3d auto-trigger runs without needing a page reload.
      await refetch();

      // try {
      //     const completedSession = await completeOnboardingMutation.mutateAsync({
      //         sessionId: session?.sessionId ?? '',
      //     });

      //     if (
      //         allSubStepsDone(completedSession?.subSteps ?? null) &&
      //         !state.deploymentSuccessAppended
      //     ) {
      //         dispatch({ type: 'SET_DEPLOYMENT_SUCCESS_APPENDED', payload: true });
      //         dispatch({ type: 'SET_PIPELINE_COMPLETE', payload: true });
      //         immersivePipeline.completeStep('ar-tryon');
      //         appendCard(
      //             createDeploymentSuccessCard(completedSession?.experienceUrl)
      //         );
      //     }
      // } catch {
      //     // handled elsewhere
      // }
      } finally {
        isProcessingSelectionRef.current = false;
      }
    },
    [
      appendCard,
      appendText,
      brandAdvertisementMutation,
      dispatch,
      effectiveValidateProductAnswers,
      extractPdpMutation,
      immersivePipeline,
      marketingPipeline,
      refetch,
      session,
      state,
      isProcessingSelectionRef,
    ]
  );

  return { handleProductImageSelected };
};
