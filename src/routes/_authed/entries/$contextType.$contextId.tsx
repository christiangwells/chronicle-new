import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/entries/$contextType/$contextId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/entries/$contextType/$contextId"!</div>
}
