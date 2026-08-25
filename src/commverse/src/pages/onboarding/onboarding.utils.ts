import type {
  AnalyzeBrandEvent,
  OnboardingChatLine,
  OnboardingSession,
  OnboardingSignupType,
  OnboardingStepId,
  OnboardingSubSteps,
  OnboardingUserInfo,
} from '../../types/onboarding';
import { isImmersiveProductPageStep } from '../../services/onboarding/stepMapping';
import {
  BEAUTY_CATEGORY_OPTIONS,
  ONBOARDING_QUESTION_BRAND_DNA_READY,
  CATEGORY_SUGGESTIONS,
  FASHION_CATEGORY_OPTIONS,
  LOCATION_SUGGESTED_CITIES,
  PROFESSION_SUGGESTIONS,
  REFERRAL_SOURCE_SUGGESTIONS,
  SUBCATEGORY_SUGGESTIONS,
  BRAND_TRANSFORM_PRODUCT_TEXT,
} from './onboarding.constants';
import type {
  BeautyAnswers,
  BrandKitRawData,
  ProductAnswers,
} from './onboarding.types';

export type ImmersivePipelineRequirements = {
  asset3dCreated: boolean;
  visualizerCreated: boolean;
  arExperienceCreated: boolean;
  vtonCreated: boolean;
};

export type OnboardingUrlValidationMode = 'website' | 'product';

export const getImmersivePipelineRequirements = (params: {
  category?: string | null;
  subCategory?: string | null;
}): ImmersivePipelineRequirements => {
  const normalizedCategory = params.category?.trim().toLowerCase() ?? '';
  const normalizedSubCategory = params.subCategory?.trim().toLowerCase() ?? '';
  const isOtherSubCategory =
    normalizedSubCategory === 'others' || normalizedSubCategory === 'other';

  if (normalizedCategory === 'fashion') {
    return {
      asset3dCreated: false,
      visualizerCreated: false,
      arExperienceCreated: false,
      vtonCreated: true,
    };
  }

  if (
    normalizedCategory === 'cosmetic' ||
    normalizedCategory === 'cosmetics'
  ) {
    return {
      asset3dCreated: true,
      visualizerCreated: false,
      arExperienceCreated: true,
      vtonCreated: !isOtherSubCategory,
    };
  }

  if (
    normalizedCategory === 'furniture' ||
    normalizedCategory === 'others' ||
    normalizedCategory === 'other'
  ) {
    return {
      asset3dCreated: true,
      visualizerCreated: false,
      arExperienceCreated: true,
      vtonCreated: false,
    };
  }

  return {
    asset3dCreated: true,
    visualizerCreated: false,
    arExperienceCreated: true,
    vtonCreated: false,
  };
};

type CategoryWithSubcategories = {
  subcategories?: { _id?: string; name: string }[];
};

const subcategoryId = (sub: { _id?: string; name: string }): string | null => {
  const id = typeof sub._id === 'string' ? sub._id.trim() : '';
  return id || null;
};

/**
 * Product CMS expects `subcategory` to be a subcategory Mongo id (or the literal "Others"),
 * not onboarding display labels like "Dress (Top & Bottom)".
 */
