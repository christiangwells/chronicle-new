import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'

import { getEntryStats } from '~/features/entries/data/get-stats'

export const Route = createFileRoute('/_authed/entries/')({
  loader: () => getEntryStats(),
  component: RouteComponent,
})

// TODO: can't put the sidebar inside here right now because that doesn't take a null
// Need to either fix that, or actually don't have this route at all, just redirect
function RouteComponent() {
  const stats = Route.useLoaderData()

  return (
    <div className="w-full top-(--header-height) h-[calc(100svh-var(--header-height))]! bg-muted/50 flex">
      <div className="grid grid-cols-3 gap-4 text-center mx-auto mt-12 px-6 h-32">
        <Stat label="Total" value={stats.total ?? 0} />
        <Stat label="Days" value={stats.days ?? 0} />
        <Stat label="Streak" value={stats.currentDayStreak ?? 0} />
        <Stat label="This Week" value={stats.currentWeek ?? 0} />
        <Stat label="This Day" value={stats.thisDay ?? 0} />
        <div className="flex flex-col items-center justify-center">
          <div className="text-xs text-muted-foreground">First</div>
          <div className="text-sm">
            {stats.firstDate
              ? dayjs(stats.firstDate).format('MMM D, YYYY')
              : '—'}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Latest</div>
          <div className="text-sm">
            {stats.latestDate
              ? dayjs(stats.latestDate).format('MMM D, YYYY')
              : '—'}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-row gap-2 items-center justify-center p-3 rounded-md">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
