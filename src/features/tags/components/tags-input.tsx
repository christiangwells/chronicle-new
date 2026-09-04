import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
  ComboboxValue,
  useComboboxAnchor,
} from '~/components/ui/combobox'
import { getTags } from '~/features/tags/data/get-tags'
import type { TagInput } from '~/features/tags/lib'
import { cn } from '~/lib/utils'

interface ChipsInputProps {
  value: TagInput[]
  onChange: (value: TagInput[]) => void
  placeholder?: string
  className?: string
  'aria-invalid'?: boolean
}

export function TagsInput({
  value,
  onChange,
  placeholder = 'Add a tag',
  className,
  'aria-invalid': ariaInvalid,
}: ChipsInputProps) {
  const anchor = useComboboxAnchor()
  const [inputValue, setInputValue] = React.useState('')
  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(),
  })
  const normalizedInput = inputValue.trim()
  const availableTags = (tags ?? []).filter(
    (tag, index, allTags) =>
      allTags.findIndex(
        (candidate) => candidate.text.toLowerCase() === tag.text.toLowerCase(),
      ) === index,
  )
  const items: TagInput[] = availableTags.map(({ id, text }) => ({
    type: 'existing',
    id,
    text,
  }))
  const selectedOnlyTags = value.filter(
    (tag) =>
      !availableTags.some(
        (candidate) => candidate.text.toLowerCase() === tag.text.toLowerCase(),
      ),
  )
  items.push(...selectedOnlyTags)
  const canCreate =
    normalizedInput.length > 0 &&
    !items.some(
      (tag) => tag.text.toLowerCase() === normalizedInput.toLowerCase(),
    )
  const itemsForView = canCreate
    ? [
        ...items,
        {
          type: 'new' as const,
          text: normalizedInput,
        },
      ]
    : items
  const selectedItems = value.map(
    (tag) =>
      items.find(
        (item) => item.text.toLowerCase() === tag.text.toLowerCase(),
      ) ?? tag,
  )

  function addInputValue() {
    if (canCreate) {
      onChange([...value, { type: 'new', text: normalizedInput }])
      setInputValue('')
    }
  }

  return (
    <Combobox
      multiple
      items={itemsForView}
      value={selectedItems}
      itemToStringLabel={(item) => item.text}
      onValueChange={(nextValue) => {
        if (nextValue.some((item) => item.type === 'new')) {
          setInputValue('')
        }
        onChange(nextValue)
      }}
      onInputValueChange={setInputValue}
    >
      <ComboboxChips ref={anchor} className={cn('w-full', className)}>
        <ComboboxValue>
          {(selectedValue: TagInput[]) =>
            selectedValue.map((tag) => (
              <ComboboxChip
                key={tag.type === 'existing' ? tag.id : `new:${tag.text}`}
                className="bg-primary/20 text-primary uppercase"
              >
                {tag.text}
              </ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput
          aria-label="Tags"
          aria-invalid={ariaInvalid}
          placeholder={value.length === 0 ? placeholder : undefined}
          onKeyDownCapture={(event) => {
            if (event.key === 'Tab' && canCreate) {
              addInputValue()
            }
            if (event.key === ',' && canCreate) {
              event.preventDefault()
              addInputValue()
            }
          }}
        />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        {isLoading && <ComboboxStatus>Loading tags...</ComboboxStatus>}
        <ComboboxList>
          {(tag: TagInput) => (
            <ComboboxItem
              key={tag.type === 'existing' ? tag.id : `new:${tag.text}`}
              value={tag}
            >
              {tag.type === 'new' ? `Add "${tag.text}"` : tag.text}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>
          {normalizedInput
            ? `Add "${normalizedInput}"`
            : 'Start typing to add a tag'}
        </ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}
