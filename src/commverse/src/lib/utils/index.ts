import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { defaultSettings } from '../../constants';
import type {
  ExperienceCardType,
  FilterOption,
  FlatFont,
  IProductResponse,
  PublishStatus,
  TModules,
  VisualizerProps,
} from '../../types';
import { AxiosError } from 'axios';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import type { UserData } from '../../services/api';
import type { ModeValue, TabData } from '../../types';
import { TEXTURES_DATA, TRI_TARGET_DATA } from '../../data';
import type {
  BillingCurrency,
  CatalogPaidPlanKey,
  DownloadFileOptions,
  ProductCMSItem,
  SubscriptionPricingCatalogData,
} from '../../types/api.types';
import { VITE_ENCRYPTION_KEY, VITE_GATEWAY_BASE_URL, VITE_S3_BASE_URL } from '../../env';
import { useUIStore } from '../store';

// Cache for HDRI previews - stores up to 6 most recent previews
const HDRI_PREVIEW_CACHE_SIZE = 6;
const hdriPreviewCache = new Map<string, string>();
const cacheOrder: string[] = [];

// Shared renderer for HDRI preview generation (reused to avoid context loss)
let sharedRenderer: THREE.WebGLRenderer | null = null;
let sharedPmremGenerator: THREE.PMREMGenerator | null = null;

function getSharedRenderer(
  width: number,
  height: number
): {
  renderer: THREE.WebGLRenderer;
  pmremGenerator: THREE.PMREMGenerator;
} {
  if (!sharedRenderer || sharedRenderer.getContext().isContextLost()) {
    // Cleanup old renderer if it exists
    if (sharedRenderer) {
      sharedPmremGenerator?.dispose();
      sharedRenderer.dispose();
      sharedRenderer.forceContextLoss();
    }

    sharedRenderer = new THREE.WebGLRenderer({ antialias: true });
    sharedRenderer.outputColorSpace = THREE.SRGBColorSpace;
    sharedRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    sharedRenderer.toneMappingExposure = 1;

    sharedPmremGenerator = new THREE.PMREMGenerator(sharedRenderer);
    sharedPmremGenerator.compileEquirectangularShader();
  }

  sharedRenderer.setSize(width, height);
  return {
    renderer: sharedRenderer,
    pmremGenerator: sharedPmremGenerator!,
  };
}

/**
 * Disposes the shared renderer - call this when the component unmounts
 */
export function disposeHDRIRenderer(): void {
  if (sharedPmremGenerator) {
    sharedPmremGenerator.dispose();
    sharedPmremGenerator = null;
  }
  if (sharedRenderer) {
    sharedRenderer.dispose();
    sharedRenderer.forceContextLoss();
    sharedRenderer = null;
  }
}

/**
 * Clears the HDRI preview cache
 */
export function clearHDRICache(): void {
  hdriPreviewCache.clear();
  cacheOrder.length = 0;
}

/**
 * Adds an item to the cache with LRU eviction
 */
function addToCache(key: string, value: string): void {
  // If key already exists, update it and move to end
  if (hdriPreviewCache.has(key)) {
    const index = cacheOrder.indexOf(key);
    if (index > -1) cacheOrder.splice(index, 1);
  }
  // If cache is full, remove oldest entry
  else if (cacheOrder.length >= HDRI_PREVIEW_CACHE_SIZE) {
    const oldestKey = cacheOrder.shift();
    if (oldestKey) hdriPreviewCache.delete(oldestKey);
  }

  hdriPreviewCache.set(key, value);
  cacheOrder.push(key);
}

/**
 * Loads an HDR environment map and renders it to a canvas element.
 * @param hdrPath - Path to the HDR file (URL or blob URL)
 * @param width - Width of the output canvas (default: 256)
 * @param height - Height of the output canvas (default: 128)
 * @returns Promise that resolves with the canvas element containing the environment preview
 */
