import toast from 'react-hot-toast';
import { DEFAULT_POSTER, DUMMY_FEEDBACKS } from '@/Constants';
import { HIGHLIGHTED_CATEGORIES } from '@/Constants/Navbar';
import type { IButton } from '@/Types/Common.type';

export const toaster = (type: 'success' | 'error' = 'success', error: string | Error) => {
  const message = error instanceof Error ? error.message : String(error);
  if (type === 'error') {
    toast.error(message);
  } else {
    toast.success(message);
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

export const deepEqual = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
};

// It return a boolean value is level 3 category option is highlighted or not
export const isHighlightedCategory = (
  option: string,
  l1Cat?: keyof typeof HIGHLIGHTED_CATEGORIES,
) => (l1Cat ? HIGHLIGHTED_CATEGORIES[l1Cat].includes(option) : false);

export const getTodaysFeedback = (forwardIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0) => {
  // Get the current date
  const today = new Date();
  // Get the day of the month (1 to 31)
  const day = today.getDate();
  // Calculate the feedback index for today
  const feedbackIndex = (day + forwardIndex) % DUMMY_FEEDBACKS.length;
  // Get the feedback for today
  const todayFeedback = DUMMY_FEEDBACKS[feedbackIndex];

  return todayFeedback;
};

export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay = 300,
): ((...args: Args) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
