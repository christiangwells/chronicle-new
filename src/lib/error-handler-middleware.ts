import { notFound } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

import { Prisma } from '~/generated/prisma/client'
import { logger } from '~/lib/logger'

export const errorHandlerMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next, serverFnMeta }) => {
  try {
    const result = await next()
    return result
  } catch (error) {
    logger.error(
      error,
      `Error occurred processing function ${serverFnMeta.name}`,
    )

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw notFound()
    }

    throw error
  }
})
