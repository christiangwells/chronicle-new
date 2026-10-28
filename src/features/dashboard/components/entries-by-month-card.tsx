import type React from 'react'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import {
  type DashboardYear,
  formatDashboardYear,
} from '~/features/dashboard/lib'
import { type DayCounts, getMonthlyCounts } from '~/features/dashboard/stats'

const chartConfig = {
  entries: { label: 'Entries', color: 'var(--primary)' },
} satisfies ChartConfig

export const EntriesByMonthCard: React.FC<{
  dayCounts: DayCounts
  year: DashboardYear
}> = ({ dayCounts, year }) => {
  const data = useMemo(
    () => getMonthlyCounts(dayCounts, year),
    [dayCounts, year],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entries by Month</CardTitle>
        <CardDescription>{formatDashboardYear(year)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-44 w-full"
        >
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="entries" fill="var(--color-entries)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
