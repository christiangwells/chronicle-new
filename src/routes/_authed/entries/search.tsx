import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
  useRouterState,
} from '@tanstack/react-router'
import { SearchIcon, SearchXIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { Spinner } from '~/components/ui/spinner'
import { EntrySummaryCard } from '~/features/entries/components/summary-card'
import { Highlight } from '~/features/search/components/highlight'
import { SearchSidebar } from '~/features/search/components/search-sidebar'
import { searchEntries } from '~/features/search/data/search-entries'
import {
  DEFAULT_SEARCH_LIMIT,
  type EntrySearch,
  entrySearchSchema,
  hasActiveFilters,
  MAX_SEARCH_LIMIT,
  parseSearchTerms,
} from '~/features/search/lib'
import { useIsMobile } from '~/hooks/use-mobile'

export const Route = createFileRoute('/_authed/entries/search')({
  staticData: { sidebar: true },
  validateSearch: entrySearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    hasActiveFilters(deps) ? searchEntries({ data: deps }) : null,
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const updateSearch = (patch: Partial<EntrySearch>) =>
    navigate({
      to: '/entries/search',
      // Changing filters starts back at the first page of results
      search: (prev) => ({ ...prev, ...patch, limit: undefined }),
      replace: true,
      resetScroll: false,
    })

  const resetSearch = () =>
    navigate({ to: '/entries/search', search: {}, resetScroll: false })

  return (
    <div className="flex w-full">
      <SearchSidebar
        search={search}
        onChange={updateSearch}
        onReset={resetSearch}
      />
      <SearchResults onReset={resetSearch} />
    </div>
  )
}

function SearchResults({ onReset }: { onReset: () => void }) {
  const search = Route.useSearch()
  const data = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const matchRoute = useMatchRoute()
  const isMobile = useIsMobile()
  const isLoading = useRouterState({
    select: (state) => state.status === 'pending',
  })

  const isEntrySelected = !!matchRoute({
    to: '/entries/search/$entryId',
    fuzzy: true,
  })

  // Same as the by-context list - on mobile the entry takes up the whole screen
  if (isEntrySelected && isMobile) {
    return <Outlet />
  }

  const terms = parseSearchTerms(search.q)
  const limit = search.limit ?? DEFAULT_SEARCH_LIMIT

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="bg-muted/80 top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <ResizablePanel defaultSize="40" minSize="20" className="h-full">
        <ScrollArea className="h-full">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4 p-4">
            {!data ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchIcon />
                  </EmptyMedia>
                  <EmptyTitle>Search your journal</EmptyTitle>
                  <EmptyDescription>
                    Enter some keywords, or filter by date or tags.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : data.total === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchXIcon />
                  </EmptyMedia>
                  <EmptyTitle>No results</EmptyTitle>
                  <EmptyDescription>
                    No entries match these filters.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="secondary" onClick={onReset}>
                    Reset filters
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <>
                <div className="relative my-2 flex items-center justify-center overflow-hidden">
                  <Separator />
                  <span className="text-muted-foreground flex shrink-0 items-center gap-2 px-2 font-bold">
                    {data.results.length < data.total
                      ? `Showing ${data.results.length} of ${data.total} results`
                      : `${data.total} ${data.total === 1 ? 'result' : 'results'}`}
                    {isLoading && <Spinner />}
                  </span>
                  <Separator />
                </div>
                {data.results.map((entry) => (
                  <Link
                    key={entry.id}
                    to="/entries/search/$entryId"
                    params={{ entryId: entry.uuid }}
                    search={true}
                    className="group"
                    resetScroll={false}
                  >
                    <EntrySummaryCard
                      entry={entry}
                      title={
                        entry.title && (
                          <Highlight text={entry.title} terms={terms} />
                        )
                      }
                      body={<Highlight text={entry.snippet} terms={terms} />}
                    />
                  </Link>
                ))}
                {data.results.length < data.total &&
                  limit < MAX_SEARCH_LIMIT && (
                    <Button
                      variant="secondary"
                      className="self-center"
                      disabled={isLoading}
                      onClick={() =>
                        navigate({
                          search: (prev) => ({
                            ...prev,
                            limit: Math.min(
                              limit + DEFAULT_SEARCH_LIMIT,
                              MAX_SEARCH_LIMIT,
                            ),
                          }),
                          replace: true,
                          resetScroll: false,
                        })
                      }
                    >
                      Show more
                    </Button>
                  )}
              </>
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>
      {isEntrySelected && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="60" minSize="20">
            <Outlet />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}
