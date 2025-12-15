import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/entries/')({
  component: RouteComponent,
})

// TODO: get first month with an entry and navigate to it?
function RouteComponent() {
  return (
    <>
      <div>
        <Link to="/logout">Log out</Link>
      </div>
    </>
  )
}
