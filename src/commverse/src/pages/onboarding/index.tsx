import { useMemo, useState } from 'react';
import BrandOnboarding from './components/BrandOnboarding';
import BrandOnboardingIntro from './components/BrandOnboardingIntro';
import IndividualOnboarding from './components/IndividualOnboarding';
import IndividualOnboardingIntro from './components/IndividualOnboardingIntro';
import { useOnboardingManager } from './hooks/useOnboardingManager';
import type { OnboardingSignupType } from '../../types/onboarding';

function OnboardingIntro({
  signupType,
  onFinish,
  onSkip,
  isSkipping = false,
}: {
  signupType: OnboardingSignupType;
  onFinish: () => void;
  onSkip: () => void;
  isSkipping?: boolean;
}) {
  return (
    <div className="flex h-screen w-screen flex-col bg-[#F9F9FF]">
      <header className="flex items-center justify-start px-8 py-9">
        <img
          src="/assets/icons/Commverse Logo - Final.svg"
          alt="Commverse Studio"
          className="w-auto"
        />
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        {signupType === 'brand' ? (
          <BrandOnboardingIntro
            onNext={onFinish}
            onSkip={onSkip}
            isSkipping={isSkipping}
          />
        ) : (
          <IndividualOnboardingIntro
            onNext={onFinish}
            onSkip={onSkip}
            isSkipping={isSkipping}
          />
        )}
      </div>
    </div>
  );
}

const Onboarding = () => {
  const {
    session,
    sessionWithUi,
    isLoading,
    isError,
    errorMessage,
    refetch,
    isSubmitting,
    isBrandKitProceeding,
    marketingPipeline,
    immersivePipeline,
    state,
    dispatch,
    handleSubmitAnswer,
    handleUserMessage,
    handleUserAttachmentsMessage,
    handleGoToDashboard,
    handleCompleteIndividualOnboarding,
    handleSkipOnboarding,
    cosmeticTryOnModalData,
    handleCloseCosmeticTryOnModal,
    handleCompleteBeautyTryOn,
    handleBrandKitProceed,
    handleProductImageSelected,
    validateProductMutation,
    extractPdpMutation,
  } = useOnboardingManager();
  const [dismissedIntroKey, setDismissedIntroKey] = useState<string | null>(
    null
  );

  const introStorageKey = useMemo(
    () =>
      session?.sessionId
        ? `onboarding-intro-dismissed:${session.sessionId}:${session.signupType}`
        : null,
    [session?.sessionId, session?.signupType]
  );

  const showIntro =
    Boolean(session && introStorageKey) &&
    dismissedIntroKey !== introStorageKey &&
    sessionStorage.getItem(introStorageKey as string) !== '1';

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p className="text-sm text-[#656b7a]">Loading...</p>
      </div>
    );
  }

  if (showIntro && session) {
    return (
      <OnboardingIntro
        signupType={session.signupType}
        onSkip={handleSkipOnboarding}
        isSkipping={isSubmitting}
        onFinish={() => {
          if (introStorageKey) {
            sessionStorage.setItem(introStorageKey, '1');
            setDismissedIntroKey(introStorageKey);
          }
        }}
      />
    );
  }

  if (isError || !session || !sessionWithUi) {
    return (
      <div className="flex h-screen items-center justify-center bg-white px-6">
        <div className="max-w-md text-center">
          <p className="text-lg font-medium text-[#18181a]">
            We could not load onboarding.
          </p>
          {errorMessage ? (
            <p className="mt-2 text-sm text-[#656b7a]">{errorMessage}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-2xl bg-[#18181a] px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (sessionWithUi.signupType === 'individual') {
    return (
      <IndividualOnboarding
        session={sessionWithUi}
        isSubmitting={isSubmitting}
        isValidatingProduct={
          validateProductMutation.isPending || extractPdpMutation.isPending
        }
        onSubmitAnswer={handleSubmitAnswer}
        submitError={state.submitError}
        messages={state.messages}
        onUserMessage={handleUserMessage}
        onUserAttachmentsMessage={handleUserAttachmentsMessage}
        activeTab={state.activeTab}
        // onTabChange={(tab) =>
        //   dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })
        // }
        cosmeticTryOnModalData={cosmeticTryOnModalData}
        onCloseCosmeticTryOnModal={handleCloseCosmeticTryOnModal}
        onCompleteCosmeticTryOnModal={handleCompleteBeautyTryOn}
        onProductImageSelected={handleProductImageSelected}
        onGoToDashboard={handleGoToDashboard}
        onComplete={handleCompleteIndividualOnboarding}
        marketingPipeline={marketingPipeline}
        immersivePipeline={immersivePipeline}
      />
    );
  }

  return (
    <BrandOnboarding
      session={sessionWithUi}
      isSubmitting={isSubmitting}
      isValidatingProduct={validateProductMutation.isPending}
      isBrandAnalysisLoading={state.isBrandAnalysisLoading}
      showingPipeline={state.showingPipeline}
      pipelineComplete={state.pipelineComplete}
      onSubmitAnswer={handleSubmitAnswer}
      submitError={state.submitError}
      messages={state.messages}
      onUserMessage={handleUserMessage}
      activeTab={state.activeTab}
      // onTabChange={(tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })}
      isBrandKitOpen={state.isBrandKitOpen}
      confirmedBrandKitData={state.confirmedBrandKitData}
      onBrandKitChange={(data) =>
        dispatch({
          type: 'SET_CONFIRMED_BRAND_KIT_DATA',
          payload: data ?? null,
        })
      }
      onBrandKitProceed={handleBrandKitProceed}
      isBrandKitProceeding={isBrandKitProceeding}
      onProductImageSelected={handleProductImageSelected}
      onGoToDashboard={handleGoToDashboard}
      cosmeticTryOnModalData={cosmeticTryOnModalData}
      onCloseCosmeticTryOnModal={handleCloseCosmeticTryOnModal}
      marketingPipeline={marketingPipeline}
      immersivePipeline={immersivePipeline}
      resolvedAdWithBrand={state.brandAdvertisementData?.resultUrl}
      bgRemovedImage={state.brandAdvertisementData?.bgRemovedImage}
      validatedProductDetails={state.validatedProductDetails}
      isImmersivePDPOpen={state.isImmersivePDPOpen}
      onImmersivePDPOpen={() =>
        dispatch({ type: 'SET_IMMERSIVE_PDP_OPEN', payload: true })
      }
      onImmersivePDPClose={() =>
        dispatch({ type: 'SET_IMMERSIVE_PDP_OPEN', payload: false })
      }
    />
  );
};

export default Onboarding;