export const resolveCmsSubcategoryId = (
  category: CategoryWithSubcategories | null | undefined,
  onboardingSubCategoryLabel: string
): string => {
  const subs = category?.subcategories ?? [];
  if (subs.length === 0) {
    return 'Others';
  }

  const raw = onboardingSubCategoryLabel.trim();
  const normalized = raw.toLowerCase();

  const exact = subs.find((s) => s.name.trim().toLowerCase() === normalized);
  const exactId = exact ? subcategoryId(exact) : null;
  if (exactId) return exactId;

  const loose = subs.find((s) => {
    const n = s.name.trim().toLowerCase();
    if (!n || !normalized) return false;
    return n.includes(normalized) || normalized.includes(n);
  });
  const looseId = loose ? subcategoryId(loose) : null;
  if (looseId) return looseId;

  const fashionAliases: Record<string, readonly string[]> = {
    'dress (top & bottom)': [
      'dress',
      'dresses',
      'coord',
      'co-ord',
      'jumpsuit',
      'set',
      'one-piece',
    ],
    top: ['top', 'tops', 'shirt', 'tee', 't-shirt', 'tshirt', 'kurta'],
    bottom: ['bottom', 'bottoms', 'pant', 'trouser', 'legging', 'skirt', 'churidar'],
    saree: ['saree', 'sari'],
  };
  const aliases = fashionAliases[normalized];
  if (aliases) {
    for (const sub of subs) {
      const n = sub.name.trim().toLowerCase();
      const id = subcategoryId(sub);
      if (!id) continue;
      if (aliases.some((a) => n.includes(a) || a.includes(n))) {
        return id;
      }
    }
  }

  const othersSub = subs.find((s) => s.name.trim().toLowerCase() === 'others');
  const othersId = othersSub ? subcategoryId(othersSub) : null;
  if (othersId) return othersId;

  const firstId = subs[0] ? subcategoryId(subs[0]) : null;
  if (firstId) return firstId;

  return 'Others';
};

export const allSubStepsDone = (
  subSteps: OnboardingSubSteps | null | undefined,
  requirements?: ImmersivePipelineRequirements,
  options?: { treatVtonRequirementAsSatisfied?: boolean }
): boolean => {
  const resolvedRequirements =
    requirements ??
    ({
      asset3dCreated: true,
      visualizerCreated: true,
      arExperienceCreated: true,
      vtonCreated: true,
    } satisfies ImmersivePipelineRequirements);

  const checks = [
    !resolvedRequirements.asset3dCreated || !!subSteps?.asset3dCreated,
    !resolvedRequirements.visualizerCreated || !!subSteps?.visualizerCreated,
    !resolvedRequirements.arExperienceCreated || !!subSteps?.arExperienceCreated,
    !resolvedRequirements.vtonCreated ||
      !!subSteps?.vtonCreated ||
      !!options?.treatVtonRequirementAsSatisfied,
  ];

  return checks.every(Boolean);
};

export const createDeploymentSuccessCard = (experienceUrl?: string | null) => ({
  type: 'deployment-success' as const,
  ...(experienceUrl ? { experienceUrl } : {}),
});

const readStringField = (
  value: Record<string, unknown> | null | undefined,
  key: string,
): string | null => {
  const candidate = value?.[key];
  return typeof candidate === 'string' && candidate.trim() ? candidate : null;
};

export const extractVersaAssetId = (response: unknown): string | null => {
  if (!response || typeof response !== 'object') return null;
  const root = response as Record<string, unknown>;
  const data =
    root.data && typeof root.data === 'object'
      ? (root.data as Record<string, unknown>)
      : null;
  const result =
    root.result && typeof root.result === 'object'
      ? (root.result as Record<string, unknown>)
      : null;

  return (
    readStringField(data, 'assetId') ??
    readStringField(data, '_id') ??
    readStringField(result, 'assetId') ??
    readStringField(result, '_id') ??
    readStringField(root, 'assetId') ??
    readStringField(root, '_id') ??
    null
  );
};

export const getValidateProductQuestion = (
  answers: ProductAnswers,
  signupType?: OnboardingSignupType,
) => {
  if (!answers.productUrl) {
    return signupType === 'brand' ? BRAND_TRANSFORM_PRODUCT_TEXT : null;
  }

  if (!answers.category) {
    return 'What category does this product belong to?';
  }

  if (!answers.subCategory) {
    if (isTerminalProductCategory(answers.category)) return null;
    return 'Got it. What kind of product is it?';
  }

  return null;
};

export const getValidateProductChips = (
  answers: ProductAnswers,
  signupType?: OnboardingSignupType,
  allowBrandRetry?: boolean
) => {
  if (!answers.productUrl) return [];
  if (!answers.category) return CATEGORY_SUGGESTIONS;
  if (!answers.subCategory) {
    if (isTerminalProductCategory(answers.category)) return [];
    return SUBCATEGORY_SUGGESTIONS[answers.category] ?? ['Others'];
  }
  if (signupType === 'brand' && allowBrandRetry) return ['Retry'];
  return [];
};

