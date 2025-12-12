import { createFileRoute, Link } from '@tanstack/react-router'

import { Card, CardContent } from '~/components/ui/card'
import { RegisterForm } from '~/features/auth/components/register-form'

export const Route = createFileRoute('/_unauthed/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Card>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
      <div className="text-center">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </>
  )
}
