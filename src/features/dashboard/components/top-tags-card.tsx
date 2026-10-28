import { TagsIcon } from 'lucide-react'
import type React from 'react'
import { useMemo } from 'react'
import { Label, Pie, PieChart } from 'recharts'

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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import {
  type DashboardYear,
  formatDashboardYear,
} from '~/features/dashboard/lib'
import type { TagCount } from '~/features/tags/types'

// Darkest for the most used tag
const TAG_COLOURS = [
  'var(--chart-5)',
  'var(--chart-4)',
  'var(--chart-3)',
  'var(--chart-2)',
  'var(--chart-1)',
]

interface Slice {
  // Tag text can't be used as the key as it ends up in a CSS variable name
  key: string
  label: string
  count: number
  fill: string
}

export const TopTagsCard: React.FC<{
  tags: TagCount[]
  totalEntries: number
  year: DashboardYear
}> = ({ tags, totalEntries, year }) => {
  const { slices, chartConfig, totalUsage } = useMemo(() => {
    const result: Slice[] = tags
      .slice(0, TAG_COLOURS.length)
      .map((tag, index) => ({
        key: `tag${index}`,
        label: tag.text,
        count: tag.count,
        fill: `var(--color-tag${index})`,
      }))

    const otherCount = tags
      .slice(TAG_COLOURS.length)
      .reduce((sum, tag) => sum + tag.count, 0)
    if (otherCount > 0) {
      result.push({
        key: 'other',
        label: 'Other',
        count: otherCount,
        fill: 'var(--color-other)',
      })
    }

    const config: ChartConfig = {}
    result.forEach((slice, index) => {
      config[slice.key] = {
        label: slice.label,
        color:
          slice.key === 'other'
            ? 'var(--muted-foreground)'
            : TAG_COLOURS[index],
      }
    })

    return {
      slices: result,
      chartConfig: config,
      totalUsage: result.reduce((sum, slice) => sum + slice.count, 0),
    }
  }, [tags])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Topics</CardTitle>
        <CardDescription>{formatDashboardYear(year)}</CardDescription>
      </CardHeader>
      <CardContent className="@container flex-1 justify-center">
        {slices.length === 0 ? (
          <Empty className="p-0 md:p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TagsIcon />
              </EmptyMedia>
              <EmptyTitle>No tags</EmptyTitle>
              <EmptyDescription>
                Tag your entries to see what you write about most.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col items-center gap-6 @xs:flex-row">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-44 shrink-0"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="key" hideLabel />}
                />
                <Pie
                  data={slices}
                  dataKey="count"
                  nameKey="key"
                  innerRadius="62%"
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox))
                        return null
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-semibold"
                          >
                            {totalEntries}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 20}
                            className="fill-muted-foreground"
                          >
                            {totalEntries === 1 ? 'entry' : 'entries'}
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="flex w-full min-w-0 flex-1 flex-col gap-2">
              {slices.map((slice) => (
                <li key={slice.key} className="flex items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: chartConfig[slice.key].color }}
                  />
                  <span className="truncate">{slice.label}</span>
                  <span className="text-muted-foreground ml-auto tabular-nums">
                    {Math.round((slice.count / totalUsage) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
