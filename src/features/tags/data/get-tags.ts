import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import type { Tag } from '~/generated/prisma/client'
import { authMiddleware } from '~/lib/auth/middleware'

export const getTags = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Tag[]> => {
    const userId = context.session.user.id

    return prisma.tag.findMany({
      where: {
        userId,
      },
      orderBy: { text: 'asc' },
    })
  })
