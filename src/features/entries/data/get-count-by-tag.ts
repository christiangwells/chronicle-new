import { useSuspenseQuery } from '@tanstack/react-query'
import { createServerFn, useServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import type { TagCount } from '~/features/tags/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const getEntriesCountByTag = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<TagCount[]> => {
    const userId = context.session.user.id

    const rows = await prisma.$queryRaw<Array<{ text: string; count: number }>>`
      SELECT t.text AS text,
             COUNT(*) AS count
      FROM tag t
      JOIN __entry_to_tag et ON et.B = t.id
      JOIN entry e ON e.id = et.A
      WHERE e.authorId = ${userId}
        AND t.userId = ${userId}
      GROUP BY t.id
      ORDER BY count DESC, t.text
    `

    return rows.map((r) => ({ text: r.text, count: Number(r.count ?? 0) }))
  })

export function useGetEntriesByTagSuspenseQuery() {
  const getTags = useServerFn(getEntriesCountByTag)
  return useSuspenseQuery({
    queryKey: ['entries', 'countByTag'],
    queryFn: () => getTags(),
  })
}
