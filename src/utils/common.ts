import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';
import { VITE_ENCRYPTION_SECRET_KEY } from '../envs';
import { DEFAULT_POSTER } from '../constants';
import type { IButton } from '../types';

export const toaster = (type: 'success' | 'error' = 'success', error: string | Error) => {
  const message = error instanceof Error ? error.message : String(error);
  if (type === 'error') {
    toast.error(message);
  } else {
    toast.success(message);
  }
};

export const encryptData = (data: object | string) => {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(stringData, VITE_ENCRYPTION_SECRET_KEY);
  return encrypted.toString();
};

export const decryptData = (encryptedData: string | null): object | string | null => {
  if (!encryptedData) return null;

  const bytes = CryptoJS.AES.decrypt(encryptedData, VITE_ENCRYPTION_SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (decrypted) {
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  }

  return null;
};

const TOKEN_KEY = 'user_token';

const getLocalToken = () => localStorage.getItem(TOKEN_KEY);
const getSessionToken = () => sessionStorage.getItem(TOKEN_KEY);

const removeLocalToken = () => localStorage.removeItem(TOKEN_KEY);
const removeSessionToken = () => sessionStorage.removeItem(TOKEN_KEY);

export const saveLocalToken = (token: string) => {
  const encryptedToken = encryptData(token);
  localStorage.setItem(TOKEN_KEY, encryptedToken);
  removeSessionToken();
};
export const saveSessionToken = (token: string) => {
  const encryptedToken = encryptData(token);
  sessionStorage.setItem(TOKEN_KEY, encryptedToken);
  removeLocalToken();
};

const getStorageToken = () => {
  let token: string | null = null;
  const LToken = getLocalToken();
  const SToken = getSessionToken();
  if (LToken) {
    token = LToken;
  } else if (SToken) {
    token = SToken;
  }

  return token;
};

export const removeStorageToken = (): void => {
  removeLocalToken();
  removeSessionToken();
};

export const getUserToken = (): string | null => {
  try {
    const raw_token = getStorageToken();
    if (!raw_token) return null;

    const token = decryptData(raw_token) as string | null;
    if (!token) return null;

    return token;
  } catch (err) {
    console.error('Error fetching token:', err);
    return null;
  }
};

function getPosterFromBlobVideo(blobVideoUrl: string, timeInSeconds = 0): Promise<string> {
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
        resolve(DEFAULT_POSTER);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      posterCreated = true;
      resolve(canvas.toDataURL('image/png'));
      video.src = '';
    });

    video.addEventListener('error', () => {
      if (!posterCreated && !isCancelled) {
        resolve(DEFAULT_POSTER); // no console.error to avoid noise
      }
    });

    // Cancel function for cleanup
    return () => {
      isCancelled = true;
      video.src = '';
    };
  });
}

export function convertVideoToPoster(videoUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (!videoUrl) {
      resolve(DEFAULT_POSTER);
      return;
    }

    try {
      // Case 1: Cloudinary URL → instant
      if (videoUrl.includes('/upload/')) {
        const [base, versionAndPath] = videoUrl.split('/upload/');
        const cleanedPath = versionAndPath.replace(/^.*?(\/v\d+)/, '$1');
        const posterPath = cleanedPath.replace(/\.(m3u8|mp4|webm)$/, '.webp');
        resolve(`${base}/upload/so_0${posterPath}`);
        return;
      }

      // Case 2: Blob URL or direct video file → async extract
      if (videoUrl.startsWith('blob:') || /\.(mp4|webm|ogg)$/i.test(videoUrl)) {
        getPosterFromBlobVideo(videoUrl)
          .then((poster) => resolve(poster || DEFAULT_POSTER))
          .catch(() => resolve(DEFAULT_POSTER));
        return;
      }

      // Fallback
      resolve(DEFAULT_POSTER);
    } catch (error) {
      console.error('Failed to create poster URL', error);
      resolve(DEFAULT_POSTER);
    }
  });
}

export const getButtonCss = (pattern: IButton['pattern']) => {
  switch (pattern) {
    case 'primary':
      return 'text-white bg-sky-blue-burst shadow-primary-btn hover:shadow-primary-btn-hover';
    case 'secondary':
      return 'text-secondary-invert bg-secondary shadow-secondary-btn hover:shadow-secondary-btn-hover';
    case 'tertiary':
      return 'text-tertiary-invert bg-tertiary shadow-tertiary-btn hover:shadow-tertiary-btn-hover';
    case 'outline':
      return 'text-primary border border-primary shadow-outline-btn hover:shadow-outline-btn-hover';
    case 'transparent':
    default:
      return 'shadow-inner shadow-primary/20 hover:shadow-primary/30 bg-transparent border border-primary/30 text-secondary rotate-180 [&>span]:-rotate-180';
  }
};

export const getFileFromFileList = (list: unknown) => {
  if (list instanceof File) {
    return list;
  } else if (list instanceof FileList && list?.[0]) {
    return list[0];
  } else if (typeof list === 'string') {
    return list;
  } else if (Array.isArray(list)) {
    return list[0];
  } else {
    return null;
  }
};

export const nullCheck = (value: unknown) => value !== undefined && value !== null;
