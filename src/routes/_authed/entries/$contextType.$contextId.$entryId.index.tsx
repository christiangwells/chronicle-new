import { createFileRoute } from '@tanstack/react-router'
import { BookDashedIcon } from 'lucide-react'

import { Card, CardContent } from '~/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import { ReadOnlyEntry } from '~/features/entries/components/entry/read-only'
import { getEntryByUuid } from '~/features/entries/data/get-by-uuid'

export const Route = createFileRoute(
  '/_authed/entries/$contextType/$contextId/$entryId/',
)({
  loader: ({ params: { contextType, contextId, entryId } }) =>
    getEntryByUuid({ data: { contextType, contextId, uuid: entryId } }),
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  const entry = Route.useLoaderData()

  return (
    <div className="top-(--header-height) h-[calc(100svh-var(--header-height))]! p-4">
      <Card className="h-full">
        <CardContent className="flex h-full flex-col">
          <ReadOnlyEntry entry={entry} />
        </CardContent>
      </Card>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookDashedIcon />
        </EmptyMedia>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The entry you&apos;re looking for doesn&apos;t exist.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
