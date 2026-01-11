// Environment configuration utility
export const env = {
  // Auth0 Configuration
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN || '',
  AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE || '',
  APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL || 'http://localhost:3000',
  
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
} as const;

// Validate required environment variables
export function validateEnv() {
  const required = [
    'VITE_AUTH0_DOMAIN',
    'VITE_AUTH0_CLIENT_ID',
    'VITE_AUTH0_AUDIENCE',
    'VITE_API_URL',
  ] as const;

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  return missing.length === 0;
}