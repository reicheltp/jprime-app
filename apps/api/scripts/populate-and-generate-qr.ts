import { randomUUID } from 'node:crypto'
import { db } from '../src/db/index'

// Characters allowed in connection codes (excluding similar-looking: 0,1,O,I,L)
const CONNECT_CODE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const CONNECT_CODE_LENGTH = 5

function generateConnectCode(): string {
  let code = ''
  for (let i = 0; i < CONNECT_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CONNECT_CODE_CHARS.length)
    code += CONNECT_CODE_CHARS[randomIndex]
  }
  return code
}

// Demo attendees with full profile data
const DEMO_ATTENDEES = [
  { email: 'georgi.ivanov@demo.jprime.io',    displayName: 'Georgi Ivanov',     company: 'Sofia Tech Labs',               bio: 'Backend engineer obsessed with distributed systems and event-driven architecture.',           avatarUrl: 'https://i.pravatar.cc/150?u=georgi-ivanov', linkedinUrl: 'https://linkedin.com/in/georgi-ivanov',     githubUrl: 'https://github.com/givanov' },
  { email: 'maria.petrova@demo.jprime.io',    displayName: 'Maria Petrova',     company: 'Musala Soft',                   bio: 'Java champion & conference speaker. Strong opinions about clean code, loosely held.',      avatarUrl: 'https://i.pravatar.cc/150?u=maria-petrova', linkedinUrl: 'https://linkedin.com/in/maria-petrova',     twitterUrl: 'https://x.com/mariapetrova' },
  { email: 'dimitar.kovachev@demo.jprime.io', displayName: 'Dimitar Kovachev',  company: 'Proxiad Bulgaria',              bio: 'DevOps / platform engineering. Kubernetes at scale, GitOps, and way too much YAML.',            avatarUrl: 'https://i.pravatar.cc/150?u=dimitar-kovachev', githubUrl: 'https://github.com/dkovachev',                websiteUrl: 'https://dkovachev.dev' },
  { email: 'elena.stoyanova@demo.jprime.io',  displayName: 'Elena Stoyanova',   company: 'Progress Software',            bio: 'Full-stack dev by day, open-source contributor by night. Fan of reactive streams.',              avatarUrl: 'https://i.pravatar.cc/150?u=elena-stoyanova', linkedinUrl: 'https://linkedin.com/in/elena-stoyanova' },
  { email: 'nikolay.georgiev@demo.jprime.io', displayName: 'Nikolay Georgiev',  company: 'Telerik (part of Infragistics)', bio: 'Mobile & React Native developer. If it runs on a phone, I probably broke it first.',  avatarUrl: 'https://i.pravatar.cc/150?u=nikolay-georgiev', twitterUrl: 'https://x.com/ngeorgiev_dev',                githubUrl: 'https://github.com/ngeorgiev' },
  { email: 'anna.dimitrova@demo.jprime.io',   displayName: 'Anna Dimitrova',    company: 'Chaos Group',                  bio: 'Rendering engineer. Turns math into photons. Also does micro-optimisation for fun.',             avatarUrl: 'https://i.pravatar.cc/150?u=anna-dimitrova', linkedinUrl: 'https://linkedin.com/in/anna-dimitrova' },
  { email: 'stefan.nikolov@demo.jprime.io',   displayName: 'Stefan Nikolov',    company: 'SumUp',                        bio: 'Payments infrastructure engineer. Highly allergic to eventual consistency bugs.',               avatarUrl: 'https://i.pravatar.cc/150?u=stefan-nikolov', githubUrl: 'https://github.com/snikolov',                 websiteUrl: 'https://stefannikolov.io' },
  { email: 'iva.todorova@demo.jprime.io',     displayName: 'Iva Todorova',      company: 'Limeade',                      bio: 'Data engineer and ML enthusiast. Turning raw logs into business insights since 2017.',           avatarUrl: 'https://i.pravatar.cc/150?u=iva-todorova', linkedinUrl: 'https://linkedin.com/in/iva-todorova',      twitterUrl: 'https://x.com/ivatodorova' },
  { email: 'petar.hristov@demo.jprime.io',    displayName: 'Petar Hristov',     company: 'SAP Labs Bulgaria',            bio: 'Cloud-native architect. Enthusiastic about eBPF, service meshes, and observability.',             avatarUrl: 'https://i.pravatar.cc/150?u=petar-hristov', githubUrl: 'https://github.com/phristov' },
  { email: 'yoana.mihaylova@demo.jprime.io',  displayName: 'Yoana Mihaylova',   company: 'Scalefocus',                   bio: 'QA engineer turned test automation lead. Advocates for shift-left testing and chaos engineering.', avatarUrl: 'https://i.pravatar.cc/150?u=yoana-mihaylova', linkedinUrl: 'https://linkedin.com/in/yoana-mihaylova' },
  { email: 'alice.mueller@demo.jprime.io',    displayName: 'Alice Müller',      company: 'Thoughtworks Germany',         bio: 'Domain-driven design practitioner. Co-organiser of DDD Berlin.',                                 avatarUrl: 'https://i.pravatar.cc/150?u=alice-mueller', linkedinUrl: 'https://linkedin.com/in/alice-mueller-ddd', websiteUrl: 'https://alicemueller.dev' },
  { email: 'bob.vandenberg@demo.jprime.io',   displayName: 'Bob van der Berg',  company: 'ING Bank',                     bio: 'Open banking and financial APIs. Author of a very niche Kafka connector you have used.',          avatarUrl: 'https://i.pravatar.cc/150?u=bob-vandenberg', githubUrl: 'https://github.com/bvandenberg',              twitterUrl: 'https://x.com/bobvdb' },
  { email: 'carlos.reyes@demo.jprime.io',     displayName: 'Carlos Reyes',      company: 'Red Hat',                      bio: 'Quarkus contributor. Makes Java feel like Go (but with generics that actually work).',            avatarUrl: 'https://i.pravatar.cc/150?u=carlos-reyes', githubUrl: 'https://github.com/carlosreyes',              websiteUrl: 'https://carlosreyes.io' },
  { email: 'diana.popescu@demo.jprime.io',    displayName: 'Diana Popescu',     company: 'Endava Romania',               bio: 'Security engineer. Finds your injection vulnerabilities before the bad guys do.',                 avatarUrl: 'https://i.pravatar.cc/150?u=diana-popescu', linkedinUrl: 'https://linkedin.com/in/diana-popescu-sec', twitterUrl: 'https://x.com/dianasec' },
  { email: 'evan.walsh@demo.jprime.io',       displayName: 'Evan Walsh',        company: 'Stripe',                       bio: 'Infrastructure reliability. Builds systems that wake other people up at 3am (but not him).',     avatarUrl: 'https://i.pravatar.cc/150?u=evan-walsh', githubUrl: 'https://github.com/ewalsh',                   websiteUrl: 'https://evanwalsh.dev' },
  { email: 'fatima.alhassan@demo.jprime.io',  displayName: 'Fatima Al-Hassan',  company: 'Booking.com',                  bio: 'A/B testing platform engineer. Has opinions about p-values and production feature flags.',         avatarUrl: 'https://i.pravatar.cc/150?u=fatima-alhassan', linkedinUrl: 'https://linkedin.com/in/fatima-alhassan',   twitterUrl: 'https://x.com/fatima_eng' },
  { email: 'gregor.novak@demo.jprime.io',     displayName: 'Gregor Novák',      company: 'Kiwi.com',                     bio: "Search & relevance engineering. Makes sure you find the cheapest flight you didn't ask for.",    avatarUrl: 'https://i.pravatar.cc/150?u=gregor-novak', githubUrl: 'https://github.com/gnovak',                   websiteUrl: 'https://gregornovak.eu' },
  { email: 'hana.svobodova@demo.jprime.io',   displayName: 'Hana Svobodová',    company: 'JetBrains',                    bio: "Developer tooling engineer. Works on the IDE you're using to read this.",                       avatarUrl: 'https://i.pravatar.cc/150?u=hana-svobodova', linkedinUrl: 'https://linkedin.com/in/hana-svobodova',    twitterUrl: 'https://x.com/hana_jb' },
  { email: 'ivan.petrov@demo.jprime.io',      displayName: 'Ivan Petrov',       company: 'Luxoft',                       bio: "Automotive software engineer. Writes code that runs faster than the car it's in.",               avatarUrl: 'https://i.pravatar.cc/150?u=ivan-petrov', githubUrl: 'https://github.com/ipetrov_automotive' },
  { email: 'jana.horvatova@demo.jprime.io',   displayName: 'Jana Horvatová',    company: 'Deutsche Telekom IT',          bio: 'Telco cloud engineer. Migrating legacy systems one microservice at a time since 2019.',           avatarUrl: 'https://i.pravatar.cc/150?u=jana-horvatova', linkedinUrl: 'https://linkedin.com/in/jana-horvatova',    websiteUrl: 'https://janahorvatova.dev' },
]

