import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import envs from '@/envs';
import type { IErrorResponse } from '@/types/api.type';

import ApiError from './ApiError';
import type ApiSuccess from './ApiSuccess';

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

interface IFailedQueueItem {
  resolve: () => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: IFailedQueueItem[] = [];
let hasRedirected = false;
let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

// Auth calls should be quick; fail fast instead of hanging indefinitely (axios has no timeout by
// default) so a slow/dead connection can't wedge isRefreshing (and every queued request) forever.
const REFRESH_TIMEOUT_MS = 15 * 1000;
const REACTIVE_RETRY_DELAY_MS = 500;

// Dedicated client used only for the refresh call itself. Every ApiRequest subclass instance
// creates its own axios instance with identical config, so this avoids depending on any one of
// them and keeps the periodic refresh (below) independent of which API classes exist.
const refreshClient = axios.create({
  baseURL: envs.urls.gateway,
  withCredentials: true,
  timeout: REFRESH_TIMEOUT_MS,
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * True when the failure means "we don't know whether the refresh token is valid" (timeout/network
 * error, no response received) rather than "the server told us the refresh token is invalid".
 */
const isNetworkOrTimeoutError = (error: unknown): boolean =>
  axios.isAxiosError(error) && !error.response;

const callRefreshEndpoint = () =>
  refreshClient.request(API_METHODS_AND_URLS.gateway.refreshAccessToken);

const processQueue = (error?: unknown) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

const triggerLogout = () => {
  if (hasRedirected) return;

  hasRedirected = true;

  window.dispatchEvent(
    new CustomEvent('auth:logout', {
      detail: { reason: 'login' },
    }),
  );
};

/**
 * Re-arms triggerLogout() after a successful login, so a logout can fire again if this new
 * session later expires too. Without this, triggerLogout() would silently no-op on the second
 * and subsequent sessions within the same tab, since hasRedirected only ever gets set once.
 */
export const resetAuthLogoutState = () => {
  hasRedirected = false;
};

/**
 * Refreshes the access token. Safe to call concurrently - if a refresh is already in flight
 * (e.g. triggered by a 401 while the periodic timer is also refreshing), callers just wait for
 * that one instead of firing a duplicate request.
 *
 * @param retryOnceOnFailure - used by the reactive (401-triggered) path: a real user request just
 * failed, so give the refresh one extra attempt (after a short delay) before giving up, rather
 * than logging an active user out over a single transient failure. The proactive timer omits
 * this - a skipped cycle just retries itself automatically on the next tick.
 */
const refreshAccessToken = async (retryOnceOnFailure = false): Promise<void> => {
  if (isRefreshing) {
    return new Promise<void>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    try {
      await callRefreshEndpoint();
    } catch (err) {
      if (!retryOnceOnFailure) throw err;

      await delay(REACTIVE_RETRY_DELAY_MS);
      await callRefreshEndpoint();
    }

    processQueue();
  } catch (err) {
    processQueue(err);

    // Proactive path: a timeout/network error doesn't prove the refresh token is invalid, so
    // skip the logout and let the next scheduled cycle try again. Reactive path: it already got
    // a retry above, so any failure here (timeout or a real invalid-token response) logs out.
    if (retryOnceOnFailure || !isNetworkOrTimeoutError(err)) {
      triggerLogout();
    }

    throw err;
  } finally {
    isRefreshing = false;
  }
};

/** Starts proactively refreshing the access token on a fixed interval. Call once per login session. */
export const startAutoRefreshAccessToken = (intervalMs: number) => {
  stopAutoRefreshAccessToken();

  refreshIntervalId = setInterval(() => {
    refreshAccessToken().catch(() => {
      // A failure that should end the session already triggers logout inside
      // refreshAccessToken(); anything else just waits for the next tick to retry.
    });
  }, intervalMs);
};

/** Stops the periodic refresh started by startAutoRefreshAccessToken. Call on logout/unmount. */
export const stopAutoRefreshAccessToken = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
};

export class ApiRequest {
  protected readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: envs.urls.gateway,
      withCredentials: true,
    });

    this.instance.interceptors.response.use(
      (res) => res,
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
          return Promise.reject(error instanceof Error ? error : new Error(String(error)));
        }

        if (!error.config) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as AxiosRequestConfigWithRetry;

        const refreshUrl = API_METHODS_AND_URLS.gateway.refreshAccessToken.url;

        if (originalRequest.url?.includes(refreshUrl)) {
          triggerLogout();
          return Promise.reject(error);
        }

        // 🔁 401 handling
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await refreshAccessToken(true);
            return await this.instance.request(originalRequest);
          } catch (err) {
            return await Promise.reject(err instanceof Error ? err : new Error(String(err)));
          }
        }

        return Promise.reject(error);
      },
    );
  }

  protected request = async <TData = unknown>(
    config: AxiosRequestConfig,
  ): Promise<ApiSuccess<TData>> => {
    try {
      const { data } = await this.instance.request<ApiSuccess<TData>>(config);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errResp: AxiosResponse<IErrorResponse> | undefined = error.response;

        throw new ApiError({
          message: errResp?.data.message ?? 'API Error occurred',
          globalErrors: errResp?.data.globalErrors,
          fieldErrors: errResp?.data.fieldErrors,
        });
      }

      if (error instanceof Error) {
        throw new ApiError({ message: error.message });
      }

      throw new ApiError({ message: 'Something went wrong!' });
    }
  };
}
