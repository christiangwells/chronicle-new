import { createFileRoute, redirect } from '@tanstack/react-router'

import { authClient } from '~/lib/auth/client'

export const Route = createFileRoute('/logout')({
  preload: false,
  loader: () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          throw redirect({ to: '/login' })
        },
      },
    }),
})
