import {
  createFileRoute,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router'

import { EntryContextTypeSidebar } from '~/features/entries/components/context-type-sidebar'
import {
  assertEntryContextType,
  type EntryContextType,
} from '~/features/entries/types'

export const Route = createFileRoute('/_authed/entries/$contextType')({
  component: RouteComponent,
  params: {
    parse: (params): { contextType: EntryContextType } => {
      if (assertEntryContextType(params.contextType)) {
        return { contextType: params.contextType }
      }
      throw redirect({ to: '/entries' })
    },
  },
})

function RouteComponent() {
  const { contextType } = Route.useParams()
  const router = useRouter()

  return (
    <div className="flex w-full">
      <EntryContextTypeSidebar
        selectedContextType={contextType}
        selectContextType={(selection: EntryContextType) =>
          router.navigate({
            to: '/entries/$contextType',
            params: { contextType: selection },
          })
        }
      />
      <Outlet />
    </div>
  )
}
