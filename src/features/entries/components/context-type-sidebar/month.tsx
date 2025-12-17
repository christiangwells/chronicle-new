import { Link, useMatchRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { ChevronRightIcon } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar'
import { useGetEntriesByMonthSuspenseQuery } from '~/features/entries/data/get-count-by-month'
import { EntryContextType } from '~/features/entries/types'

export const EntryMonths: React.FC = () => {
  const { data } = useGetEntriesByMonthSuspenseQuery()
  const matchRoute = useMatchRoute()

  const match = matchRoute({
    to: '/entries/$contextType/$contextId',
    fuzzy: true,
  })
  const selection = match ? dayjs(match.contextId) : null
  const selectedYear = selection?.year().toString()
  const selectedMonth = selection
    ? (selection.month() + 1).toString()
    : undefined

  if (Object.keys(data).length === 0) {
    return (
      <p className="text-center mt-4 text-muted-foreground">No entries yet</p>
    )
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {Object.entries(data)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([year, months]) => (
            <Collapsible
              key={year}
              asChild
              defaultOpen={year === selectedYear}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  variant="outline"
                  className={
                    year === selectedYear
                      ? 'bg-primary hover:bg-primary/90! text-primary-foreground!'
                      : ''
                  }
                >
                  <CollapsibleTrigger>
                    {year}{' '}
                    <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {Object.entries(months)
                      .sort((a, b) => Number(b[0]) - Number(a[0]))
                      .map(([month, count]) => (
                        <SidebarMenuSubItem key={`${year}-${month}`}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              to="/entries/$contextType/$contextId"
                              params={{
                                contextType: EntryContextType.month,
                                contextId: `${year}-${month}`,
                              }}
                              className="flex justify-between"
                              activeProps={{
                                className:
                                  'bg-primary hover:bg-primary/90! text-primary-foreground!',
                              }}
                            >
                              {dayjs(`${year}-${month}-15`).format('MMMM')}
                              <Badge
                                variant={
                                  year === selectedYear &&
                                  month === selectedMonth
                                    ? 'default'
                                    : 'outline'
                                }
                              >
                                {count}
                              </Badge>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
