import { z } from 'zod'

const tagTextSchema = z.string().trim().min(1, 'Tag text is required')

export const tagInputSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('existing'),
    id: z.number().int().positive(),
    text: tagTextSchema,
  }),
  z.object({
    type: z.literal('new'),
    text: tagTextSchema,
  }),
])

export type TagInput = z.infer<typeof tagInputSchema>
