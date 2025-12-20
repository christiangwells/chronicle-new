import { SidebarIcon } from 'lucide-react'
import type React from 'react'

import { Quill } from '~/components/quill'
import { SettingsMenu } from '~/components/settings-menu'
import { ModeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { useSidebar } from '~/components/ui/sidebar'

export const EntryHeader: React.FC = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2 sm:gap-4 sm:px-4">
        <Button
          className="size-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 gap-4">
          <Quill className="size-6 sm:size-8" />
          <div className="font-semibold sm:text-2xl">Chronicle</div>
        </div>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <ModeToggle />
        <SettingsMenu />
      </div>
    </header>
  )
}
