const {
  // A
  // B
  // C
  // VITE_CONTACT_US_GOOGLE_APP_SCRIPTS_URL,
  // VITE_CONTACT_US_GOOGLE_DEPLOYMENT_ID, // NOTE - This is not used anywhere It's just for convenience
  // VITE_CONTACT_US_GOOGLE_SHEET_URL, // NOTE - This is not used anywhere It's just for convenience

  // D
  // E
  VITE_ENCRYPTION_SECRET_KEY,

  // F
  // G

  VITE_GATEWAY_DEV_URL,
  VITE_GATEWAY_PROD_URL,
  // VITE_GOOGLE_MAPS_API_KEY,

  // H
  // I
  VITE_IS_DEV,

  // J
  // K
  // L
  // M

  VITE_MAIL_SERVICE_DEV_URL,
  VITE_MAIL_SERVICE_PROD_URL,

  VITE_MEDIA_SERVICE_DEV_URL,
  VITE_MEDIA_SERVICE_PROD_URL,

  // N
  // O
  // VITE_OPENING_GOOGLE_APP_SCRIPTS_URL,
  // VITE_OPENING_GOOGLE_DEPLOYMENT_ID, // NOTE - This is not used anywhere It's just for convenience
  // VITE_OPENING_GOOGLE_SHEET_URL, // NOTE - This is not used anywhere It's just for convenience

  // P
  // Q
  // R
  // VITE_RAZORPAY_KEY_ID,
  // VITE_RAZORPAY_KEY_SECRET, // NOTE - This is not used anywhere It's just for convenience

  // S
  // T
  // U

  VITE_USER_SERVICE_DEV_URL,
  VITE_USER_SERVICE_PROD_URL,

  // V
  // W

  VITE_WORKER_SERVICE_DEV_URL,
  VITE_WORKER_SERVICE_PROD_URL,

  // X
  // Y
  // Z
} = import.meta.env as Record<string, string>;
const is_dev = VITE_IS_DEV === 'true';
const envs = {
  // A
  // B
  // C
  // D
  // E
  encryption_secret_key: VITE_ENCRYPTION_SECRET_KEY,
  // F
  // G
  // H
  // I

  is_dev,

  // J
  // K
  // L
  // M
  // N
  // O
  // P
  // Q
  // R
  // S
  // T
  // U
  urls: {
    gateway: is_dev ? VITE_GATEWAY_DEV_URL : VITE_GATEWAY_PROD_URL,
    services: {
      mail: is_dev ? VITE_MAIL_SERVICE_DEV_URL : VITE_MAIL_SERVICE_PROD_URL,
      media: is_dev ? VITE_MEDIA_SERVICE_DEV_URL : VITE_MEDIA_SERVICE_PROD_URL,
      user: is_dev ? VITE_USER_SERVICE_DEV_URL : VITE_USER_SERVICE_PROD_URL,
      worker: is_dev ? VITE_WORKER_SERVICE_DEV_URL : VITE_WORKER_SERVICE_PROD_URL,
    },
  },
  // V
  // W
  // X
  // Y
  // Z
};

export default envs;
