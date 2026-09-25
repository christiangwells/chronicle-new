import type { Entry, Tag } from '~/generated/prisma/client'

export type EntryWithTags = Entry & { tags: Tag[] }

export enum EntryContextType {
  month = 'month',
  date = 'date',
  tag = 'tag',
}

export function assertEntryContextType(
  contextType: string,
): contextType is EntryContextType {
  return Object.values(EntryContextType).includes(
    contextType as EntryContextType,
  )
}

export interface EntriesStats {
  total: number
  days: number
  currentDayStreak: number
  currentWeek: number
  thisDay: number
  firstDate: Date | null
  latestDate: Date | null
}

// To make reading grouped types easier
export type Year = string
export type Month = string
export type Day = string
