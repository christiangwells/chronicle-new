import dayjs from 'dayjs'
import type React from 'react'

import { Button } from '~/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '~/components/ui/sidebar'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import {
  type EntrySearch,
  hasActiveFilters,
  type SearchSort,
  type TagMatch,
} from '~/features/search/lib'

import { DateFilter } from './date-filter'
import { KeywordInput } from './keyword-input'
import { TagsFilter } from './tags-filter'

interface SearchSidebarProps {
  search: EntrySearch
  onChange: (patch: Partial<EntrySearch>) => void
  onReset: () => void
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({
  search,
  onChange,
  onReset,
}) => {
  const tags = search.tags ?? []

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <KeywordInput value={search.q} onChange={(q) => onChange({ q })} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Date</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-3 px-2">
            <DateFilter
              label="From"
              value={search.from}
              onChange={(from) => onChange({ from })}
              disabled={
                search.to ? { after: dayjs(search.to).toDate() } : undefined
              }
            />
            <DateFilter
              label="To"
              value={search.to}
              onChange={(to) => onChange({ to })}
              disabled={
                search.from
                  ? { before: dayjs(search.from).toDate() }
                  : undefined
              }
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tags</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-3 px-2">
            <TagsFilter
              value={tags}
              onChange={(nextTags) => onChange({ tags: nextTags })}
            />
            {tags.length > 1 && (
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                className="bg-background w-full"
                value={search.match ?? 'all'}
                onValueChange={(match) => {
                  if (match) onChange({ match: match as TagMatch })
                }}
              >
                <ToggleGroupItem value="all" className="flex-1">
                  All tags
                </ToggleGroupItem>
                <ToggleGroupItem value="any" className="flex-1">
                  Any tag
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Sort</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              className="bg-background w-full"
              value={search.sort ?? 'newest'}
              onValueChange={(sort) => {
                if (sort) onChange({ sort: sort as SearchSort })
              }}
            >
              <ToggleGroupItem value="newest" className="flex-1">
                Newest first
              </ToggleGroupItem>
              <ToggleGroupItem value="oldest" className="flex-1">
                Oldest first
              </ToggleGroupItem>
            </ToggleGroup>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="secondary"
          disabled={!hasActiveFilters(search)}
          onClick={onReset}
        >
          Reset filters
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
