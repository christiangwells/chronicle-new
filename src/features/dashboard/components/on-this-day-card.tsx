import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { HistoryIcon, SunIcon } from 'lucide-react'
import type React from 'react'

import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import { EntryContextType, type EntryWithTags } from '~/features/entries/types'
import { toDateString } from '~/lib/dates'

export const OnThisDayCard: React.FC<{ entries: EntryWithTags[] }> = ({
  entries,
}) => {
  const today = dayjs()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SunIcon className="text-primary size-5" />
          On this day
        </CardTitle>
        <CardDescription>{today.format('D MMMM')}</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <Empty className="p-0 md:p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HistoryIcon />
              </EmptyMedia>
              <EmptyTitle>Nothing yet</EmptyTitle>
              <EmptyDescription>
                Entries from this day in previous years will show up here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          entries.map((entry) => {
            const date = dayjs(entry.date)
            const yearsAgo = today.year() - date.year()

            return (
              <Link
                key={entry.id}
                to="/entries/by/$contextType/$contextId/$entryId"
                params={{
                  contextType: EntryContextType.date,
                  contextId: toDateString(entry.date),
                  entryId: entry.uuid,
                }}
                className="hover:bg-muted/50 flex flex-col gap-1.5 rounded-lg border p-3"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-primary font-medium">
                    {date.format('D MMM YYYY · h:mm A')}
                  </span>
                  <span className="text-muted-foreground">
                    {yearsAgo} {yearsAgo === 1 ? 'year' : 'years'} ago
                  </span>
                </div>
                {entry.title && (
                  <p className="line-clamp-1 font-semibold">{entry.title}</p>
                )}
                <div
                  className="text-muted-foreground line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: entry.text }}
                />
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <Badge key={tag.id} variant="inverted">
                        {tag.text}
                      </Badge>
                    ))}
                  </div>
                )}
              </Link>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
