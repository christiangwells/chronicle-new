import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import dayjs from 'dayjs'

import { prisma } from '~/db'
import { EntryContextType, type EntryWithTags } from '~/features/entries/types'
import { authMiddleware } from '~/lib/auth/middleware'
import { assertUnreachable } from '~/lib/utils'

export const getEntryByUuid = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(
    (data: {
      contextType?: EntryContextType
      contextId?: string
      uuid: string
    }) => data,
  )
  .handler(
    async ({
      context,
      data: { contextType, contextId, uuid },
    }): Promise<EntryWithTags> => {
      const userId = context.session.user.id

      const entry = await prisma.entry.findUniqueOrThrow({
        where: { uuid, authorId: userId },
        // TODO: this is not the order the tags were selected, which will look off a little bit
        // This is preferable to id which will be order of when they were created (globally for
        // the user) but ideally it would be selection order. Would need to make a custom many-
        // to-many table for that, which makes things a little less nice and simple in prisma.
        // Will also need to do this for other queries on entries
        include: { tags: { orderBy: { text: 'asc' } } },
      })

      // If this is being retrieved as part of a context, validate that it's valid in that
      if (
        contextType &&
        contextId &&
        !isEntryContextValid(entry, contextType, contextId)
      ) {
        throw notFound()
      }

      return entry
    },
  )

/**
 * If this is being retrieved as part of a context, validate that it belongs there.
 *
 * This allows us to avoid things like navigating to a month and entry that is not inside
 * that month, and dealing with any UX weirdness that arises from that.
 */
function isEntryContextValid(
  entry: EntryWithTags,
  contextType: EntryContextType,
  contextId: string,
): boolean {
  switch (contextType) {
    case EntryContextType.month:
      return dayjs(entry.date).isSame(contextId, 'month')
    case EntryContextType.date:
      return dayjs(entry.date).isSame(contextId, 'day')
    case EntryContextType.tag:
      return entry.tags.some((tag) => tag.text === contextId)
    default:
      assertUnreachable(contextType)
  }
}
