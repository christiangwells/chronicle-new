import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

import { PrismaClient } from './generated/prisma/client.js'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    adapter,
    // Only needed for search - opt back in with `omit: { plainText: false }`
    omit: { entry: { plainText: true } },
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
