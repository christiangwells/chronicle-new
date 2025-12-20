import { createFileRoute } from '@tanstack/react-router'

import { EntryContextTypeSidebar } from '~/features/entries/components/context-type-sidebar'

export const Route = createFileRoute('/_authed/entries/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex w-full">
      <EntryContextTypeSidebar selectedContextType="search" />
      <div className="bg-muted/80 top-(--header-height) h-[calc(100svh-var(--header-height))]! flex-1">
        Search results go here
      </div>
    </div>
  )
}
