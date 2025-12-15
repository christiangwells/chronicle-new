import { useSuspenseQuery } from '@tanstack/react-query'
import { createServerFn, useServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import { authMiddleware } from '~/lib/auth/middleware'

export const getEntriesByMonth = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { session } = context

    const rows = await prisma.$queryRaw<
      Array<{ year: string; month: string; count: number }>
    >`
      SELECT strftime('%Y', date) AS year,
             strftime('%m', date) AS month,
             COUNT(*) AS count
      FROM entry e
      WHERE e.authorId = ${session.user.id}
      GROUP BY year, month
      ORDER BY year DESC, month DESC
    `

    const result: Record<string, Record<number, number>> = {}

    for (const r of rows) {
      const year = r.year
      const monthNum = Number(r.month)
      const count = Number(r.count ?? 0)

      if (!result[year]) result[year] = {}
      result[year][monthNum] = count
    }

    return result
  })

export function useGetEntriesByMonthSuspenseQuery() {
  const getMonths = useServerFn(getEntriesByMonth)
  return useSuspenseQuery({
    queryKey: ['entriesByMonth'],
    queryFn: () => getMonths(),
  })
}
