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
