import { createServerFn } from '@tanstack/react-start'

import { prisma } from '~/db'
import { authMiddleware } from '~/lib/auth/middleware'

export const deleteEntry = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ context, data: { id } }) => {
    const userId = context.session.user.id

    await prisma.entry.delete({
      where: { id, authorId: userId },
    })
  })
