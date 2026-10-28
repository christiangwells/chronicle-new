import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import type { EntryWithTags } from '~/features/entries/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const getRecentEntries = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<EntryWithTags[]> => {
    const userId = context.session.user.id

    return prisma.entry.findMany({
      where: { authorId: userId },
      orderBy: { date: 'desc' },
      take: 5,
      include: { tags: { orderBy: { text: 'asc' } } },
    })
  })
