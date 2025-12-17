import { z } from 'zod'

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be at most 5000 characters'),
  images: z.array(z.string().url()).max(10, 'Maximum 10 images allowed').optional(),
  topicIds: z.array(z.string()).min(1, 'At least one topic is required'),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>



