import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import type { Year } from '~/features/entries/types'
import type { TagCount } from '~/features/tags/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const getTagCountsByYear = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Record<Year, TagCount[]>> => {
    const userId = context.session.user.id

    // TODO: when session/setting timezones are a thing this needs to be updated
    const rows = await prisma.$queryRaw<
      Array<{ year: string; text: string; count: number }>
    >`
      SELECT strftime('%Y', e.date, 'localtime') AS year,
             t.text AS text,
             COUNT(*) AS count
      FROM tag t
      JOIN __entry_to_tag et ON et.B = t.id
      JOIN entry e ON e.id = et.A
      WHERE e.authorId = ${userId}
        AND t.userId = ${userId}
      GROUP BY year, t.id
      ORDER BY year DESC, count DESC, t.text
    `

    const result: Record<Year, TagCount[]> = {}

    for (const r of rows) {
      if (!result[r.year]) result[r.year] = []
      result[r.year].push({ text: r.text, count: Number(r.count ?? 0) })
    }

    return result
  })
