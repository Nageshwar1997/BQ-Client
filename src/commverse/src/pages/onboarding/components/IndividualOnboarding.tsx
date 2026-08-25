import { useEffect, useMemo, useRef, useState } from 'react';
import type { MediaAttachment } from '../../../types/chat';
import type { TTryOn } from '../../../types';
import type {
  OnboardingChatLine,
  OnboardingSession,
} from '../../../types/onboarding';
import CreationPipelineCard from './CreationPipelineCard';
import type { usePipeline } from './pipeline/usePipeline';
import LeftChatMessage from './LeftChatMessage';
import LeftChatWaitingForInput from './LeftChatWaitingForInput';
import LoadingOverlay from './LoadingOverlay';
import LogoHeader from './LogoHeader';
import MemoryHeader, { type OnboardingHeaderTab } from './MemoryHeader';
import ProductImageSelectionCard from './ProductImageSelectionCard';
import RightChatMessage from './RightChatMessage';
import Button from '../../../components/Button';
import CosmeticTryOnOnboardingModal from './CosmeticTryOnOnboardingModal';
import { Icon } from '@iconify/react';
import { downloadFile } from '../../../lib/utils';
import type { UploadAsset } from './IndividualChatInput';
import IndividualChatInput, { IMAGE_SLOT_COUNT } from './IndividualChatInput';
import {
  BEAUTY_CATEGORY_OPTIONS,
  FASHION_CATEGORY_OPTIONS,
} from '../onboarding.constants';
import {
  getIndividualInputPlaceholder,
  getIndividualUrlValidationMode,
} from '../onboarding.utils';
export type IndividualStageTab = Extract<
  OnboardingHeaderTab,
  'beauty-try-on' | 'cloth-try-on' | 'product-ad'
>;

const INDIVIDUAL_STAGE_TABS: IndividualStageTab[] = [
  'beauty-try-on',
  'cloth-try-on',
  'product-ad',
];
const CLOTH_TRYON_LOADING_MESSAGES = [
  'Understanding body posture…',
  'Mapping clothing fabric…',
  'Generating your AI try-on…',
  'Almost there...',
];

const PRODUCT_AD_LOADING_MESSAGES = [
  'Analyzing your prompt...',
  'Crafting creative ideas...',
  'Building your media...',
  'Applying final touches...',
];

function isIndividualStageTab(
  tab: OnboardingHeaderTab
): tab is IndividualStageTab {
  return INDIVIDUAL_STAGE_TABS.includes(tab as IndividualStageTab);
}

interface IndividualOnboardingProps {
  session?: OnboardingSession;
  isSubmitting?: boolean;
  isValidatingProduct?: boolean;
  onSubmitAnswer?: (
    answer: string,
    attachments?: MediaAttachment[]
  ) => Promise<void> | void;
  submitError?: string | null;
  messages?: OnboardingChatLine[];
  onUserMessage?: (text: string) => void;
  onUserAttachmentsMessage?: (attachments: MediaAttachment[]) => void;
  activeTab?: OnboardingHeaderTab;
  // onTabChange?: (tab: OnboardingHeaderTab) => void;
  cosmeticTryOnModalData?: {
    productTitle: string;
    subCategory: TTryOn;
    variants: string[];
    productLink?: string;
  } | null;
  onCloseCosmeticTryOnModal?: () => void;
  onCompleteCosmeticTryOnModal?: () => void;
  onProductImageSelected?: (imageUrl: string) => void;
  onGoToDashboard?: () => void;
  onComplete?: () => void;
  marketingPipeline: ReturnType<typeof usePipeline>;
  immersivePipeline: ReturnType<typeof usePipeline>;
}

