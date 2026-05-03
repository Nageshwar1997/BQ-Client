import envs from '@/envs';
import CryptoJS from 'crypto-js';

export const encryptData = (data: object | string) => {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(stringData, envs.encryption_secret_key);
  return encrypted.toString();
};

export const decryptData = (encryptedData: string | null): object | string | null => {
  if (!encryptedData) return null;

  const bytes = CryptoJS.AES.decrypt(encryptedData, envs.encryption_secret_key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted || null;
  }
};
