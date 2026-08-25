import axios from 'axios';

import { PUBLISH_BASE_URL } from '../../env';
import { getUser } from '../../lib/utils';
import type {
  AnalyzeBrandEvent,
  AnalyzeBrandPayload,
  CompleteOnboardingPayload,
  CompleteOnboardingStepPayload,
  ExtractPdpPayload,
  ExtractPdpResult,
  RemoveBackgroundPayload,
  RemoveBackgroundResult,
  BrandAdvertisementPayload,
  BrandAdvertisementResult,
  CreativeStudioPhotoshootPayload,
  CreativeStudioPhotoshootResult,
  OnboardingFlowStep,
  OnboardingFlowStepKey,
  OnboardingSession,
  OnboardingSignupType,
  OnboardingStepId,
  SaveUserInfoPayload,
  ValidateProductPayload,
  ValidateProductResult,
} from '../../types/onboarding';
import {
  getProductStepDataFromFlow,
  mapFlowStepKeyToUiStep,
} from './stepMapping';
import { privateApiClient } from '../api';
import { BRAND_TRANSFORM_PRODUCT_TEXT, ONBOARDING_QUESTION_ANALYZE_BRAND, ONBOARDING_QUESTION_BEAUTY_TRY_ON, ONBOARDING_QUESTION_BRAND_ADVERTISEMENT, ONBOARDING_QUESTION_BRAND_DNA_READY, ONBOARDING_QUESTION_CLOTH_TRY_ON, ONBOARDING_QUESTION_COMPLETE, ONBOARDING_QUESTION_CREATION_PIPELINE, ONBOARDING_QUESTION_PRODUCT_AD } from '../../pages/onboarding/onboarding.constants';

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};

const valueAsString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

const valueAsNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
};

const valueAsBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return fallback;
};

const stringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
};

const logOnboardingDebug = (label: string, payload: unknown) => {
  const browserDebugEnabled =
    typeof window !== 'undefined' &&
    window.localStorage?.getItem('onboarding_debug') === '1';
  if (!import.meta.env.DEV && !browserDebugEnabled) return;
  console.log(`[onboarding] ${label}`, payload);
};

const EXPERIENCE_PATHS: Record<string, string> = {
  '3d_visualizer': '3d-visualizer',
  '3d-visualizer': '3d-visualizer',
  ar_experience: 'ar-experience',
  'ar-experience': 'ar-experience',
  '3d_configurator': 'configurator',
  configurator: 'configurator',
  fashion_tryon: 'fashion-try-on',
  'fashion-try-on': 'fashion-try-on',
  beauty_tryon: 'beauty-try-on',
  'beauty-try-on': 'beauty-try-on',
  immersive_store: 'storefront',
  'immersive-store': 'storefront',
  storefront: 'storefront',
};

const toErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = toRecord(error.response?.data);
    const nestedError = toRecord(data.error);
    const dataMessage = valueAsString(data.message);
    const nestedMessage = valueAsString(nestedError.message);

    if (nestedMessage) return nestedMessage;
    if (dataMessage) return dataMessage;
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};

const buildExperienceUrl = (
  siteInfoValue: unknown,
  typeValue?: unknown
): string | null => {
  const siteInfo = toRecord(siteInfoValue);
  const subdomain =
    valueAsString(siteInfo.subdomain) || valueAsString(siteInfo.subDomain);
  const slug = valueAsString(siteInfo.slug);

  if (!subdomain || !slug || !PUBLISH_BASE_URL) return null;

  const rawType = valueAsString(typeValue).trim();
  const modulePath = rawType ? (EXPERIENCE_PATHS[rawType] ?? rawType) : '';

  return `https://${subdomain}.${PUBLISH_BASE_URL}/${slug}${modulePath ? `/${modulePath}` : ''}`;
};

