import { createCsrfMiddleware, createStart } from '@tanstack/react-start'

import { errorHandlerMiddleware } from '~/lib/error-handler-middleware'

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
})

export const startInstance = createStart(() => ({
  functionMiddleware: [errorHandlerMiddleware],
  requestMiddleware: [csrfMiddleware],
}))
