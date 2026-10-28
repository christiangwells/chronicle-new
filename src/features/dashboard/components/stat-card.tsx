import { ArrowDownIcon, ArrowUpIcon, type LucideIcon } from 'lucide-react'
import type React from 'react'

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { cn } from '~/lib/utils'

export const StatCard: React.FC<{
  icon: LucideIcon
  label: string
  value: React.ReactNode
  delta: number | null
  description: string | null
}> = ({ icon: Icon, label, value, delta, description }) => {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        <CardAction>
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
            <Icon className="size-4" />
          </div>
        </CardAction>
      </CardHeader>
      {(delta !== null || description) && (
        <CardFooter className="text-muted-foreground gap-1.5 text-xs">
          {delta !== null && (
            <span
              className={cn(
                'flex items-center gap-0.5 font-medium tabular-nums',
                delta >= 0 ? 'text-primary' : 'text-destructive',
              )}
            >
              {delta > 0 && <ArrowUpIcon className="size-3" />}
              {delta < 0 && <ArrowDownIcon className="size-3" />}
              {Math.abs(delta).toFixed(0)}%
            </span>
          )}
          {description && <span className="truncate">{description}</span>}
        </CardFooter>
      )}
    </Card>
  )
}
