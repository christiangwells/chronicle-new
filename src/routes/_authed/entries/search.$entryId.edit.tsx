import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { Card, CardContent } from '~/components/ui/card'
import { EditEntry } from '~/features/entries/components/entry/edit'
import { deleteEntry } from '~/features/entries/data/delete'
import { getEntryByUuid } from '~/features/entries/data/get-by-uuid'
import { updateEntry } from '~/features/entries/data/update'
import type { EntryInput } from '~/features/entries/lib'

export const Route = createFileRoute('/_authed/entries/search/$entryId/edit')({
  loader: ({ params: { entryId } }) =>
    getEntryByUuid({ data: { uuid: entryId } }),
  component: RouteComponent,
})

function RouteComponent() {
  const entry = Route.useLoaderData()
  const params = Route.useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const invalidate = () =>
    Promise.all([
      router.invalidate(),
      queryClient.invalidateQueries({ queryKey: ['entries'] }),
      queryClient.invalidateQueries({ queryKey: ['tags'] }),
    ])

  const navigateToEntry = () => {
    router.navigate({
      to: '/entries/search/$entryId',
      params,
      search: true,
    })
  }

  const onSubmit = async (input: EntryInput) => {
    await updateEntry({ data: { id: entry.id, input } })
    await invalidate()
    navigateToEntry()
  }

  const onDelete = async () => {
    await deleteEntry({ data: { id: entry.id } })
    await invalidate()
    router.navigate({ to: '/entries/search', search: true })
  }

  return (
    <div className="top-(--header-height) h-[calc(100svh-var(--header-height))]! p-4">
      <Card className="h-full">
        <CardContent className="flex h-full flex-col">
          <EditEntry
            entry={entry}
            onCancel={navigateToEntry}
            onSubmit={onSubmit}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}
