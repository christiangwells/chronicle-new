import { createFileRoute, redirect } from '@tanstack/react-router'

import { EntryContextType } from '~/features/entries/types'

export const Route = createFileRoute('/_authed/entries/')({
  loader: () => {
    throw redirect({
      to: '/entries/by/$contextType',
      params: { contextType: EntryContextType.month },
    })
  },
})
