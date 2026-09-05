import { useForm } from '@tanstack/react-form'
import { CheckIcon } from 'lucide-react'
import type React from 'react'

import { SubmitButton } from '~/components/ui/button'
import { DateTimePicker } from '~/components/ui/date-time-picker'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { MinimalTiptapEditor } from '~/components/ui/rich-text'
import { ScrollArea } from '~/components/ui/scroll-area'
import { entrySchema } from '~/features/entries/lib'
import type { EntryInput } from '~/features/entries/lib'
import type { EntryWithTags } from '~/features/entries/types'
import { TagsInput } from '~/features/tags/components/tags-input'
import type { TagInput } from '~/features/tags/lib'
import { toDateTimeLocal } from '~/lib/dates'

import { EntryControls } from './controls'

interface EditEntryProps {
  entry?: EntryWithTags
  onCancel: () => void
  onSubmit: (entry: EntryInput) => void | Promise<void>
  onDelete: () => void // TODO: This could probably move to the read-only component
}

export const EditEntry: React.FC<EditEntryProps> = ({
  entry,
  onCancel,
  onSubmit,
  onDelete,
}) => {
  const form = useForm({
    defaultValues: getDefaultValues(entry),
    validators: {
      onSubmit: entrySchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(entrySchema.parse(value))
    },
  })

  // TODO: disable everything if submitting

  return (
    <form
      className="flex h-full flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div className="flex flex-row items-center justify-between">
        <EntryControls
          isDirty={form.state.isDirty}
          isSubmitting={form.state.isSubmitting}
          entryId={entry?.id}
          onCancel={onCancel}
          onDelete={onDelete}
        />
        <form.Field name="date">
          {(field) => (
            <DateTimePicker
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              showLabels={false}
              className="justify-center"
            />
          )}
        </form.Field>
        <SubmitButton
          variant="default"
          size="icon-sm"
          isSubmitting={form.state.isSubmitting}
        >
          <CheckIcon />
        </SubmitButton>
      </div>

      <ScrollArea className="entry-edit-scroll-area min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-col gap-2">
          <form.Field name="title">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="sr-only">
                  Title
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  placeholder="Title"
                  className="font-bold"
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="text">
            {(field) => (
              <MinimalTiptapEditor
                value={field.state.value}
                onChange={(value) => field.handleChange(String(value))}
                className="h-full min-h-48 flex-1 overflow-hidden"
                editorContentClassName="min-h-0 overflow-y-auto"
              />
            )}
          </form.Field>

          <div className="mt-auto flex items-center gap-2">
            <form.Field name="tags">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field className="flex-1" data-invalid={isInvalid}>
                    <TagsInput
                      value={field.state.value}
                      onChange={field.handleChange}
                      aria-invalid={isInvalid}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )
              }}
            </form.Field>
          </div>
        </div>
      </ScrollArea>
    </form>
  )
}

function getDefaultValues(entry?: EntryWithTags) {
  if (!entry) {
    return {
      date: toDateTimeLocal(new Date()),
      title: '',
      text: '',
      tags: [],
    }
  }

  return {
    date: toDateTimeLocal(entry.date), // TODO: does this actually make sense? Can't it just be kept as UTC?
    title: entry.title ?? '',
    text: entry.text,
    tags: entry.tags.map(
      (tag): TagInput => ({
        type: 'existing',
        id: tag.id,
        text: tag.text,
      }),
    ),
  }
}
