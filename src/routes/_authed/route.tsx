import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AppHeader } from '~/components/app-header'
import { SidebarProvider } from '~/components/ui/sidebar'
import { authMiddleware } from '~/lib/auth/middleware'

export const Route = createFileRoute('/_authed')({
  server: {
    middleware: [authMiddleware],
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <AppHeader />
        <Outlet />
      </SidebarProvider>
    </div>
  )
}
