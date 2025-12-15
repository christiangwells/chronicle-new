import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

import { auth } from './'

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      // TODO: add a redirect param, and consume it in login
      throw redirect({ to: '/login' })
    }

    return await next({ context: { session } })
  },
)
