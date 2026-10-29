import dayjs from 'dayjs'
import { z } from 'zod'

import type { EntryWithTags } from '~/features/entries/types'

export const DEFAULT_SEARCH_LIMIT = 50
export const MAX_SEARCH_LIMIT = 500

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  // Round trip to reject dates like 2026-02-31, which dayjs rolls over
  .refine((date) => dayjs(date).format('YYYY-MM-DD') === date)

const tagMatchSchema = z.enum(['all', 'any'])
const sortSchema = z.enum(['newest', 'oldest'])

export type TagMatch = z.infer<typeof tagMatchSchema>
export type SearchSort = z.infer<typeof sortSchema>

export const entrySearchSchema = z.object({
  q: z
    .string()
    .trim()
    .transform((q) => q || undefined)
    .optional()
    .catch(undefined),
  from: dateStringSchema.optional().catch(undefined),
  to: dateStringSchema.optional().catch(undefined),
  tags: z
    .array(z.string())
    .transform((tags) => (tags.length > 0 ? tags : undefined))
    .optional()
    .catch(undefined),
  match: tagMatchSchema.optional().catch(undefined),
  sort: sortSchema.optional().catch(undefined),
  limit: z
    .number()
    .int()
    .min(1)
    .max(MAX_SEARCH_LIMIT)
    .optional()
    .catch(undefined),
})

export type EntrySearch = z.infer<typeof entrySearchSchema>

export const searchEntriesSchema = z.object({
  q: z.string().trim().optional(),
  from: dateStringSchema.optional(),
  to: dateStringSchema.optional(),
  tags: z.array(z.string()).default([]),
  match: tagMatchSchema.default('all'),
  sort: sortSchema.default('newest'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(MAX_SEARCH_LIMIT)
    .default(DEFAULT_SEARCH_LIMIT),
})

export type SearchResult = Omit<EntryWithTags, 'text'> & { snippet: string }

export function hasActiveFilters(search: EntrySearch): boolean {
  return !!(search.q || search.from || search.to || search.tags?.length)
}

/**
 * Split a keyword query into terms, keeping "quoted phrases" together.
 */
export function parseSearchTerms(q: string | undefined): string[] {
  if (!q) return []

  const terms = Array.from(q.matchAll(/"([^"]*)"|(\S+)/g), (match) =>
    (match[1] ?? match[2]).trim(),
  ).filter(Boolean)

  return terms.filter(
    (term, index) =>
      terms.findIndex(
        (candidate) => candidate.toLowerCase() === term.toLowerCase(),
      ) === index,
  )
}

/**
 * Get a snippet of `text` around the first matching term, or the start of the text if no terms match.
 */
export function buildSnippet(
  text: string,
  terms: string[],
  length = 200,
): string {
  const lowerText = text.toLowerCase()
  const firstMatch = Math.min(
    ...terms
      .map((term) => lowerText.indexOf(term.toLowerCase()))
      .filter((index) => index !== -1),
  )

  // Show a bit of context before the match, rather than starting on it
  const start = Number.isFinite(firstMatch)
    ? Math.max(0, Math.min(firstMatch - 40, text.length - length))
    : 0
  const end = Math.min(text.length, start + length)

  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}
