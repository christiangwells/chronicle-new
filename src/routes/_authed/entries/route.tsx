import { createFileRoute, Outlet } from '@tanstack/react-router'

import { SidebarProvider } from '~/components/ui/sidebar'
import { EntryHeader } from '~/features/entries/components/header'

export const Route = createFileRoute('/_authed/entries')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <EntryHeader />
        <Outlet />
      </SidebarProvider>
    </div>
  )
}