export const isTerminalProductCategory = (category?: string | null) => {
  const normalizedCategory = category?.trim().toLowerCase() ?? '';
  return (
    normalizedCategory === 'others' ||
    normalizedCategory === 'other' ||
    normalizedCategory === 'furniture'
  );
};

export const isValidateProductReady = (answers: ProductAnswers) =>
  Boolean(
    answers.productUrl?.trim() &&
    answers.category?.trim() &&
    (isTerminalProductCategory(answers.category) || answers.subCategory?.trim())
  );

export const getUserInfoQuestion = (answers: Partial<OnboardingUserInfo>) => {
  if (!answers.name) {
    return 'Before we get started, tell us about yourself.\n\nHow should we call you?';
  }

  if (!answers.location) {
    return `Awesome, ${answers.name}. Where are you from?`;
  }

  if (!answers.profession) {
    return 'Great! What are you into?';
  }

  if (!answers.referralSource) {
    return 'Nice! Lastly, how did you hear about us?';
  }

  return undefined;
};

export const isUserInfoIncomplete = (answers: Partial<OnboardingUserInfo>) =>
  !answers.name ||
  !answers.location ||
  !answers.profession ||
  !answers.referralSource;

export const getIndividualBeautyQuestion = (answers: BeautyAnswers) => {
  if (!answers.beautySubCategory) {
    return `Let’s start with something fun.\n\nEver wanted to try a lipstick or eyeliner before buying it online?\n\nDrop a product page link from any store — and we’ll let you try it on your face instantly using AR.\n\nChoose a category to get started.`;
  }

  if (!answers.beautyProductUrl) {
    return 'Paste a beauty product link…';
  }

  return null;
};

export const getIndividualBeautyChips = (answers: BeautyAnswers) => {
  if (!answers.beautySubCategory) {
    return BEAUTY_CATEGORY_OPTIONS;
  }

  return [];
};

export const getIndividualClothTryOnQuestion = (answers: ProductAnswers) => {
  if (!answers.category || !answers.subCategory) {
    return "Now let's try something even cooler.\n\nLet's generate an image of you wearing your desired outfit.\n\nUpload:\nYour photo\nClothing image";
  }

  return 'Choose the outfit type...';
};

export const getIndividualProductAdQuestion = (answers: ProductAnswers) => {
  if (!answers.category || !answers.subCategory) {
    return "Now it's your turn to be the model.\n\nAI Product Photoshoot\n\nUpload:\nA photo of any product\nA photo of yourself";
  }

  return 'Choose the outfit type...';
};

export const getIndividualInputPlaceholder = ({
  question,
  activeTab,
  uploadedImageCount,
  isGenerating,
  shouldShowSuggestedChips,
}: {
  question?: string | null;
  activeTab: 'beauty-try-on' | 'cloth-try-on' | 'product-ad';
  uploadedImageCount: number;
  isGenerating: boolean;
  shouldShowSuggestedChips: boolean;
}) => {
  if (isGenerating) {
    return 'Please wait...';
  }

  const normalizedQuestion = question?.trim().toLowerCase() ?? '';

  if (normalizedQuestion.includes('how should we call you')) {
    return 'Enter your name...';
  }

  if (normalizedQuestion.includes('where are you from')) {
    return 'Enter your city...';
  }

  if (normalizedQuestion.includes('what are you into')) {
    return 'Enter your profession...';
  }

  if (normalizedQuestion.includes('how did you hear about us')) {
    return 'Enter your response...';
  }

  if (
    activeTab === 'beauty-try-on' &&
    normalizedQuestion.includes('choose a category to get started')
  ) {
    return 'Select product category...';
  }

  if (
    activeTab === 'beauty-try-on' &&
    normalizedQuestion.includes('paste a beauty product link')
  ) {
    return 'https://www.website.com/product-detail-page';
  }

  if (shouldShowSuggestedChips) {
    return 'Choose the outfit type...';
  }

  if (activeTab === 'product-ad' && uploadedImageCount >= 2) {
    return 'Choose the outfit type...';
  }

  if (
    (activeTab === 'cloth-try-on' || activeTab === 'product-ad') &&
    uploadedImageCount < 2
  ) {
    return 'Ask anything...';
  }

  return 'Type your answer...';
};

