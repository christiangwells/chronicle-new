import { createFileRoute, Link } from '@tanstack/react-router'

import { Card, CardHeader } from '~/components/ui/card'
import { LoginForm } from '~/features/auth/components/login-form'

export const Route = createFileRoute('/_unauthed/login')({
  component: LoginComponent,
})

function LoginComponent() {
  return (
    <>
      <Card>
        <CardHeader>
          <LoginForm />
        </CardHeader>
      </Card>
      <div className="text-center">
        Don't have an account? <Link to="/register">Sign up!</Link>
      </div>
    </>
  )
}
