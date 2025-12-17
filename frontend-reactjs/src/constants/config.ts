export const APP_CONFIG = {
  name: 'Otaku Community',
  description: 'A Japan-centered social community platform',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  imageUploadUrl: import.meta.env.VITE_CLOUDINARY_URL || '',
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
} as const