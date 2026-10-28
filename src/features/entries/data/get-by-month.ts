import { createServerFn } from '@tanstack/react-start'
import dayjs from 'dayjs'

import { prisma } from '~/db'
import type { EntryWithTags } from '~/features/entries/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const getEntriesByMonth = createServerFn()
  .middleware([authMiddleware])
  .validator((data: { month: string }) => data)
  .handler(async ({ context, data: { month } }): Promise<EntryWithTags[]> => {
    const userId = context.session.user.id

    const start = dayjs(month).startOf('month')
    const end = start.endOf('month')

    return prisma.entry.findMany({
      where: {
        authorId: userId,
        date: { gte: start.toDate(), lte: end.toDate() },
      },
      orderBy: { date: 'desc' },
      include: { tags: true },
    })
  })
