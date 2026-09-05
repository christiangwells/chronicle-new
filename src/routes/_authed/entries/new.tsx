import { createFileRoute, useRouter } from '@tanstack/react-router'

import { Card, CardContent } from '~/components/ui/card'
import { EntryContextTypeSidebar } from '~/features/entries/components/context-type-sidebar'
import { EditEntry } from '~/features/entries/components/entry/edit'
import { createEntry } from '~/features/entries/data/create'
import type { EntryInput } from '~/features/entries/lib'
import { EntryContextType } from '~/features/entries/types'
import { toDateString } from '~/lib/dates'

export const Route = createFileRoute('/_authed/entries/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  const onSubmit = async (input: EntryInput) => {
    const entry = await createEntry({ data: { input } })
    await router.invalidate()
    router.navigate({
      to: '/entries/$contextType/$contextId/$entryId',
      params: {
        contextType: EntryContextType.date,
        contextId: toDateString(entry.date),
        entryId: entry.uuid,
      },
    })
  }

  return (
    <div className="flex w-full">
      <EntryContextTypeSidebar selectedContextType="new" />
      <div className="bg-muted/80 top-(--header-height) h-[calc(100svh-var(--header-height))]! flex-1">
        <div className="top-(--header-height) h-[calc(100svh-var(--header-height))]! p-4">
          <Card className="mx-auto h-full max-w-7xl">
            <CardContent className="flex h-full flex-col">
              <EditEntry
                onCancel={() => router.history.back()}
                onSubmit={onSubmit}
                onDelete={() => {}} // TODO: make this be tied to including an existing entry
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
