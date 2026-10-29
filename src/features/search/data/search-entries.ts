import { createServerFn } from '@tanstack/react-start'
import dayjs from 'dayjs'

import { prisma } from '~/db'
import {
  buildSnippet,
  parseSearchTerms,
  searchEntriesSchema,
  type SearchResult,
} from '~/features/search/lib'
import type { Prisma } from '~/generated/prisma/client'
import { authMiddleware } from '~/lib/auth/middleware'

export const searchEntries = createServerFn()
  .middleware([authMiddleware])
  .validator(searchEntriesSchema)
  .handler(
    async ({
      context,
      data: { q, from, to, tags, match, sort, limit },
    }): Promise<{ results: SearchResult[]; total: number }> => {
      const userId = context.session.user.id
      const terms = parseSearchTerms(q)

      const where: Prisma.EntryWhereInput = {
        authorId: userId,
        date: {
          gte: from ? dayjs(from).startOf('day').toDate() : undefined,
          lte: to ? dayjs(to).endOf('day').toDate() : undefined,
        },
        // Note: SQLite LIKE is only case insensitive for ASCII characters
        AND: [
          ...terms.map((term) => ({
            OR: [
              { title: { contains: term } },
              { plainText: { contains: term } },
            ],
          })),
          ...(match === 'all'
            ? tags.map((text) => ({ tags: { some: { text, userId } } }))
            : []),
        ],
        tags:
          match === 'any' && tags.length > 0
            ? { some: { userId, text: { in: tags } } }
            : undefined,
      }

      const [entries, total] = await Promise.all([
        prisma.entry.findMany({
          where,
          orderBy: { date: sort === 'oldest' ? 'asc' : 'desc' },
          take: limit,
          include: { tags: { orderBy: { text: 'asc' } } },
          omit: { text: true, plainText: false },
        }),
        prisma.entry.count({ where }),
      ])

      return {
        results: entries.map(({ plainText, ...entry }) => ({
          ...entry,
          snippet: buildSnippet(plainText, terms),
        })),
        total,
      }
    },
  )
