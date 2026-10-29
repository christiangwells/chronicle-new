import { Link } from '@tanstack/react-router'

import { Badge } from '~/components/ui/badge'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'
import { useGetEntriesByTagSuspenseQuery } from '~/features/entries/data/get-count-by-tag'
import { EntryContextType } from '~/features/entries/types'

export const EntryTags: React.FC = () => {
  const { data } = useGetEntriesByTagSuspenseQuery()

  if (data.length === 0) {
    return <p className="text-muted-foreground mt-4 text-center">No tags yet</p>
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.map(({ text, count }) => (
          <SidebarMenuItem key={text}>
            <SidebarMenuButton asChild>
              <Link
                to="/entries/by/$contextType/$contextId"
                params={{ contextType: EntryContextType.tag, contextId: text }}
                className="group/tag data-[status=active]:bg-primary/5 hover:data-[status=active]:bg-primary/5 data-[status=active]:border-primary data-[status=active]:text-primary flex justify-between border border-transparent"
              >
                <span className="truncate">{text}</span>
                <Badge
                  // Manually set the CSS classes instead of changing the variant as
                  // that lags behind the rest of the button changing
                  variant="outline"
                  className="group-data-[status=active]/tag:bg-primary/20 group-data-[status=active]/tag:text-primary group-data-[status=active]/tag:border-transparent group-data-[status=active]/tag:font-semibold"
                >
                  {count}
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
