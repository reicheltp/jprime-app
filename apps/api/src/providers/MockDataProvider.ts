import type { Session, Speaker } from '@jprime/types'
import type { DataProvider } from './DataProvider'

const SESSIONS: Session[] = [
  // Day 1 — 2026-05-29
  {
    id: 'session-001',
    title: 'Opening Keynote: The Future of JVM Languages',
    type: 'keynote',
    track: null,
    room: 'Hall A',
    day: '2026-05-29',
    startTime: '2026-05-29T09:00:00',
    endTime: '2026-05-29T09:45:00',
    description:
      'A look at where the JVM ecosystem is headed: virtual threads, pattern matching, value types, and the rise of polyglot development on the JVM.',
    speakers: [
      { id: 'speaker-001', name: 'Viktor Georgiev' },
      { id: 'speaker-002', name: 'Maria Kostadinova' },
    ],
  },
  {
    id: 'session-002',
    title: 'Deep Dive into Virtual Threads in Java 21',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-29',
    startTime: '2026-05-29T10:00:00',
    endTime: '2026-05-29T10:45:00',
    description:
      'Virtual threads (Project Loom) change the concurrency model in Java. We explore performance characteristics, migration patterns, and common pitfalls when adopting virtual threads in existing codebases.',
    speakers: [{ id: 'speaker-003', name: 'Stefan Ivanov' }],
  },
  {
    id: 'session-003',
    title: 'Kotlin Coroutines in Practice',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-29',
    startTime: '2026-05-29T10:00:00',
    endTime: '2026-05-29T10:45:00',
    description:
      'Beyond the basics: structured concurrency, coroutine context, error propagation, and testing strategies for real-world Kotlin coroutine code.',
    speakers: [{ id: 'speaker-004', name: 'Elena Petrova' }],
  },
  {
    id: 'session-004',
    title: 'Building REST APIs with Spring Boot 3',
    type: 'workshop',
    track: 'Workshop',
    room: 'Workshop Room',
    day: '2026-05-29',
    startTime: '2026-05-29T10:00:00',
    endTime: '2026-05-29T12:00:00',
    description:
      'Hands-on workshop: build a production-ready REST API from scratch using Spring Boot 3, Spring Security 6, and Spring Data JPA. Bring your laptop.',
    speakers: [{ id: 'speaker-005', name: 'Dimitar Todorov' }],
  },
  {
    id: 'session-005',
    title: 'GraalVM Native Image for Microservices',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-29',
    startTime: '2026-05-29T11:00:00',
    endTime: '2026-05-29T11:45:00',
    description:
      'Compile your JVM application to a native binary with GraalVM. We cover configuration, tracing agent usage, reflection metadata, and real production case studies.',
    speakers: [{ id: 'speaker-006', name: 'Ana Stoyanova' }],
  },
  {
    id: 'session-006',
    title: 'Reactive Streams with Project Reactor',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-29',
    startTime: '2026-05-29T11:00:00',
    endTime: '2026-05-29T11:45:00',
    description:
      'A practical guide to writing non-blocking, backpressure-aware code with Project Reactor. Includes real debugging techniques and common anti-patterns.',
    speakers: [{ id: 'speaker-007', name: 'Nikolay Simeonov' }],
  },
  {
    id: 'session-007',
    title: 'Lunch Break',
    type: 'break',
    track: null,
    room: 'Hall A',
    day: '2026-05-29',
    startTime: '2026-05-29T12:00:00',
    endTime: '2026-05-29T13:00:00',
    description: null,
    speakers: [],
  },
  {
    id: 'session-008',
    title: 'Event-Driven Architecture with Apache Kafka',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-29',
    startTime: '2026-05-29T13:00:00',
    endTime: '2026-05-29T13:45:00',
    description:
      'Design and implement event-driven systems using Kafka. Topics include topic design, consumer groups, exactly-once semantics, and Schema Registry.',
    speakers: [{ id: 'speaker-003', name: 'Stefan Ivanov' }],
  },
  {
    id: 'session-009',
    title: 'Cloud-Native Security Best Practices',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-29',
    startTime: '2026-05-29T13:00:00',
    endTime: '2026-05-29T13:45:00',
    description:
      'Security is not an afterthought. We examine OWASP Top 10 for cloud-native apps, secrets management, mTLS, and supply chain security with SBOM.',
    speakers: [{ id: 'speaker-008', name: 'Ralitsa Dimitrova' }],
  },
  {
    id: 'session-010',
    title: 'Kubernetes for Java Developers',
    type: 'workshop',
    track: 'Workshop',
    room: 'Workshop Room',
    day: '2026-05-29',
    startTime: '2026-05-29T13:00:00',
    endTime: '2026-05-29T15:00:00',
    description:
      'Hands-on workshop: deploy a multi-tier Java application to Kubernetes. Covers pods, services, ConfigMaps, liveness/readiness probes, and Helm charts.',
    speakers: [{ id: 'speaker-009', name: 'Georgi Apostolov' }],
  },
  {
    id: 'session-011',
    title: 'Observability with OpenTelemetry',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-29',
    startTime: '2026-05-29T14:00:00',
    endTime: '2026-05-29T14:45:00',
    description:
      'Instrument your Java services with OpenTelemetry for distributed tracing, metrics, and logs. Integration with Grafana, Jaeger, and Prometheus.',
    speakers: [{ id: 'speaker-010', name: 'Ivanka Marinova' }],
  },
  {
    id: 'session-012',
    title: 'Micronaut vs Quarkus: The Battle of Microframeworks',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-29',
    startTime: '2026-05-29T14:00:00',
    endTime: '2026-05-29T14:45:00',
    description:
      'An objective, benchmark-driven comparison of two leading cloud-native Java frameworks. When to choose each, how they handle AOT compilation, and real-world trade-offs.',
    speakers: [{ id: 'speaker-006', name: 'Ana Stoyanova' }],
  },
  {
    id: 'session-013',
    title: 'Coffee Break',
    type: 'break',
    track: null,
    room: 'Hall A',
    day: '2026-05-29',
    startTime: '2026-05-29T15:00:00',
    endTime: '2026-05-29T15:15:00',
    description: null,
    speakers: [],
  },
  {
    id: 'session-014',
    title: 'Testing Strategies for Cloud-Native Applications',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-29',
    startTime: '2026-05-29T15:15:00',
    endTime: '2026-05-29T16:00:00',
    description:
      'Unit, integration, contract, and end-to-end testing for microservices. Covers Testcontainers, WireMock, Pact, and the test pyramid for distributed systems.',
    speakers: [{ id: 'speaker-005', name: 'Dimitar Todorov' }],
  },
  {
    id: 'session-015',
    title: 'Infrastructure as Code with Pulumi',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-29',
    startTime: '2026-05-29T15:15:00',
    endTime: '2026-05-29T16:00:00',
    description:
      'Manage cloud infrastructure using real programming languages with Pulumi. Compare to Terraform, explore multi-cloud scenarios, and write testable infrastructure code.',
    speakers: [{ id: 'speaker-007', name: 'Nikolay Simeonov' }],
  },
  {
    id: 'session-016',
    title: 'Day 1 Closing Panel: Modern Software Development Trends',
    type: 'keynote',
    track: null,
    room: 'Hall A',
    day: '2026-05-29',
    startTime: '2026-05-29T16:15:00',
    endTime: '2026-05-29T17:00:00',
    description:
      'A panel discussion with speakers reflecting on the biggest trends shaping software development: AI assistance, platform engineering, FinOps, and developer experience.',
    speakers: [
      { id: 'speaker-001', name: 'Viktor Georgiev' },
      { id: 'speaker-004', name: 'Elena Petrova' },
      { id: 'speaker-008', name: 'Ralitsa Dimitrova' },
    ],
  },

  // Day 2 — 2026-05-30
  {
    id: 'session-017',
    title: 'Opening Day 2: AI and Developer Productivity',
    type: 'keynote',
    track: null,
    room: 'Hall A',
    day: '2026-05-30',
    startTime: '2026-05-30T09:00:00',
    endTime: '2026-05-30T09:45:00',
    description:
      'How AI is reshaping the developer workflow: code generation, intelligent refactoring, automated code review, and where human judgement still wins.',
    speakers: [{ id: 'speaker-002', name: 'Maria Kostadinova' }],
  },
  {
    id: 'session-018',
    title: 'AI-Assisted Development with JetBrains AI',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-30',
    startTime: '2026-05-30T10:00:00',
    endTime: '2026-05-30T10:45:00',
    description:
      'A practical look at integrating JetBrains AI into your daily workflow. Live demo: generating boilerplate, writing tests, explaining legacy code, and refactoring with AI suggestions.',
    speakers: [{ id: 'speaker-009', name: 'Georgi Apostolov' }],
  },
  {
    id: 'session-019',
    title: 'Functional Programming in Java',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-30',
    startTime: '2026-05-30T10:00:00',
    endTime: '2026-05-30T10:45:00',
    description:
      'Applying functional programming principles in Java: immutability, higher-order functions, sealed types, pattern matching, and the functional interfaces in the JDK.',
    speakers: [{ id: 'speaker-010', name: 'Ivanka Marinova' }],
  },
  {
    id: 'session-020',
    title: 'Advanced Kubernetes Patterns',
    type: 'workshop',
    track: 'Workshop',
    room: 'Workshop Room',
    day: '2026-05-30',
    startTime: '2026-05-30T10:00:00',
    endTime: '2026-05-30T12:00:00',
    description:
      'Go beyond basic Kubernetes: custom operators with the Operator SDK, admission webhooks, RBAC deep-dive, and zero-downtime deployments. Hands-on with a live cluster.',
    speakers: [{ id: 'speaker-004', name: 'Elena Petrova' }],
  },
  {
    id: 'session-021',
    title: 'Spring AI: Building LLM-Powered Applications',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-30',
    startTime: '2026-05-30T11:00:00',
    endTime: '2026-05-30T11:45:00',
    description:
      'Spring AI provides abstractions for integrating large language models into Spring applications. Build RAG pipelines, function-calling agents, and structured output parsers.',
    speakers: [{ id: 'speaker-001', name: 'Viktor Georgiev' }],
  },
  {
    id: 'session-022',
    title: 'Database Performance Tuning for Java Apps',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-30',
    startTime: '2026-05-30T11:00:00',
    endTime: '2026-05-30T11:45:00',
    description:
      'Diagnosing and fixing slow queries in Java applications: EXPLAIN plans, N+1 detection, connection pool tuning, read replicas, and caching strategies with Redis.',
    speakers: [{ id: 'speaker-006', name: 'Ana Stoyanova' }],
  },
  {
    id: 'session-023',
    title: 'Lunch Break',
    type: 'break',
    track: null,
    room: 'Hall A',
    day: '2026-05-30',
    startTime: '2026-05-30T12:00:00',
    endTime: '2026-05-30T13:00:00',
    description: null,
    speakers: [],
  },
  {
    id: 'session-024',
    title: 'Designing for Failure: Chaos Engineering',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-30',
    startTime: '2026-05-30T13:00:00',
    endTime: '2026-05-30T13:45:00',
    description:
      'Build resilient systems by deliberately breaking them. Introduction to Chaos Monkey, Litmus, and GameDay practices for Java microservices.',
    speakers: [{ id: 'speaker-008', name: 'Ralitsa Dimitrova' }],
  },
  {
    id: 'session-025',
    title: 'GraphQL with Spring for GraphQL',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-30',
    startTime: '2026-05-30T13:00:00',
    endTime: '2026-05-30T13:45:00',
    description:
      'Build type-safe GraphQL APIs with Spring for GraphQL. Schema-first design, data fetchers, subscriptions, and the n+1 problem solved with DataLoader.',
    speakers: [{ id: 'speaker-005', name: 'Dimitar Todorov' }],
  },
  {
    id: 'session-026',
    title: 'Reactive Programming Workshop',
    type: 'workshop',
    track: 'Workshop',
    room: 'Workshop Room',
    day: '2026-05-30',
    startTime: '2026-05-30T13:00:00',
    endTime: '2026-05-30T15:00:00',
    description:
      'Hands-on: build a reactive pipeline from HTTP ingestion to database persistence using Spring WebFlux and R2DBC. No prior reactive experience required.',
    speakers: [{ id: 'speaker-007', name: 'Nikolay Simeonov' }],
  },
  {
    id: 'session-027',
    title: 'Serverless Java on AWS Lambda',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-30',
    startTime: '2026-05-30T14:00:00',
    endTime: '2026-05-30T14:45:00',
    description:
      'Tame cold starts and optimise Java Lambdas with SnapStart, GraalVM native, and Quarkus. Real cost and performance benchmarks from production.',
    speakers: [{ id: 'speaker-003', name: 'Stefan Ivanov' }],
  },
  {
    id: 'session-028',
    title: 'Continuous Delivery with GitHub Actions',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-30',
    startTime: '2026-05-30T14:00:00',
    endTime: '2026-05-30T14:45:00',
    description:
      'Full CI/CD pipeline for Java applications on GitHub Actions: matrix builds, dependency caching, container publishing, automated releases, and environment promotion gates.',
    speakers: [{ id: 'speaker-009', name: 'Georgi Apostolov' }],
  },
  {
    id: 'session-029',
    title: 'Coffee Break',
    type: 'break',
    track: null,
    room: 'Hall A',
    day: '2026-05-30',
    startTime: '2026-05-30T15:00:00',
    endTime: '2026-05-30T15:15:00',
    description: null,
    speakers: [],
  },
  {
    id: 'session-030',
    title: 'Jakarta EE 11: What\'s New',
    type: 'talk',
    track: 'Track 1',
    room: 'Hall A',
    day: '2026-05-30',
    startTime: '2026-05-30T15:15:00',
    endTime: '2026-05-30T16:00:00',
    description:
      'Jakarta EE 11 brings significant updates to CDI, Jakarta REST, Jakarta Persistence, and introduces new specifications. A practical overview for enterprise Java developers.',
    speakers: [{ id: 'speaker-010', name: 'Ivanka Marinova' }],
  },
  {
    id: 'session-031',
    title: 'WebAssembly for Java Developers',
    type: 'talk',
    track: 'Track 2',
    room: 'Hall B',
    day: '2026-05-30',
    startTime: '2026-05-30T15:15:00',
    endTime: '2026-05-30T16:00:00',
    description:
      'Compile Java to WebAssembly with TeaVM and CheerpJ. Run Java in the browser, share code between frontend and backend, and explore the WASI standard.',
    speakers: [{ id: 'speaker-002', name: 'Maria Kostadinova' }],
  },
  {
    id: 'session-032',
    title: 'Closing Keynote & Community Awards',
    type: 'keynote',
    track: null,
    room: 'Hall A',
    day: '2026-05-30',
    startTime: '2026-05-30T16:15:00',
    endTime: '2026-05-30T17:00:00',
    description:
      'Closing remarks, community award ceremony, and a look ahead to JPrime 2027. Thank you for being part of the JPrime community!',
    speakers: [{ id: 'speaker-001', name: 'Viktor Georgiev' }],
  },
]

