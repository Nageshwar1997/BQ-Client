import axios from 'axios';
import { clearLoggedInData, getUser, handleThrowError } from '../lib/utils';
import type {
  Get3DAssetsParams,
  GetManageExperiencesParams,
  LoginFormData,
  OtpFormData,
  PromptTo3DPayload,
  QueueVersaImagePayload,
  QueueVersaImageResponse,
  TQueryParams,
  SendPhoneOtpPayload,
  VerifyPhoneOtpPayload,
  VersaImageResultResponse,
} from '../types';
import { VITE_GATEWAY_BASE_URL } from '../env';

export type ExperienceType =
  | '3d_visualizer'
  | 'ar_experience'
  | '3d_configurator'
  | 'fashion_tryon'
  | 'beauty_tryon'
  | 'immersive_store';
export type ExperienceStatus = 'draft' | 'published' | 'archived';

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ExperienceFilters {
  type?: ExperienceType;
  status?: ExperienceStatus;
  search?: string;
  productId?: string;
}

export interface UserData {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    isEmailVerified: boolean;
    profilePhoto?: string;
    phone?: {
      countryCode?: string;
      number?: string;
      isVerified?: boolean;
    } | null;
    isOnboarded?: boolean;
  };
}
const GATEWAY_BASE_URL = `${VITE_GATEWAY_BASE_URL}`;

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const toGatewayAbsoluteUrl = (value: string): string => {
  if (!value) return value;
  if (isAbsoluteUrl(value)) return value;
  return `${GATEWAY_BASE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
};

const normalizeModelProxyUrls = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeModelProxyUrls(item)) as T;
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const record = value as Record<string, unknown>;
  const next: Record<string, unknown> = { ...record };

  if (
    typeof record.modelProxyUrl === 'string' &&
    record.modelProxyUrl.trim().length > 0
  ) {
    next.modelUrl = toGatewayAbsoluteUrl(record.modelProxyUrl);
  }

  for (const [key, nestedValue] of Object.entries(record)) {
    if (nestedValue && typeof nestedValue === 'object') {
      next[key] = normalizeModelProxyUrls(nestedValue);
    }
  }

  return next as T;
};

export const publicApiClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
});

export const privateApiClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
});

privateApiClient.interceptors.request.use(
  (config) => {
    const user = getUser();
    const token = user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

privateApiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error?.response?.status;
    const message = String(error?.response?.data?.message ?? '').toLowerCase();
    const requestUrl = String(error?.config?.url ?? '');

    const isGeneratedMediaForbidden =
      status === 403 && requestUrl.includes('/generated-media/generate/');
    const isUnauthorized =
      !isGeneratedMediaForbidden &&
      (status === 401 ||
        // status === 403 ||
        // message.includes('forbidden') ||
        message.includes('unauthorized'));
    const isMissingAuthenticatedUser =
      (requestUrl.includes('/auth/user-detail') && status === 404) ||
      message.includes('user not found') ||
      message.includes('no user found');

    if (isUnauthorized || isMissingAuthenticatedUser) {
      clearLoggedInData();
    }

    return Promise.reject(error);
  }
);

export const createExperience = async (payLoad: any) => {
  try {
    const response = await privateApiClient.post('/experience', payLoad);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const getExperiences = async (
  filters?: ExperienceFilters,
  pagination?: PaginationQuery
) => {
  try {
    const params = new URLSearchParams();

    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.productId) params.append('productId', filters.productId);
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    const queryString = params.toString();
    const response = await privateApiClient.get(
      `/experience${queryString ? `?${queryString}` : ''}`
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const getExperienceById = async (id: string) => {
  try {
    const response = await privateApiClient.get(`/experience/${id}`);
    return normalizeModelProxyUrls(response.data);
  } catch (error) {
    handleThrowError({ error });
  }
};

export const deleteExperience = async (id: string) => {
  try {
    const response = await privateApiClient.delete(`/experience/${id}`);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const updateExperience = async (
  id: string,
  data:
    | FormData
    | {
        title?: string;
        draftData?: string;
        siteInfo?: {
          siteId: string;
          subDomain?: string;
          slug: string;
        };
        isPublished?: boolean;
        isDeleted?: boolean;
        productId?: string;
        assetIds?: string[];
      }
) => {
  try {
    const response = await privateApiClient.patch(`/experience/${id}`, data);
    // export const updateExperience = async (data: TQueryParams) => {
    //   const { id, ...updateData } = data;
    //   try {
    //     const response = await privateApiClient.patch(
    //       `/experience/${id}`,
    //       updateData
    //     );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const publishExperience = async (
  id: string,
  status: ExperienceStatus
) => {
  try {
    const response = await privateApiClient.patch(`/experience/${id}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const uploadExperienceImages = async (formData: FormData) => {
  try {
    const imagesCount = formData.getAll('images').length;

    if (!imagesCount) {
      throw new Error('At least one image is required');
    }

    if (imagesCount > 5) {
      throw new Error('Maximum 5 images allowed');
    }

    const response = await privateApiClient.post(
      '/experience/upload-media',
      formData
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const deleteExperienceImage = async (keys: string[]) => {
  try {
    const response = await privateApiClient.delete(
      '/experience/delete-images',
      {
        data: { keys },
      }
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const checkIfEmailExists = async (
  bodyData: Pick<LoginFormData, 'email'>
) => {
  try {
    const response = await publicApiClient.post('/auth/check-email', bodyData);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const registerUser = async (bodyData: LoginFormData) => {
  try {
    const response = await publicApiClient.post('/auth/register', bodyData);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const loginUser = async (bodyData: LoginFormData) => {
  try {
    const response = await publicApiClient.post('/auth/login', bodyData);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const sendOTP = async (bodyData: Pick<LoginFormData, 'email'>) => {
  try {
    const response = await publicApiClient.post('/auth/resend-otp', bodyData);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const verifyOTP = async (bodyData: OtpFormData) => {
  try {
    const response = await publicApiClient.post('/auth/verify-otp', bodyData);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const forgotPassword = async (bodyData: Pick<OtpFormData, 'email'>) => {
  try {
    const response = await publicApiClient.post(
      '/auth/forgot-password',
      bodyData
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const verifyForgotPasswordOTP = async (bodyData: OtpFormData) => {
  try {
    const response = await publicApiClient.post(
      '/auth/verify-password-reset-otp',
      bodyData
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const resetPassword = async (bodyData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await publicApiClient.post(
      '/auth/reset-password',
      bodyData
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const signoutAll = async () => {
  try {
    const response = await privateApiClient.post('/auth/signout-all');
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const deleteAccount = async (body: { password: string }) => {
  try {
    const response = await privateApiClient.delete('/auth/account', {
      data: body,
    });
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const getUserDetail = async () => {
  try {
    const response = await privateApiClient.get('/auth/user-detail');
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const updateProfile = async (body: FormData) => {
  try {
    const response = await privateApiClient.patch('/auth/profile', body);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const getBrand = async () => {
  try {
    const response = await privateApiClient.get('/auth/brand');
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const updateBrand = async (body: FormData) => {
  try {
    const response = await privateApiClient.patch('/auth/brand', body);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const addBrandItem = async ({
  section,
  body,
}: {
  section: 'characters' | 'poses' | 'backgrounds' | 'writing-style';
  body: FormData;
}) => {
  try {
    const response = await privateApiClient.post(
      `/auth/brand/${section}`,
      body
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const editBrandItem = async ({
  section,
  itemId,
  body,
}: {
  section: 'characters' | 'poses' | 'backgrounds' | 'writing-style';
  itemId: string;
  body: FormData;
}) => {
  try {
    const response = await privateApiClient.patch(
      `/auth/brand/${section}/${itemId}`,
      body
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const deleteBrandItem = async ({
  section,
  itemId,
}: {
  section: 'characters' | 'poses' | 'backgrounds' | 'writing-style';
  itemId: string;
}) => {
  try {
    const response = await privateApiClient.delete(
      `/auth/brand/${section}/${itemId}`
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const getSettings = async () => {
  try {
    const response = await privateApiClient.get('/auth/settings');
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const updateSettings = async (body: FormData) => {
  try {
    const response = await privateApiClient.patch('/auth/settings', body);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

// ====== 3D Asset Library =====

export const get3DAssets = async ({
  page = 1,
  limit = 10,
  search,
  productId,
  categoryId,
  sortOrder = 'desc',
  experienceType,
  fileType,
  assetType,
}: Get3DAssetsParams = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('page', String(page));
    queryParams.set('limit', String(limit));

    if (search) queryParams.set('search', search);
    if (productId) queryParams.set('productId', productId);
    if (assetType && assetType !== 'all')
      queryParams.set('assetType', assetType);
    if (categoryId) queryParams.set('categoryId', categoryId);
    if (sortOrder) queryParams.set('sortOrder', sortOrder);
    if (experienceType) queryParams.set('experienceType', experienceType);
    if (fileType) queryParams.set('fileType', fileType);

    const response = await privateApiClient.get(
      `/asset-library?${queryParams.toString()}`
    );
    return normalizeModelProxyUrls(response.data);
  } catch (error) {
    handleThrowError({ error });
  }
};
export const get3DAssetId = async (id: string) => {
  try {
    const response = await privateApiClient.get(`/asset-library/${id}`);
    return normalizeModelProxyUrls(response.data);
  } catch (error) {
    handleThrowError({ error });
  }
};
export const update3DAsset = async (id: string, data: FormData) => {
  try {
    const response = await privateApiClient.put(`/asset-library/${id}`, data);
    return normalizeModelProxyUrls(response.data);
  } catch (error) {
    handleThrowError({ error });
  }
};

export const attach3DAssetMedia = async (id: string, data: FormData) => {
  try {
    const response = await privateApiClient.patch(
      `/asset-library/${id}/media`,
      data
    );
    return normalizeModelProxyUrls(response.data);
  } catch (error) {
    handleThrowError({ error });
  }
};
export const link3DAssetToProduct = async (data: {
  productId: string;
  assetId: string;
}) => {
  try {
    const response = await privateApiClient.put(
      `/asset-library/link-product`,
      data
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const unlink3DAssetFromProduct = async (data: {
  productId: string;
  assetId: string;
}) => {
  try {
    const response = await privateApiClient.put(
      `/asset-library/unlink-product`,
      data
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const upload3DAsset = async (bodyData: FormData) => {
  try {
    const response = await privateApiClient.post('/asset-library', bodyData);
    return normalizeModelProxyUrls(response.data);
  } catch (error) {
    handleThrowError({ error });
  }
};

export const delete3DAsset = async (id: string) => {
  try {
    const response = await privateApiClient.delete(`/asset-library/${id}`);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

// ===== Experiences =====

export const getManageExperiences = async (
  params: GetManageExperiencesParams = {}
) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.set('search', params.search);
    if (params.categoryId) queryParams.set('categoryId', params.categoryId);
    if (params.sort) queryParams.set('sort', params.sort);
    if (params.type) queryParams.set('type', params.type);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());

    const response = await privateApiClient.get(
      `/experience/manage?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export interface GetExperiencesParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  productId?: string;
}

export const handleListExperiences = async ({
  page = 1,
  limit = 10,
  search,
  type,
  status,
  productId,
}: GetExperiencesParams = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('page', String(page));
    queryParams.set('limit', String(limit));

    if (search) queryParams.set('search', search);
    if (type) queryParams.set('type', type);
    if (status) queryParams.set('status', status);
    if (productId) queryParams.set('productId', productId);

    const response = await privateApiClient.get(
      `/experience?${queryParams.toString()}`
    );
    return normalizeModelProxyUrls(response.data);
  } catch (error) {
    handleThrowError({ error });
  }
};

// ===== Categories =====
export const getCategories = async (params?: TQueryParams) => {
  try {
    const response = await privateApiClient.get(`/categories`, { params });
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

// ===== Versa AI =====

export const generateImageTo3D = async (data: FormData) => {
  try {
    const response = await privateApiClient.post('/versa-ai/image-to-3d', data);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const regenerateImageTo3D = async (data: FormData) => {
  try {
    const response = await privateApiClient.post(
      '/versa-ai/image-to-3d/update',
      data
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const generatePromptTo3D = async (data: PromptTo3DPayload) => {
  try {
    const response = await privateApiClient.post(
      '/versa-ai/prompt-to-3d',
      data
    );

    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};
export const reGeneratePromptTo3D = async (data: PromptTo3DPayload) => {
  try {
    const response = await privateApiClient.post(
      '/versa-ai/prompt-to-3d/update',
      data
    );

    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const queueVersaImageGeneration = async (
  data: QueueVersaImagePayload
) => {
  try {
    const response = await privateApiClient.post<QueueVersaImageResponse>(
      '/versa-ai/generate-image',
      data
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const getVersaImageGenerationResult = async (jobId: string) => {
  try {
    const response = await privateApiClient.get<VersaImageResultResponse>(
      `/versa-ai/generate-image/result/${jobId}`
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};
// ===== Product CMS =====
export interface GetProductCMSParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  subcategory?: string;
  sortOrder?: 'asc' | 'desc';
  experienceType?: string;
}

export const getProductCMS = async ({
  page = 1,
  limit = 10,
  search,
  categoryId,
  sortOrder = 'desc',
  experienceType,
}: GetProductCMSParams = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('page', String(page));
    queryParams.set('limit', String(limit));
    queryParams.set('sortOrder', sortOrder);

    if (search) queryParams.set('search', search);
    if (categoryId) queryParams.set('categoryId', categoryId);
    if (experienceType) queryParams.set('experienceType', experienceType);

    const response = await privateApiClient.get(
      `/products?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const createProductCMS = async (formData: FormData) => {
  try {
    const response = await privateApiClient.post('/products', formData);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};
// ===== Subscriptions =====
export const getSubscriptionPricingCatalog = async () => {
  try {
    const response = await publicApiClient.get('/subscriptions/pricing');
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const createSubscriptionCheckout = async (data: {
  planId: string;
  billingCycle: 'monthly' | 'annual';
  quantity: number;
  /** Must match displayed currency; selects Chargebee item_price_id on the server. */
  billingCurrency?: 'USD' | 'INR';
}) => {
  try {
    const response = await privateApiClient.post(
      '/subscriptions/checkout',
      data
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const getSubscriptionMe = async () => {
  try {
    const response = await privateApiClient.get('/subscriptions/me');
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const changeSubscription = async (data: {
  planId: string;
  billingCycle: 'monthly' | 'annual';
  quantity: number;
}) => {
  try {
    const response = await privateApiClient.post('/subscriptions/change', data);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const getProductCMSById = async (id: string) => {
  try {
    const response = await privateApiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const updateProductCMS = async (id: string, formData: FormData) => {
  try {
    const response = await privateApiClient.patch(`/products/${id}`, formData);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const deleteProductCMS = async (id: string) => {
  try {
    const response = await privateApiClient.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};
export interface DeleteProductCMSMediaFilesBody {
  imageKeys: string[];
  videoKeys: string[];
}
export const deleteProductCMSMediaFiles = async (
  id: string,
  bodyData: DeleteProductCMSMediaFilesBody
) => {
  try {
    const response = await privateApiClient.delete(
      `/products/media/files/${id}`,
      {
        data: bodyData,
      }
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const getProductAssets = async (id: string) => {
  try {
    const response = await privateApiClient.get(`/products/assets/${id}`);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

// ===== Sites =====
export const getSites = async () => {
  try {
    const response = await privateApiClient.get('/auth/sites');
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const createSite = async (data: { value: string }) => {
  try {
    const response = await privateApiClient.post('/auth/sites', {
      subdomain: data.value,
    });
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const updateSite = async (id: string, body: FormData | any) => {
  try {
    const response = await privateApiClient.patch(`/auth/sites/${id}`, body);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const deleteSite = async (id: string) => {
  try {
    const response = await privateApiClient.delete(`/auth/sites/${id}`);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

// ===== Phone OTP =====

export const sendPhoneOtpForUser = async (payload: SendPhoneOtpPayload) => {
  try {
    const response = await privateApiClient.post(
      '/auth/phone/send-otp',
      payload
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const savePhoneNumber = async (payload: SendPhoneOtpPayload) => {
  try {
    const response = await privateApiClient.post('/auth/phone/save', payload);
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const verifyPhoneOtpForUser = async (payload: VerifyPhoneOtpPayload) => {
  try {
    const response = await privateApiClient.post(
      '/auth/phone/verify-otp',
      payload
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const sendPhoneOtp = async (payload: SendPhoneOtpPayload) => {
  try {
    const response = await privateApiClient.post(
      '/auth/send-phone-otp',
      payload
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const verifyPhoneOtp = async (payload: VerifyPhoneOtpPayload) => {
  try {
    const response = await privateApiClient.post(
      '/auth/verify-phone-otp',
      payload
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

// ===== Fashion VTON =====
export const checkVtonHealth = async () => {
  try {
    const response = await publicApiClient.get('/api/health');
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};

export const generateFashionVton = async (data: FormData) => {
  try {
    const response = await privateApiClient.post(
      '/generated-media/generate/vton',
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    handleThrowError({ error });
  }
};
