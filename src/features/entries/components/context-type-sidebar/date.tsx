import { useNavigate, useParams } from '@tanstack/react-router'
import { useVirtualizer } from '@tanstack/react-virtual'
import dayjs from 'dayjs'
import type React from 'react'
import { useEffect, useMemo, useRef } from 'react'

import { Calendar } from '~/components/ui/calendar'
import { SidebarGroup } from '~/components/ui/sidebar'
import { useGetEntriesByDateSuspenseQuery } from '~/features/entries/data/get-count-by-date'
import {
  EntryContextType,
  type Month,
  type Year,
} from '~/features/entries/types'

export const EntryDates: React.FC = () => {
  const { data } = useGetEntriesByDateSuspenseQuery()
  const navigate = useNavigate()
  // Read params from the matches being rendered; useMatchRoute matches against
  // the previous location while a navigation into this view is still pending
  const { contextType, contextId } = useParams({ strict: false })
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const selected =
    contextType === EntryContextType.date && contextId
      ? dayjs(contextId).toDate()
      : undefined
  const selectedMonth = selected ? dayjs(selected).format('YYYY-MM') : undefined

  const { months, entryDatesByMonth } = useMemo(
    () => createCalendarMonths(data),
    [data],
  )
  const virtualizer = useVirtualizer({
    count: months.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 320,
    overscan: 2,
  })

  // No "already scrolled" guard: StrictMode remounts cancel the virtualizer's
  // scroll reconciliation, so the effect must be able to re-run. Leave the
  // scroll position alone when the selected month is already fully visible
  useEffect(() => {
    if (months.length === 0) return

    const selectedMonthIndex = selectedMonth
      ? months.indexOf(selectedMonth)
      : -1
    const targetMonthIndex =
      selectedMonthIndex === -1 ? months.length - 1 : selectedMonthIndex

    const targetMonth = virtualizer.measurementsCache[targetMonthIndex]
    const scrollOffset = virtualizer.scrollOffset ?? 0
    const viewportHeight = virtualizer.scrollRect?.height ?? 0
    const isFullyVisible =
      targetMonth &&
      targetMonth.start >= scrollOffset &&
      targetMonth.end <= scrollOffset + viewportHeight
    if (isFullyVisible) return

    virtualizer.scrollToIndex(targetMonthIndex, { align: 'start' })
  }, [months, selectedMonth, virtualizer])

  if (months.length === 0) {
    return (
      <p className="text-muted-foreground mt-4 text-center">No entries yet</p>
    )
  }

  return (
    <SidebarGroup className="min-h-0 flex-1 p-0">
      <div ref={scrollElementRef} className="h-full overflow-y-auto p-2">
        <div
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((virtualMonth) => {
            const month = months[virtualMonth.index]

            return (
              <div
                key={month}
                ref={virtualizer.measureElement}
                data-index={virtualMonth.index}
                className="absolute top-0 left-0 w-full pb-2"
                style={{ transform: `translateY(${virtualMonth.start}px)` }}
              >
                <EntryMonth
                  month={month}
                  entryDates={entryDatesByMonth.get(month) ?? []}
                  selected={selected}
                  onSelect={(date) =>
                    navigate({
                      to: '/entries/by/$contextType/$contextId',
                      params: {
                        contextType: EntryContextType.date,
                        contextId: dayjs(date).format('YYYY-MM-DD'),
                      },
                    })
                  }
                />
              </div>
            )
          })}
        </div>
      </div>
    </SidebarGroup>
  )
}

interface EntryMonthProps {
  month: string
  entryDates: string[]
  selected?: Date
  onSelect: (date: Date) => void
}

const EntryMonth: React.FC<EntryMonthProps> = ({
  month,
  entryDates,
  selected,
  onSelect,
}) => {
  return (
    <Calendar
      month={dayjs(month).toDate()}
      mode="single"
      showOutsideDays={false}
      hideNavigation
      selected={selected}
      onSelect={(date: Date | undefined) => date && onSelect(date)}
      modifiers={{ hasEntry: entryDates.map((date) => dayjs(date).toDate()) }}
      modifiersClassNames={{
        hasEntry: 'bg-muted',
        selected: 'bg-primary text-primary-foreground',
      }}
      className="w-full rounded-md border"
    />
  )
}

function createCalendarMonths(
  entriesByDate: Record<Year, Record<Month, Record<string, number>>>,
) {
  const entryDatesByMonth = new Map<string, string[]>()
  const entryMonths = Object.entries(entriesByDate).flatMap(([year, months]) =>
    Object.entries(months).map(([month, days]) => {
      const monthKey = `${year}-${month}`
      entryDatesByMonth.set(
        monthKey,
        Object.keys(days).map((day) => `${monthKey}-${day}`),
      )
      return monthKey
    }),
  )

  const earliestMonth = entryMonths.sort()[0]
  if (!earliestMonth) return { months: [], entryDatesByMonth }

  const latestMonth = dayjs().startOf('month')
  const monthCount = latestMonth.diff(dayjs(earliestMonth), 'month') + 1
  const months = Array.from({ length: monthCount }, (_, index) =>
    dayjs(earliestMonth).add(index, 'month').format('YYYY-MM'),
  )

  return { months, entryDatesByMonth }
}
