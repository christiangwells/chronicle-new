import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

import { prisma } from '~/db'
import { logger, loggerMiddleware } from '~/lib/logger'

export const Route = createFileRoute('/health')({
  server: {
    middleware: [loggerMiddleware],
    handlers: {
      GET: async () => {
        const checks = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          database: await checkDatabase(),
          version: process.env.npm_package_version,
        }

        return json(checks)
      },
    },
  },
})

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'connected', latency: 0 }
  } catch (error) {
    logger.error(error, 'Error checking database health')
    return { status: 'error', error }
  }
}
