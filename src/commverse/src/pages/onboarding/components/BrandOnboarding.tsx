import { useEffect, useMemo, useRef, useState } from 'react';

import Chip from '../../../components/Chip';
import ChatInput, {
  type UploadAsset,
} from '../../../components/ChatInput/ChatInput';
import Modal from '../../../components/Modal';
import type { MediaAttachment } from '../../../types/chat';
import type { TTryOn } from '../../../types';
import type {
  OnboardingChatLine,
  OnboardingSession,
  OnboardingBrandKitData,
  ProductSelectionCard,
} from '../../../types/onboarding';
import BrandAdvertisementCard from './AdvertisementComparisonCard';
import BrandDnaReadyCard from './BrandDnaReadyCard';
import BrandOnboardingKit from './BrandOnboardingKit';
import CreationPipelineCard from './CreationPipelineCard';
import type { usePipeline } from './pipeline/usePipeline';
import LeftChatMessage from './LeftChatMessage';
import LeftChatWaitingForInput from './LeftChatWaitingForInput';
import LoadingOverlay from './LoadingOverlay';
import LogoHeader from './LogoHeader';
import MemoryHeader, { type OnboardingHeaderTab } from './MemoryHeader';
import ProductImageSelectionCard from './ProductImageSelectionCard';
import RightChatMessage from './RightChatMessage';
import { CommverseIconChat } from '../../../icons';
import ToastCard from '../../../components/AlertCards/ToastCard';
import { buildBrandKitData } from './buildBrandKitData';
import {
  BRAND_DNA_LOADING_TEXT,
  CATEGORY_SUGGESTIONS,
  ONBOARDING_QUESTION_BRAND_DNA_READY,
  SUBCATEGORY_SUGGESTIONS,
} from '../onboarding.constants';
import {
  getBrandUrlValidationMode,
  getBrandInputPlaceholder,
  normalizeWebsiteUrl,
} from '../onboarding.utils';
// import ImmersivePDP from '../immersive-pdp';

const BRAND_VALIDATE_SUBTITLES = [
  'Analyzing your product…',
  'Generating brand-matched advertisement…',
  'Preparing your immersive experience…',
  'Almost ready...',
];

interface BrandOnboardingProps {
  session: OnboardingSession;
  isSubmitting?: boolean;
  isValidatingProduct?: boolean;
  isBrandAnalysisLoading?: boolean;
  showingPipeline?: boolean;
  /** When true, immersive/marketing pipeline finished (or skipped after failure); chat can resume. */
  pipelineComplete?: boolean;
  onSubmitAnswer: (
    answer: string,
    attachments?: MediaAttachment[]
  ) => Promise<void> | void;
  submitError?: string | null;
  messages: OnboardingChatLine[];
  onUserMessage: (text: string) => void;
  activeTab: OnboardingHeaderTab;
  // onTabChange: (tab: OnboardingHeaderTab) => void;
  isBrandKitOpen?: boolean;
  isBrandKitProceeding?: boolean;
  onBrandKitProceed?: (data: OnboardingBrandKitData) => void;
  onBrandKitChange?: (data: OnboardingBrandKitData) => void;
  confirmedBrandKitData?: OnboardingBrandKitData | null;
  cosmeticTryOnModalData?: {
    productTitle: string;
    subCategory: TTryOn;
    variants: string[];
  } | null;
  onCloseCosmeticTryOnModal?: () => void;
  onProductImageSelected?: (imageUrl: string) => void;
  onGoToDashboard?: () => void;
  marketingPipeline: ReturnType<typeof usePipeline>;
  immersivePipeline: ReturnType<typeof usePipeline>;
  resolvedAdWithBrand?: string | null;
  bgRemovedImage?: string | null;
  validatedProductDetails?: {
    productName?: string | null;
    description?: string | null;
    productUrl?: string | null;
    productImages?: string[] | null;
    productColors?: string[] | null;
    subCategory?: string | null;
  } | null;
  isImmersivePDPOpen?: boolean;
  onImmersivePDPOpen?: () => void;
  onImmersivePDPClose?: () => void;
}

