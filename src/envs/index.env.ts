export const envs = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  ENCRYPTION_SECRET_KEY: import.meta.env.VITE_ENCRYPTION_SECRET_KEY,
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
  NODE_ENV: import.meta.env.VITE_NODE_ENV,
  CONTACT_US_GOOGLE_APP_SCRIPTS_URL: import.meta.env
    .VITE_CONTACT_US_GOOGLE_APP_SCRIPTS_URL,
  CONTACT_US_GOOGLE_DEPLOYMENT_ID: import.meta.env
    .VITE_CONTACT_US_GOOGLE_DEPLOYMENT_ID, // *NOTE - This is not used anywhere It's just for convenience
  CONTACT_US_GOOGLE_SHEET_URL: import.meta.env.VITE_CONTACT_US_GOOGLE_SHEET_URL, // *NOTE - This is not used anywhere It's just for convenience
  OPENING_GOOGLE_APP_SCRIPTS_URL: import.meta.env
    .VITE_OPENING_GOOGLE_APP_SCRIPTS_URL,
  OPENING_GOOGLE_DEPLOYMENT_ID: import.meta.env
    .VITE_OPENING_GOOGLE_DEPLOYMENT_ID, // *NOTE - This is not used anywhere It's just for convenience
  OPENING_GOOGLE_SHEET_URL: import.meta.env.VITE_OPENING_GOOGLE_SHEET_URL, // *NOTE - This is not used anywhere It's just for convenience
};