const IndividualOnboarding = ({
  session,
  isSubmitting = false,
  isValidatingProduct = false,
  onSubmitAnswer,
  submitError,
  messages: parentMessages = [],
  onUserMessage,
  onUserAttachmentsMessage,
  activeTab: parentActiveTab,
  // onTabChange,
  cosmeticTryOnModalData,
  onCloseCosmeticTryOnModal,
  onCompleteCosmeticTryOnModal,
  onProductImageSelected,
  onGoToDashboard,
  onComplete,
  marketingPipeline,
  immersivePipeline,
}: IndividualOnboardingProps) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const localMessageIdRef = useRef(0);
  const [localMessages, setLocalMessages] = useState<OnboardingChatLine[]>([]);
  const [activeTab] = useState<IndividualStageTab>('beauty-try-on');
  const [uploadedAttachments, setUploadedAttachments] = useState<
    MediaAttachment[]
  >([]);
  const [inputResetSignal, setInputResetSignal] = useState(0);

  const finalActiveTab: IndividualStageTab =
    parentActiveTab && isIndividualStageTab(parentActiveTab)
      ? parentActiveTab
      : activeTab;

  const mergedMessages = useMemo(
    () => [...parentMessages, ...localMessages],
    [parentMessages, localMessages]
  );

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mergedMessages, session?.suggestedChips]);

  const appendLocalMessage = (line: OnboardingChatLine) => {
    setLocalMessages((prev) => [...prev, line]);
  };

  const resetComposer = () => {
    setUploadedAttachments([]);
    setInputResetSignal((prev) => prev + 1);
  };

  const getNextLocalMessageId = (prefix: string) => {
    localMessageIdRef.current += 1;
    return `${prefix}-${localMessageIdRef.current}`;
  };

  // const handleTabChange = (tab: OnboardingHeaderTab) => {
  //   if (!isIndividualStageTab(tab)) return;
  //   onTabChange?.(tab);
  //   setActiveTab(tab);
  // };

  const submitAnswer = async (
    answer: string,
    attachments: MediaAttachment[] = []
  ): Promise<boolean> => {
    const trimmedAnswer = answer.trim();
    if ((!trimmedAnswer && attachments.length === 0) || isSubmitting) {
      return false;
    }

    const userText =
      trimmedAnswer ||
      (attachments.length === 1
        ? `Uploaded ${attachments[0].name}`
        : `Uploaded ${attachments.length} images`);

    if (onUserMessage) {
      onUserMessage(userText);
    } else {
      appendLocalMessage({
        id: getNextLocalMessageId('user'),
        from: 'user',
        kind: 'text',
        text: userText,
      });
    }

    if (attachments.length > 0) {
      if (onUserAttachmentsMessage) {
        onUserAttachmentsMessage(attachments);
      } else {
        appendLocalMessage({
          id: getNextLocalMessageId('user-attachments'),
          from: 'user',
          kind: 'card',
          card: { type: 'user-attachments', attachments },
        });
      }
    }

    if (!onSubmitAnswer) return true;

    try {
      await onSubmitAnswer(trimmedAnswer, attachments);
      return true;
    } catch {
      // Parent container handles errors and displays submitError.
      return false;
    }
  };

  const handleSend: (text: string, attachments: MediaAttachment[]) => void = (
    text,
    attachments
  ) => {
    void submitAnswer(text, attachments);
  };

  const handleAttachmentUpload: (file: File) => Promise<UploadAsset> = async (
    file
  ) => {
    const url = URL.createObjectURL(file);
    return {
      id: crypto.randomUUID(),
      url,
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      file,
    };
  };

  const chips = session?.suggestedChips ?? [];
  const uploadedImageCount = uploadedAttachments.filter(
    (attachment) => attachment.type === 'image'
  ).length;
  const hasRequiredClothImages = uploadedImageCount >= IMAGE_SLOT_COUNT;
  const shouldShowClothTryOnChips =
    finalActiveTab !== 'cloth-try-on' ||
    uploadedImageCount >= 2 ||
    chips.length === 0;
  const lastMsg = mergedMessages[mergedMessages.length - 1];
  const isAwaitingAnswer =
    !!lastMsg &&
    lastMsg.from === 'ai' &&
    lastMsg.kind === 'text' &&
    !isSubmitting;
  const isClothTryOnGenerating =
    finalActiveTab === 'cloth-try-on' && (isSubmitting || isValidatingProduct);
  const isProductAdGenerating =
    finalActiveTab === 'product-ad' && (isSubmitting || isValidatingProduct);
  const hasIndividualCompletionCard = mergedMessages.some(
    (message) =>
      message.kind === 'card' && message.card.type === 'individual-completion'
  );
  const shouldShowWaitingIndicator =
    !hasIndividualCompletionCard &&
    (isAwaitingAnswer || isClothTryOnGenerating || isProductAdGenerating);
  const shouldShowSuggestedChips =
    !hasIndividualCompletionCard &&
    chips.length > 0 &&
    shouldShowClothTryOnChips &&
    !isClothTryOnGenerating;
  const chipSet = new Set(chips);
  const isBeautyCategoryChipSet =
    chips.length > 0 &&
    chips.length === BEAUTY_CATEGORY_OPTIONS.length &&
    BEAUTY_CATEGORY_OPTIONS.every((chip) => chipSet.has(chip));
  const isFashionCategoryChipSet =
    chips.length > 0 &&
    chips.length === FASHION_CATEGORY_OPTIONS.length &&
    FASHION_CATEGORY_OPTIONS.every((chip) => chipSet.has(chip));
  const isChipOnlyMode =
    shouldShowSuggestedChips &&
    (isBeautyCategoryChipSet || isFashionCategoryChipSet);
  const isClothUploadOnlyMode =
    finalActiveTab === 'cloth-try-on' &&
    !hasIndividualCompletionCard &&
    !isClothTryOnGenerating;

  const inputPlaceholder = getIndividualInputPlaceholder({
    question: session?.nextQuestion,
    activeTab: finalActiveTab,
    uploadedImageCount,
    isGenerating:
      isValidatingProduct || isClothTryOnGenerating || isProductAdGenerating,
    shouldShowSuggestedChips,
  });
  const urlValidationMode = getIndividualUrlValidationMode({
    question: session?.nextQuestion,
    activeTab: finalActiveTab,
  });

  return (
    <div className="bg-neutral-gray-100 flex h-dvh w-dvw flex-col px-8 pb-12">
      <LogoHeader />
      <MemoryHeader
        className="h-24"
        signupType="individual"
        activeTab={finalActiveTab}
        // onTabChange={handleTabChange}
      />
      {isValidatingProduct && (
        <LoadingOverlay
          title="Processing your product"
          subtitles={[
            'Analyzing the product…',
            'Extracting product details…',
            'Generating output…',
            'Almost ready...',
          ]}
        />
      )}
      <div className="flex h-full w-full justify-center overflow-hidden">
        <div className="flex h-full w-full max-w-4xl flex-col">
          <div
            ref={chatRef}
            className="flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto px-3"
          >
            {mergedMessages.map((msg) => {
              if (msg.kind === 'text') {
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

              if (card.type === 'product-selection') {
                return (
                  <div key={msg.id} className="mb-4 h-[500px]">
                    <ProductImageSelectionCard
                      images={card.images}
                      productName={card.productName}
                      description={card.description}
                      price={card.price}
                      onNext={onProductImageSelected}
                      compact
                    />
                  </div>
                );
              }

              if (card.type === 'product-display') {
                return (
                  <div key={msg.id} className="mb-4">
                    <div className="border-neutral-gray-300 w-full max-w-[420px] overflow-hidden rounded-[24px] border shadow-[0_18px_50px_rgba(24,24,26,0.08)]">
                      <img
                        src={card.image}
                        alt={card.productName}
                        className="h-64 w-full object-cover"
                      />
                      <div className="flex flex-col gap-3 p-6">
                        <h3 className="text-neutral-gray-900 text-xl font-semibold">
                          {card.productName}
                        </h3>
                        <p className="text-neutral-gray-600 text-sm leading-6">
                          {card.description}
                        </p>
                        <div className="text-neutral-gray-900 text-lg font-semibold">
                          {card.price}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (card.type === 'user-attachments') {
                return (
                  <div key={msg.id} className="mb-4 flex justify-end">
                    <div className="flex max-w-[80%] flex-wrap justify-end gap-3">
                      {card.attachments.map((attachment) =>
                        attachment.type === 'image' ? (
                          <img
                            key={attachment.id}
                            src={attachment.url}
                            alt={attachment.name}
                            className="border-neutral-gray-300 max-h-50 rounded-[20px] border object-contain p-2.5"
                          />
                        ) : (
                          <div
                            key={attachment.id}
                            className="bg-neutral-graytext-neutral-gray-900 flex h-24 w-24 items-center justify-center rounded-[14px] text-xs text-white"
                          >
                            Video
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              }

              if (
                card.type === 'cloth-tryon-result' ||
                card.type === 'brand-advertisement' ||
                card.type === 'vton-result' ||
                card.type === 'individual-completion'
              ) {
                return (
                  <div
                    key={msg.id}
                    className="mb-4 flex flex-col items-start gap-2"
                  >
                    <img
                      src={card.resultUrl}
                      alt="Generated output"
                      className="border-neutral-gray-300 max-h-50 rounded-[20px] border object-contain p-2.5"
                    />
                    {(card.type === 'vton-result' ||
                      card.type === 'individual-completion') && (
                      <button
                        onClick={async () =>
                          await downloadFile({ url: card.resultUrl })
                        }
                        className="flex items-center gap-0.5"
                      >
                        <Icon
                          icon="solar:download-minimalistic-linear"
                          className="size-4"
                        />
                        <span className="text-neutral-gray-700 font-metropolis text-xs/[15px] font-medium">
                          Download
                        </span>
                      </button>
                    )}
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
                    <CreationPipelineCard steps={pipeline.displaySteps} />
                  </div>
                );
              }

              return null;
            })}
          </div>
          <div className="flex flex-col gap-6 pt-6">
            {!hasIndividualCompletionCard && shouldShowWaitingIndicator && (
              <LeftChatWaitingForInput
                messages={
                  isClothTryOnGenerating
                    ? CLOTH_TRYON_LOADING_MESSAGES
                    : isProductAdGenerating
                      ? PRODUCT_AD_LOADING_MESSAGES
                      : ['Versa is formulating a response...']
                }
                intervalMs={5000}
              />
            )}
            {!hasIndividualCompletionCard && shouldShowSuggestedChips && (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    content={chip}
                    size="sm"
                    className="bg-neutral-gray-200! h-7.5! w-fit! px-2! py-1.5! [&_span]:leading-none!"
                    disabled={
                      isSubmitting ||
                      (finalActiveTab === 'cloth-try-on' &&
                        !hasRequiredClothImages)
                    }
                    onClick={() =>
                      void (async () => {
                        const success = await submitAnswer(
                          chip,
                          finalActiveTab === 'cloth-try-on'
                            ? uploadedAttachments
                            : []
                        );

                        if (success && finalActiveTab === 'cloth-try-on') {
                          resetComposer();
                        }
                      })()
                    }
                  />
                ))}
              </div>
            )}
            {hasIndividualCompletionCard ? (
              <div className="flex items-center justify-center">
                <Button
                  variant="primary"
                  content="Continue"
                  className="w-fit! min-w-[200px]! py-2.5!"
                  disabled={isSubmitting || isValidatingProduct}
                  onClick={onComplete ?? onGoToDashboard}
                />
                {submitError && (
                  <p className="text-ui-error text-center text-sm">
                    {submitError}
                  </p>
                )}
              </div>
            ) : (
              <IndividualChatInput
                activeTab={finalActiveTab}
                onSend={handleSend}
                onUploadAttachment={handleAttachmentUpload}
                onUploadedAttachmentsChange={setUploadedAttachments}
                placeholder={inputPlaceholder}
                urlValidationMode={urlValidationMode}
                disabled={isSubmitting || isValidatingProduct}
                isSubmitting={isSubmitting || isValidatingProduct}
                errorMessage={submitError}
                resetSignal={inputResetSignal}
                chipOnlyMode={isChipOnlyMode}
                textEntryDisabled={isClothUploadOnlyMode}
              />
            )}
          </div>
        </div>
      </div>
      <CosmeticTryOnOnboardingModal
        open={Boolean(cosmeticTryOnModalData)}
        onClose={onCloseCosmeticTryOnModal ?? (() => undefined)}
        productTitle={cosmeticTryOnModalData?.productTitle ?? 'Beauty Product'}
        subCategory={cosmeticTryOnModalData?.subCategory ?? 'Lipstick'}
        variants={cosmeticTryOnModalData?.variants ?? []}
        productLink={cosmeticTryOnModalData?.productLink}
        showExperienceMeta={false}
        isNextLoading={isSubmitting || isValidatingProduct}
        onNext={onCompleteCosmeticTryOnModal ?? (() => undefined)}
      />
    </div>
  );
};

export default IndividualOnboarding;