const BrandOnboarding = ({
  session,
  isSubmitting,
  isValidatingProduct,
  isBrandAnalysisLoading,
  showingPipeline = false,
  pipelineComplete = false,
  onSubmitAnswer,
  submitError,
  messages,
  onUserMessage,
  activeTab,
  // onTabChange,
  isBrandKitOpen = false,
  isBrandKitProceeding = false,
  onBrandKitProceed,
  onBrandKitChange,
  confirmedBrandKitData = null,

  // onCloseCosmeticTryOnModal,
  onProductImageSelected,
  marketingPipeline,
  immersivePipeline,
  // resolvedAdWithBrand,
  // bgRemovedImage,
  // validatedProductDetails,
  // isImmersivePDPOpen = false,
  onImmersivePDPOpen,
  // onImmersivePDPClose,
}: BrandOnboardingProps) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const brandKitData = useMemo(
    () => confirmedBrandKitData ?? buildBrandKitData(session, session.rawData),
    [session, confirmedBrandKitData]
  );
  const showBrandKit = isBrandKitOpen && activeTab === 'brand-memory';
  const hasCompletedBrandDna = messages.some(
    (message) =>
      message.kind === 'card' && message.card.type === 'brand-dna-ready'
  );
  const inputPlaceholder = getBrandInputPlaceholder({
    question: session?.nextQuestion,
    isGenerating: Boolean(
      (showingPipeline && !pipelineComplete) || isBrandAnalysisLoading
    ),
  });
  const urlValidationMode = getBrandUrlValidationMode(session?.nextQuestion);
  const activeProductSelectionCard =
    useMemo<ProductSelectionCard | null>(() => {
      const lastMessage = messages[messages.length - 1];

      if (
        lastMessage?.kind === 'card' &&
        lastMessage.card.type === 'product-selection'
      ) {
        return lastMessage.card;
      }

      return null;
    }, [messages]);
  const [tryOnSelectionImage, setTryOnSelectionImage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const el = chatRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, session.suggestedChips]);

  const submitAnswer = async (
    answer: string,
    attachments: MediaAttachment[] = []
  ) => {
    const trimmedAnswer = answer.trim();
    if ((!trimmedAnswer && attachments.length === 0) || isSubmitting) return;
    const shouldNormalizeWebsiteUrl =
      session.currentStep === 'analyze-brand' && attachments.length === 0;
    const resolvedAnswer = shouldNormalizeWebsiteUrl
      ? normalizeWebsiteUrl(trimmedAnswer)
      : trimmedAnswer;

    onUserMessage(
      resolvedAnswer ||
      (attachments.length === 1
        ? `Uploaded ${attachments[0].name}`
        : `Uploaded ${attachments.length} images`)
    );

    try {
      await onSubmitAnswer(resolvedAnswer, attachments);
    } catch {
      // Container owns mutation error state.
    }
  };

  const handleSend: (text: string, attachments: MediaAttachment[]) => void = (
    text,
    attachments
  ) => {
    void submitAnswer(text, attachments);
  };

  const handleAttachmentUpload: (
    file: File
  ) => Promise<UploadAsset> = async () => {
    throw new Error('Attachments are not supported during onboarding yet.');
  };

  const chips = session.suggestedChips ?? [];
  const chipSet = new Set(chips);
  const isCategoryChipSet =
    chips.length > 0 &&
    chips.length === CATEGORY_SUGGESTIONS.length &&
    CATEGORY_SUGGESTIONS.every((chip) => chipSet.has(chip));
  const isProductTypeChipSet = Object.values(SUBCATEGORY_SUGGESTIONS).some(
    (options) =>
      chips.length > 0 &&
      chips.length === options.length &&
      options.every((chip) => chipSet.has(chip))
  );
  const shouldDisableInputForChips = isCategoryChipSet || isProductTypeChipSet;
  const lastMsg = messages[messages.length - 1];
  const isAwaitingAnswer =
    !!lastMsg &&
    lastMsg.from === 'ai' &&
    lastMsg.kind === 'text' &&
    !isSubmitting;

  return (
    <div className="h-screen bg-white">
      {isValidatingProduct && (
        <LoadingOverlay
          title="Creating your Immersive Product Page"
          subtitles={BRAND_VALIDATE_SUBTITLES}
        />
      )}

      <div className="mx-auto flex h-screen w-full max-w-[1280px] flex-col">
        <div className="relative z-10 flex h-[88px] shrink-0 items-center justify-center bg-linear-to-b from-white from-50% to-transparent px-12 py-5">
          <LogoHeader
            className="h-auto justify-center"
            logoClassName="h-[16px] w-auto"
          />
        </div>
        {showBrandKit ? (
          <div className="min-h-0 flex-1 px-6 pb-6">
            <BrandOnboardingKit
              embedded
              data={brandKitData}
              rawData={(session.rawData as Record<string, unknown>) ?? {}}
              onChange={onBrandKitChange ?? (() => {})}
              onProceed={onBrandKitProceed}
              isProceeding={isBrandKitProceeding}
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 justify-center px-8 pb-12">
            <div className="relative flex w-full max-w-[696px] flex-1 flex-col">
              {/* Header */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-24 justify-center bg-linear-to-b from-white from-50% to-transparent">
                <MemoryHeader
                  className="pointer-events-auto pt-0"
                  signupType="brand"
                  activeTab={activeTab}
                  // onTabChange={onTabChange}
                />
              </div>

              {/* Scrollable chat */}
              <div
                ref={chatRef}
                className="no-scrollbar flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto px-3 pt-24"
              >
                {messages.map((msg) => {
                  if (msg.kind === 'text') {
                    const isBrandDnaLoadingMessage =
                      msg.from === 'ai' &&
                      msg.text.trim() === BRAND_DNA_LOADING_TEXT;
                    const isBrandDnaReadyMessage =
                      msg.from === 'ai' &&
                      msg.text.trim() === ONBOARDING_QUESTION_BRAND_DNA_READY;

                    if (isBrandDnaLoadingMessage || isBrandDnaReadyMessage) {
                      if (isBrandDnaLoadingMessage && hasCompletedBrandDna) {
                        return null;
                      }

                      return (
                        <div
                          key={msg.id}
                          className="flex w-full items-start gap-2 px-0 py-[2px]"
                        >
                          <CommverseIconChat
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                          />
                          <p
                            className={
                              isBrandDnaLoadingMessage
                                ? 'ai-status-gradient-text font-metropolis text-sm leading-tight font-normal italic'
                                : 'font-metropolis text-sm leading-tight font-medium text-[#18181A]'
                            }
                          >
                            {msg.text.trim()}
                          </p>
                        </div>
                      );
                    }

                    return msg.from === 'ai' ? (
                      <LeftChatMessage
                        key={msg.id}
                        message={msg.text}
                        showTime={false}
                      />
                    ) : (
                      <RightChatMessage
                        key={msg.id}
                        message={msg.text}
                        showTime={false}
                      />
                    );
                  }

                  const { card } = msg;

                  if (card.type === 'brand-dna-ready') {
                    const cardBrandKitData = buildBrandKitData(
                      session,
                      card.rawData ?? session.rawData
                    );
                    return (
                      <div key={msg.id} className="mb-4">
                        <BrandDnaReadyCard
                          compact
                          data={cardBrandKitData}
                          rawData={card.rawData ?? session.rawData}
                        />
                      </div>
                    );
                  }

                  if (card.type === 'product-selection') {
                    return null;
                  }

                  if (card.type === 'brand-advertisement') {
                    return (
                      <div key={msg.id} className="mb-4">
                        <BrandAdvertisementCard
                          originalImageUrl={card.originalImageUrl ?? ''}
                          resultUrl={card.resultUrl}
                          onArTryOn={onImmersivePDPOpen}
                        />
                      </div>
                    );
                  }

                  if (card.type === 'product-display') {
                    return (
                      <div key={msg.id} className="mb-4">
                        <ProductImageSelectionCard
                          images={[card.image]}
                          productName={card.productName}
                          description={card.description}
                          price={card.price}
                          compact
                        />
                      </div>
                    );
                  }

                  if (card.type === 'creation-pipeline') {
                    const pipeline =
                      card.phase === 'marketing'
                        ? marketingPipeline
                        : immersivePipeline;

                    return (
                      <div key={msg.id} className="mb-4">
                        <CreationPipelineCard
                          steps={pipeline.displaySteps}
                          compact
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Sticky input area */}
              <div className="mt-6 flex flex-col gap-6 bg-white">
                {isAwaitingAnswer && <LeftChatWaitingForInput />}

                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {chips.map((chip, index) => (
                      <button
                        key={`${chip}-${index}`}
                        onClick={() => {
                          void submitAnswer(chip);
                        }}
                        className="cursor-pointer"
                        disabled={isSubmitting}
                      >
                        <Chip
                          text={chip}
                          variant="secondary"
                          className="rounded-lg! px-2! py-1.5! text-sm! font-semibold!"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <ChatInput
                  onSend={handleSend}
                  onUploadAttachment={handleAttachmentUpload}
                  placeholder={inputPlaceholder}
                  urlValidationMode={urlValidationMode}
                  disabled={
                    isSubmitting ||
                    isBrandAnalysisLoading ||
                    (showingPipeline && !pipelineComplete) ||
                    shouldDisableInputForChips
                  }
                  isSubmitting={isSubmitting}
                  errorMessage={undefined}
                  className="shadow-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {activeProductSelectionCard &&
      !isValidatingProduct &&
      !tryOnSelectionImage ? (
        <Modal
          open
          onClose={() => {}}
          closeOnOutsideClick={false}
          className="[&>div]:max-h-[90vh] [&>div]:w-[min(1040px,90vw)] [&>div]:max-w-none [&>div]:overflow-y-auto [&>div]:overflow-x-hidden [&>div]:rounded-3xl"
        >
          <ProductImageSelectionCard
            images={activeProductSelectionCard.images}
            productName={activeProductSelectionCard.productName}
            description={activeProductSelectionCard.description}
            price={activeProductSelectionCard.price}
            onNext={(selectedImage) => {
              setTryOnSelectionImage(selectedImage);
              void onProductImageSelected?.(selectedImage);
            }}
          />
        </Modal>
      ) : null}

      {submitError && <ToastCard key={submitError} type="error" title={submitError} />}

      {/* {isImmersivePdpVisible || isImmersivePDPOpen ? (
        <ImmersivePDP
          isActive={isImmersivePDPOpen}
          shouldAutoGenerate3D={
            !(
              session.subSteps?.asset3dCreated ||
              session.subSteps?.arExperienceCreated
            )
          }
          profilePhoto={session.brand?.profilePhoto}
          vibeDescription={session.brand?.vibe?.description}
          bgRemovedImage={bgRemovedImage}
          productUrl={
            validatedProductDetails?.productUrl ?? session.answers?.productUrl
          }
          productImages={
            resolvedAdWithBrand
              ? [resolvedAdWithBrand]
              : (validatedProductDetails?.productImages ??
                activeProductSelectionCard?.images)
          }
          productName={
            validatedProductDetails?.productName ??
            activeProductSelectionCard?.productName
          }
          productDescription={
            validatedProductDetails?.description ??
            activeProductSelectionCard?.description
          }
          productColors={validatedProductDetails?.productColors}
          category={session.answers?.category}
          subCategory={
            (validatedProductDetails?.subCategory ??
              session.answers?.subCategory ??
              'Lipstick') as TTryOn
          }
          fashionTryOnGarmentImage={tryOnSelectionImage}
          onClose={() => {
            setIsImmersivePdpVisible(false);
            setIsImmersivePdpDismissed(true);
            onImmersivePDPClose?.();
          }}
          onCloseCosmeticTryOnModal={onCloseCosmeticTryOnModal}
        />
      ) : null} */}
    </div>
  );
};

export default BrandOnboarding;
