import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { EntryContextTitle } from '~/features/entries/components/context-title'
import { EntrySummaryCard } from '~/features/entries/components/summary-card'
import {
  getEntriesByDate,
  getEntriesByMonth,
  getEntriesByTag,
} from '~/features/entries/data'
import { EntryContextType } from '~/features/entries/types'
import { assertUnreachable } from '~/lib/utils'

export const Route = createFileRoute(
  '/_authed/entries/$contextType/$contextId',
)({
  loader: ({ params: { contextType, contextId } }) => {
    switch (contextType) {
      case EntryContextType.month:
        return getEntriesByMonth({ data: { month: contextId } })
      case EntryContextType.date:
        return getEntriesByDate({ data: { date: contextId } })
      case EntryContextType.tag:
        return getEntriesByTag({ data: { tag: contextId } })
      default:
        assertUnreachable(contextType)
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { contextType, contextId } = Route.useParams()
  const matchRoute = useMatchRoute()
  const entries = Route.useLoaderData()

  const isEntrySelected = !!matchRoute({
    to: '/entries/$contextType/$contextId/$entryId',
    fuzzy: true,
  })

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-muted/80 top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <ResizablePanel defaultSize={40} minSize={20} className="h-full">
        <ScrollArea className="h-full">
          <div className="flex h-full flex-col gap-4 p-4">
            <div className="relative my-2 flex items-center justify-center overflow-hidden">
              <Separator />
              <span className="text-muted-foreground shrink-0 px-2 font-bold">
                <EntryContextTitle
                  contextType={contextType}
                  contextId={contextId}
                />
              </span>
              <Separator />
            </div>
            {entries.map((entry) => (
              <Link
                key={entry.id}
                to="/entries/$contextType/$contextId/$entryId"
                params={{
                  contextType,
                  contextId,
                  entryId: entry.uuid,
                }}
                className="group"
              >
                <EntrySummaryCard entry={entry} />
              </Link>
            ))}
          </div>
        </ScrollArea>
      </ResizablePanel>
      {isEntrySelected && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={20}>
            <Outlet />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}
