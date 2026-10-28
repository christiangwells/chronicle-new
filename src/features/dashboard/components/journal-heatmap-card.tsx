import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import type React from 'react'
import { Fragment, useMemo } from 'react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import {
  ALL_TIME,
  type DashboardYear,
  formatDashboardYear,
} from '~/features/dashboard/lib'
import {
  buildHeatmapMonths,
  buildHeatmapWeeks,
  type DayCounts,
  type HeatmapLevel,
} from '~/features/dashboard/stats'
import { EntryContextType } from '~/features/entries/types'
import { toDateString } from '~/lib/dates'
import { cn } from '~/lib/utils'

const LEVEL_CLASSES: Record<HeatmapLevel, string> = {
  0: 'bg-muted',
  1: 'bg-primary/25',
  2: 'bg-primary/50',
  3: 'bg-primary/75',
  4: 'bg-primary',
}

const WEEKDAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', '']

const MONTH_LABELS = Array.from({ length: 12 }, (_, index) =>
  dayjs('2000-01-01').month(index).format('MMM'),
)

export const JournalHeatmapCard: React.FC<{
  dayCounts: DayCounts
  year: DashboardYear
  years: number[]
  total: number
  onYearChange: (year: DashboardYear) => void
}> = ({ dayCounts, year, years, total, onYearChange }) => {
  const entries = `${total} ${total === 1 ? 'entry' : 'entries'}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Journal Over Time</CardTitle>
        <CardDescription>
          {year === ALL_TIME ? `${entries} in total` : `${entries} in ${year}`}
        </CardDescription>
        <CardAction>
          <Select
            value={year.toString()}
            onValueChange={(value) =>
              onYearChange(value === ALL_TIME ? ALL_TIME : Number(value))
            }
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ALL_TIME}>
                  {formatDashboardYear(ALL_TIME)}
                </SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {year === ALL_TIME ? (
          <MonthGrid dayCounts={dayCounts} years={years} />
        ) : (
          <DayGrid dayCounts={dayCounts} year={year} />
        )}
      </CardContent>
      <CardFooter className="text-muted-foreground justify-end gap-1 text-xs">
        <span className="mr-1">Less</span>
        {Object.entries(LEVEL_CLASSES).map(([level, className]) => (
          <div key={level} className={cn('size-3 rounded-sm', className)} />
        ))}
        <span className="ml-1">More</span>
      </CardFooter>
    </Card>
  )
}

const DayGrid: React.FC<{ dayCounts: DayCounts; year: number }> = ({
  dayCounts,
  year,
}) => {
  const weeks = useMemo(
    () => buildHeatmapWeeks(dayCounts, year),
    [dayCounts, year],
  )

  return (
    <div className="text-muted-foreground grid min-w-2xl grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
      <div />
      <div className="flex h-4 gap-1">
        {weeks.map((week, index) => {
          const firstOfMonth = week.find((cell) => cell?.date.date() === 1)
          return (
            <div key={index} className="relative flex-1">
              {firstOfMonth && (
                <span className="absolute left-0">
                  {firstOfMonth.date.format('MMM')}
                </span>
              )}
            </div>
          )
        })}
      </div>
      <div className="grid grid-rows-7 gap-1">
        {WEEKDAY_LABELS.map((label, index) => (
          <div key={index} className="flex items-center leading-none">
            {label}
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {weeks.map((week, index) => (
          <div key={index} className="flex flex-1 flex-col gap-1">
            {week.map((cell, dayIndex) =>
              cell ? (
                <HeatmapSquare
                  key={dayIndex}
                  count={cell.count}
                  level={cell.level}
                  period={cell.date.format('D MMM YYYY')}
                  contextType={EntryContextType.date}
                  contextId={toDateString(cell.date.toDate())}
                  className="aspect-square"
                />
              ) : (
                <div key={dayIndex} className="aspect-square" />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const MonthGrid: React.FC<{ dayCounts: DayCounts; years: number[] }> = ({
  dayCounts,
  years,
}) => {
  const rows = useMemo(
    () => buildHeatmapMonths(dayCounts, years, dayjs()),
    [dayCounts, years],
  )

  return (
    <div className="text-muted-foreground grid min-w-xl grid-cols-[auto_repeat(12,minmax(0,1fr))] items-center gap-1 text-xs">
      <div />
      {MONTH_LABELS.map((label) => (
        <div key={label} className="text-center">
          {label}
        </div>
      ))}
      {rows.map(({ year, months }) => (
        <Fragment key={year}>
          <div className="pr-1">{year}</div>
          {months.map((cell, index) =>
            cell ? (
              <HeatmapSquare
                key={index}
                count={cell.count}
                level={cell.level}
                period={cell.month.format('MMMM YYYY')}
                contextType={EntryContextType.month}
                contextId={cell.month.format('YYYY-MM')}
                className="h-7"
              />
            ) : (
              <div key={index} className="h-7" />
            ),
          )}
        </Fragment>
      ))}
    </div>
  )
}

const HeatmapSquare: React.FC<{
  count: number
  level: HeatmapLevel
  period: string
  contextType: EntryContextType
  contextId: string
  className: string
}> = ({ count, level, period, contextType, contextId, className }) => {
  const label = `${count} ${count === 1 ? 'entry' : 'entries'} · ${period}`
  const classes = cn('rounded-sm', LEVEL_CLASSES[level], className)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {count > 0 ? (
          <Link
            to="/entries/by/$contextType/$contextId"
            params={{ contextType, contextId }}
            aria-label={label}
            className={cn(
              classes,
              'focus-visible:ring-ring/50 outline-none hover:opacity-80 focus-visible:ring-[3px]',
            )}
          />
        ) : (
          <div aria-label={label} className={classes} />
        )}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
