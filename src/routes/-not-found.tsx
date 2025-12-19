import type React from 'react'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '~/components/ui/empty'

export const NotFoundRoute: React.FC = () => (
  <Empty>
    <EmptyHeader>
      <EmptyTitle>404 - Not Found</EmptyTitle>
      <EmptyDescription>
        The page you&apos;re looking for doesn&apos;t exist.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
)
