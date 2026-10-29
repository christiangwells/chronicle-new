import type React from 'react'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '~/components/ui/combobox'
import { useGetEntriesByTagSuspenseQuery } from '~/features/entries/data/get-count-by-tag'

interface TagsFilterProps {
  value: string[]
  onChange: (value: string[]) => void
}

export const TagsFilter: React.FC<TagsFilterProps> = ({ value, onChange }) => {
  const anchor = useComboboxAnchor()
  const { data: tagCounts } = useGetEntriesByTagSuspenseQuery()
  const countByTag = new Map(tagCounts.map(({ text, count }) => [text, count]))
  const items = tagCounts
    .map(({ text }) => text)
    .sort((a, b) => a.localeCompare(b))

  return (
    <Combobox
      multiple
      items={items}
      value={value}
      onValueChange={(nextValue: string[]) => onChange(nextValue)}
    >
      <ComboboxChips ref={anchor} className="bg-background w-full">
        <ComboboxValue>
          {(selectedValue: string[]) =>
            selectedValue.map((tag) => (
              <ComboboxChip
                key={tag}
                className="bg-primary/20 text-primary uppercase"
              >
                {tag}
              </ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput
          aria-label="Tags"
          placeholder={value.length === 0 ? 'Any tags' : undefined}
        />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          {(tag: string) => (
            <ComboboxItem key={tag} value={tag}>
              <span className="flex-1 truncate">{tag}</span>
              <span className="text-muted-foreground text-xs tabular-nums">
                {countByTag.get(tag)}
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>No matching tags</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}