export const normalizeUrlCandidate = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return trimmedValue;

  return /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;
};

export const isValidHttpUrl = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return false;
  if (!/^https?:\/\//i.test(trimmedValue)) return false;

  try {
    const parsed = new URL(trimmedValue);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const hostname = parsed.hostname.trim().toLowerCase();
    if (!hostname) return false;

    const isIpv4Address = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (isIpv4Address) {
      return hostname
        .split('.')
        .every((segment) => Number(segment) >= 0 && Number(segment) <= 255);
    }

    if (hostname === 'localhost') return false;

    const hostnameParts = hostname.split('.');
    if (hostnameParts.length < 2) return false;

    return hostnameParts.every((part) => /^[a-z0-9-]+$/i.test(part));
  } catch {
    return false;
  }
};

export const getBrandUrlValidationMode = (
  question?: string | null
): OnboardingUrlValidationMode | null => {
  const normalizedQuestion = question?.trim().toLowerCase() ?? '';

  if (
    normalizedQuestion.includes('drop your website') ||
    normalizedQuestion.includes('understand your brand in 60 seconds')
  ) {
    return 'website';
  }

  if (
    normalizedQuestion.includes('product page url') ||
    normalizedQuestion.includes('preview your first experience')
  ) {
    return 'product';
  }

  return null;
};

export const getIndividualUrlValidationMode = ({
  question,
  activeTab,
}: {
  question?: string | null;
  activeTab: 'beauty-try-on' | 'cloth-try-on' | 'product-ad';
}): OnboardingUrlValidationMode | null => {
  const normalizedQuestion = question?.trim().toLowerCase() ?? '';

  if (
    activeTab === 'beauty-try-on' &&
    normalizedQuestion.includes('paste a beauty product link')
  ) {
    return 'product';
  }

  return null;
};

export const getBrandInputPlaceholder = ({
  question,
  isGenerating,
}: {
  question?: string | null;
  isGenerating: boolean;
}) => {
  if (isGenerating) {
    return 'Please wait...';
  }

  const normalizedQuestion = question?.trim().toLowerCase() ?? '';

  if (normalizedQuestion.includes('how should we call you')) {
    return 'Enter your name...';
  }

  if (normalizedQuestion.includes('where are you from')) {
    return 'Enter your city...';
  }

  if (normalizedQuestion.includes('what are you into')) {
    return 'Enter your profession...';
  }

  if (normalizedQuestion.includes('how did you hear about us')) {
    return 'Enter your response...';
  }

  if (
    normalizedQuestion.includes('drop your website') ||
    normalizedQuestion.includes('understand your brand in 60 seconds')
  ) {
    return 'https://www.yourbrand.com/';
  }

  if (normalizedQuestion.includes('what category does this product belong to')) {
    return 'Please select the category...';
  }

  if (normalizedQuestion.includes('what kind of product is it')) {
    return 'Please wait...';
  }

  if (
    normalizedQuestion.includes('product page url') ||
    normalizedQuestion.includes('preview your first experience')
  ) {
    return 'https://www.website.com/product-detail-page';
  }

  return 'Type your answer...';
};

export const normalizeWebsiteUrl = (value: string) => {
  const candidate = normalizeUrlCandidate(value);
  if (!candidate) return candidate;

  try {
    const parsed = new URL(candidate);
    return `${parsed.protocol}//${parsed.host}/`;
  } catch {
    return value.trim();
  }
};

export const inferGarmentType = (
  answer: string
): 'top' | 'bottom' | 'dress' | undefined => {
  const normalized = answer.toLowerCase();

  if (
    normalized.includes('dress') ||
    normalized.includes('saree') ||
    normalized.includes('others')
  ) {
    return 'dress';
  }

  if (normalized.includes('bottom')) {
    return 'bottom';
  }

  if (normalized.includes('top') || normalized.includes('jacket')) {
    return 'top';
  }

  return undefined;
};

