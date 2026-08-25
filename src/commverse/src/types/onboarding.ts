import type { MediaAttachment } from './chat';

export type OnboardingSignupType = 'brand' | 'individual';

export type OnboardingFlowStepKey =
  | 'user_info'
  | 'brand_analysis'
  | 'product_link'
  | 'marketing_image'
  | 'immersive_product_page'
  | 'product_link_and_generation'
  | 'beauty_try_on'
  | 'cloth_try_on'
  | 'product_ad';

export type OnboardingFlowStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'not_started'
  | 'abandoned';

export type VoiceValue = 'high' | 'moderate' | 'low';
type nullable<T> = T | null;

export type OnboardingAssetItem = {
  id: string;
  image: string;
  name: string;
  tag: string;
};

type OnboardingWritingStyle = {
  id: string;
  name: string;
  instruction: string;
  tag: string;
};

export type OnboardingBrandKitData = {
  profilePhoto?: string | null;
  logos?: string[];
  colors: {
    primary: string[];
    secondary: string[];
    others: string[];
  };
  fonts: string[];
  assets: {
    characters: OnboardingAssetItem[];
    poses: OnboardingAssetItem[];
    backgrounds: OnboardingAssetItem[];
  };
  vibe: {
    archetype: string;
    description: string;
    preferredTerms: string[];
    forbiddenTerms: string[];
    voice: {
      confident: VoiceValue;
      energetic: VoiceValue;
      professional: VoiceValue;
      trust: VoiceValue;
      friendly: VoiceValue;
      authority: VoiceValue;
    };
    writingStyle: nullable<OnboardingWritingStyle[]>;
  };
};

export type OnboardingStepId =
  | 'user-info'
  | 'analyze-brand'
  | 'validate-product'
  | 'beauty-try-on'
  | 'cloth-try-on'
  | 'product-ad'
  | 'extract-pdp'
  | 'generate-vton'
  | 'brand-dna-ready'
  | 'creation-pipeline'
  | 'brand-advertisement'
  | 'complete';

export type OnboardingSubSteps = {
  asset3dCreated?: boolean;
  visualizerCreated?: boolean;
  arExperienceCreated?: boolean;
  vtonCreated?: boolean;
} | null;

export type OnboardingFlowStep = {
  stepKey: OnboardingFlowStepKey;
  title: string;
  required: boolean;
  status: OnboardingFlowStatus;
  data?: Record<string, unknown> | null;
  completedAt: string | null;
  skippedAt?: string | null;
};

export type SaveUserInfoPayload = {
  name: string;
  location: string;
  profession: string;
  referralSource: string;
};

export type CompleteOnboardingPayload = {
  skipPendingRequiredSteps?: boolean;
};

export type OnboardingUserInfo = {
  name: string;
  location: string;
  profession: string;
  category: string;
  referralSource: string;
};

export type ProductSelectionCard = {
  type: 'product-selection';
  images: string[];
  productName: string;
  description: string;
  price: string;
};

export type BrandAdvertisementCard = {
  type: 'brand-advertisement';
  originalImageUrl?: string;
  resultUrl: string;
};

export type VtonResultCard = {
  type: 'vton-result';
  resultUrl: string;
};

export type ClothTryonResultCard = {
  type: 'cloth-tryon-result';
  resultUrl: string;
};

export type ProductDisplayCard = {
  type: 'product-display';
  image: string;
  productName: string;
  description: string;
  price: string;
};

export type UserAttachmentsCard = {
  type: 'user-attachments';
  attachments: MediaAttachment[];
};

export type BrandDnaReadyCard = {
  type: 'brand-dna-ready';
  rawData?: Record<string, unknown>;
};

export type CreationPipelineCard = {
  type: 'creation-pipeline';
  phase?: 'marketing' | 'immersive';
};

export type DeploymentSuccessCard = {
  type: 'deployment-success';
  experienceUrl?: string | null;
};

export type IndividualCompletionCard = {
  type: 'individual-completion';
  resultUrl: string;
};

export type OnboardingCard =
  | ProductSelectionCard
  | BrandAdvertisementCard
  | VtonResultCard
  | ClothTryonResultCard
  | ProductDisplayCard
  | UserAttachmentsCard
  | BrandDnaReadyCard
  | CreationPipelineCard
  | DeploymentSuccessCard
  | IndividualCompletionCard;

export type OnboardingChatLine =
  | {
    id: string;
    from: 'ai' | 'user';
    kind: 'text';
    text: string;
  }
  | {
    id: string;
    from: 'ai' | 'user';
    kind: 'card';
    card: OnboardingCard;
  };

