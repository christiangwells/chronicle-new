import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import type { EntryWithTags } from '~/features/entries/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const getEntriesOnThisDay = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<EntryWithTags[]> => {
    const userId = context.session.user.id

    // TODO: when session/setting timezones are a thing this needs to be updated
    const rows = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id
      FROM entry
      WHERE authorId = ${userId}
        AND strftime('%m-%d', date, 'localtime') = strftime('%m-%d', 'now', 'localtime')
        AND strftime('%Y', date, 'localtime') < strftime('%Y', 'now', 'localtime')
      ORDER BY date DESC
      LIMIT 5
    `

    return prisma.entry.findMany({
      where: { authorId: userId, id: { in: rows.map((r) => Number(r.id)) } },
      orderBy: { date: 'desc' },
      include: { tags: { orderBy: { text: 'asc' } } },
    })
  })
