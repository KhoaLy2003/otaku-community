export const APP_CONFIG = {
  name: 'Otaku Community',
  description: 'A Japan-centered social community platform',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  imageUploadUrl: process.env.NEXT_PUBLIC_CLOUDINARY_URL || '',
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
} as const