function buildSpeakers(): Speaker[] {
  const specs: Omit<Speaker, 'sessions'>[] = [
    {
      id: 'speaker-001',
      firstName: 'Viktor',
      lastName: 'Georgiev',
      fullName: 'Viktor Georgiev',
      bio: 'Viktor is a Java Champion and senior engineer with 15 years of experience building large-scale distributed systems. He has contributed to several open-source JVM projects and speaks regularly at international conferences about concurrency, performance, and modern Java.',
      photoUrl: null,
    },
    {
      id: 'speaker-002',
      firstName: 'Maria',
      lastName: 'Kostadinova',
      fullName: 'Maria Kostadinova',
      bio: 'Maria leads the platform engineering team at a Sofia-based fintech company. She is a Google Developer Expert for Cloud and an advocate for DevOps culture, infrastructure automation, and observability-driven development.',
      photoUrl: null,
    },
    {
      id: 'speaker-003',
      firstName: 'Stefan',
      lastName: 'Ivanov',
      fullName: 'Stefan Ivanov',
      bio: 'Stefan is a software architect specialising in event-driven systems and stream processing. He has architected Kafka-based pipelines processing billions of events daily and is passionate about teaching distributed systems concepts through practical examples.',
      photoUrl: null,
    },
    {
      id: 'speaker-004',
      firstName: 'Elena',
      lastName: 'Petrova',
      fullName: 'Elena Petrova',
      bio: 'Elena is a Kotlin GDE and senior developer at JetBrains. She focuses on language design, coroutines internals, and building tooling for modern Kotlin development. Author of several widely-read articles on structured concurrency.',
      photoUrl: null,
    },
    {
      id: 'speaker-005',
      firstName: 'Dimitar',
      lastName: 'Todorov',
      fullName: 'Dimitar Todorov',
      bio: 'Dimitar is a Spring Framework committer and Java enthusiast with a passion for clean code and test-driven development. He runs workshops across Europe helping teams adopt modern testing practices and get the most out of the Spring ecosystem.',
      photoUrl: null,
    },
    {
      id: 'speaker-006',
      firstName: 'Ana',
      lastName: 'Stoyanova',
      fullName: 'Ana Stoyanova',
      bio: 'Ana is a GraalVM specialist and performance engineer. She has migrated production workloads from JVM to native image at two unicorn startups, and is a frequent contributor to GraalVM documentation and community forums.',
      photoUrl: null,
    },
    {
      id: 'speaker-007',
      firstName: 'Nikolay',
      lastName: 'Simeonov',
      fullName: 'Nikolay Simeonov',
      bio: 'Nikolay is a reactive systems expert and the author of a popular online course on Project Reactor. He works as a staff engineer at a streaming media company where reactive pipelines handle millions of concurrent connections.',
      photoUrl: null,
    },
    {
      id: 'speaker-008',
      firstName: 'Ralitsa',
      lastName: 'Dimitrova',
      fullName: 'Ralitsa Dimitrova',
      bio: 'Ralitsa is a cloud security engineer and CNCF ambassador. She is deeply involved in the Kubernetes security community, a maintainer of several security-focused open-source tools, and a regular speaker on supply chain security and zero-trust architecture.',
      photoUrl: null,
    },
    {
      id: 'speaker-009',
      firstName: 'Georgi',
      lastName: 'Apostolov',
      fullName: 'Georgi Apostolov',
      bio: 'Georgi is a Kubernetes and cloud-native consultant who has helped dozens of teams adopt container orchestration in production. He is a CKA-certified trainer and enjoys making complex infrastructure concepts accessible through hands-on workshops.',
      photoUrl: null,
    },
    {
      id: 'speaker-010',
      firstName: 'Ivanka',
      lastName: 'Marinova',
      fullName: 'Ivanka Marinova',
      bio: 'Ivanka is a Java EE/Jakarta EE expert and member of the Jakarta EE specification committee. She has over a decade of experience building enterprise applications and is passionate about standards, interoperability, and the future of enterprise Java.',
      photoUrl: null,
    },
  ]

  return specs.map((spec) => {
    const speakerSessions = SESSIONS.filter(
      (s) => s.type !== 'break' && s.speakers.some((sr) => sr.id === spec.id)
    ).map(
      (s): import('@jprime/types').SessionRef => ({
        id: s.id,
        title: s.title,
        day: s.day,
        startTime: s.startTime,
      })
    )
    return { ...spec, sessions: speakerSessions }
  })
}

const SPEAKERS = buildSpeakers()

export class MockDataProvider implements DataProvider {
  async getSessions(): Promise<Session[]> {
    return SESSIONS
  }

  async getSession(id: string): Promise<Session | null> {
    return SESSIONS.find((s) => s.id === id) ?? null
  }

  async getSpeakers(): Promise<Speaker[]> {
    return SPEAKERS
  }

  async getSpeaker(id: string): Promise<Speaker | null> {
    return SPEAKERS.find((s) => s.id === id) ?? null
  }
}
