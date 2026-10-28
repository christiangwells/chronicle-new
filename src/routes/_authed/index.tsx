import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { EntriesByMonthCard } from '~/features/dashboard/components/entries-by-month-card'
import { JournalHeatmapCard } from '~/features/dashboard/components/journal-heatmap-card'
import { OnThisDayCard } from '~/features/dashboard/components/on-this-day-card'
import { RecentEntriesCard } from '~/features/dashboard/components/recent-entries-card'
import { TopTagsCard } from '~/features/dashboard/components/top-tags-card'
import { YearStats } from '~/features/dashboard/components/year-stats'
import {
  ALL_TIME,
  dashboardSearchSchema,
  type DashboardYear,
} from '~/features/dashboard/lib'
import {
  computePeriodStats,
  flattenDayCounts,
  getAllTimePeriod,
  getAvailableYears,
  getPreviousPeriod,
  getStatsPeriod,
  mergeTagCounts,
} from '~/features/dashboard/stats'
import { getEntriesCountByDate } from '~/features/entries/data/get-count-by-date'
import { getEntriesOnThisDay } from '~/features/entries/data/get-on-this-day'
import { getRecentEntries } from '~/features/entries/data/get-recent'
import { getTagCountsByYear } from '~/features/tags/data/get-count-by-year'

export const Route = createFileRoute('/_authed/')({
  validateSearch: dashboardSearchSchema,
  loader: async () => {
    const [countsByDate, tagCountsByYear, onThisDay, recentEntries] =
      await Promise.all([
        getEntriesCountByDate(),
        getTagCountsByYear(),
        getEntriesOnThisDay(),
        getRecentEntries(),
      ])

    return { countsByDate, tagCountsByYear, onThisDay, recentEntries }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { countsByDate, tagCountsByYear, onThisDay, recentEntries } =
    Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const today = useMemo(() => dayjs(), [])
  const year: DashboardYear = search.year ?? today.year()

  const dayCounts = useMemo(
    () => flattenDayCounts(countsByDate),
    [countsByDate],
  )
  const years = useMemo(
    () => getAvailableYears(countsByDate, today.year()),
    [countsByDate, today],
  )
  const { current, comparison } = useMemo(() => {
    if (year === ALL_TIME) {
      return {
        current: computePeriodStats(
          dayCounts,
          getAllTimePeriod(dayCounts, today),
        ),
        comparison: null,
      }
    }

    const period = getStatsPeriod(year, today)
    // Nothing to compare against in the first year of the journal
    const hasPrevious = year > years[years.length - 1]

    return {
      current: computePeriodStats(dayCounts, period),
      comparison: hasPrevious
        ? {
            stats: computePeriodStats(dayCounts, getPreviousPeriod(period)),
            label:
              year === today.year()
                ? 'vs same period last year'
                : 'vs previous year',
          }
        : null,
    }
  }, [dayCounts, year, years, today])
  const tags = useMemo(
    () =>
      year === ALL_TIME
        ? mergeTagCounts(tagCountsByYear)
        : (tagCountsByYear[year] ?? []),
    [tagCountsByYear, year],
  )

  const onYearChange = (selected: DashboardYear) =>
    navigate({
      search: { year: selected === today.year() ? undefined : selected },
      replace: true,
      resetScroll: false,
    })

  return (
    <main className="bg-muted/40 flex-1">
      <div className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[1fr_22rem] lg:p-8">
        <div className="flex min-w-0 flex-col gap-4">
          <JournalHeatmapCard
            dayCounts={dayCounts}
            year={year}
            years={years}
            total={current.total}
            onYearChange={onYearChange}
          />
          <YearStats
            current={current}
            comparison={comparison}
            showStreakYear={year === ALL_TIME}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <EntriesByMonthCard dayCounts={dayCounts} year={year} />
            <TopTagsCard tags={tags} totalEntries={current.total} year={year} />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <OnThisDayCard entries={onThisDay} />
          <RecentEntriesCard entries={recentEntries} />
        </div>
      </div>
    </main>
  )
}