const extractExperienceUrl = (
  rawSession: Record<string, unknown>
): string | null => {
  const directCandidates = [
    rawSession.experienceUrl,
    rawSession.experience_url,
    rawSession.liveUrl,
    rawSession.live_url,
    rawSession.previewUrl,
    rawSession.preview_url,
    rawSession.publishedUrl,
    rawSession.published_url,
    rawSession.url,
  ];

  for (const candidate of directCandidates) {
    const url = valueAsString(candidate).trim();
    if (url) return url;
  }

  const nestedRecords = [
    toRecord(rawSession.experience),
    toRecord(rawSession.generatedExperience),
    toRecord(rawSession.result),
    toRecord(rawSession.data),
  ];

  for (const nested of nestedRecords) {
    const nestedDirectCandidates = [
      nested.experienceUrl,
      nested.experience_url,
      nested.liveUrl,
      nested.live_url,
      nested.previewUrl,
      nested.preview_url,
      nested.publishedUrl,
      nested.published_url,
      nested.url,
    ];

    for (const candidate of nestedDirectCandidates) {
      const url = valueAsString(candidate).trim();
      if (url) return url;
    }

    const builtNestedUrl = buildExperienceUrl(
      nested.siteInfo,
      nested.type ?? nested.experienceType ?? nested.moduleType
    );
    if (builtNestedUrl) return builtNestedUrl;
  }

  return buildExperienceUrl(
    rawSession.siteInfo,
    rawSession.type ?? rawSession.experienceType ?? rawSession.moduleType
  );
};

const inferSignupType = (
  rawSession: Record<string, unknown>
): OnboardingSignupType => {
  const flow = toRecord(rawSession.flow);
  const explicit = valueAsString(
    flow.userType ?? rawSession.userType ?? rawSession.signupType
  ).toLowerCase();
  if (explicit === 'brand' || explicit === 'individual') {
    return explicit as OnboardingSignupType;
  }

  const user = getUser();
  const email = user?.user?.email?.toLowerCase() ?? '';
  const generalDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'protonmail.com',
    'mail.com',
  ];

  return generalDomains.some((domain) => email.endsWith(`@${domain}`))
    ? 'individual'
    : 'brand';
};

const inferCurrentStepKeyFromFlowSteps = (
  flowSteps: OnboardingFlowStep[]
): OnboardingFlowStepKey | null => {
  const nextRequiredStep = flowSteps.find(
    (step) =>
      step.required &&
      step.status !== 'completed' &&
      step.status !== 'skipped'
  );
  return nextRequiredStep?.stepKey ?? null;
};

const hasIncompleteRequiredFlowStep = (flowSteps: OnboardingFlowStep[]): boolean =>
  flowSteps.some(
    (step) =>
      step.required &&
      step.status !== 'completed' &&
      step.status !== 'skipped'
  );

const getFlowStep = (
  flowSteps: OnboardingFlowStep[],
  stepKey: OnboardingFlowStepKey | 'product_link_and_generation'
) => flowSteps.find((step) => step.stepKey === stepKey);



const questionByStep: Record<
  Exclude<OnboardingStepId, 'logo' | 'extract-pdp' | 'generate-vton'>,
  string
> = {
  'user-info': '',
  'analyze-brand': ONBOARDING_QUESTION_ANALYZE_BRAND,
  'brand-dna-ready': ONBOARDING_QUESTION_BRAND_DNA_READY,
  'validate-product': BRAND_TRANSFORM_PRODUCT_TEXT,
  'beauty-try-on': ONBOARDING_QUESTION_BEAUTY_TRY_ON,
  'cloth-try-on': ONBOARDING_QUESTION_CLOTH_TRY_ON,
  'product-ad': ONBOARDING_QUESTION_PRODUCT_AD,
  'creation-pipeline': ONBOARDING_QUESTION_CREATION_PIPELINE,
  'brand-advertisement': ONBOARDING_QUESTION_BRAND_ADVERTISEMENT,
  complete: ONBOARDING_QUESTION_COMPLETE,
};

export const getOnboardingQuestionByStep = (
  step: Exclude<OnboardingStepId, 'logo' | 'extract-pdp' | 'generate-vton'>
) => questionByStep[step];

