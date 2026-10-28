import { Link, useMatches } from '@tanstack/react-router'
import { SidebarIcon } from 'lucide-react'
import type React from 'react'

import { Quill } from '~/components/quill'
import { SettingsMenu } from '~/components/settings-menu'
import { ModeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { useSidebar } from '~/components/ui/sidebar'
import { cn } from '~/lib/utils'

export const AppHeader: React.FC = () => {
  const { toggleSidebar } = useSidebar()
  const hasSidebar = useMatches({
    select: (matches) => matches.some((match) => match.staticData.sidebar),
  })

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2 sm:gap-4 sm:px-4">
        {/* Hidden rather than removed so the rest of the header doesn't shift between routes */}
        <Button
          className={cn('size-8', !hasSidebar && 'invisible')}
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator
          orientation="vertical"
          className={cn('mr-2 h-4', !hasSidebar && 'invisible')}
        />
        <div className="flex flex-1 items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-4">
            <Quill className="size-6 sm:size-8" />
            <span className="font-semibold sm:text-2xl">Chronicle</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Button variant="secondary" size="sm" asChild>
              <Link
                to="/entries"
                className="data-[status=active]:text-primary-foreground data-[status=active]:bg-primary"
              >
                Entries
              </Link>
            </Button>
          </nav>
        </div>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <ModeToggle />
        <SettingsMenu />
      </div>
    </header>
  )
}
