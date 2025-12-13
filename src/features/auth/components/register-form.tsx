import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import type React from 'react'
import { toast } from 'sonner'
import z from 'zod'

import { SubmitButton } from '~/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { authClient } from '~/lib/auth/client'
import { logger } from '~/lib/logger'

const formSchema = z
  .object({
    email: z.string().trim().min(1, 'Required'),
    name: z.string().trim().min(1, 'Required'),
    password: z
      .string()
      .trim()
      .min(8, 'Passwords must be at least 8 characters'),
    confirmPassword: z.string().trim().min(1, 'Required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
type Input = z.infer<typeof formSchema>

export const RegisterForm: React.FC = () => {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    // onSubmitInvalid: (a) => {
    //   console.log(a)
    // },
    onSubmit: async ({ value }) => {
      try {
        logger.debug(value, 'Submitted user registration')
        // return
        // TODO: type the useForm call, right now it wants all 12 options to be typed
        const { email, name, password } = value as Input
        await authClient.signUp.email(
          { email, name, password },
          {
            onSuccess: () => {
              router.navigate({ to: '/' })
              toast.dismiss()
            },
            onError: (e) => {
              logger.error(e, 'Error registering user')
              toast.error('Could not register user', {
                description: e.error.message,
                duration: Infinity,
              })
            },
          },
        )
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
      <FieldGroup className="gap-3">
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
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="confirmPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <SubmitButton isSubmitting={isSubmitting} className="mt-1" />
          )}
        />
      </FieldGroup>
    </form>
  )
}