export const getQuestionForCurrentStep = (
  question: string | undefined,
  answers: Partial<OnboardingUserInfo>,
  isBrandKitOpen?: boolean
) => {
  if (isBrandKitOpen) {
    return undefined;
  }

  if (isUserInfoIncomplete(answers)) {
    const userInfoQuestion = getUserInfoQuestion(answers);
    if (userInfoQuestion) return userInfoQuestion;
  }

  const lowerQ = question?.toLowerCase() ?? '';
  if (
    lowerQ.includes('before we get started') ||
    lowerQ.includes('how should we call you') ||
    lowerQ.includes('where are you from') ||
    lowerQ.includes('what are you into') ||
    lowerQ.includes('how did you hear about us')
  ) {
    return undefined;
  }

  return question;
};

export const shouldWaitForBrandDnaBeforeQuestion = (
  session: OnboardingSession
) =>
  session.signupType === 'brand' &&
  (session.currentStep === 'validate-product' ||
    isImmersiveProductPageStep(session.flow?.currentStepKey) ||
    session.status === 'completed');

export const hasBrandDnaReadyMessage = (
  messages: OnboardingChatLine[],
  brandDnaAppended = false
) =>
  brandDnaAppended ||
  messages.some(
    (message) =>
      message.from === 'ai' &&
      ((message.kind === 'text' &&
        message.text.trim() === ONBOARDING_QUESTION_BRAND_DNA_READY) ||
        (message.kind === 'card' && message.card.type === 'brand-dna-ready'))
  );

export const getPostUserInfoStep = (
  signupType: OnboardingSignupType
): OnboardingStepId =>
  signupType === 'individual' ? 'validate-product' : 'analyze-brand';

export const buildQuestionKey = (
  step: OnboardingStepId | 'user-info' | undefined,
  question: string
) => `${step ?? 'unknown'}:${question.trim().toLowerCase()}`;

export const getPipelineRefetchInterval = (
  showingPipeline: boolean,
  pipelineComplete: boolean,
  baseMs: number,
  jitterMs: number
) => {
  if (!showingPipeline || pipelineComplete) return false;
  return baseMs + Math.floor(Math.random() * jitterMs);
};

