import { createFileRoute } from '@tanstack/react-router'

import { auth } from '~/lib/auth'
import { loggerMiddleware } from '~/lib/logger'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    middleware: [loggerMiddleware],
    handlers: {
      GET: ({ request }) => {
        return auth.handler(request)
      },
      POST: ({ request }) => {
        return auth.handler(request)
      },
    },
  },
})
