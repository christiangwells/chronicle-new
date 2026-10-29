import dayjs from 'dayjs'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import * as React from 'react'
import type { Matcher } from 'react-day-picker'

import { Button } from '~/components/ui/button'
import { ButtonGroup } from '~/components/ui/button-group'
import { Calendar } from '~/components/ui/calendar'
import { Field, FieldLabel } from '~/components/ui/field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { toDateString } from '~/lib/dates'

interface DateFilterProps {
  label: string
  /** YYYY-MM-DD */
  value: string | undefined
  onChange: (value: string | undefined) => void
  disabled?: Matcher
}

export const DateFilter: React.FC<DateFilterProps> = ({
  label,
  value,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  const date = value ? dayjs(value).toDate() : undefined

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <ButtonGroup className="w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id={id}
                className="bg-background flex-1 justify-between font-normal"
              >
                {date ? dayjs(date).format('MMM D, YYYY') : 'Any date'}
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            }
          />
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              disabled={disabled}
              onSelect={(selectedDate) => {
                onChange(selectedDate ? toDateString(selectedDate) : undefined)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
        {value && (
          <Button
            variant="outline"
            size="icon"
            className="bg-background"
            aria-label={`Clear ${label.toLowerCase()} date`}
            onClick={() => onChange(undefined)}
          >
            <XIcon />
          </Button>
        )}
      </ButtonGroup>
    </Field>
  )
}