export const hydrateMessagesFromSession = (
  session: OnboardingSession,
  appendQuestionKey: (key: string) => void
): OnboardingChatLine[] => {
  const initialMessages: OnboardingChatLine[] = [];
  const answers = session.answers || session.user;
  const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  const asStringArray = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : [];

  const addQA = (
    step: OnboardingStepId | 'user-info',
    question: string | undefined,
    answer: string | undefined
  ) => {
    if (question) {
      appendQuestionKey(buildQuestionKey(step, question));
      initialMessages.push({
        id: `q-${step}-${initialMessages.length}`,
        from: 'ai',
        kind: 'text',
        text: question,
      });
    }

    if (answer) {
      initialMessages.push({
        id: `a-${step}-${initialMessages.length}`,
        from: 'user',
        kind: 'text',
        text: answer,
      });
    }
  };

  const shouldHydrateUserInfoHistory = !(
    session.signupType === 'individual' && session.currentStep !== 'user-info'
  );

  if (shouldHydrateUserInfoHistory) {
    if (answers?.name) {
      addQA('user-info', getUserInfoQuestion({}), answers.name);
    }
    if (answers?.location) {
      addQA(
        'user-info',
        getUserInfoQuestion({ name: answers.name }),
        answers.location
      );
    }
    if (answers?.profession) {
      addQA(
        'user-info',
        getUserInfoQuestion({ name: answers.name, location: answers.location }),
        answers.profession
      );
    }
    if (answers?.referralSource) {
      addQA(
        'user-info',
        getUserInfoQuestion({
          name: answers.name,
          location: answers.location,
          profession: answers.profession,
        }),
        answers.referralSource
      );
    }
  }

  if (
    session.signupType === 'brand' &&
    (session.currentStep === 'validate-product' ||
      isImmersiveProductPageStep(session.flow?.currentStepKey) ||
      session.status === 'completed')
  ) {
    initialMessages.push({
      id: `ai-brand-ready-text-${session.sessionId}`,
      from: 'ai',
      kind: 'text',
      text: ONBOARDING_QUESTION_BRAND_DNA_READY,
    });
    initialMessages.push({
      id: `ai-brand-ready-${session.sessionId}`,
      from: 'ai',
      kind: 'card',
      card: {
        type: 'brand-dna-ready',
        rawData: (session.rawData as BrandKitRawData | undefined) ?? undefined,
      },
    });

    if (session.currentStep === 'validate-product') {
      const productStepData =
        session.flow?.steps.find(
          (step) =>
            step.stepKey === 'product_link' ||
            step.stepKey === 'product_link_and_generation'
        )?.data ?? null;
      const productData = asRecord(productStepData);
      const productImages = asStringArray(productData?.productImages);

      if (productImages.length > 0) {
        initialMessages.push({
          id: `c-product-selection-${initialMessages.length}`,
          from: 'ai',
          kind: 'card',
          card: {
            type: 'product-selection',
            images: productImages,
            productName:
              (typeof productData?.productName === 'string' &&
                productData.productName) ||
              (typeof productData?.product_name === 'string' &&
                productData.product_name) ||
              'Your Product',
            description:
              (typeof productData?.description === 'string' &&
                productData.description) ||
              '',
            price:
              (typeof productData?.price === 'string' && productData.price) ||
              '',
          },
        });
        return initialMessages;
      }

      const validateProductQuestion = getValidateProductQuestion(
        {
          productUrl: answers?.productUrl,
          category: answers?.category,
          subCategory: answers?.subCategory,
        },
        'brand'
      );

      if (validateProductQuestion) {
        appendQuestionKey(
          buildQuestionKey('validate-product', validateProductQuestion)
        );
        initialMessages.push({
          id: `q-validate-product-${initialMessages.length}`,
          from: 'ai',
          kind: 'text',
          text: validateProductQuestion,
        });
      }
    }

    if (isImmersiveProductPageStep(session.flow?.currentStepKey)) {
      const marketingStepData = asRecord(
        session.flow?.steps.find((step) => step.stepKey === 'marketing_image')
          ?.data
      );
      const adWithBrand =
        marketingStepData &&
          typeof marketingStepData.adWithBrandMemory === 'string' &&
          marketingStepData.adWithBrandMemory
          ? marketingStepData.adWithBrandMemory
          : null;
      const adWithoutBrand =
        marketingStepData &&
          typeof marketingStepData.adWithoutBrandMemory === 'string' &&
          marketingStepData.adWithoutBrandMemory
          ? marketingStepData.adWithoutBrandMemory
          : undefined;

      if (adWithBrand) {
        initialMessages.push({
          id: `q-brand-immersive-${initialMessages.length}`,
          from: 'ai',
          kind: 'text',
          text: 'Let’s create your first immersive Product Page',
        });
        initialMessages.push({
          id: `card-brand-ad-${initialMessages.length}`,
          from: 'ai',
          kind: 'card',
          card: {
            type: 'brand-advertisement',
            originalImageUrl: adWithoutBrand,
            resultUrl: adWithBrand,
          },
        });
      }

      initialMessages.push({
        id: `q-immersive-pipeline-${initialMessages.length}`,
        from: 'ai',
        kind: 'text',
        text: "Now let's make your product page immersive",
      });
      initialMessages.push({
        id: `card-immersive-pipeline-${initialMessages.length}`,
        from: 'ai',
        kind: 'card',
        card: { type: 'creation-pipeline', phase: 'immersive' },
      });
    }
  }

  // Hydrate individual completion so reload shows the "done" UI
  // instead of falling back to Product Ad input.
  if (session.signupType === 'individual') {
    const productAdStep = session.flow?.steps?.find(
      (step) => step.stepKey === 'product_ad'
    );
    const productAdResultUrl =
      (productAdStep?.data &&
        typeof productAdStep.data.resultUrl === 'string' &&
        productAdStep.data.resultUrl) ||
      null;

    if (productAdStep?.status === 'completed' && productAdResultUrl) {
      initialMessages.push({
        id: `ai-product-ad-complete-text-${initialMessages.length}`,
        from: 'ai',
        kind: 'text',
        text: "And that's a wrap.\n\nYou just created a product campaign with yourself as the model.",
      });
      initialMessages.push({
        id: `card-product-ad-complete-${initialMessages.length}`,
        from: 'ai',
        kind: 'card',
        card: {
          type: 'individual-completion',
          resultUrl: productAdResultUrl,
        },
      });
    }
  }

  return initialMessages;
};

