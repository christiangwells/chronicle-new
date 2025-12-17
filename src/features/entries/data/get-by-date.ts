import { createServerFn } from '@tanstack/react-start'
import dayjs from 'dayjs'

import { prisma } from '~/db'
import type { EntryWithTags } from '~/features/entries/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const getEntriesByDate = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data: { date: string }) => data)
  .handler(async ({ context, data: { date } }): Promise<EntryWithTags[]> => {
    const userId = context.session.user.id

    const start = dayjs(date).startOf('day')
    const end = start.endOf('day')

    return prisma.entry.findMany({
      where: {
        authorId: userId,
        date: { gte: start.toDate(), lte: end.toDate() },
      },
      orderBy: { date: 'desc' },
      include: { tags: true },
    })
  })
