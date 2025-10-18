---
description: "Task list generated from Del Carmen Consulting website rebuild design documents"
---

# Tasks: Del Carmen Consulting Website Rebuild

**Input**: Design documents from `/specs/001-dcc-website-rebuild/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are requested (test-first workflow mandated in plan.md and spec.md). Write tests before implementation tasks in each user story phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish tri-workspace monorepo skeleton and baseline repository configuration.

- [X] T001 Configure pnpm workspace in `package.json` and `pnpm-workspace.yaml` to register `web-app`, `ui-library`, and `cms-schemas` packages with aggregate `lint`, `typecheck`, `test`, and `build` scripts.
- [X] T002 Initialize Next.js App Router workspace under `web-app/` (create `web-app/package.json`, `web-app/next.config.mjs`, `web-app/app/page.tsx`, `web-app/tsconfig.json`, and supporting directories).
- [X] T003 Initialize Chakra component workspace under `ui-library/` (create `ui-library/package.json`, `ui-library/tsconfig.json`, `ui-library/src/index.ts`, and placeholder `README.md`).
- [X] T004 Initialize Sanity schema workspace under `cms-schemas/` (create `cms-schemas/package.json`, `cms-schemas/tsconfig.json`, `cms-schemas/src/schemas/index.ts`, and `cms-schemas/cli/index.ts` stubs).
- [X] T005 Create repository-level config files (`.gitignore`, `.editorconfig`, `.nvmrc`, `.env.example`) aligned with Node.js 18, pnpm 9, and Sanity credential patterns referenced in quickstart.md.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Establish shared TypeScript configuration (`tsconfig.base.json`, update `web-app/tsconfig.json`, `ui-library/tsconfig.json`, `cms-schemas/tsconfig.json`) with path aliases for cross-package imports.
- [X] T007 Configure linting and formatting (`.eslintrc.cjs`, `web-app/.eslintrc.cjs`, `ui-library/.eslintrc.cjs`, `prettier.config.cjs`, `.lintstagedrc.json`) and hook scripts in root `package.json`.
- [X] T008 Configure testing harness (`jest.config.ts`, `web-app/jest.config.ts`, `ui-library/jest.config.ts`, `web-app/tests/setupTests.ts`, `playwright.config.ts`) supporting Jest + RTL + Playwright per research.md.
- [X] T009 Implement Chakra theme scaffold in `ui-library/src/theme/index.ts` with WCAG-compliant color tokens, typography scale, and reduced-motion helpers.
- [X] T010 Wire Chakra provider and global layout in `web-app/app/layout.tsx` and `web-app/app/providers.tsx` to consume `ui-library` theme, fonts, and metadata defaults.
- [X] T011 Implement Sanity client wrapper in `web-app/lib/sanity/client.ts` with cached server-side client, GROQ helper, and environment guards.
- [X] T012 Define shared CMS TypeScript types in `ui-library/src/types/cms.ts` (Agency, Service, CaseStudy, Testimonial, SiteSettings, ContactSubmission) generated from data-model.md.
- [X] T013 Author Sanity schema modules (`cms-schemas/src/schemas/siteSettings.ts`, `service.ts`, `caseStudy.ts`, `testimonial.ts`, `people.ts`, `agency.ts`) exporting base fields, validation, and status toggles.
- [X] T014 Scaffold CLI entry points per contracts (`web-app/package.json` scripts, `ui-library/package.json` scripts, `cms-schemas/package.json` scripts, and `docs/CLI.md`) matching command names and `--json` expectations.

**Checkpoint**: Foundation ready—user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Agency Leader Discovers Services (Priority: P1) 🎯 MVP

**Goal**: Present compelling Home and Services experiences that explain DCC’s mission, offerings, proof points, and credibility.

**Independent Test**: Navigate the Home and Services pages, read service details, and access supporting proof points (metrics, testimonials) without friction.

### Tests for User Story 1 (write first; ensure red state) ⚠️

- [X] T015 [P] [US1] Create unit tests for Hero and StatStrip components in `ui-library/tests/unit/hero-statstrip.spec.tsx` covering semantic structure, theming, and reduced-motion handling.
- [X] T016 [P] [US1] Create unit tests for ServiceCard and TestimonialCarousel in `ui-library/tests/unit/service-testimonial.spec.tsx` validating accessibility, keyboard focus, and permission toggles.
- [X] T017 [P] [US1] Create integration test in `web-app/tests/integration/home-services.spec.tsx` to verify GROQ data hydration, ISR props, and fallback handling for missing case studies.
- [X] T018 [P] [US1] Create Playwright journey `web-app/tests/e2e/home-services.spec.ts` covering Home hero scan, services navigation, and testimonial visibility.

### Implementation for User Story 1

- [X] T019 [P] [US1] Implement `ui-library/src/components/Hero/Hero.tsx` and `Hero.testable.tsx` variants with mission messaging, CTA slots, and reduced-motion animation guard.
- [X] T020 [P] [US1] Implement `ui-library/src/components/StatStrip/StatStrip.tsx` with responsive metrics, aria-labels, and theme token defaults.
- [X] T021 [P] [US1] Implement `ui-library/src/components/ServiceCard/ServiceCard.tsx` and `ui-library/src/components/Testimonial/TestimonialCarousel.tsx` with permission-aware rendering.
- [X] T022 [P] [US1] Create GROQ queries and helpers in `web-app/lib/queries/marketing.ts` returning SiteSettings, Hero, Services, Testimonials with typed responses.
- [X] T023 [US1] Build Home route in `web-app/app/(marketing)/page.tsx` composing Hero, StatStrip, Service highlights, and testimonials with ISR revalidation logic.
- [X] T024 [US1] Build Services index route in `web-app/app/(marketing)/services/page.tsx` with service listing, case study callouts, and CTA banner.
- [X] T025 [US1] Build dynamic service detail route in `web-app/app/(marketing)/services/[slug]/page.tsx` rendering methodology, FAQs, related case studies, and testimonial proofs.
- [X] T026 [US1] Implement marketing SEO helpers in `web-app/lib/seo/marketing.ts` supplying JSON-LD, open graph tags, and canonical URLs for Home and Services.

**Checkpoint**: User Story 1 delivers a production-ready marketing surface with reusable UI primitives and data fetching.

---

## Phase 4: User Story 2 - Compliance Officer Reviews Data Services (Priority: P1)

**Goal**: Demonstrate compliance rigor via data-rich service pages and an interactive agency map showcasing engagements.

**Independent Test**: Visit the Bias-Free Policing and Data Analytics pages, verify compliance messaging, and consume structured data about audits and reporting cadence.

### Tests for User Story 2 (write first; ensure red state) ⚠️

- [X] T027 [P] [US2] Create unit tests for map filter store in `web-app/tests/unit/map-store.spec.ts` validating filter combinations, permission gating, and empty states.
- [X] T028 [P] [US2] Create unit tests for `ui-library/src/components/InteractiveMap/InteractiveMap.tsx` covering keyboard controls, motion preferences, and clustering fallbacks.
- [X] T029 [P] [US2] Create integration test in `web-app/tests/integration/bias-free-page.spec.tsx` verifying GROQ data, compliance highlights, and FAQ rendering.
- [X] T030 [P] [US2] Create Playwright spec `web-app/tests/e2e/map-filter.spec.ts` validating map filter interactions, SSR hydration, and list fallback.

### Implementation for User Story 2

- [X] T031 [P] [US2] Implement map data utilities in `web-app/lib/map/buildAgencyGeoJSON.ts` aggregating Agency documents, permission flags, and engagement filters.
- [X] T032 [P] [US2] Implement `ui-library/src/components/InteractiveMap/InteractiveMap.tsx` with React Leaflet, accessible controls, clustering, and reduced-motion adaptors.
- [X] T033 [P] [US2] Implement `ui-library/src/components/ComplianceHighlights/ComplianceHighlights.tsx` summarizing audit cadence, SB 1074 references, and CTA links.
- [X] T034 [US2] Build Bias-Free Policing route `web-app/app/(marketing)/services/bias-free-policing/page.tsx` integrating map, compliance highlights, and testimonial evidence.
- [X] T035 [US2] Build Data Analytics route `web-app/app/(marketing)/services/data-analytics/page.tsx` with metric grids, methodology tabs, and map-filter CTA.
- [X] T036 [US2] Implement map data API route `web-app/app/api/agency-map/route.ts` exposing filtered geo data with caching and rate limiting.
- [X] T037 [US2] Implement Sanity custom input `cms-schemas/src/components/geoCoordinateInput.tsx` with validation and preview for agency coordinates.
- [X] T038 [US2] Enhance `cms-schemas/src/schemas/agency.ts` with map display toggles, engagement type enums, and permission-based projections.

**Checkpoint**: User Story 2 equips compliance audiences with data-backed evidence and interactive exploration.

---

## Phase 5: User Story 3 - Prospect Initiates Contact (Priority: P2)

**Goal**: Deliver a multi-step contact flow with validation, spam controls, and Sanity persistence.

**Independent Test**: Complete the contact form flow, receive confirmation, and trigger the proper notifications/storage.

### Tests for User Story 3 (write first; ensure red state) ⚠️

- [X] T039 [P] [US3] Create unit tests for contact form wizard in `ui-library/tests/unit/contact-form-wizard.spec.tsx` covering step transitions, validation states, and keyboard navigation.
- [X] T040 [P] [US3] Create integration test in `web-app/tests/integration/contact-route.spec.ts` exercising Zod schema, honeypot failure, and Sanity mutation error handling.
- [X] T041 [P] [US3] Create Playwright journey `web-app/tests/e2e/contact-form.spec.ts` covering happy path, validation errors, and spam retry guard.

### Implementation for User Story 3

- [X] T042 [P] [US3] Implement `ui-library/src/components/ContactForm/FormStepper.tsx` handling progress indicators, aria attributes, and CTA slots.
- [X] T043 [P] [US3] Implement `ui-library/src/components/ContactForm/steps/*` components (AgencyDetails, ServiceInterest, ReviewSubmit) with reusable field primitives.
- [X] T044 [US3] Implement contact validation schema in `web-app/lib/validation/contact.ts` using Zod with consent, honeypot, and rate limit constraints.
- [X] T045 [US3] Implement route handler `web-app/app/api/contact/route.ts` persisting to Sanity with restricted token and returning structured JSON responses.
- [X] T046 [US3] Implement Sanity mutation helper in `web-app/lib/sanity/mutations.ts` with retry/backoff and redaction of PII in logs.
- [X] T047 [US3] Build contact page `web-app/app/contact/page.tsx` composing form wizard, success messaging, and alternate contact options.
- [X] T048 [US3] Implement rate limiting and spam guard in `web-app/lib/security/rateLimit.ts` integrating HMAC secret and IP hash storage.
- [X] T049 [US3] Add ContactSubmission schema in `cms-schemas/src/schemas/contactSubmission.ts` with retention metadata, honeypot guard, and dataset permissions.

**Checkpoint**: User Story 3 enables reliable lead capture with validation, persistence, and accessible UX.

---

## Phase 6: User Story 4 - Researcher Consumes Insights (Priority: P3)

**Goal**: Publish blog and case study content via SSG + ISR with authoritative layouts and metadata.

**Independent Test**: Navigate to the Blog and Case Studies pages, load individual entries via SSG + ISR, and confirm metadata and accessibility compliance.

### Tests for User Story 4 (write first; ensure red state) ⚠️

- [X] T050 [P] [US4] Create unit tests for CaseCard and CaseStudy layout components in `ui-library/tests/unit/case-card.spec.tsx` validating placeholder states and alt text.
- [X] T051 [P] [US4] Create unit tests for Post layout in `web-app/tests/unit/post-layout.spec.tsx` ensuring semantic headings, author attribution, and share controls.
- [X] T052 [P] [US4] Create integration test in `web-app/tests/integration/blog-case-ssg.spec.tsx` covering SSG data fetching, ISR revalidation, and draft filtering.
- [X] T053 [P] [US4] Create Playwright journey `web-app/tests/e2e/blog-navigation.spec.ts` covering blog index, case study detail, and shareable metadata.

### Implementation for User Story 4

- [X] T054 [P] [US4] Implement `ui-library/src/components/CaseCard/CaseCard.tsx` with metrics slots, permission-aware testimonials, and placeholders.
- [X] T055 [P] [US4] Implement `ui-library/src/components/PostList/PostList.tsx` and `ui-library/src/components/PostHeading/PostHeading.tsx` with structured data hooks.
- [X] T056 [US4] Implement GROQ queries in `web-app/lib/queries/insights.ts` covering posts, case studies, pagination, and draft exclusion.
- [X] T057 [US4] Build case study listing and detail routes (`web-app/app/(insights)/case-studies/page.tsx`, `web-app/app/(insights)/case-studies/[slug]/page.tsx`) with placeholder handling.
- [X] T058 [US4] Build blog listing and post detail routes (`web-app/app/(insights)/blog/page.tsx`, `web-app/app/(insights)/blog/[slug]/page.tsx`) with OG metadata exports.
- [X] T059 [US4] Integrate structured data and sitemap generation (`web-app/lib/seo/insights.ts`, `next-sitemap.config.js`) supporting schema.org Article and NewsArticle types.
- [X] T060 [US4] Enhance Sanity schemas `cms-schemas/src/schemas/post.ts` and `caseStudy.ts` with status enums, placeholder flags, and SEO objects aligning with data-model.md.

**Checkpoint**: User Story 4 delivers discoverable insights with automated metadata and ISR-ready routes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality, observability, and compliance tasks that span multiple user stories.

- [ ] T061 [P] Integrate automated accessibility audits by adding `@axe-core/playwright` checks in `web-app/tests/e2e/accessibility.spec.ts` and wiring `pnpm --filter web-app test:a11y`.
- [ ] T062 [P] Configure Lighthouse performance budgets (`web-app/tests/performance/lighthouse.config.ts`, GitHub Action workflow) enforcing <2s LCP and surfacing CI reports.
- [ ] T063 Implement observability CLI (`web-app/cli/status.ts`, `ui-library/cli/analyze.ts`, `cms-schemas/cli/status.ts`) fulfilling `status`/`analyze` contract outputs in JSON.
- [ ] T064 Update documentation (`docs/CLI.md`, `quickstart.md`, `README.md`) with final workflows, environment variables, and outstanding clarifications for FR-012/FR-013 placeholders.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** must complete before Foundational work begins.
- **Foundational (Phase 2)** blocks all user stories; it delivers shared tooling, schemas, theme, and Sanity connectivity.
- **User Stories** unlock after Phase 2. US1 and US2 share P1 priority and may run in parallel if separate contributors manage different files. US3 (P2) depends on Foundational and benefits from US1 data utilities but remains independently testable. US4 (P3) depends on shared schemas and marketing components but not on contact flow.
- **Polish (Phase 7)** follows completion of targeted user stories; run after core acceptance criteria are met.

Within each user story:
- Tests precede implementation (TDD). Do not start implementation tasks until corresponding tests exist and fail.
- Data utilities precede page composition; page routes depend on query helpers and UI components.
- Sanity schema updates precede runtime usage for new document fields.

## Parallel Opportunities

- **Setup**: T003 and T004 can run after T001 in parallel since they touch distinct workspaces.
- **User Story 1**: T015–T018 can run concurrently; T019–T021 can run in parallel once tests are written because components live in separate directories.
- **User Story 2**: T027–T030 parallelize across unit/integration/e2e. T031–T033 run in parallel before page composition tasks T034–T036.
- **User Story 3**: T039–T041 can run simultaneously. T042 and T043 operate on separate files and may proceed in parallel after tests.
- **User Story 4**: T050–T053 run concurrently for test coverage. T054 and T055 can parallelize before query/page work.
- **Polish**: T061 and T062 execute independently while T063 waits on prior CLI implementations.

## Parallel Examples

- **US1**: Execute T019 (Hero component) and T021 (ServiceCard/Testimonial components) in parallel once tests T015–T018 are in place.
- **US2**: Execute T031 (map data utilities) alongside T033 (ComplianceHighlights component) while another contributor handles T032.
- **US3**: Execute T042 (FormStepper) and T043 (step components) concurrently after writing tests T039–T041.
- **US4**: Execute T054 (CaseCard) and T055 (Post list/headings) in parallel before proceeding to query tasks T056–T058.

## Implementation Strategy

1. Complete Setup and Foundational phases to solidify tooling, theme, and schema layers.
2. Deliver MVP via User Story 1, providing core marketing surfaces and reusable UI primitives.
3. In parallel, advance User Story 2 to add compliance depth and interactive map, ensuring data credibility.
4. Expand lead-capture capabilities with User Story 3, validating persistence and anti-spam controls.
5. Round out authority content through User Story 4, leveraging prior components for insights surfaces.
6. Finish with Polish phase to enforce accessibility, performance, and observability guardrails before launch.
