import { z } from 'zod'

export const ALL_TIME = 'all'

export type DashboardYear = number | typeof ALL_TIME

export const dashboardSearchSchema = z.object({
  year: z
    .union([z.literal(ALL_TIME), z.number().int().min(1900).max(9999)])
    .optional()
    .catch(undefined),
})

export function formatDashboardYear(year: DashboardYear): string {
  return year === ALL_TIME ? 'All time' : year.toString()
}