const normalizeOnboardingSession = (rawSession: unknown): OnboardingSession => {
  const raw = toRecord(rawSession);
  const user = toRecord(raw.user);
  const brand = toRecord(raw.brand);
  const flowRecord = toRecord(raw.flow);
  const flowSteps = Array.isArray(flowRecord.steps)
    ? flowRecord.steps.map((item): OnboardingFlowStep => {
      const step = toRecord(item);
      return {
        stepKey: valueAsString(step.stepKey) as OnboardingFlowStepKey,
        title: valueAsString(step.title),
        required: valueAsBoolean(step.required),
        status: valueAsString(
          step.status,
          'not_started'
        ) as OnboardingFlowStep['status'],
        data:
          step.data &&
            typeof step.data === 'object' &&
            !Array.isArray(step.data)
            ? toRecord(step.data)
            : null,
        completedAt: valueAsString(step.completedAt) || null,
        skippedAt: valueAsString(step.skippedAt) || null,
      };
    })
    : [];
  const flowUserType = inferSignupType(raw);
  const flowCurrentStepKeyRaw = (valueAsString(flowRecord.currentStepKey) ||
    null) as OnboardingFlowStepKey | null;
  const flowCurrentStepKey =
    flowCurrentStepKeyRaw ?? inferCurrentStepKeyFromFlowSteps(flowSteps);
  const rawAnswers = toRecord(raw.answers);
  const productStepData = toRecord(getProductStepDataFromFlow(flowSteps));
  const marketingImageStep = getFlowStep(flowSteps, 'marketing_image');
  const shouldRestartBrandProductLink =
    flowUserType === 'brand' &&
    flowCurrentStepKey === 'product_link' &&
    marketingImageStep?.status !== 'completed';
  const flowStatus = valueAsString(flowRecord.status, 'not_started');
  const isCompleted = flowStatus === 'completed';
  const currentStep = mapFlowStepKeyToUiStep(flowCurrentStepKey, flowUserType) ?? 'complete';
  const resolvedCurrentStep =
    !isCompleted && currentStep === 'complete' && hasIncompleteRequiredFlowStep(flowSteps)
      ? 'validate-product'
      : currentStep;
  const resolvedProductUrl = shouldRestartBrandProductLink
    ? ''
    : valueAsString(rawAnswers.productUrl) || valueAsString(productStepData.productUrl);
  const resolvedCategory = shouldRestartBrandProductLink
    ? ''
    : valueAsString(rawAnswers.category) || valueAsString(productStepData.category);
  const resolvedSubCategory = shouldRestartBrandProductLink
    ? ''
    : valueAsString(rawAnswers.subCategory) || valueAsString(productStepData.subCategory);
  logOnboardingDebug('normalized status snapshot', {
    flowStatus: valueAsString(flowRecord.status, 'unknown'),
    flowCurrentStepKeyRaw,
    flowCurrentStepKeyResolved: flowCurrentStepKey,
    currentStep: resolvedCurrentStep,
    isCompleted,
    shouldRestartBrandProductLink,
    hasIncompleteRequiredStep: hasIncompleteRequiredFlowStep(flowSteps),
    answers: {
      productUrl: resolvedProductUrl,
      category: resolvedCategory,
      subCategory: resolvedSubCategory,
    },
  });
  const runtimeUser = getUser();

  return {
    sessionId:
      valueAsString(raw.sessionId) ||
      valueAsString(toRecord(raw.data).sessionId) ||
      valueAsString(runtimeUser?.user?.id) ||
      'onboarding',
    signupType: flowUserType,
    status: flowStatus as OnboardingSession['status'],
    currentStep: resolvedCurrentStep,
    nextQuestion:
      questionByStep[resolvedCurrentStep as keyof typeof questionByStep] ?? null,
    suggestedChips: [],
    answers: {
      name: valueAsString(rawAnswers.name) || valueAsString(user.name),
      location:
        valueAsString(rawAnswers.location) || valueAsString(user.location),
      profession:
        valueAsString(rawAnswers.profession) || valueAsString(user.profession),
      referralSource:
        valueAsString(rawAnswers.referralSource) ||
        valueAsString(user.referralSource),
      productUrl: resolvedProductUrl,
      category: resolvedCategory,
      subCategory: resolvedSubCategory,
    },
    completedAt: isCompleted
      ? valueAsString(raw.completedAt) ||
      valueAsString(raw.completed_at) ||
      null
      : null,
    user: {
      name: valueAsString(user.name),
      location: valueAsString(user.location),
      profession: valueAsString(user.profession),
      referralSource: valueAsString(user.referralSource),
    },
    brand: {
      name: valueAsString(brand.name) || null,
      profilePhoto: valueAsString(brand.profilePhoto) || null,
      logos: stringArray(brand.logos),
      colors:
        brand.colors && typeof brand.colors === 'object'
          ? {
            primary: stringArray(toRecord(brand.colors).primary),
            secondary: stringArray(toRecord(brand.colors).secondary),
          }
          : null,
      fonts: stringArray(brand.fonts),
      vibe:
        brand.vibe && typeof brand.vibe === 'object'
          ? {
            archetype: valueAsString(toRecord(brand.vibe).archetype) || null,
            description:
              valueAsString(toRecord(brand.vibe).description) || null,
            preferredTerms: stringArray(toRecord(brand.vibe).preferredTerms),
          }
          : null,
    },
    subSteps:
      raw.subSteps && typeof raw.subSteps === 'object'
        ? {
          asset3dCreated: valueAsBoolean(
            toRecord(raw.subSteps).asset3dCreated
          ),
          visualizerCreated: valueAsBoolean(
            toRecord(raw.subSteps).visualizerCreated
          ),
          arExperienceCreated: valueAsBoolean(
            toRecord(raw.subSteps).arExperienceCreated
          ),
          vtonCreated: valueAsBoolean(toRecord(raw.subSteps).vtonCreated),
        }
        : null,
    experienceUrl: extractExperienceUrl(raw),
    rawData: raw,
    flow:
      flowSteps.length > 0 ||
        flowCurrentStepKey ||
        valueAsString(flowRecord.flowKey)
        ? {
          userType: flowUserType,
          flowKey: valueAsString(flowRecord.flowKey) || null,
          flowVersion:
            typeof flowRecord.flowVersion === 'number'
              ? flowRecord.flowVersion
              : typeof flowRecord.flowVersion === 'string' &&
                flowRecord.flowVersion
                ? Number(flowRecord.flowVersion)
                : null,
          status: valueAsString(
            flowRecord.status,
            'not_started'
          ) as OnboardingSession['status'],
          currentStepKey: flowCurrentStepKey,
          steps: flowSteps,
        }
        : null,
  };
};

