import {
  Calendar1Icon,
  CalendarDaysIcon,
  PlusIcon,
  SearchIcon,
  TagIcon,
} from 'lucide-react'
import type React from 'react'

import { Button } from '~/components/ui/button'
import { ButtonGroup } from '~/components/ui/button-group'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from '~/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { EntryContextType } from '~/features/entries/types'
import { assertUnreachable } from '~/lib/utils'

import { EntryMonths } from './month'

const contextTypeButtonData = [
  { contextType: EntryContextType.month, icon: <CalendarDaysIcon /> },
  { contextType: EntryContextType.date, icon: <Calendar1Icon /> },
  { contextType: EntryContextType.tag, icon: <TagIcon /> },
]

interface EntryContextTypeSidebarProps {
  selectedContextType: EntryContextType
  selectContextType: (selection: EntryContextType) => void
}

export const EntryContextTypeSidebar: React.FC<
  EntryContextTypeSidebarProps
> = ({ selectedContextType, selectContextType }) => {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <SidebarMenu className="flex flex-row justify-between">
          <Button variant="outline" size="icon-sm">
            <PlusIcon />
          </Button>
          <ButtonGroup>
            {contextTypeButtonData.map(({ contextType, icon }) => (
              <Tooltip delayDuration={700} key={contextType}>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      selectedContextType === contextType
                        ? 'default'
                        : 'outline'
                    }
                    size="icon-sm"
                    onClick={() => selectContextType(contextType)}
                  >
                    {icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View entries by {contextType}</TooltipContent>
              </Tooltip>
            ))}
          </ButtonGroup>
          <Button variant="outline" size="icon-sm">
            <SearchIcon />
          </Button>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Content contextType={selectedContextType} />
      </SidebarContent>
    </Sidebar>
  )
}

const Content: React.FC<{ contextType: EntryContextType }> = ({
  contextType,
}) => {
  if (contextType === EntryContextType.month) {
    return <EntryMonths />
  } else if (contextType === EntryContextType.date) {
    return 'date'
  } else if (contextType === EntryContextType.tag) {
    return 'tag'
  } else {
    assertUnreachable(contextType)
  }
}
