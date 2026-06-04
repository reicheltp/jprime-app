import { randomUUID } from 'node:crypto'
import { db } from '../src/db/index'

const DEMO_ATTENDEES = [
  { email: 'georgi.ivanov@demo.jprime.io',    displayName: 'Georgi Ivanov',     company: 'Sofia Tech Labs',               bio: 'Backend engineer obsessed with distributed systems and event-driven architecture.',           linkedin: 'https://linkedin.com/in/georgi-ivanov',     github: 'https://github.com/givanov' },
  { email: 'maria.petrova@demo.jprime.io',    displayName: 'Maria Petrova',     company: 'Musala Soft',                   bio: 'Java champion & conference speaker. Strong opinions about clean code, loosely held.',      linkedin: 'https://linkedin.com/in/maria-petrova',     twitter: 'https://x.com/mariapetrova' },
  { email: 'dimitar.kovachev@demo.jprime.io', displayName: 'Dimitar Kovachev',  company: 'Proxiad Bulgaria',              bio: 'DevOps / platform engineering. Kubernetes at scale, GitOps, and way too much YAML.',            github: 'https://github.com/dkovachev',                website: 'https://dkovachev.dev' },
  { email: 'elena.stoyanova@demo.jprime.io',  displayName: 'Elena Stoyanova',   company: 'Progress Software',            bio: 'Full-stack dev by day, open-source contributor by night. Fan of reactive streams.',              linkedin: 'https://linkedin.com/in/elena-stoyanova' },
  { email: 'nikolay.georgiev@demo.jprime.io', displayName: 'Nikolay Georgiev',  company: 'Telerik (part of Infragistics)', bio: 'Mobile & React Native developer. If it runs on a phone, I probably broke it first.',  twitter: 'https://x.com/ngeorgiev_dev',                github: 'https://github.com/ngeorgiev' },
  { email: 'anna.dimitrova@demo.jprime.io',   displayName: 'Anna Dimitrova',    company: 'Chaos Group',                  bio: 'Rendering engineer. Turns math into photons. Also does micro-optimisation for fun.',             linkedin: 'https://linkedin.com/in/anna-dimitrova' },
  { email: 'stefan.nikolov@demo.jprime.io',   displayName: 'Stefan Nikolov',    company: 'SumUp',                        bio: 'Payments infrastructure engineer. Highly allergic to eventual consistency bugs.',               github: 'https://github.com/snikolov',                 website: 'https://stefannikolov.io' },
  { email: 'iva.todorova@demo.jprime.io',     displayName: 'Iva Todorova',      company: 'Limeade',                      bio: 'Data engineer and ML enthusiast. Turning raw logs into business insights since 2017.',           linkedin: 'https://linkedin.com/in/iva-todorova',      twitter: 'https://x.com/ivatodorova' },
  { email: 'petar.hristov@demo.jprime.io',    displayName: 'Petar Hristov',     company: 'SAP Labs Bulgaria',            bio: 'Cloud-native architect. Enthusiastic about eBPF, service meshes, and observability.',             github: 'https://github.com/phristov' },
  { email: 'yoana.mihaylova@demo.jprime.io',  displayName: 'Yoana Mihaylova',   company: 'Scalefocus',                   bio: 'QA engineer turned test automation lead. Advocates for shift-left testing and chaos engineering.', linkedin: 'https://linkedin.com/in/yoana-mihaylova' },
  { email: 'alice.mueller@demo.jprime.io',    displayName: 'Alice Müller',      company: 'Thoughtworks Germany',         bio: 'Domain-driven design practitioner. Co-organiser of DDD Berlin.',                                 linkedin: 'https://linkedin.com/in/alice-mueller-ddd', website: 'https://alicemueller.dev' },
  { email: 'bob.vandenberg@demo.jprime.io',   displayName: 'Bob van der Berg',  company: 'ING Bank',                     bio: 'Open banking and financial APIs. Author of a very niche Kafka connector you have used.',          github: 'https://github.com/bvandenberg',              twitter: 'https://x.com/bobvdb' },
  { email: 'carlos.reyes@demo.jprime.io',     displayName: 'Carlos Reyes',      company: 'Red Hat',                      bio: 'Quarkus contributor. Makes Java feel like Go (but with generics that actually work).',            github: 'https://github.com/carlosreyes',              website: 'https://carlosreyes.io' },
  { email: 'diana.popescu@demo.jprime.io',    displayName: 'Diana Popescu',     company: 'Endava Romania',               bio: 'Security engineer. Finds your injection vulnerabilities before the bad guys do.',                 linkedin: 'https://linkedin.com/in/diana-popescu-sec', twitter: 'https://x.com/dianasec' },
  { email: 'evan.walsh@demo.jprime.io',       displayName: 'Evan Walsh',        company: 'Stripe',                       bio: 'Infrastructure reliability. Builds systems that wake other people up at 3am (but not him).',     github: 'https://github.com/ewalsh',                   website: 'https://evanwalsh.dev' },
  { email: 'fatima.alhassan@demo.jprime.io',  displayName: 'Fatima Al-Hassan',  company: 'Booking.com',                  bio: 'A/B testing platform engineer. Has opinions about p-values and production feature flags.',         linkedin: 'https://linkedin.com/in/fatima-alhassan',   twitter: 'https://x.com/fatima_eng' },
  { email: 'gregor.novak@demo.jprime.io',     displayName: 'Gregor Novák',      company: 'Kiwi.com',                     bio: "Search & relevance engineering. Makes sure you find the cheapest flight you didn't ask for.",    github: 'https://github.com/gnovak',                   website: 'https://gregornovak.eu' },
  { email: 'hana.svobodova@demo.jprime.io',   displayName: 'Hana Svobodová',    company: 'JetBrains',                    bio: "Developer tooling engineer. Works on the IDE you're using to read this.",                       linkedin: 'https://linkedin.com/in/hana-svobodova',    twitter: 'https://x.com/hana_jb' },
  { email: 'ivan.petrov@demo.jprime.io',      displayName: 'Ivan Petrov',       company: 'Luxoft',                       bio: "Automotive software engineer. Writes code that runs faster than the car it's in.",               github: 'https://github.com/ipetrov_automotive' },
  { email: 'jana.horvatova@demo.jprime.io',   displayName: 'Jana Horvatová',    company: 'Deutsche Telekom IT',          bio: 'Telco cloud engineer. Migrating legacy systems one microservice at a time since 2019.',           linkedin: 'https://linkedin.com/in/jana-horvatova',    website: 'https://janahorvatova.dev' },
]

