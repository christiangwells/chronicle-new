import {
  CalendarDaysIcon,
  ClockIcon,
  FlameIcon,
  PencilIcon,
} from 'lucide-react'
import type React from 'react'

import {
  percentChange,
  type PeriodStats,
  type Streak,
} from '~/features/dashboard/stats'

import { StatCard } from './stat-card'

export const YearStats: React.FC<{
  current: PeriodStats
  /** `null` when there's nothing to compare against, e.g. all time or the first year */
  comparison: { stats: PeriodStats; label: string } | null
  showStreakYear: boolean
}> = ({ current, comparison, showStreakYear }) => {
  const delta = (select: (stats: PeriodStats) => number): number | null =>
    comparison ? percentChange(select(current), select(comparison.stats)) : null
  const label = comparison?.label ?? null
  const streak = current.longestStreak

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard
        icon={PencilIcon}
        label="Total entries"
        value={current.total}
        delta={delta((stats) => stats.total)}
        description={label}
      />
      <StatCard
        icon={CalendarDaysIcon}
        label="Days journalled"
        value={current.days}
        delta={delta((stats) => stats.days)}
        description={label}
      />
      <StatCard
        icon={FlameIcon}
        label="Longest streak"
        value={`${streak?.length ?? 0} ${streak?.length === 1 ? 'day' : 'days'}`}
        delta={delta((stats) => stats.longestStreak?.length ?? 0)}
        description={streak ? formatStreak(streak, showStreakYear) : label}
      />
      <StatCard
        icon={ClockIcon}
        label="Avg. entries per week"
        value={current.avgPerWeek.toFixed(1)}
        delta={delta((stats) => stats.avgPerWeek)}
        description={label}
      />
    </div>
  )
}

function formatStreak({ start, end }: Streak, showYear: boolean): string {
  if (!showYear) return `${start.format('MMM D')} – ${end.format('MMM D')}`
  if (start.isSame(end, 'year')) {
    return `${start.format('MMM D')} – ${end.format('MMM D, YYYY')}`
  }
  return `${start.format('MMM D, YYYY')} – ${end.format('MMM D, YYYY')}`
}
