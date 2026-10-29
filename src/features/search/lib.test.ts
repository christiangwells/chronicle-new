import { describe, expect, it } from 'vitest'

import {
  buildSnippet,
  entrySearchSchema,
  hasActiveFilters,
  parseSearchTerms,
} from './lib'

describe('parseSearchTerms', () => {
  it('splits on whitespace', () => {
    expect(parseSearchTerms('  coffee   morning ')).toEqual([
      'coffee',
      'morning',
    ])
  })

  it('keeps quoted phrases together', () => {
    expect(parseSearchTerms('"long walk" beach "')).toEqual([
      'long walk',
      'beach',
      '"',
    ])
    expect(parseSearchTerms('"" a')).toEqual(['a'])
  })

  it('removes case-insensitive duplicates', () => {
    expect(parseSearchTerms('Coffee coffee COFFEE tea')).toEqual([
      'Coffee',
      'tea',
    ])
  })

  it('handles no query', () => {
    expect(parseSearchTerms(undefined)).toEqual([])
    expect(parseSearchTerms('   ')).toEqual([])
  })
})

describe('buildSnippet', () => {
  const text = `${'a'.repeat(100)} needle ${'b'.repeat(100)}`

  it('centres on the first match with ellipses', () => {
    const snippet = buildSnippet(text, ['NEEDLE'], 60)

    expect(snippet.startsWith('…')).toBe(true)
    expect(snippet.endsWith('…')).toBe(true)
    expect(snippet).toContain('needle')
  })

  it('uses the earliest of several terms', () => {
    const snippet = buildSnippet('one two three', ['three', 'two'], 100)

    expect(snippet).toBe('one two three')
  })

  it('starts at the beginning when nothing matches', () => {
    expect(buildSnippet(text, ['missing'], 10)).toBe(`${'a'.repeat(10)}…`)
    expect(buildSnippet(text, [], 10)).toBe(`${'a'.repeat(10)}…`)
  })

  it('does not cut off the end when the match is near it', () => {
    const snippet = buildSnippet(text, ['b'], 300)

    expect(snippet).toBe(text)
  })
})

describe('entrySearchSchema', () => {
  it('parses valid search params', () => {
    expect(
      entrySearchSchema.parse({
        q: ' hello ',
        from: '2025-01-01',
        to: '2025-12-31',
        tags: ['work'],
        match: 'any',
        sort: 'oldest',
        limit: 100,
      }),
    ).toEqual({
      q: 'hello',
      from: '2025-01-01',
      to: '2025-12-31',
      tags: ['work'],
      match: 'any',
      sort: 'oldest',
      limit: 100,
    })
  })

  it('drops invalid values instead of failing', () => {
    expect(
      entrySearchSchema.parse({
        q: '   ',
        from: '2025-02-31',
        to: 'yesterday',
        tags: [],
        match: 'some',
        sort: 1,
        limit: 10_000,
      }),
    ).toEqual({})
  })
})

describe('hasActiveFilters', () => {
  it('ignores sort and paging', () => {
    expect(hasActiveFilters({ sort: 'oldest', limit: 100 })).toBe(false)
    expect(hasActiveFilters({ tags: ['work'] })).toBe(true)
    expect(hasActiveFilters({ to: '2025-01-01' })).toBe(true)
  })
})
