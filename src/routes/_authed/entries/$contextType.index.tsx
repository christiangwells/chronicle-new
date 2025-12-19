import { createFileRoute, redirect } from '@tanstack/react-router'
import dayjs from 'dayjs'

import { getLatestEntryMonth } from '~/features/entries/data/get-latest-month'
import { EntryContextType } from '~/features/entries/types'
import { assertUnreachable } from '~/lib/utils'

export const Route = createFileRoute('/_authed/entries/$contextType/')({
  loader: async ({ params: { contextType } }) => {
    switch (contextType) {
      case EntryContextType.month: {
        const latestMonth = await getLatestEntryMonth()
        if (latestMonth)
          throw redirect({
            to: '/entries/$contextType/$contextId',
            params: { contextType, contextId: latestMonth },
          })
        break
      }
      case EntryContextType.date: {
        const now = dayjs()
        throw redirect({
          to: '/entries/$contextType/$contextId',
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

// TODO: have something generic here, like an image?
function RouteComponent() {
  return <div>TODO</div>
}
