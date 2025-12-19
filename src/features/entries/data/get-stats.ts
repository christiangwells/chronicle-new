import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import type { EntriesStats } from '~/features/entries/types'
import { authMiddleware } from '~/lib/auth/middleware'

export const getEntryStats = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id
    // TODO: when session/setting timezones are a thing this needs to be updated
    const [stats] = await prisma.$queryRaw<EntriesStats[]>`
      WITH user_entries AS (
        SELECT date(date, 'localtime') AS day
        FROM entry
        WHERE authorId = ${userId}
      ),
      distinct_days AS (
        SELECT DISTINCT day FROM user_entries
      ),
      total_count AS (
        SELECT COUNT(*) AS total FROM entry WHERE authorId = ${userId}
      ),
      days_count AS (
        SELECT COUNT(*) AS days FROM distinct_days
      ),
      week_count AS (
        SELECT COUNT(*) AS currentWeek
        FROM entry
        WHERE authorId = ${userId}
          AND date(date, 'localtime') >= date(date('now','localtime'), 'weekday 0', '-6 days')
          AND date(date, 'localtime') <= date('now','localtime')
      ),
      this_day_count AS (
        SELECT COUNT(*) AS thisDay
        FROM entry
        WHERE authorId = ${userId}
          AND strftime('%m-%d', date) = strftime('%m-%d', 'now')
      ),
      bounds AS (
        SELECT
          MIN(date) AS firstDate,
          MAX(date) AS latestDate
        FROM entry
        WHERE authorId = ${userId}
      ),
      ranked_days AS (
        SELECT day, ROW_NUMBER() OVER (ORDER BY day DESC) AS rn
        FROM distinct_days
      ),
      streak AS (
        SELECT COUNT(*) AS currentDayStreak
        FROM (
          SELECT day, rn
          FROM ranked_days
          WHERE julianday(date('now','localtime')) - julianday(day) = rn - 1
        )
      )
      SELECT
        (SELECT total FROM total_count) AS total,
        (SELECT days FROM days_count) AS days,
        (SELECT currentDayStreak FROM streak) AS currentDayStreak,
        (SELECT currentWeek FROM week_count) AS currentWeek,
        (SELECT thisDay FROM this_day_count) AS thisDay
        ,(SELECT firstDate FROM bounds) AS firstDate
        ,(SELECT latestDate FROM bounds) AS latestDate
    `

    return stats
  })