export type OnboardingSession = {
  sessionId: string;
  signupType: OnboardingSignupType;
  status: OnboardingFlowStatus;
  currentStep: OnboardingStepId;
  nextQuestion?: string | null;
  suggestedChips?: string[] | null;
  answers: {
    name: string;
    location: string;
    profession: string;
    referralSource: string;
    productUrl?: string;
    category?: string;
    subCategory?: string;
  };
  completedAt: string | null;
  user: {
    name: string;
    location: string;
    profession: string;
    referralSource: string;
  };
  brand: {
    name: string | null;
    profilePhoto: string | null;
    logos: string[];
    colors: {
      primary: string[];
      secondary: string[];
      others?: string[];
    } | null;
    fonts: string[];
    vibe: {
      archetype: string | null;
      description: string | null;
      preferredTerms: string[];
      voice?: {
        confident: VoiceValue;
        energetic: VoiceValue;
        professional: VoiceValue;
        trust: VoiceValue;
        friendly: VoiceValue;
        authority: VoiceValue;
      };
    } | null;
  };
  subSteps?: OnboardingSubSteps;
  experienceUrl?: string | null;
  rawData?: Record<string, unknown>;
  flow?: {
    userType: OnboardingSignupType;
    flowKey: string | null;
    flowVersion: number | null;
    status: OnboardingFlowStatus;
    currentStepKey: OnboardingFlowStepKey | null;
    steps: OnboardingFlowStep[];
  } | null;
};

export type AnalyzeBrandEvent =
  | { phase: 'validating' }
  | { phase: 'scraping' }
  | { phase: 'logo' }
  | ({
    phase: 'brand_meta';
  } & Record<string, unknown>)
  | { phase: 'done' }
  | { phase: 'error'; message?: string };

export type AnalyzeBrandPayload = {
  url: string;
};

export type AnalyzeBrandOptions = {
  onEvent?: (event: AnalyzeBrandEvent) => void;
};

export type StartOnboardingPayload = Record<string, unknown>;

export type ValidateProductPayload = {
  product_url: string;
  category: string;
  subCategory: string;
};

export type ProductShade = {
  hex: string;
  name?: string;
};

export type ValidateProductResult = {
  valid?: boolean;
  productImages?: string[];
  product_name?: string;
  productName?: string;
  name?: string;
  price?: string;
  description?: string;
  features?: unknown;
  category?: string;
  subCategory?: string;
  product_shades?: ProductShade[];
  dominantProductColor?: string | null;
  productColors?: string[];
  productUrl?: string;
  product_url?: string;
  primary_colors: string[];
  secondary_colors: string[];
  vibe: string;
  vibe_keywords: string[];
  typography_description: string;
  advertisement: {
    generatedMediaId: string;
    resultUrl: string;
  } | null;
};

export type ExtractPdpPayload = {
  url: string;
  category?: string;
  subCategory?: string;
};

export type ExtractPdpResult = {
  productImages?: string[];
  productName?: string | null;
  description?: string | null;
  price?: string | null;
  category?: string | null;
  subCategory?: string | null;
  features?: string[];
  product_shades?: ProductShade[];
  dominantProductColor?: string | null;
  productColors?: string[];
};

export type RemoveBackgroundPayload = {
  imageUrl?: string;
  image_url?: string;
};

export type RemoveBackgroundResult = {
  pngBase64: string;
  mimeType: string;
  width: number;
  height: number;
  sourceUrl: string;
};

export type BrandAdvertisementPayload = {
  product_image_url: string;
  logo_url?: string;
  brand_name?: string;
  primary_colors?: string[];
  secondary_colors?: string[];
  vibe?: string;
  brand_voice?: Array<{ word?: string; score?: number; rating?: string }>;
  brand_archetype?: string;
  archetype_description?: string;
  typography_description?: string;
  product_name?: string;
  category: string;
  subCategory?: string;
  description?: string;
  features?: string[];
};

export type BrandAdvertisementResult = {
  category: string;
  subCategory: string;
  bgRemovedImage: string;
  bgRemovedImageKey?: string;
  adWithoutBrandMemory: string;
  adWithoutBrandMemoryKey?: string;
  adWithBrandMemory: string;
  adWithBrandMemoryKey?: string;
};

export type CreativeStudioPhotoshootPayload = {
  productImage: File;
  personImage?: File;
  prompt: string;
  aspectRatio?: string;
};

export type CreativeStudioPhotoshootResult = {
  resultImageUrl: string;
};

export type CompleteOnboardingStepPayload = {
  stepKey: OnboardingFlowStepKey;
  data?: Record<string, unknown>;
};

export type ChatInputAttachment = MediaAttachment;
