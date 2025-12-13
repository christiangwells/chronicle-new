import { createIsomorphicFn, createMiddleware } from '@tanstack/react-start'
import pino from 'pino'

const level = import.meta.env.DEV ? 'debug' : 'info'

// const consoleTransport = pino.transport({
//   target: 'pino-pretty',
// })

const loggerInit = createIsomorphicFn()
  .server(() => pino({ level }))
  .client(() =>
    pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
      level,
    }),
  )

const logger = loggerInit()

const loggerMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const startTime = Date.now()
    const timestamp = new Date().toISOString()

    logger.info(`[${timestamp}] ${request.method} ${request.url} - Starting`)

    try {
      const response = await next()
      const duration = Date.now() - startTime

      logger.info(
        `[${timestamp}] ${request.method} ${request.url} - ${response.response.status} (${duration}ms)`,
      )

      return response
    } catch (error) {
      const duration = Date.now() - startTime
      logger.error(
        error,
        `[${timestamp}] ${request.method} ${request.url} - Error (${duration}ms):`,
      )
      throw error
    }
  },
)

export { logger, loggerMiddleware }
