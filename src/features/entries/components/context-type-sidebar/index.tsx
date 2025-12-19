import { Link } from '@tanstack/react-router'
import {
  Calendar1Icon,
  CalendarDaysIcon,
  PlusIcon,
  SearchIcon,
  TagIcon,
} from 'lucide-react'
import type React from 'react'
import { Fragment } from 'react'

import { Button } from '~/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '~/components/ui/button-group'
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
  selectedContextType: EntryContextType | 'search'
}

export const EntryContextTypeSidebar: React.FC<
  EntryContextTypeSidebarProps
> = ({ selectedContextType }) => {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <SidebarMenu className="flex flex-row justify-between">
          {/* TODO: create a standalone create entry route */}
          <Button variant="secondary" size="icon-sm">
            <PlusIcon />
          </Button>
          <ButtonGroup>
            {contextTypeButtonData.map(({ contextType, icon }, index, arr) => (
              <Fragment key={contextType}>
                <Tooltip delayDuration={700}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        selectedContextType === contextType
                          ? 'default'
                          : 'secondary'
                      }
                      size="icon-sm"
                      asChild
                    >
                      <Link to="/entries/$contextType" params={{ contextType }}>
                        {icon}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View entries by {contextType}</TooltipContent>
                </Tooltip>
                {index !== arr.length - 1 && <ButtonGroupSeparator />}
              </Fragment>
            ))}
          </ButtonGroup>
          {/* TODO: make a different sidebar group with keyword search, date filter, tag filter etc */}
          <Button
            variant={selectedContextType === 'search' ? 'default' : 'secondary'}
            size="icon-sm"
          >
            <Link to="/entries/search">
              <SearchIcon />
            </Link>
          </Button>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Content contextType={selectedContextType} />
      </SidebarContent>
    </Sidebar>
  )
}

const Content: React.FC<{ contextType: EntryContextType | 'search' }> = ({
  contextType,
}) => {
  if (contextType === EntryContextType.month) {
    return <EntryMonths />
  } else if (contextType === EntryContextType.date) {
    return 'date'
  } else if (contextType === EntryContextType.tag) {
    return 'tag'
  } else if (contextType === 'search') {
    return 'search'
  } else {
    assertUnreachable(contextType)
  }
}
