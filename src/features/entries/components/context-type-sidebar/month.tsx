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
  // const selectedMonth = selection
  //   ? (selection.month() + 1).toString()
  //   : undefined

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
              data-status={year === selectedYear ? 'active' : 'inactive'}
              defaultOpen={year === selectedYear}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  variant="default"
                  className=" border group-data-[state=closed]/collapsible:group-data-[status=active]/collapsible:bg-primary/5 dark:group-data-[state=closed]/collapsible:group-data-[status=active]/collapsible:bg-primary/2 group-data-[state=closed]/collapsible:group-data-[status=active]/collapsible:border-primary hover:group-data-[state=closed]/collapsible:group-data-[status=active]/collapsible:bg-primary/5! dark:hover:group-data-[state=closed]/collapsible:group-data-[status=active]/collapsible:bg-primary/2! group-data-[state=closed]/collapsible:group-data-[status=active]/collapsible:text-primary"
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
                              className="group/month flex justify-between border border-transparent data-[status=active]:bg-primary/5 hover:data-[status=active]:bg-primary/5 data-[status=active]:border-primary data-[status=active]:text-primary"
                            >
                              {dayjs(`${year}-${month}-15`).format('MMMM')}
                              <Badge
                                // Manually set the CSS classes instead of changing the variant as
                                // that lags behind the rest of the button changing
                                variant="outline"
                                className="group-data-[status=active]/month:border-transparent group-data-[status=active]/month:bg-primary/20 group-data-[status=active]/month:text-primary group-data-[status=active]/month:font-semibold"
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
