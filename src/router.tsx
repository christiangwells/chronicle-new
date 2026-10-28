import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import * as TanstackQuery from './integrations/tanstack-query/root-provider'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    /** The route renders a sidebar, so the header shows the sidebar toggle */
    sidebar?: boolean
  }
}

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          {props.children}
        </TanstackQuery.Provider>
      )
    },
    scrollRestoration: true,
    scrollToTopSelectors: ['[data-radix-scroll-area-viewport]'],
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
