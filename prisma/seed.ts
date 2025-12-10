import { faker } from '@faker-js/faker'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import dayjs, { type Dayjs } from 'dayjs'

import { PrismaClient, type Tag, type User } from '~/generated/prisma/client'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await clearTables()

  const [user] = await createUsers()

  const tags = await createTags(user)

  await createEntries(user, tags)

  console.log(`✅ Created seed`)
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
  // use the same salt and hash for both, for simplicity. password is "test"
  const hash =
    'd670d3b3d9fa8267d944010df5dcfa6e74905d0f676ede0f5bc7fa2ff88ee5a7e521cbf4cbd9c59454bbae6b27986df1e010476116e989eacf865d534f9b5212'
  const salt = '705cd5113fcbe2ccd6c44ad242fc7ec7'
  // TODO: sign users up using better auth instead of manually inserting them
  return prisma.user.createManyAndReturn({
    data: [
      { id: '1', name: 'test', email: 'test@email.com' },
      { id: '2', name: faker.person.firstName(), email: 'test2@email.com' },
    ],
  })
}

async function createTags(user: User) {
  return prisma.tag.createManyAndReturn({
    data: Array.from({ length: 5 }, (_v, k) => k + 1).map((id) => ({
      id,
      text: faker.word.noun(),
      userId: user.id,
    })),
  })
}

async function createEntries(user: User, allTags: Tag[]) {
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
        authorId: user.id,
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
