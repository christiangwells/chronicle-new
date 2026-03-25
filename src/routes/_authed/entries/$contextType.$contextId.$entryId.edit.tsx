import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent } from '~/components/ui/card'
import { getEntryByUuid } from '~/features/entries/data/get-by-uuid'

export const Route = createFileRoute(
  '/_authed/entries/$contextType/$contextId/$entryId/edit',
)({
  loader: ({ params: { contextType, contextId, entryId } }) =>
    getEntryByUuid({ data: { contextType, contextId, uuid: entryId } }),
  component: RouteComponent,
})

function RouteComponent() {
  const entry = Route.useLoaderData()

  return (
    <div className="top-(--header-height) h-[calc(100svh-var(--header-height))]! p-4">
      <Card className="h-full">
        <CardContent className="flex h-full flex-col">
          Editing entry {entry.uuid}
        </CardContent>
      </Card>
    </div>
  )
}
