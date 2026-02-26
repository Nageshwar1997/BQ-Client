import { decryptData, encryptData } from './Crypto.util';

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