// Seed the database with attendees
const countBefore = db.query<{ n: number }, []>('SELECT COUNT(*) as n FROM users').get()?.n ?? 0

const insertStmt = db.prepare(
  'INSERT OR IGNORE INTO users (id, email, created_at) VALUES (?, ?, ?)'
)
const updateStmt = db.prepare(`
  UPDATE users SET
    display_name = ?,
    company      = ?,
    bio          = ?,
    avatar_url   = ?,
    linkedin_url = ?,
    twitter_url  = ?,
    github_url   = ?,
    website_url  = ?,
    connection_code = ?
  WHERE email = ?
`)

const now = Date.now()
for (const a of DEMO_ATTENDEES) {
  const connectionCode = generateConnectCode()
  insertStmt.run(randomUUID(), a.email, now)
  updateStmt.run(
    a.displayName ?? null,
    a.company ?? null,
    a.bio ?? null,
    a.avatarUrl ?? null,
    a.linkedinUrl ?? null,
    a.twitterUrl ?? null,
    a.githubUrl ?? null,
    a.websiteUrl ?? null,
    connectionCode,
    a.email,
  )
}

const countAfter = db.query<{ n: number }, []>('SELECT COUNT(*) as n FROM users').get()?.n ?? 0
const inserted = countAfter - countBefore
const updated = DEMO_ATTENDEES.length - inserted

