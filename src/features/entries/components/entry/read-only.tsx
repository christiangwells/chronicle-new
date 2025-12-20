import { Link, useMatchRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { PencilIcon, XIcon } from 'lucide-react'
import type React from 'react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import type { EntryWithTags } from '~/features/entries/types'

export const ReadOnlyEntry: React.FC<{ entry: EntryWithTags }> = ({
  entry,
}) => {
  const closeRoute = useCloseRoute()

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-row items-center">
        {closeRoute ? (
          <Button variant="secondary" size="icon-sm" asChild>
            <Link to={closeRoute.to} params={closeRoute.params}>
              <XIcon />
            </Link>
          </Button>
        ) : (
          <div className="size-8" />
        )}

        <p className="text-muted-foreground flex-1 text-center font-bold">
          {dayjs(entry.date).format('ddd, MMM D, YYYY, h:mm A')}
        </p>
        <Button variant="default" size="icon-sm">
          <PencilIcon />
        </Button>
      </div>
      <h5 className="font-bold">{entry.title}</h5>
      <ScrollArea className="min-h-0 flex-1">
        <div
          dangerouslySetInnerHTML={{ __html: entry.text }}
          className="text-card-foreground/70 space-y-2"
        />
      </ScrollArea>
      <div className="space-x-2">
        {entry.tags
          .sort((a, b) => a.text.localeCompare(b.text))
          .map((tag) => (
            <Badge key={tag.id} variant="inverted" className="uppercase">
              {tag.text}
            </Badge>
          ))}
      </div>
    </div>
  )
}

function useCloseRoute() {
  const matchRoute = useMatchRoute()
  const contextMatch = matchRoute({
    to: '/entries/$contextType/$contextId',
    fuzzy: true,
  })
  // TODO: standalone match when that's a route?

  if (contextMatch) {
    return {
      to: '/entries/$contextType/$contextId',
      params: contextMatch,
    } as const
  }

  return null
}
