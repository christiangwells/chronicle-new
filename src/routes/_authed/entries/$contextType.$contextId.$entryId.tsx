import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/entries/$contextType/$contextId/$entryId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/entries/$contextType/$contextId/$entryId"!</div>
}