console.log('\n=== Database Population Complete ===')
if (inserted > 0) console.log(`✓ ${inserted} demo attendees created`)
if (updated > 0)  console.log(`✓ ${updated} existing attendees profile data refreshed`)
console.log(`✓ Total users in DB: ${countAfter}\n`)

// Generate example QR codes as data URLs
console.log('=== Example QR Codes (Data URLs) ===\n')

// QR code format: JPRIME_CONN:{"email":"...","displayName":"..."}
const QR_PREFIX = 'JPRIME_CONN:'

function generateQRCodeContent(email: string, displayName: string): string {
  return `${QR_PREFIX}${JSON.stringify({ email, displayName })}`
}

// Select 3 sample attendees for QR code generation
const sampleAttendees = [
  DEMO_ATTENDEES[0], // Georgi Ivanov
  DEMO_ATTENDEES[1], // Maria Petrova
  DEMO_ATTENDEES[2], // Dimitar Kovachev
]

console.log('Sample QR Codes for testing connections:\n')
sampleAttendees.forEach((attendee, index) => {
  const qrContent = generateQRCodeContent(attendee.email, attendee.displayName)
  console.log(`${index + 1}. ${attendee.displayName}`)
  console.log(`   Email: ${attendee.email}`)
  console.log(`   QR Content: ${qrContent}`)
  console.log(`   Full URL for testing: https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrContent)}\n`)
})

console.log('To use these QR codes:')
console.log('- Open the URLs above in a browser to see the QR code images')
console.log('- Scan with the app\'s QR scanner')
console.log('- Or use any QR code generator with the QR Content as input')
console.log('\nDatabase and QR examples ready!\n')
