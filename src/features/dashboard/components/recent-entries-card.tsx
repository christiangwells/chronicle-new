import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { ArrowRightIcon, ChevronRightIcon, NotebookPenIcon } from 'lucide-react'
import type React from 'react'
import { Fragment } from 'react'

import { Button } from '~/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import { Separator } from '~/components/ui/separator'
import { EntryContextType, type EntryWithTags } from '~/features/entries/types'
import { cn } from '~/lib/utils'

export const RecentEntriesCard: React.FC<{ entries: EntryWithTags[] }> = ({
  entries,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
        {entries.length > 0 && (
          <CardAction>
            <Button variant="link" size="sm" className="h-auto p-0" asChild>
              <Link
                to="/entries/by/$contextType"
                params={{ contextType: EntryContextType.month }}
              >
                View all
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="gap-0">
        {entries.length === 0 ? (
          <Empty className="p-0 md:p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <NotebookPenIcon />
              </EmptyMedia>
              <EmptyTitle>No entries yet</EmptyTitle>
              <EmptyDescription>
                Your latest entries will show up here.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/entries/new">Write an entry</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          entries.map((entry, index) => {
            const date = dayjs(entry.date)

            return (
              <Fragment key={entry.id}>
                {index > 0 && <Separator />}
                <Link
                  to="/entries/by/$contextType/$contextId/$entryId"
                  params={{
                    contextType: EntryContextType.month,
                    contextId: date.format('YYYY-MM'),
                    entryId: entry.uuid,
                  }}
                  className="hover:bg-muted/50 -mx-2 flex items-center gap-3 rounded-md px-2 py-3"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-primary text-xs font-medium">
                      {date.format('D MMM YYYY')}
                    </span>
                    {entry.title && (
                      <span className="truncate font-medium">
                        {entry.title}
                      </span>
                    )}
                    <div
                      className={cn(
                        'text-muted-foreground',
                        entry.title ? 'line-clamp-1' : 'line-clamp-2',
                      )}
                      dangerouslySetInnerHTML={{ __html: entry.text }}
                    />
                  </div>
                  <ChevronRightIcon className="text-muted-foreground size-4 shrink-0" />
                </Link>
              </Fragment>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
