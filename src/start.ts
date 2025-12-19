import { createStart } from '@tanstack/react-start'

import { errorHandlerMiddleware } from '~/lib/error-handler-middleware'

export const startInstance = createStart(() => ({
  functionMiddleware: [errorHandlerMiddleware],
}))
