import { SearchIcon, XIcon } from 'lucide-react'
import * as React from 'react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '~/components/ui/input-group'
import { useDebouncedValue } from '~/hooks/use-debounced-value'

interface KeywordInputProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
}

export const KeywordInput: React.FC<KeywordInputProps> = ({
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState(value ?? '')
  const debouncedValue = useDebouncedValue(inputValue, 300)

  // Keep in sync when the URL changes from elsewhere (reset, back/forward)
  const [prevValue, setPrevValue] = React.useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    if (value !== (inputValue.trim() || undefined)) {
      setInputValue(value ?? '')
    }
  }

  const commit = (nextValue: string) => {
    const normalized = nextValue.trim() || undefined
    if (normalized !== value) {
      onChange(normalized)
    }
  }

  React.useEffect(() => {
    commit(debouncedValue)
    // Only commit when the debounced value settles, not when the URL value changes
  }, [debouncedValue])

  return (
    <InputGroup className="bg-background">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Keywords"
        placeholder="Search entries"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commit(inputValue)
          }
        }}
      />
      {inputValue && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear keywords"
            onClick={() => {
              setInputValue('')
              commit('')
            }}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