export const getOnboardingSession = async (): Promise<OnboardingSession> => {
  try {
    const response = await privateApiClient.get('/onboarding/status');
    const responseBody = toRecord(response.data);
    // logOnboardingDebug('/onboarding/status raw response', response.data);
    return normalizeOnboardingSession(responseBody.data ?? responseBody);
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const resolveOnboardingUserType =
  async (): Promise<OnboardingSession> => {
    try {
      await privateApiClient.post('/onboarding/user-type');
      return getOnboardingSession();
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  };

export const startOnboarding = async (): Promise<OnboardingSession> => {
  return resolveOnboardingUserType();
};

export const saveUserInfo = async (
  payload: SaveUserInfoPayload
): Promise<OnboardingSession> => {
  try {
    const response = await privateApiClient.post(
      '/onboarding/user-info',
      payload
    );
    logOnboardingDebug('/onboarding/user-info request payload', payload);
    logOnboardingDebug('/onboarding/user-info raw response', response.data);
    return getOnboardingSession();
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const analyzeBrand = async (
  payload: AnalyzeBrandPayload,
  handlers?: {
    onEvent?: (event: AnalyzeBrandEvent) => void;
  }
): Promise<OnboardingSession> => {
  const token = getUser()?.token;
  if (!token) {
    throw new Error('Authentication token missing.');
  }

  const base = valueAsString(privateApiClient.defaults.baseURL).replace(
    /\/$/,
    ''
  );

  const response = await fetch(`${base}/onboarding/analyze-brand`, {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream, application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        const data = toRecord(await response.json());
        message =
          valueAsString(toRecord(data.error).message) ||
          valueAsString(data.message) ||
          message;
      } else {
        const text = (await response.text()).trim();
        if (text) message = text;
      }
    } catch {
      // Keep fallback status message.
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';

  if (contentType.includes('text/event-stream')) {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to read streaming response.');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let currentDataLines: string[] = [];

    const flushEvent = () => {
      if (currentDataLines.length === 0) return;
      const data = currentDataLines.join('\n').trim();
      currentDataLines = [];
      if (!data || data === '[DONE]') return;
      const raw = JSON.parse(data) as AnalyzeBrandEvent;
      handlers?.onEvent?.(raw);
    };

    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });

      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) {
          flushEvent();
          continue;
        }

        if (line.startsWith('data:')) {
          currentDataLines.push(line.slice(5).trimStart());
        }
      }

      if (done) {
        if (buffer.trim()) {
          const trailingLine = buffer.trim();
          if (trailingLine.startsWith('data:')) {
            currentDataLines.push(trailingLine.slice(5).trimStart());
          }
        }
        flushEvent();
        break;
      }
    }
  } else {
    const rawText = await response.text();
    let parsedBody: unknown = {};
    try {
      parsedBody = rawText ? (JSON.parse(rawText) as unknown) : {};
    } catch {
      parsedBody = {};
    }
    const body = toRecord(parsedBody);
    const data = toRecord(body.data ?? body);
    if (typeof data.phase === 'string') {
      handlers?.onEvent?.(data as AnalyzeBrandEvent);
    }
  }

  return getOnboardingSession();
};

export const validateProduct = async (
  payload: ValidateProductPayload
): Promise<ValidateProductResult> => {
  try {
    const response = await privateApiClient.post(
      '/onboarding/validate-product',
      payload
    );
    console.log('result response', response.data);
    return response.data as ValidateProductResult;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const extractPdp = async (
  payload: ExtractPdpPayload
): Promise<ExtractPdpResult> => {
  try {
    const response = await privateApiClient.post(
      '/onboarding/extract-pdp',
      payload
    );
    const body = toRecord(response.data);
    return (body.data ?? body) as ExtractPdpResult;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const removeBackground = async (
  payload: RemoveBackgroundPayload
): Promise<RemoveBackgroundResult> => {
  try {
    const imageUrl = payload.imageUrl ?? payload.image_url ?? '';
    if (!imageUrl) {
      throw new Error('image_url is required');
    }
    const response = await privateApiClient.post(
      '/onboarding/remove-background',
      {
        image_url: imageUrl,
      }
    );
    const body = toRecord(response.data);
    const data = toRecord(body.data ?? body);
    return {
      pngBase64: valueAsString(data.pngBase64),
      mimeType: valueAsString(data.mimeType, 'image/png'),
      width: valueAsNumber(data.width),
      height: valueAsNumber(data.height),
      sourceUrl: valueAsString(data.sourceUrl ?? imageUrl),
    };
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const brandAdvertisement = async (
  payload: BrandAdvertisementPayload
): Promise<BrandAdvertisementResult> => {
  try {
    const requestBody = {
      product_image_url: payload.product_image_url,
      product_name: payload.product_name,
      category: payload.category,
      subCategory: payload.subCategory,
      description: payload.description,
      features: payload.features,
    };

    const response = await privateApiClient.post(
      '/onboarding/brand-advertisement',
      requestBody
    );
    const body = toRecord(response.data);
    const data = toRecord(body.data ?? body);
    return {
      category: valueAsString(data.category, payload.category),
      subCategory: valueAsString(data.subCategory, payload.subCategory),
      bgRemovedImage: valueAsString(data.bgRemovedImage),
      bgRemovedImageKey: valueAsString(data.bgRemovedImageKey),
      adWithoutBrandMemory: valueAsString(data.adWithoutBrandMemory),
      adWithoutBrandMemoryKey: valueAsString(data.adWithoutBrandMemoryKey),
      adWithBrandMemory: valueAsString(data.adWithBrandMemory),
      adWithBrandMemoryKey: valueAsString(data.adWithBrandMemoryKey),
    };
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const creativeStudioPhotoshoot = async (
  payload: CreativeStudioPhotoshootPayload
): Promise<CreativeStudioPhotoshootResult> => {
  try {
    const safePrompt = payload.prompt.trim()
      ? payload.prompt.trim()
      : '';
    const formData = new FormData();
    formData.append('product_image', payload.productImage);
    formData.append('prompt', safePrompt);
    if (payload.personImage) {
      formData.append('person_image', payload.personImage);
    }
    if (payload.aspectRatio) {
      formData.append('aspect_ratio', payload.aspectRatio);
    }

    const response = await privateApiClient.post(
      '/creative-studio/photoshoot',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const body = toRecord(response.data);
    const data = toRecord(body.data ?? body);
    const resultImage = valueAsString(data.result_image).trim();
    const base64Image = valueAsString(data.image_base64).trim();
    const mimeType = valueAsString(data.mime_type, 'image/png').trim();
    const resultImageUrl =
      resultImage ||
      (base64Image ? `data:${mimeType};base64,${base64Image}` : '');

    if (!resultImageUrl) {
      throw new Error('Photoshoot response did not include a generated image.');
    }

    return { resultImageUrl };
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const completeOnboardingStep = async (
  payload: CompleteOnboardingStepPayload
): Promise<OnboardingSession> => {
  try {
    await privateApiClient.patch(
      `/onboarding/steps/${payload.stepKey}/complete`,
      payload.data ? { data: payload.data } : {}
    );
    return getOnboardingSession();
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};

export const completeOnboarding = async (
  payload?: CompleteOnboardingPayload
): Promise<OnboardingSession> => {
  try {
    await privateApiClient.patch('/onboarding/complete', payload);
    return getOnboardingSession();
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};
export const getProductSnapshot = async (productUrl: string) => {
  try {
    const response = await privateApiClient.post(
      '/onboarding/product-snapshot',
      { url: productUrl }
    );
    const data = response.data ?? {};
    const snapshotUrl =
      data.snapshotUrl ?? null;
    return { snapshotUrl };
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};
