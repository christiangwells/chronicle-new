import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Quill } from '~/components/quill'
import { ModeToggle } from '~/components/theme-toggle'

export const Route = createFileRoute('/_unauthed')({
  component: UnauthenticatedLayout,
})

function UnauthenticatedLayout() {
  return (
    <div className="bg-muted [&_a]:text-primary relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 [&_a]:underline-offset-4 [&_a:hover]:underline">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 self-center font-medium">
          <Quill className="size-12" />
          <div className="text-2xl font-bold">Chronicle</div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
