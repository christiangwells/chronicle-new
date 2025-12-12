import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import * as z from 'zod'

import { SubmitButton } from '~/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { authClient } from '~/lib/auth/client'

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
})
type Input = z.infer<typeof formSchema>

export const LoginForm: React.FC = () => {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // TODO: type the useForm call, right now it wants all 12 options to be typed
        await authClient.signIn.email(value as Input, {
          onSuccess: () => {
            router.navigate({ to: '/' })
            toast.dismiss()
          },
          onError: () => {
            toast.error('Username or password incorrect', {
              duration: Infinity,
            })
          },
        })
      } catch (e) {
        toast.error('Something went wrong', { duration: Infinity })
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  required
                />
              </Field>
            )
          }}
        />
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  required
                  type="password"
                />
              </Field>
            )
          }}
        />
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <SubmitButton isSubmitting={isSubmitting} />
          )}
        />
      </FieldGroup>
    </form>
  )
}
