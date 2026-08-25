// export const { VITE_GATEWAY_BASE_URL, VITE_ENCRYPTION_KEY } = import.meta
// .env as Record<string, string>;

export const ASSET_BASE_URL = 'https://commverse-3d-upload.s3.amazonaws.com';
export const {
  VITE_GATEWAY_BASE_URL,
  VITE_ENCRYPTION_KEY,
  VITE_S3_BASE_URL,
  VITE_PUBLISH_BASE_URL,
  VITE_STOREFRONT_URL,
} = import.meta.env as Record<string, string>;

export const PUBLISH_BASE_URL = VITE_PUBLISH_BASE_URL;
