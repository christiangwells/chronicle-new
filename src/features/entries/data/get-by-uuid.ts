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
        include: { tags: true },
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
