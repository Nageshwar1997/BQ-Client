import type { IconProps } from '@iconify/react';

import { VIDEO_PLACEHOLDER } from '@/constants/common.constants';
import { DUMMY_FEEDBACKS } from '@/constants/navbar.constants';
import { ROUTES } from '@/constants/routes.constants';

export const isDeepEqual = <T>(
  obj1: T,
  obj2: T,
  options?: { ignoreValues?: unknown[] },
): boolean => {
  const ignoreValues = options?.ignoreValues ?? [];

  const shouldIgnore = (value: unknown) =>
    ignoreValues.some((ignored) => Object.is(ignored, value));

  if (obj1 === obj2) return true;

  // Date
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  // File
  if (obj1 instanceof File && obj2 instanceof File) {
    return (
      obj1.name === obj2.name &&
      obj1.size === obj2.size &&
      obj1.type === obj2.type &&
      obj1.lastModified === obj2.lastModified
    );
  }

  // Set
  if (obj1 instanceof Set && obj2 instanceof Set) {
    if (obj1.size !== obj2.size) return false;

    const arr1 = [...obj1];
    const arr2 = [...obj2];

    return arr1.every((item, index) => isDeepEqual(item, arr2[index], options));
  }

  // Map
  if (obj1 instanceof Map && obj2 instanceof Map) {
    if (obj1.size !== obj2.size) return false;

    for (const [key, value] of obj1.entries()) {
      if (!obj2.has(key)) return false;

      if (!isDeepEqual(value, obj2.get(key), options)) {
        return false;
      }
    }

    return true;
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const isArray1 = Array.isArray(obj1);
  const isArray2 = Array.isArray(obj2);

  if (isArray1 !== isArray2) return false;

  if (isArray1 && isArray2) {
    if (obj1.length !== obj2.length) return false;

    return obj1.every((item, index) => isDeepEqual(item, obj2[index], options));
  }

  const keys1 = Object.keys(obj1).filter(
    (key) => !shouldIgnore(obj1[key as keyof T]),
  ) as (keyof T)[];

  const keys2 = Object.keys(obj2).filter(
    (key) => !shouldIgnore(obj2[key as keyof T]),
  ) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (shouldIgnore(value1) && shouldIgnore(value2)) {
      return true;
    }

    return isDeepEqual(value1, value2, options);
  });
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Date) &&
  !(value instanceof File) &&
  !(value instanceof Map) &&
  !(value instanceof Set);

/**
 * Diffs `original` against `updated`. Plain objects are diffed key-by-key (only the changed
 * keys come back); everything else (arrays, Dates, Files, Maps, Sets, primitives, ...) has no
 * notion of "fields", so the whole `updated` value comes back if it differs.
 * Returns `undefined` when nothing changed.
 */
export const getUpdatedFields = <T>(original: T, updated: T): Partial<T> | T | undefined => {
  if (isDeepEqual(original, updated)) return undefined;

  if (isPlainObject(original) && isPlainObject(updated)) {
    const changedKeys = Object.keys(updated).filter(
      (key) => !isDeepEqual(original[key], updated[key]),
    );

    return Object.fromEntries(changedKeys.map((key) => [key, updated[key]])) as Partial<T>;
  }

  return updated;
};

const getPosterFromBlobVideo = (blobVideoUrl: string, timeInSeconds = 0): Promise<string> => {
  return new Promise((resolve) => {
    let posterCreated = false;
    let isCancelled = false;

    const video = document.createElement('video');
    video.src = blobVideoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    video.addEventListener('loadeddata', () => {
      if (!isCancelled) video.currentTime = timeInSeconds;
    });

    video.addEventListener('seeked', () => {
      if (isCancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(VIDEO_PLACEHOLDER);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      posterCreated = true;
      resolve(canvas.toDataURL('image/png'));
      video.src = '';
    });

    video.addEventListener('error', () => {
      if (!posterCreated && !isCancelled) {
        resolve(VIDEO_PLACEHOLDER); // no console.error to avoid noise
      }
    });

    // Cancel function for cleanup
    return () => {
      isCancelled = true;
      video.src = '';
    };
  });
};

export const convertVideoToPoster = (videoUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    if (!videoUrl) {
      resolve(VIDEO_PLACEHOLDER);
      return;
    }

    try {
      // Case 1: Cloudinary URL → instant
      if (videoUrl.includes('/upload/')) {
        const [base = '', versionAndPath = ''] = videoUrl.split('/upload/');
        const cleanedPath = versionAndPath.replace(/^.*?(\/v\d+)/, '$1');
        const posterPath = cleanedPath.replace(/\.(mp4|webm|mov|mkv|ogg|m3u8)$/, '.webp');
        resolve(`${base}/upload/so_0${posterPath}`);
        return;
      }

      // Case 2: Blob URL or direct video file → async extract
      if (videoUrl.startsWith('blob:') || /\.(mp4|webm|ogg|m3u8|mov)$/i.test(videoUrl)) {
        getPosterFromBlobVideo(videoUrl)
          .then((poster) => {
            resolve(poster || VIDEO_PLACEHOLDER);
          })
          .catch(() => {
            resolve(VIDEO_PLACEHOLDER);
          });
        return;
      }

      // Fallback
      resolve(VIDEO_PLACEHOLDER);
    } catch (error) {
      console.error('Failed to create poster URL', error);
      resolve(VIDEO_PLACEHOLDER);
    }
  });
};

export const formatINRCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(date));
};

export const isIconProps = (value: unknown): value is IconProps => {
  return typeof value === 'object' && value !== null && 'icon' in value;
};

/* ========== NULL CHECK FUNCTION ========== */
export const isNull = (value: unknown): value is null => value === null;

/* ========== NULL CHECK FUNCTION ========== */
export const isUndefined = (value: unknown): value is undefined => value === undefined;

/* ========== NULL/UNDEFINED CHECK FUNCTION ========== */
export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return isNull(value) || isUndefined(value);
};

// Builds a /products/l1-slug/l2-slug/l3-slug path from the given slug chain.
// Returns undefined if any segment is missing/empty, so callers can skip navigation instead of linking to a broken URL.
export const buildCategoryProductsPath = (...slugs: (string | undefined)[]) => {
  if (slugs.length === 0 || slugs.some((slug) => !slug)) return undefined;
  return `/${ROUTES.PRODUCTS.BASE}/${slugs.join('/')}`;
};

// ROUTES values and category.path from the API are stored without a leading slash, so a
// direct <Link to={path}> resolves relative to the current route. This normalizes any such
// path to an absolute in-app URL.
export const toAbsolutePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

// Resolves a category's navigation target: an explicit `path` always wins (normalized to
// absolute); otherwise falls back to the /products slug chain, or undefined if that chain
// is incomplete (e.g. a missing/empty slug), so the caller can render a non-interactive label.
export const resolveCategoryPath = (path: string | undefined, ...slugs: (string | undefined)[]) =>
  path ? toAbsolutePath(path) : buildCategoryProductsPath(...slugs);

export const getTodaysFeedback = () => {
  // Get the current date
  const today = new Date();
  // Get the day of the week (0 to 6)
  const day = today.getDay();
  // Calculate the feedback index for today
  const feedbackIndex = day % DUMMY_FEEDBACKS.length;
  // Get the feedback for today
  const todayFeedback = DUMMY_FEEDBACKS[feedbackIndex];

  return todayFeedback ?? DUMMY_FEEDBACKS[0];
};
