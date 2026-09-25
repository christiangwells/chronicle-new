import { useSuspenseQuery } from '@tanstack/react-query'
import { createServerFn, useServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import type { Day, Month, Year } from '~/features/entries/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const getEntriesCountByDate = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id

    const rows = await prisma.$queryRaw<
      Array<{ year: string; month: string; day: string; count: number }>
    >`
      SELECT strftime('%Y', date) AS year,
             strftime('%m', date) AS month,
             strftime('%d', date) AS day,
             COUNT(*) AS count
      FROM entry e
      WHERE e.authorId = ${userId}
      GROUP BY year, month, day
      ORDER BY year DESC, month DESC, day DESC
    `

    const result: Record<Year, Record<Month, Record<Day, number>>> = {}

    for (const r of rows) {
      const { year, month, day } = r
      const count = Number(r.count ?? 0)

      if (!result[year]) result[year] = {}
      if (!result[year][month]) result[year][month] = {}
      result[year][month][day] = count
    }

    return result
  })

export function useGetEntriesByDateSuspenseQuery() {
  const getMonths = useServerFn(getEntriesCountByDate)
  return useSuspenseQuery({
    queryKey: ['entriesByDate'],
    queryFn: () => getMonths(),
  })
}
