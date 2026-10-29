import { createFileRoute, redirect } from '@tanstack/react-router'
import dayjs from 'dayjs'

import { getLatestEntryMonth } from '~/features/entries/data/get-latest-month'
import { EntryContextType } from '~/features/entries/types'
import { assertUnreachable } from '~/lib/utils'

export const Route = createFileRoute('/_authed/entries/by/$contextType/')({
  loader: async ({ params: { contextType } }) => {
    switch (contextType) {
      case EntryContextType.month: {
        const latestMonth = await getLatestEntryMonth()
        if (latestMonth)
          throw redirect({
            to: '/entries/by/$contextType/$contextId',
            params: { contextType, contextId: latestMonth },
          })
        break
      }
      case EntryContextType.date: {
        const now = dayjs()
        throw redirect({
          to: '/entries/by/$contextType/$contextId',
          params: { contextType, contextId: now.format('YYYY-MM-DD') },
        })
      }
      case EntryContextType.tag:
        // Don't really need to show anything here by default? The first tag makes less sense
        // than "now"/"latest" in the other contexts
        break
      default:
        assertUnreachable(contextType)
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { contextType } = Route.useParams()

  return (
    <div className="bg-muted/80 top-(--header-height) flex h-[calc(100svh-var(--header-height))]! w-full justify-center p-4">
      <div className="text-muted-foreground">Select a {contextType}</div>
    </div>
  )
}
