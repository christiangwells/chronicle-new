import { createServerFn } from '@tanstack/react-start'
import dayjs from 'dayjs'

import { prisma } from '~/db'
import { authMiddleware } from '~/lib/auth/middleware'

export const getLatestEntryMonth = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id

    const latestEntry = await prisma.entry.findFirst({
      where: { authorId: userId },
      orderBy: { date: 'desc' },
    })

    if (!latestEntry) {
      return null
    }

    const date = dayjs(latestEntry.date)
    return date.format('YYYY-MM')
  })
