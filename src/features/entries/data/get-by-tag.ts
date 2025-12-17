import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import type { EntryWithTags } from '~/features/entries/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const getEntriesByTag = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data: { tag: string }) => data)
  .handler(async ({ context, data: { tag } }): Promise<EntryWithTags[]> => {
    const userId = context.session.user.id

    return prisma.entry.findMany({
      where: {
        authorId: userId,
        tags: { some: { text: tag } },
      },
      orderBy: { date: 'desc' },
      include: { tags: true },
    })
  })
