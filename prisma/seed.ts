import { faker } from '@faker-js/faker'
import dayjs, { type Dayjs } from 'dayjs'

import { prisma } from '~/db'
import { type Tag } from '~/generated/prisma/client'
import { authClient } from '~/lib/auth/client'

async function main() {
  console.log('🌱 Seeding database...')

  // Ensure the local dev server is running before we try to seed.
  try {
    await ensureServerRunning('http://localhost:3001')
  } catch (err) {
    console.error(
      '\n❌ Server at http://localhost:3001 is not reachable. Start the server and retry.\n',
      err,
    )
    process.exit(1)
  }

  // Clear existing data
  await clearTables()

  const mainUserId = await createUsers()

  const tags = await createTags(mainUserId)

  await createEntries(mainUserId, tags)

  console.log(`✅ Created seed`)
}

async function ensureServerRunning(
  url = 'http://localhost:3001',
  timeoutMs = 3000,
): Promise<void> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal })
    clearTimeout(timeout)
    if (res.status >= 500) {
      throw new Error(`Server responded with status ${res.status}`)
    }
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

function clearTables() {
  return prisma.$transaction([
    prisma.entry.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.user.deleteMany(),
  ])
}

/**
 * Create 2 users - the first being the main test user, and an extraneous one to test ownership rules.
 */
async function createUsers() {
  // TODO: maybe just go back to having it insert manually
  const user1 = await authClient.signUp.email({
    email: 'test@email.com',
    password: 'testing123',
    name: 'test',
  })
  if (user1.error) throw user1.error
  const user2 = await authClient.signUp.email({
    email: 'test2@email.com',
    password: 'testing123',
    name: faker.person.firstName(),
  })
  if (user2.error) throw user2.error

  return user1.data.user.id
}

async function createTags(userId: string) {
  return prisma.tag.createManyAndReturn({
    data: Array.from({ length: 5 }, (_v, k) => k + 1).map((id) => ({
      id,
      text: faker.word.noun(),
      userId,
    })),
  })
}

async function createEntries(userId: string, allTags: Tag[]) {
  // Start from yesterday, so any new entries are guaranteed to be the latest
  const startDate = dayjs().subtract(1, 'day').startOf('day')
  let id = 1

  // go back 1000 days

  for (const i of [...Array(1000).keys()]) {
    // 20% chance we don't use this day (user skipped a day)
    if (Math.random() <= 0.2) {
      continue
    }

    const currentDate = startDate.subtract(i, 'days')
    const { date, title, text, tags } = createEntryInput(currentDate, allTags)
    // Can't create many because it doesn't allow many-to-many foreign keys

    await prisma.entry.create({
      data: {
        id: id++,
        date,
        title,
        text,
        authorId: userId,
        tags: { connect: tags },
      },
    })
  }
}

function createEntryInput(day: Dayjs, allTags: Tag[]) {
  const date = faker.date.between({
    from: day.toISOString(),
    to: day.endOf('day').toISOString(),
  })

  const title = faker.lorem.words({ min: 0, max: 5 })

  const paragraphCount = faker.number.int({ min: 1, max: 5 })
  const text = Array.from({ length: paragraphCount })
    .map(() => `<p>${faker.lorem.paragraph({ min: 1, max: 10 })}</p>`)
    .join('')

  const tags = faker.helpers
    .arrayElements(allTags, { min: 0, max: 3 })
    .map((tag) => ({ id: tag.id }))

  return { date, title, text, tags }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
