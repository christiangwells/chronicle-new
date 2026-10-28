import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'

import {
  buildHeatmapMonths,
  buildHeatmapWeeks,
  computePeriodStats,
  flattenDayCounts,
  getAllTimePeriod,
  getMonthlyCounts,
  getPreviousPeriod,
  getStatsPeriod,
  mergeTagCounts,
  percentChange,
} from './stats'

const dayCounts = flattenDayCounts({
  '2025': {
    '01': { '30': 1, '31': 2 },
    '02': { '01': 1 },
    '03': { '05': 3 },
  },
  '2024': {
    '12': { '31': 1 },
  },
})

describe('computePeriodStats', () => {
  it('counts entries, days, and the longest streak across a month boundary', () => {
    const stats = computePeriodStats(
      dayCounts,
      getStatsPeriod(2025, dayjs('2026-10-10')),
    )

    expect(stats.total).toBe(7)
    expect(stats.days).toBe(4)
    expect(stats.longestStreak?.length).toBe(3)
    expect(stats.longestStreak?.start.format('YYYY-MM-DD')).toBe('2025-01-30')
    expect(stats.longestStreak?.end.format('YYYY-MM-DD')).toBe('2025-02-01')
    expect(stats.avgPerWeek).toBeCloseTo(7 / (365 / 7))
  })

  it('has no streak when there are no entries', () => {
    const stats = computePeriodStats(
      dayCounts,
      getStatsPeriod(2023, dayjs('2026-10-10')),
    )

    expect(stats.total).toBe(0)
    expect(stats.longestStreak).toBeNull()
  })
})

describe('getStatsPeriod', () => {
  it('caps the current year at today and compares the same period last year', () => {
    const period = getStatsPeriod(2026, dayjs('2026-10-10T15:30'))
    const previous = getPreviousPeriod(period)

    expect(period.start.format('YYYY-MM-DD')).toBe('2026-01-01')
    expect(period.end.format('YYYY-MM-DD')).toBe('2026-10-10')
    expect(previous.start.format('YYYY-MM-DD')).toBe('2025-01-01')
    expect(previous.end.format('YYYY-MM-DD')).toBe('2025-10-10')
  })

  it('uses the full year for past years', () => {
    const period = getStatsPeriod(2024, dayjs('2026-10-10'))

    expect(period.end.format('YYYY-MM-DD')).toBe('2024-12-31')
  })
})

describe('getAllTimePeriod', () => {
  it('runs from the first entry to today', () => {
    const period = getAllTimePeriod(dayCounts, dayjs('2026-10-10T15:30'))

    expect(period.start.format('YYYY-MM-DD')).toBe('2024-12-31')
    expect(period.end.format('YYYY-MM-DD')).toBe('2026-10-10')
    expect(computePeriodStats(dayCounts, period).total).toBe(8)
  })

  it('is just today when there are no entries', () => {
    const period = getAllTimePeriod(new Map(), dayjs('2026-10-10'))

    expect(period.start.format('YYYY-MM-DD')).toBe('2026-10-10')
  })
})

describe('percentChange', () => {
  it('returns null when there is nothing to compare against', () => {
    expect(percentChange(5, 0)).toBeNull()
  })

  it('returns the change as a percentage', () => {
    expect(percentChange(12, 10)).toBeCloseTo(20)
    expect(percentChange(5, 10)).toBeCloseTo(-50)
  })
})

describe('getMonthlyCounts', () => {
  it('sums entries per month for the year', () => {
    const months = getMonthlyCounts(dayCounts, 2025)

    expect(months).toHaveLength(12)
    expect(months[0]).toEqual({ month: 'Jan', entries: 3 })
    expect(months[1]).toEqual({ month: 'Feb', entries: 1 })
    expect(months[2]).toEqual({ month: 'Mar', entries: 3 })
    expect(months[11]).toEqual({ month: 'Dec', entries: 0 })
  })
})

describe('getMonthlyCounts all time', () => {
  it('sums each month across every year', () => {
    const months = getMonthlyCounts(dayCounts, 'all')

    expect(months[0]).toEqual({ month: 'Jan', entries: 3 })
    expect(months[11]).toEqual({ month: 'Dec', entries: 1 })
  })
})

describe('buildHeatmapMonths', () => {
  it('has a row per year with levels by monthly count and no future months', () => {
    const counts = new Map([
      ['2025-01-01', 8],
      ['2025-01-02', 1],
      ['2025-02-01', 25],
      ['2024-12-31', 1],
    ])
    const rows = buildHeatmapMonths(counts, [2025, 2024], dayjs('2025-02-15'))

    expect(rows.map((row) => row.year)).toEqual([2025, 2024])
    expect(rows[0].months[0]).toMatchObject({ count: 9, level: 2 })
    expect(rows[0].months[1]).toMatchObject({ count: 25, level: 4 })
    expect(rows[0].months[2]).toBeNull()
    expect(rows[1].months[0]).toMatchObject({ count: 0, level: 0 })
    expect(rows[1].months[11]).toMatchObject({ count: 1, level: 1 })
  })
})

describe('mergeTagCounts', () => {
  it('combines years and sorts by most used', () => {
    expect(
      mergeTagCounts({
        '2025': [
          { text: 'work', count: 3 },
          { text: 'life', count: 1 },
        ],
        '2024': [
          { text: 'life', count: 4 },
          { text: 'health', count: 3 },
        ],
      }),
    ).toEqual([
      { text: 'life', count: 5 },
      { text: 'health', count: 3 },
      { text: 'work', count: 3 },
    ])
  })
})

describe('buildHeatmapWeeks', () => {
  it('aligns weeks to Monday and covers every day of the year', () => {
    // 2025-01-01 is a Wednesday
    const weeks = buildHeatmapWeeks(dayCounts, 2025)

    expect(weeks.every((week) => week.length === 7)).toBe(true)
    expect(weeks[0][0]).toBeNull()
    expect(weeks[0][1]).toBeNull()
    expect(weeks[0][2]?.date.format('YYYY-MM-DD')).toBe('2025-01-01')
    expect(weeks.flat().filter(Boolean)).toHaveLength(365)
  })

  it('uses the entry count as the level, capped at 4', () => {
    const cells = buildHeatmapWeeks(
      flattenDayCounts({
        '2025': { '01': { '01': 1, '02': 2, '03': 4, '04': 7 } },
      }),
      2025,
    ).flat()
    const level = (date: string) =>
      cells.find((cell) => cell?.date.format('YYYY-MM-DD') === date)?.level

    expect(level('2025-01-01')).toBe(1)
    expect(level('2025-01-02')).toBe(2)
    expect(level('2025-01-03')).toBe(4)
    expect(level('2025-01-04')).toBe(4)
    expect(level('2025-01-05')).toBe(0)
  })
})
