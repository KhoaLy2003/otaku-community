import { z } from 'zod'

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  interests: z.array(z.string()).optional(),
  location: z.string().max(100, 'Location must be at most 100 characters').optional(),
  avatar: z.string().url().optional(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>



