import type { MutableRefObject } from 'react';

import { analyzeBrand } from '../../../services/onboarding';
import type { AnalyzeBrandEvent } from '../../../types/onboarding';
import type { BrandKitRawData } from '../onboarding.types';
import { BRAND_DNA_LOADING_TEXT } from '../onboarding.constants';
import { isAnalysisProgressEvent } from '../onboarding.utils';
import type { OnboardingDispatch } from '../hooks/useOnboardingState';

interface AnalyzeBrandFlowArgs {
  answer: string;
  dispatch: OnboardingDispatch;
  appendText: (text: string, from: 'ai' | 'user') => void;
  refetch: () => Promise<unknown>;
  isCollectingUserInfo: boolean;
  brandAnalysisCompletedRef: MutableRefObject<boolean>;
}

export const runAnalyzeBrandFlow = async ({
  answer,
  dispatch,
  appendText,
  refetch,
  isCollectingUserInfo,
  brandAnalysisCompletedRef,
}: AnalyzeBrandFlowArgs) => {
  dispatch({ type: 'SET_STATUS', payload: 'analyzing' });
  dispatch({ type: 'SET_BRAND_ANALYSIS_LOADING', payload: true });

  const phasesHandled = new Set<string>();
  let latestBrandMeta: BrandKitRawData | null = null;
  let brandDnaMessageShown = false;

  try {
    const analyzedSession = await analyzeBrand(
      { url: answer.trim() },
      {
        onEvent: (event: AnalyzeBrandEvent) => {
          if (phasesHandled.has(event.phase)) return;
          phasesHandled.add(event.phase);

          if (isAnalysisProgressEvent(event)) {
            if (event.phase === 'brand_meta') {
              latestBrandMeta = event as BrandKitRawData;
            }
            if (brandDnaMessageShown) return;
            brandDnaMessageShown = true;
            appendText(BRAND_DNA_LOADING_TEXT, 'ai');
            return;
          }

          if (event.phase === 'error') {
            throw new Error(event.message ?? 'Brand analysis failed. Please try again.');
          }
        },
      }
    );

    brandAnalysisCompletedRef.current = true;
    dispatch({
      type: 'SET_PENDING_BRAND_KIT_RAW_DATA',
      payload:
        latestBrandMeta ??
        ((analyzedSession.rawData as BrandKitRawData | undefined) ?? null),
    });
    dispatch({ type: 'SET_BRAND_KIT_OPEN', payload: true });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'brand-memory' });
    dispatch({ type: 'SET_PENDING_STEP', payload: 'validate-product' });
    await refetch();
  } finally {
    dispatch({
      type: 'SET_STATUS',
      payload: isCollectingUserInfo ? 'collecting' : 'idle',
    });
    dispatch({ type: 'SET_BRAND_ANALYSIS_LOADING', payload: false });
  }
};
