import dayjs from 'dayjs'
import type React from 'react'

import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import type { EntryWithTags } from '~/features/entries/types'

export const EntrySummaryCard: React.FC<{ entry: EntryWithTags }> = ({
  entry,
}) => {
  const date = dayjs(entry.date)

  return (
    // to have the active background colour not look washed out it needs to be against black
    // so the card needs to have that and the content gets the colour
    <Card className="hover:bg-background group-[.active]:bg-background group-[.active]:border-primary py-0 group-[.active]:shadow-none">
      <CardContent className="hover:bg-muted/40 hover:group-[.active]:bg-primary/5 group-[.active]:bg-primary/5 dark:group-[.active]:bg-primary/10 flex h-28 flex-row items-center gap-4 px-4 py-2">
        <div className="text-muted-foreground flex flex-col items-stretch justify-start text-center text-sm/5 font-bold uppercase">
          {/* TODO: maybe just show weekday, day, and time for month context and just time for date context.
          potentially even for tags they should be grouped into months so only show same as month context
          */}
          <p>{date.format('ddd')}</p>
          <h2 className="text-3xl tracking-tight">{date.format('DD')}</h2>
          <p>{date.format('MMM')}</p>
          <p>{date.format('YYYY')}</p>
        </div>
        <div className="flex-1 space-y-0">
          {entry.title && (
            <p className="line-clamp-1 font-semibold">{entry.title}</p>
          )}
          <div
            className="text-muted-foreground line-clamp-2 first:line-clamp-3 last:line-clamp-3 only:line-clamp-4"
            dangerouslySetInnerHTML={{ __html: entry.text }}
          />
          {entry.tags.length > 1 && (
            <div className="space-x-2">
              {entry.tags
                .sort((a, b) => a.text.localeCompare(b.text))
                .map((tag) => (
                  <Badge key={tag.id} variant="inverted" className="uppercase">
                    {tag.text}
                  </Badge>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
