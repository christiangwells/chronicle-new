import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/entries/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Link to="/logout">Log out</Link>
    </div>
  )
}
