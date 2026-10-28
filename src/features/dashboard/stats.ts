import dayjs, { type Dayjs } from 'dayjs'

import { ALL_TIME, type DashboardYear } from '~/features/dashboard/lib'
import type { Day, Month, Year } from '~/features/entries/types'
import type { TagCount } from '~/features/tags/types'

export type CountsByDate = Record<Year, Record<Month, Record<Day, number>>>

/** Entry counts keyed by `YYYY-MM-DD` */
export type DayCounts = Map<string, number>

export interface StatsPeriod {
  start: Dayjs
  end: Dayjs
}

export interface Streak {
  length: number
  start: Dayjs
  end: Dayjs
}

export interface PeriodStats {
  total: number
  days: number
  longestStreak: Streak | null
  avgPerWeek: number
}

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4

export interface HeatmapCell {
  date: Dayjs
  count: number
  level: HeatmapLevel
}

export interface HeatmapMonthCell {
  month: Dayjs
  count: number
  level: HeatmapLevel
}

const DAY_KEY_FORMAT = 'YYYY-MM-DD'

export function flattenDayCounts(countsByDate: CountsByDate): DayCounts {
  const result: DayCounts = new Map()

  for (const [year, months] of Object.entries(countsByDate)) {
    for (const [month, days] of Object.entries(months)) {
      for (const [day, count] of Object.entries(days)) {
        result.set(`${year}-${month}-${day}`, count)
      }
    }
  }

  return result
}

export function getAvailableYears(
  countsByDate: CountsByDate,
  currentYear: number,
): number[] {
  const years = new Set(Object.keys(countsByDate).map(Number))
  years.add(currentYear)
  return [...years].sort((a, b) => b - a)
}

/**
 * The current year only runs up to today so that comparisons against the previous year
 * are like for like.
 */
export function getStatsPeriod(year: number, today: Dayjs): StatsPeriod {
  const start = dayjs(`${year}-01-01`)
  const end =
    year === today.year()
      ? today.startOf('day')
      : start.endOf('year').startOf('day')

  return { start, end }
}

/** From the first entry up to today */
export function getAllTimePeriod(
  dayCounts: DayCounts,
  today: Dayjs,
): StatsPeriod {
  let first = today.format(DAY_KEY_FORMAT)
  for (const key of dayCounts.keys()) {
    if (key < first) first = key
  }

  return { start: dayjs(first), end: today.startOf('day') }
}

export function getPreviousPeriod({ start, end }: StatsPeriod): StatsPeriod {
  return { start: start.subtract(1, 'year'), end: end.subtract(1, 'year') }
}

export function computePeriodStats(
  dayCounts: DayCounts,
  { start, end }: StatsPeriod,
): PeriodStats {
  let total = 0
  let days = 0
  let periodDays = 0
  let longestStreak: Streak | null = null
  let streakStart: Dayjs | null = null
  let streakLength = 0

  for (let day = start; !day.isAfter(end, 'day'); day = day.add(1, 'day')) {
    periodDays++
    const count = dayCounts.get(day.format(DAY_KEY_FORMAT)) ?? 0

    if (count === 0) {
      streakStart = null
      streakLength = 0
      continue
    }

    total += count
    days++
    streakStart ??= day
    streakLength++

    if (!longestStreak || streakLength > longestStreak.length) {
      longestStreak = { length: streakLength, start: streakStart, end: day }
    }
  }

  return {
    total,
    days,
    longestStreak,
    avgPerWeek: periodDays > 0 ? total / (periodDays / 7) : 0,
  }
}

/** Returns `null` when there is nothing to compare against */
export function percentChange(
  current: number,
  previous: number,
): number | null {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

/** Entries per calendar month. All time sums each month across every year. */
export function getMonthlyCounts(
  dayCounts: DayCounts,
  year: DashboardYear,
): Array<{ month: string; entries: number }> {
  const counts = Array.from({ length: 12 }, () => 0)
  const prefix = year === ALL_TIME ? '' : `${year}-`

  for (const [key, count] of dayCounts) {
    if (key.startsWith(prefix)) {
      counts[Number(key.slice(5, 7)) - 1] += count
    }
  }

  return counts.map((entries, month) => ({
    month: dayjs('2000-01-01').month(month).format('MMM'),
    entries,
  }))
}

/**
 * Columns of Monday-first weeks covering the year. Days outside the year (the start of
 * the first week and the end of the last) are `null`.
 *
 * Levels are the day's entry count, capped at 4.
 */
export function buildHeatmapWeeks(
  dayCounts: DayCounts,
  year: number,
): Array<Array<HeatmapCell | null>> {
  const start = dayjs(`${year}-01-01`)
  const end = start.endOf('year')

  const weeks: Array<Array<HeatmapCell | null>> = []
  let week: Array<HeatmapCell | null> = Array.from(
    { length: mondayIndex(start) },
    () => null,
  )

  for (let day = start; !day.isAfter(end, 'day'); day = day.add(1, 'day')) {
    const count = dayCounts.get(day.format(DAY_KEY_FORMAT)) ?? 0
    week.push({ date: day, count, level: getHeatmapLevel(count) })

    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  if (week.length > 0) {
    weeks.push([
      ...week,
      ...Array.from({ length: 7 - week.length }, () => null),
    ])
  }

  return weeks
}

/**
 * A row of months per year, newest first. Months after the current one are `null`.
 *
 * Levels are roughly weeks' worth of daily entries: 1–8, 9–16, 17–24, 25+.
 */
export function buildHeatmapMonths(
  dayCounts: DayCounts,
  years: number[],
  today: Dayjs,
): Array<{ year: number; months: Array<HeatmapMonthCell | null> }> {
  const monthCounts = new Map<string, number>()
  for (const [key, count] of dayCounts) {
    const month = key.slice(0, 7)
    monthCounts.set(month, (monthCounts.get(month) ?? 0) + count)
  }

  return years.map((year) => ({
    year,
    months: Array.from({ length: 12 }, (_, index) => {
      const month = dayjs(`${year}-01-01`).month(index)
      if (month.isAfter(today, 'month')) return null

      const count = monthCounts.get(month.format('YYYY-MM')) ?? 0
      return {
        month,
        count,
        level: Math.min(Math.ceil(count / 8), 4) as HeatmapLevel,
      }
    }),
  }))
}

/** Combines each year's tag counts, most used first */
export function mergeTagCounts(byYear: Record<Year, TagCount[]>): TagCount[] {
  const counts = new Map<string, number>()
  for (const tags of Object.values(byYear)) {
    for (const tag of tags) {
      counts.set(tag.text, (counts.get(tag.text) ?? 0) + tag.count)
    }
  }

  return [...counts]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text))
}

function getHeatmapLevel(count: number): HeatmapLevel {
  return Math.min(count, 4) as HeatmapLevel
}

function mondayIndex(date: Dayjs): number {
  return (date.day() + 6) % 7
}
