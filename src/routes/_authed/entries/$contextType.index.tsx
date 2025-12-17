import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/entries/$contextType/')({
  component: RouteComponent,
})

// TODO: show some stats
function RouteComponent() {
  return <div>Hello "/_authed/entries/$contextType/index"!</div>
}
