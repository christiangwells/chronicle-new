import { createFileRoute } from '@tanstack/react-router'

import { authMiddleware } from '~/lib/auth/middleware'

export const Route = createFileRoute('/_authed')({
  server: {
    middleware: [authMiddleware],
  },
})
