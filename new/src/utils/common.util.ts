import type { IButton } from '@/types/component.type';
import { decryptData, encryptData } from './crypto.util';
import useToastStore from '@/stores/toast.store';
import type { ICustomToast, IDefaultToast, ILoadingToast } from '@/types/store.type';

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

const TOKEN_KEY = 'user_token';

const getLocalToken = () => localStorage.getItem(TOKEN_KEY);
const getSessionToken = () => sessionStorage.getItem(TOKEN_KEY);

const removeLocalToken = () => localStorage.removeItem(TOKEN_KEY);
const removeSessionToken = () => sessionStorage.removeItem(TOKEN_KEY);

export const saveLocalToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, encryptData(token));
  removeSessionToken();
};

export const saveSessionToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, encryptData(token));
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

    const token = decryptData(raw_token) as string;
    if (!token) throw new Error('No token found');

    return token;
  } catch (err) {
    console.error('Error fetching token:', err);
    return null;
  }
};

const { addToast, removeToast } = useToastStore.getState();
export const toaster = {
  success: (data: Omit<IDefaultToast, 'type'>) => addToast({ ...data, type: 'success' }),

  error: (data: Omit<IDefaultToast, 'type'>) => addToast({ ...data, type: 'error' }),

  warning: (data: Omit<IDefaultToast, 'type'>) => addToast({ ...data, type: 'warning' }),
  loading: (data: Omit<ILoadingToast, 'type'>) => addToast({ ...data, type: 'loading' }),

  custom: (data: ICustomToast) => addToast(data),

  remove: (toastId: string) => removeToast(toastId),
};

export const getSafeNonAuthPath = (path: string | null) => {
  if (!path || !path.startsWith('/')) return null;

  const { origin, pathname, search = '', hash = '' } = new URL(path, window.location.origin);

  if (origin !== window.location.origin || pathname === '/auth' || pathname.startsWith('/auth/'))
    return null;

  return `${pathname}${search}${hash}`;
};