const countBefore = db.query<{ n: number }, []>('SELECT COUNT(*) as n FROM users').get()?.n ?? 0

const insertStmt = db.prepare(
  'INSERT OR IGNORE INTO users (id, email, created_at) VALUES (?, ?, ?)'
)
const updateStmt = db.prepare(`
  UPDATE users SET
    display_name = ?,
    company      = ?,
    bio          = ?,
    linkedin_url = ?,
    twitter_url  = ?,
    github_url   = ?,
    website_url  = ?
  WHERE email = ?
`)

const now = Date.now()
for (const a of DEMO_ATTENDEES) {
  insertStmt.run(randomUUID(), a.email, now)
  updateStmt.run(
    a.displayName ?? null,
    a.company ?? null,
    a.bio ?? null,
    a.linkedin ?? null,
    a.twitter ?? null,
    a.github ?? null,
    a.website ?? null,
    a.email,
  )
}

const countAfter = db.query<{ n: number }, []>('SELECT COUNT(*) as n FROM users').get()?.n ?? 0
const inserted = countAfter - countBefore
const updated = DEMO_ATTENDEES.length - inserted

console.log('\nSeed complete')
if (inserted > 0) console.log(`  ${inserted} demo attendees created`)
if (updated > 0)  console.log(`  ${updated} existing attendees profile data refreshed`)
console.log(`  Total users in DB: ${countAfter}\n`)
