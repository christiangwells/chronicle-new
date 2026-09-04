import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import { updateEntrySchema } from '~/features/entries/lib'
import type { EntryWithTags } from '~/features/entries/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const updateEntry = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(updateEntrySchema)
  .handler(async ({ context, data: { id, input } }): Promise<EntryWithTags> => {
    const userId = context.session.user.id
    const userTags = await prisma.tag.findMany({ where: { userId } })
    const tagsById = new Map(userTags.map((tag) => [tag.id, tag]))
    const tagsByText = new Map(
      userTags.map((tag) => [tag.text.toLowerCase(), tag]),
    )
    const existingTagIds: number[] = []
    const newTagTexts: string[] = []

    for (const tag of input.tags) {
      if (tag.type === 'existing') {
        if (!tagsById.has(tag.id)) {
          throw new Error('One or more tags do not belong to this user')
        }
        existingTagIds.push(tag.id)
        continue
      }

      const existingTag = tagsByText.get(tag.text.toLowerCase())
      if (existingTag) {
        existingTagIds.push(existingTag.id)
      } else {
        newTagTexts.push(tag.text)
      }
    }

    return prisma.entry.update({
      where: { id, authorId: userId },
      data: {
        date: new Date(input.date),
        title: input.title.trim() || null,
        text: input.text,
        tags: {
          set: existingTagIds.map((tagId) => ({ id: tagId })),
          connectOrCreate: newTagTexts.map((text) => ({
            where: { text_userId: { text, userId } },
            create: { text, userId },
          })),
        },
      },
      include: { tags: { orderBy: { text: 'asc' } } },
    })
  })