export function loadHDRToCanvas(
  hdrPath: string,
  width: number = 256,
  height: number = 128
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const { renderer, pmremGenerator } = getSharedRenderer(width, height);

    // Create a simple scene with a plane to show the environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Dark background

    const aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      -aspect,
      aspect, // left, right
      1,
      -1, // top, bottom
      0.1,
      10 // near, far
    );
    camera.position.z = 1;

    // Detect file type from path - check before # hash
    const pathBeforeHash = hdrPath.split('#')[0];
    const isJpeg = /\.(jpg|jpeg)$/i.test(pathBeforeHash);

    const loader = isJpeg ? new THREE.TextureLoader() : new RGBELoader();

    loader.load(
      hdrPath,
      (texture) => {
        try {
          // Clear any previous content
          while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
          }

          // Generate environment map
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;

          // Create plane with the original HDRI texture
          const hdriPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(aspect * 2, 2), // Match aspect ratio
            new THREE.MeshBasicMaterial({
              map: texture, // Use original texture, not envMap
              side: THREE.DoubleSide,
            })
          );
          scene.add(hdriPlane);

          // Clear the renderer and render the scene
          renderer.setClearColor(0x1a1a1a, 1);
          renderer.render(scene, camera);

          // Get the canvas with the rendered result
          const outputCanvas = document.createElement('canvas');
          outputCanvas.width = width;
          outputCanvas.height = height;
          const ctx = outputCanvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(renderer.domElement, 0, 0);
          }

          // Cleanup
          scene.remove(hdriPlane);
          texture.dispose();
          envMap.dispose();
          hdriPlane.geometry.dispose();
          hdriPlane.material.dispose();

          resolve(outputCanvas);
        } catch (error) {
          reject(error);
        }
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * Loads an HDR environment map and returns a data URL of the preview.
 * Results are cached to prevent excessive WebGL context creation.
 * @param hdrPath - Path to the HDR file (URL or blob URL)
 * @param width - Width of the output image (default: 256)
 * @param height - Height of the output image (default: 128)
 * @param fileName - File name to help detect file type (optional)
 * @returns Promise that resolves with a data URL string
 */
