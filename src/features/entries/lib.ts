import { z } from 'zod'

import { tagInputSchema } from '~/features/tags/lib'

export const entrySchema = z
  .object({
    date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
      message: 'A valid date is required',
    }),
    title: z.string(),
    text: z.string(),
    tags: z.array(tagInputSchema),
  })
  .superRefine(({ tags }, context) => {
    const tagNames = new Set<string>()

    tags.forEach((tag, index) => {
      const normalizedText = tag.text.trim().toLowerCase()
      if (tagNames.has(normalizedText)) {
        context.addIssue({
          code: 'custom',
          message: 'Tags must be unique',
          path: ['tags', index],
        })
      }
      tagNames.add(normalizedText)
    })
  })

export const createEntrySchema = z.object({
  input: entrySchema,
})

export const updateEntrySchema = z.object({
  id: z.number().int().positive(),
  input: entrySchema,
})

export type EntryInput = z.infer<typeof entrySchema>
