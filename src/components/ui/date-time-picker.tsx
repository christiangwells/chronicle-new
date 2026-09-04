'use client'

import { format, isValid } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Field, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  className?: string
  dateLabel?: string
  timeLabel?: string
  showLabels?: boolean
  disabled?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  onBlur,
  className,
  dateLabel = 'Date',
  timeLabel = 'Time',
  showLabels = true,
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  const dateId = `${id}-date`
  const timeId = `${id}-time`
  const parsedDate = value ? new Date(value) : undefined
  const date = parsedDate && isValid(parsedDate) ? parsedDate : undefined

  const updateDate = (nextDate: Date) => {
    onChange(format(nextDate, "yyyy-MM-dd'T'HH:mm"))
  }

  return (
    <FieldGroup className={cn('flex-row gap-2', className)}>
      <Field className="w-35">
        {showLabels && <FieldLabel htmlFor={dateId}>{dateLabel}</FieldLabel>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id={dateId}
                aria-label={dateLabel}
                disabled={disabled}
                className="w-full justify-between font-normal"
              >
                {date ? format(date, 'PP') : 'Select date'}
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
              onSelect={(selectedDate) => {
                if (!selectedDate) return

                selectedDate.setHours(
                  date?.getHours() ?? 0,
                  date?.getMinutes() ?? 0,
                  0,
                  0,
                )
                updateDate(selectedDate)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-26">
        {showLabels && <FieldLabel htmlFor={timeId}>{timeLabel}</FieldLabel>}
        <Input
          type="time"
          id={timeId}
          aria-label={timeLabel}
          value={date ? format(date, 'HH:mm') : ''}
          disabled={disabled}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          onBlur={onBlur}
          onChange={(event) => {
            if (!event.target.value) return

            const [hours, minutes] = event.target.value.split(':').map(Number)
            const nextDate = date ? new Date(date) : new Date()
            nextDate.setHours(hours, minutes, 0, 0)
            updateDate(nextDate)
          }}
        />
      </Field>
    </FieldGroup>
  )
}