export const isAnalysisProgressEvent = (event: AnalyzeBrandEvent) =>
  event.phase === 'validating' ||
  event.phase === 'scraping' ||
  event.phase === 'logo' ||
  event.phase === 'brand_meta';

export const getDisplayQuestion = ({
  isCollectingUserInfo,
  userInfoAnswers,
  session,
  activeTab,
  beautyAnswers,
  productAnswers,
}: {
  isCollectingUserInfo: boolean;
  userInfoAnswers: Partial<OnboardingUserInfo>;
  session?: OnboardingSession;
  activeTab: string;
  beautyAnswers: BeautyAnswers;
  productAnswers: ProductAnswers;
}) => {
  const flowCurrentStepKey = session?.flow?.currentStepKey ?? null;

  if (isCollectingUserInfo) {
    return (
      getUserInfoQuestion(userInfoAnswers) ?? session?.nextQuestion ?? null
    );
  }

  if (session?.signupType === 'individual' && activeTab === 'beauty-try-on') {
    return getIndividualBeautyQuestion(beautyAnswers);
  }

  if (session?.signupType === 'individual' && activeTab === 'cloth-try-on') {
    return getIndividualClothTryOnQuestion(productAnswers);
  }

  if (
    session?.signupType === 'individual' &&
    activeTab === 'product-ad' &&
    session.flow?.status !== 'completed'
  ) {
    return getIndividualProductAdQuestion(productAnswers);
  }

  if (
    session?.currentStep === 'validate-product' ||
    flowCurrentStepKey === 'product_link' ||
    flowCurrentStepKey === 'marketing_image'
  ) {
    return getValidateProductQuestion(
      productAnswers,
      session?.signupType
    );
  }

  return session?.nextQuestion ?? null;
};

export const getDisplayChips = ({
  userInfoAnswers,
  session,
  activeTab,
  beautyAnswers,
  productAnswers,
  allowBrandRetry = false,
}: {
  userInfoAnswers: Partial<OnboardingUserInfo>;
  session?: OnboardingSession;
  activeTab: string;
  beautyAnswers: BeautyAnswers;
  productAnswers: ProductAnswers;
  allowBrandRetry?: boolean;
}) => {
  const flowCurrentStepKey = session?.flow?.currentStepKey ?? null;

  if (!userInfoAnswers.name) return [];
  if (!userInfoAnswers.location) return LOCATION_SUGGESTED_CITIES;
  if (!userInfoAnswers.profession) return PROFESSION_SUGGESTIONS;
  if (!userInfoAnswers.referralSource) return REFERRAL_SOURCE_SUGGESTIONS;

  if (session?.signupType === 'individual') {
    if (activeTab === 'beauty-try-on') {
      return getIndividualBeautyChips(beautyAnswers);
    }

    if (activeTab === 'cloth-try-on') {
      return FASHION_CATEGORY_OPTIONS;
    }

    return [];
  }

  if (
    session?.currentStep === 'validate-product' ||
    flowCurrentStepKey === 'product_link' ||
    flowCurrentStepKey === 'marketing_image'
  ) {
    return getValidateProductChips(
      productAnswers,
      session?.signupType,
      allowBrandRetry
    );
  }

  return session?.suggestedChips ?? [];
};
