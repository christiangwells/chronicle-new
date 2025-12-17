import dayjs from 'dayjs'
import type React from 'react'

import { EntryContextType } from '~/features/entries/types'
import { assertUnreachable } from '~/lib/utils'

interface EntryContextTitleProps {
  contextType: EntryContextType
  contextId: string
}

export const EntryContextTitle: React.FC<EntryContextTitleProps> = ({
  contextType,
  contextId,
}) => {
  switch (contextType) {
    case EntryContextType.month: {
      const date = dayjs(contextId)

      return date.format('MMMM, YYYY')
    }
    case EntryContextType.date: {
      const date = dayjs(contextId)

      return date.format('D MMMM YYYY')
    }
    case EntryContextType.tag:
      return contextId
    default:
      assertUnreachable(contextType)
  }
}
