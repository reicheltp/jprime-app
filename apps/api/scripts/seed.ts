import { randomUUID } from 'node:crypto'
import { db } from '../src/db/index'

const DEMO_ATTENDEES = [
  { email: 'georgi.ivanov@demo.jprime.io' },
  { email: 'maria.petrova@demo.jprime.io' },
  { email: 'dimitar.kovachev@demo.jprime.io' },
  { email: 'elena.stoyanova@demo.jprime.io' },
  { email: 'nikolay.georgiev@demo.jprime.io' },
  { email: 'anna.dimitrova@demo.jprime.io' },
  { email: 'stefan.nikolov@demo.jprime.io' },
  { email: 'iva.todorova@demo.jprime.io' },
  { email: 'petar.hristov@demo.jprime.io' },
  { email: 'yoana.mihaylova@demo.jprime.io' },
  { email: 'alice.mueller@demo.jprime.io' },
  { email: 'bob.vandenberg@demo.jprime.io' },
  { email: 'carlos.reyes@demo.jprime.io' },
  { email: 'diana.popescu@demo.jprime.io' },
  { email: 'evan.walsh@demo.jprime.io' },
  { email: 'fatima.alhassan@demo.jprime.io' },
  { email: 'gregor.novak@demo.jprime.io' },
  { email: 'hana.svobodova@demo.jprime.io' },
  { email: 'ivan.petrov@demo.jprime.io' },
  { email: 'jana.horvatova@demo.jprime.io' },
]

const countBefore = db.query<{ n: number }, []>(
  'SELECT COUNT(*) as n FROM users'
).get()?.n ?? 0

const insert = db.prepare(
  'INSERT OR IGNORE INTO users (id, email, created_at) VALUES (?, ?, ?)'
)

const now = Date.now()
for (const { email } of DEMO_ATTENDEES) {
  insert.run(randomUUID(), email, now)
}

const countAfter = db.query<{ n: number }, []>(
  'SELECT COUNT(*) as n FROM users'
).get()?.n ?? 0

const inserted = countAfter - countBefore
const skipped = DEMO_ATTENDEES.length - inserted

console.log('\nSeed complete')
console.log(`  ${inserted} demo attendees inserted`)
if (skipped > 0) console.log(`  ${skipped} already existed (skipped)`)
console.log(`  Total users in DB: ${countAfter}\n`)