export async function loadHDRToDataURL(
  hdrPath: string,
  width: number = 256,
  height: number = 128,
  fileName?: string
): Promise<string> {
  // Create a cache key based on path and dimensions
  const cacheKey = `${hdrPath}-${width}x${height}`;

  // Check if we have a cached result
  const cached = hdriPreviewCache.get(cacheKey);
  if (cached) {
    // Move to end of cache order (most recently used)
    const index = cacheOrder.indexOf(cacheKey);
    if (index > -1) {
      cacheOrder.splice(index, 1);
      cacheOrder.push(cacheKey);
    }
    return cached;
  }

  // Check if it's an image file (JPG/JPEG) - if so, convert to data URL
  // Use fileName if provided (for custom uploads), otherwise extract from URL
  let fileNameToCheck = fileName;
  if (!fileNameToCheck) {
    const pathBeforeHash = hdrPath.split('#')[0];
    // Extract just the filename from the path
    fileNameToCheck = pathBeforeHash.split('/').pop() || pathBeforeHash;
  }
  const isImage = /\.(jpg|jpeg)$/i.test(fileNameToCheck);

  if (isImage) {
    try {
      // For blob URLs (from file uploads), we need to convert them to data URLs
      if (hdrPath.startsWith('blob:')) {
        const response = await fetch(hdrPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch blob: ${response.status}`);
        }
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            addToCache(cacheKey, dataUrl);
            resolve(dataUrl);
          };
          reader.onerror = () => reject(new Error('Failed to read blob'));
          reader.readAsDataURL(blob);
        });
      } else {
        // For regular URLs, fetch and convert to data URL
        const response = await fetch(hdrPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            addToCache(cacheKey, dataUrl);
            resolve(dataUrl);
          };
          reader.onerror = () => reject(new Error('Failed to read image'));
          reader.readAsDataURL(blob);
        });
      }
    } catch (error) {
      console.error('Failed to load image preview:', error);
      throw error;
    }
  }

  // For HDR/EXR files, use Three.js rendering
  const canvas = await loadHDRToCanvas(hdrPath, width, height);
  const dataUrl = canvas.toDataURL('image/png');

  // Cache the result
  addToCache(cacheKey, dataUrl);

  return dataUrl;
}

export const colorMap: Record<
  string,
  { border: string; text: string; from: string }
> = {
  'module-3d-viz': {
    border: 'border-module-3d-viz',
    text: 'text-module-3d-viz',
    from: 'from-module-3d-viz/20',
  },
  'module-ar': {
    border: 'border-module-ar',
    text: 'text-module-ar',
    from: 'from-module-ar/20',
  },
  'module-tryon': {
    border: 'border-module-tryon',
    text: 'text-module-tryon',
    from: 'from-module-tryon/20',
  },
  'module-configurator': {
    border: 'border-module-configurator',
    text: 'text-module-configurator',
    from: 'from-module-configurator/20',
  },
  'module-storefront': {
    border: 'border-module-storefront',
    text: 'text-module-storefront',
    from: 'from-module-storefront/20',
  },
  'module-video': {
    border: 'border-module-video',
    text: 'text-module-video',
    from: 'from-module-video/20',
  },
  'module-social': {
    border: 'border-module-social',
    text: 'text-module-social',
    from: 'from-module-social/20',
  },
};

export function compareChanges(
  newSettings: VisualizerProps,
  baseSettings: VisualizerProps
): number {
  let changes = 0;

  function walk(current: any, base: any) {
    for (const key in base) {
      const baseVal = base[key];
      const currentVal = current?.[key];

      // ignore functions
      if (typeof baseVal === 'function') continue;

      // both are objects → recurse
      if (
        typeof baseVal === 'object' &&
        baseVal !== null &&
        typeof currentVal === 'object' &&
        currentVal !== null
      ) {
        walk(currentVal, baseVal);
      } else {
        if (baseVal !== currentVal) {
          changes++;
        }
      }
    }
  }

  walk(newSettings, baseSettings);
  return changes;
}

export function getSettingChanges(settings: VisualizerProps): number {
  let changes = 0;

  function walk(current: any, base: any) {
    for (const key in base) {
      const baseVal = base[key];
      const currentVal = current?.[key];

      // ignore functions
      if (typeof baseVal === 'function') continue;

      // both are objects → recurse
      if (
        typeof baseVal === 'object' &&
        baseVal !== null &&
        typeof currentVal === 'object' &&
        currentVal !== null
      ) {
        walk(currentVal, baseVal);
      } else {
        if (baseVal !== currentVal) {
          changes++;
        }
      }
    }
  }

  walk(settings, defaultSettings);
  return changes;
}

export const SECRET_KEY = VITE_ENCRYPTION_KEY;
export const USER_LOCAL_STORAGE_KEY = 'USER_INFO';

const encryptData = (data: string): string => {
  const keyHex = CryptoJS?.enc?.Hex?.parse(SECRET_KEY);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(data, keyHex, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.toString();
};

export const decryptData = (encryptedData: string) => {
  try {
    if (!encryptedData?.includes(':')) return undefined;

    const [ivBase64, cipherBase64] = encryptedData.split(':');
    if (!ivBase64 || !cipherBase64) return undefined;

    const keyHex = CryptoJS.enc.Hex.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Base64.parse(ivBase64);

    let bytes;
    try {
      bytes = CryptoJS.AES.decrypt(cipherBase64, keyHex, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
    } catch {
      return undefined;
    }

    const result = bytes?.toString(CryptoJS.enc.Utf8) || undefined;
    if (!result) return undefined;

    return result;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const decodeJWT = (token: string) => {
  try {
    // header, payload, and signature
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

export const saveUser = (data: UserData) => {
  const encryptedData = encryptData?.(JSON?.stringify(data));
  Cookies.set(USER_LOCAL_STORAGE_KEY, encryptedData, {
    expires: 7,
    secure: true,
    sameSite: 'strict',
  });
};

export const getUser = () => {
  const user = Cookies.get(USER_LOCAL_STORAGE_KEY);
  if (!user) return null;

  const result = decryptData(user);
  if (!result) return null;

  return JSON.parse(result) as UserData;
};

export const clearStorages = () => {
  localStorage.clear();
  sessionStorage.clear();
  Cookies.remove(USER_LOCAL_STORAGE_KEY);
};

export async function blobUrlToFile(
  blobUrl?: string,
  fileName?: string,
  mimeType?: string
): Promise<File | null> {
  if (!blobUrl || blobUrl.trim() === '') {
    return null;
  }

  try {
    const res = await fetch(blobUrl);

    if (!res.ok) {
      return null;
    }

    const blob = await res.blob();

    if (!blob || blob.size === 0) {
      return null;
    }

    return new File([blob], fileName ?? 'file', {
      type: mimeType || blob.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.warn('Error converting blob URL to file:', error);
    return null;
  }
}

const extensionFromImageMime = (mimeType: string) => {
  if (mimeType.includes('jpeg')) return 'jpg';
  if (mimeType.includes('webp')) return 'webp';
  return 'png';
};

/**
 * Builds a `File` from an image URL for multipart uploads (e.g. fashion VTON).
 * Remote hosts must allow cross-origin reads (`Access-Control-Allow-Origin`), or the
 * browser blocks `fetch`. We try `fetch` first, then `Image` + canvas with
 * `crossOrigin="anonymous"` (same CORS rules). If both fail, use a same-origin URL,
 * upload a file, or add a server-side image proxy.
 */
export async function urlToImageFile(
  url: string,
  filenameBase: string
): Promise<File> {
  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error('Image URL is empty.');
  }

  const tryFetch = async (): Promise<File | null> => {
    try {
      const res = await fetch(trimmed, {
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
      });
      if (!res.ok) return null;
      const blob = await res.blob();
      if (!blob.size || !blob.type.startsWith('image/')) return null;
      const ext = extensionFromImageMime(blob.type);
      return new File([blob], `${filenameBase}.${ext}`, {
        type: blob.type || 'image/png',
        lastModified: Date.now(),
      });
    } catch {
      return null;
    }
  };

  const tryCanvas = (): Promise<File | null> =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          if (!w || !h) {
            resolve(null);
            return;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (!blob?.size) {
                resolve(null);
                return;
              }
              resolve(
                new File([blob], `${filenameBase}.png`, {
                  type: 'image/png',
                  lastModified: Date.now(),
                })
              );
            },
            'image/png',
            0.92
          );
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = trimmed;
    });

  const fromFetch = await tryFetch();
  if (fromFetch) return fromFetch;

  const fromCanvas = await tryCanvas();
  if (fromCanvas) return fromCanvas;

  throw new Error(
    'Could not read this image in the browser (usually CORS: the image host does not allow this site). Upload a photo from your device, use an image URL from your own storage with CORS enabled, or fetch the image through your backend.'
  );
}

export const clearLoggedInData = () => {
  useUIStore.getState().setIsLoggingOut(true);
  setTimeout(() => {
    clearStorages();
    window.location.href = '/auth';
  }, 500);
};

export const handleApiSuccess = ({
  message,
  fallback = 'Success!',
}: {
  message: string;
  fallback?: string;
}) => {
  const text = message || fallback;
  return text;
};

export const handleThrowError = ({ error }: { error: unknown }) => {
  if (error instanceof AxiosError) {
    const errorMessage = error?.response?.data?.error?.message;
    throw new Error(errorMessage || 'Something went wrong. Please try again.');
  } else if (error instanceof Error) {
    throw new Error(error.message || 'Something went wrong. Please try again.');
  }
  throw new Error('Something went wrong');
};

export const handleApiError = ({
  error,
  fallback = 'Something went wrong!',
}: {
  error: Error;
  fallback?: string;
}) => {
  const message = error.message || fallback;
  return message;
};

// Example: "02 Dec, 2025"
export const formatShortDate = (isoDate: string) => {
  const d = new Date(isoDate);

  const day = d.toLocaleString('en-GB', { day: '2-digit' });
  const month = d.toLocaleString('en-GB', { month: 'short' });
  const year = d.toLocaleString('en-GB', { year: 'numeric' });

  return `${day} ${month}, ${year}`;
};

// Example: "Tue, 02 Dec 2025, 10:05 AM"
export const formatFullDateTime = (isoDate: string) => {
  const d = new Date(isoDate);

  const weekday = d.toLocaleString('en-US', { weekday: 'short' });
  const day = d.toLocaleString('en-US', { day: '2-digit' });
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${weekday}, ${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};

// Example: "10:05 AM"
export const to12Hour = (time24: string) => {
  if (!time24) return time24;

  const [hourStr, minute] = time24.split(':');
  const hour = parseInt(hourStr, 10);

  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute} ${suffix}`;
};

export const getDateInUTC = (date: Date | string, time: string) => {
  if (!date || !time) return '';

  const y =
    date instanceof Date ? date.getFullYear() : new Date(date).getFullYear();
  const m = date instanceof Date ? date.getMonth() : new Date(date).getMonth();
  const d = date instanceof Date ? date.getDate() : new Date(date).getDate();

  const isoIST = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(
    2,
    '0'
  )}T${time}:00+05:30`;

  return new Date(isoIST).toISOString();
};

export const deepEqual = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object' ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
};

export const getTabsData = (
  modelType: ModeValue
): { textures: TabData[]; triTargets: TabData[] } => {
  switch (modelType) {
    case 'fast': {
      return {
        textures: [TEXTURES_DATA['2K']],
        triTargets: [TRI_TARGET_DATA['100k']],
      };
    }
    case 'turbo': {
      return {
        textures: [TEXTURES_DATA['2K'], TEXTURES_DATA['3K']],
        triTargets: [
          TRI_TARGET_DATA['100k'],
          TRI_TARGET_DATA['50k'],
          TRI_TARGET_DATA['20k'],
        ],
      };
    }
    case 'large': {
      return {
        textures: [
          TEXTURES_DATA['2K'],
          TEXTURES_DATA['3K'],
          TEXTURES_DATA['4K'],
        ],
        triTargets: [
          TRI_TARGET_DATA['100k'],
          TRI_TARGET_DATA['50k'],
          TRI_TARGET_DATA['20k'],
          TRI_TARGET_DATA['10k'],
        ],
      };
    }
    default: {
      return {
        textures: [TEXTURES_DATA['2K']],
        triTargets: [TRI_TARGET_DATA['100k']],
      };
    }
  }
};

export const downloadFile = async ({
  url,
  filename = 'file',
  extension,
  onSuccess,
  onError,
}: DownloadFileOptions) => {
  if (!url) return;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;

    const finalName = extension ? `${filename}.${extension}` : filename;

    link.download = finalName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);

    onSuccess?.();
  } catch (error) {
    console.error('Download failed:', error);
    onError?.(error);
  }
};

export const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
};

export const formatMB = (bytes: number): string =>
  (bytes / (1024 * 1024)).toFixed(1);

export const getFileExtension = (file: File) => {
  const parts = file.name.split('.');

  return parts.length > 1 ? `.${parts.pop()!.toLowerCase()}` : '';
};

export const getRelativePublishTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60)
    return `${diffSecs} second${diffSecs !== 1 ? 's' : ''} ago`;
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffMonths < 12)
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;

  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
};
export const getProductPreviewImage = (
  product?: ProductCMSItem | IProductResponse,
  fallback = ''
): string => {
  const firstImage = product?.media?.images?.[0]?.url;
  if (firstImage) return firstImage;

  const firstModel = product?.media?.models3d?.[0] as
    | { thumbnailUrl?: string; spriteUrl?: string }
    | undefined;
  return firstModel?.thumbnailUrl ?? firstModel?.spriteUrl ?? fallback;
};

export const mapExperienceTypeToVariant = (type?: string): string => {
  const normalized = (type ?? '').trim().toLowerCase().replace(/_/g, '-');

  if (!normalized) return '';
  if (normalized === 'ar-studio' || normalized === 'ar-experience') {
    return 'ar-experience';
  }
  if (normalized === '3d-configurator') {
    return 'configurator';
  }
  if (
    normalized === 'immersive-store' ||
    normalized === 'virtual-store' ||
    normalized === 'storefront'
  ) {
    return 'storefront';
  }
  if (
    normalized === 'video-ad' ||
    normalized === 'video-ads' ||
    normalized === 'video'
  ) {
    return 'video-ad';
  }

  return normalized;
};

export const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'INR':
      return '₹';
    default:
      return currency;
  }
};

export function getRelativePublishedText(dateString: string) {
  const publishedDate = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - publishedDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return `Last published ${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }

  if (minutes < 60) {
    return `Last published ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  if (hours < 24) {
    return `Last published ${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  if (days < 30) {
    return `Last published ${days} day${days !== 1 ? 's' : ''} ago`;
  }

  if (months < 12) {
    return `Last published ${months} month${months !== 1 ? 's' : ''} ago`;
  }

  return `Last published ${publishedDate.toLocaleDateString()}`;
}
// settings

export const parseGoogleFontUrl = (url: string): FlatFont[] => {
  const decodeName = (raw: string) =>
    decodeURIComponent(raw.replace(/\+/g, ' ')).trim();
  const normalizedInput = url.trim();

  const inferNameFromPath = (pathname: string) => {
    const parts = pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] ?? '';
    const base = last.replace(/\.(woff2?|ttf|otf)$/i, '');
    return decodeName(base.replace(/[-_]+/g, ' '));
  };

  const parseFamilies = (families: string[]) =>
    families.flatMap((familyParam) => {
      const [rawName, variantPart] = familyParam.split(':');
      const name = decodeName(rawName);

      if (!name) return [];

      if (!variantPart) {
        return [{ name, weight: 400, style: 'normal' as const }];
      }

      const [axesPart, valuesPart] = variantPart.split('@');

      if (!valuesPart) {
        return [{ name, weight: 400, style: 'normal' as const }];
      }

      const axes = axesPart.split(',');

      return valuesPart.split(';').flatMap((combo) => {
        const values = combo.split(',');

        let weights: number[] = [400];
        let style: 'normal' | 'italic' = 'normal';

        axes.forEach((axis, index) => {
          const value = values[index];

          if (!value) return;

          if (axis === 'wght') {
            if (value.includes('..')) {
              const [min, max] = value.split('..').map(Number);

              // expand in steps of 100
              weights = [];
              for (let w = min; w <= max; w += 100) {
                weights.push(w);
              }
            } else {
              weights = [Number(value)];
            }
          }

          if (axis === 'ital') {
            style = value === '1' ? 'italic' : 'normal';
          }
        });

        return weights.map((weight) => ({
          name,
          weight,
          style,
        }));
      });
    });

  try {
    const parsed = new URL(normalizedInput);

    // Google Fonts CSS API
    if (parsed.hostname === 'fonts.googleapis.com') {
      const families = parsed.searchParams.getAll('family');
      return parseFamilies(families);
    }

    // Google Fonts specimen/share URLs
    if (parsed.hostname === 'fonts.google.com') {
      const specimenMatch = parsed.pathname.match(/\/specimen\/([^/]+)/i);
      if (specimenMatch?.[1]) {
        const name = decodeName(specimenMatch[1].replace(/%20/g, '+'));
        return [{ name, weight: 400, style: 'normal' }];
      }

      const shareFamily =
        parsed.searchParams.get('family') ||
        parsed.searchParams.get('selection.family');

      if (shareFamily) {
        return [
          { name: decodeName(shareFamily), weight: 400, style: 'normal' },
        ];
      }
    }

    // Generic CSS font URLs that still use family= query params
    const families = parsed.searchParams.getAll('family');
    if (families.length > 0) {
      return parseFamilies(families);
    }

    // Direct font file URLs (woff/ttf/otf)
    if (/\.(woff2?|ttf|otf)$/i.test(parsed.pathname)) {
      const name = inferNameFromPath(parsed.pathname);
      if (name) {
        return [{ name, weight: 400, style: 'normal' }];
      }
    }
  } catch {
    // Allow bare hostnames without protocol
    try {
      const parsed = new URL(`https://${normalizedInput}`);
      const families = parsed.searchParams.getAll('family');
      if (families.length > 0) {
        return parseFamilies(families);
      }
    } catch {
      if (normalizedInput) {
        return [
          { name: decodeName(normalizedInput), weight: 400, style: 'normal' },
        ];
      }
      return [];
    }
  }

  if (normalizedInput) {
    return [
      { name: decodeName(normalizedInput), weight: 400, style: 'normal' },
    ];
  }

  return [];
};

export const isFontUrl = (value: string): boolean => {
  const normalizedValue = value.trim();

  if (!normalizedValue) return false;

  try {
    const parsed = new URL(normalizedValue);
    return /^https?:$/i.test(parsed.protocol);
  } catch {
    return false;
  }
};

export const extractManageExperiencesLinkOptions = (
  experiences: ExperienceCardType[]
) => {
  const prefixSet = new Set<string>();
  const suffixSet = new Set<string>();

  experiences.forEach((exp) => {
    exp.modules.forEach((mod) => {
      if (!mod.link) return;

      const parts = mod.link.split('.');

      if (parts.length >= 2) {
        prefixSet.add(parts[0]);
        suffixSet.add(parts[parts.length - 1]);
      }
    });
  });

  const prefixes = Array.from(prefixSet);
  const suffixes = Array.from(suffixSet);

  const prefixOptions: FilterOption[] = Array.from(prefixSet).map((val) => ({
    id: val,
    value: val,
    label: val,
  }));

  const suffixOptions: FilterOption[] = Array.from(suffixSet).map((val) => ({
    id: val,
    value: val,
    label: val,
  }));

  return { prefixOptions, suffixOptions, prefixes, suffixes };
};

export const getChangedFields = <T extends Record<string, unknown>>(
  oldData: T,
  newData: T
): Partial<T> => {
  const changed: Partial<T> = {};
  (Object.keys(newData) as (keyof T)[]).forEach((key) => {
    if (!deepEqual(oldData[key], newData[key])) {
      changed[key] = newData[key];
    }
  });
  return changed;
};

export const getImageUrl = (
  path: string | null | undefined,
  fallback: string | null = null
): string | null => {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/logo?') || path.startsWith('/onboarding/logo?')) {
    const normalizedPath = path.startsWith('/logo?')
      ? `/onboarding${path}`
      : path;
    if (!VITE_GATEWAY_BASE_URL) return path;
    return `${VITE_GATEWAY_BASE_URL}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  }
  return `${VITE_S3_BASE_URL}/${path.replace(/^\/+/, '')}`;
};


export const componentStyling = (status: PublishStatus) => {
  switch (status) {
    case 'Not Published':
      return 'border-neutral-gray-400 bg-neutral-gray-200 text-neutral-gray-600';
    case 'Publishing':
      return 'border-ui-warning bg-ui-warning-light text-ui-warning';
    case 'Published':
      return 'border-ui-success bg-ui-success-light text-ui-success';
    default:
      return '';
  }
};

export const pathNameModuleMap: Record<string, TModules> = {
  '/3d-visualizer': '3d_visualizer',
  '/ar-experience': 'ar_experience',
};

export const getDefaultPayload = (
  _modelUrl: string,
  productId: string,
  assetId: string,
  module: TModules
) => {
  switch (module) {
    case '3d_visualizer':
      return {
        ...(assetId ? { assetIds: [assetId] } : {}),
        title: 'New 3D Visualizer Experience',
        type: module,
        ...(productId ? { productId } : {}),
        draftData: JSON.stringify({
          modelTransform: defaultSettings.modelTransform,
          zoom: defaultSettings.zoom,
          shadowIntensity: defaultSettings.shadowIntensity,
          camera: defaultSettings.camera,
          environment: defaultSettings.environment,
          ctaBtn: defaultSettings.ctaBtn,
          brandLogo: defaultSettings.brandLogo,
        }),
      };
    case 'ar_experience':
      return {
        ...(assetId ? { assetIds: [assetId] } : {}),
        title: 'New AR Experience',
        ...(productId ? { productId } : {}),
        type: module,
        draftData: JSON.stringify({
          modelTransform: defaultSettings.modelTransform,
          shadowIntensity: defaultSettings.shadowIntensity,
          shadowSoftness: defaultSettings.shadowSoftness,
          arAnchor: defaultSettings.arAnchor,
          zoom: defaultSettings.zoom,
          environment: defaultSettings.environment,
        }),
      };
    case '3d_configurator':
      return {
        ...(assetId ? { assetIds: [assetId] } : {}),
        title: 'New 3D Configurator Experience',
        ...(productId ? { productId } : {}),
        type: module,
        draftData: JSON.stringify({
          modelFile: null,
          modelUrl: null,
          assetData: [],
          modelTransform: defaultSettings.modelTransform,
          camera: defaultSettings.camera,
          ...(assetId ? { assetId: [assetId] } : {}),
          shadowIntensity: defaultSettings.shadowIntensity,
          shadowSoftness: defaultSettings.shadowSoftness,
          arAnchor: defaultSettings.arAnchor,
          zoom: defaultSettings.zoom,
          environment: defaultSettings.environment,
          ctaBtn: defaultSettings.ctaBtn,
          brandLogo: defaultSettings.brandLogo,
          menuPlacement: 'dock',
          textOnly: false,
          isImported: false,
          variants: [],
          editingEdition: null,
          modelFileUrl: null,
        }),
      };
  }
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};


export function resolveBillingCurrency(
  raw: string | undefined
): BillingCurrency {
  return raw === 'INR' ? 'INR' : 'USD';
}

/** Amount in major units for one subscription line (before quantity multiplier). */
export function pickCatalogAmount(
  catalog: SubscriptionPricingCatalogData | undefined,
  planKey: CatalogPaidPlanKey,
  cycle: 'monthly' | 'annual',
  currency: BillingCurrency
): number | null {
  const plan = catalog?.plans?.[planKey];
  if (!plan) return null;
  const bucket = cycle === 'monthly' ? plan.monthly : plan.annual;
  const point = bucket?.[currency];
  return typeof point?.amount === 'number' ? point.amount : null;
}

export function formatCatalogPrice(
  amount: number,
  currency: BillingCurrency
): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
