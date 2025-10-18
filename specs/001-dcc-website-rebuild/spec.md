# Feature Specification: Del Carmen Consulting Website Rebuild

**Feature Branch**: `[001-dcc-website-rebuild]`  
**Created**: 2025-10-12  
**Status**: Draft  
**Input**: User description: "Rebuild the Del Carmen Consulting website to showcase public-safety consulting services, leverage Sanity CMS, and deliver lead-generation pathways for agencies."

## Clarifications

### Session 2025-10-12

- Q: Where should contact form submissions be persisted? → A: Store submissions directly in Sanity via restricted token.
- Q: Which email notification service should support contact submissions? → A: Not needed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agency Leader Discovers Services (Priority: P1)

A police chief or municipal decision-maker visits the site to understand DCC's expertise, validate credibility, and identify the right consulting services.

**Why this priority**: Communicates DCC's core value proposition and is critical for lead generation.

**Independent Test**: Navigate the Home and Services pages, read service details, and access supporting proof points (metrics, testimonials) without friction.

**Acceptance Scenarios**:

1. **Given** an agency leader lands on the Home page, **When** they scan the hero, stats, and primary services, **Then** they understand DCC's mission and available engagements.
2. **Given** a user opens any service page, **When** they review methodology, focus areas, FAQs, and related case studies, **Then** they can determine alignment with their agency's needs.

---

### User Story 2 - Compliance Officer Reviews Data Services (Priority: P1)

A compliance or legal officer needs reassurance that DCC's racial profiling reports and audits will protect the agency and satisfy statutory requirements.

**Why this priority**: Differentiates DCC through proprietary data audits and ensures legal compliance value is clear.

**Independent Test**: Visit the Bias-Free Policing and Data Analytics pages, verify compliance messaging, and consume structured data about audits and reporting cadence.

**Acceptance Scenarios**:

1. **Given** a compliance officer reviews the Bias-Free Policing page, **When** they examine the description of racial profiling reporting, audit rigor, and SB 1074 alignment, **Then** they are confident DCC meets legal standards.
2. **Given** the same officer filters the interactive agency map, **When** they view engagements tied to racial profiling compliance, **Then** they see evidence of DCC's track record.

---

### User Story 3 - Prospect Initiates Contact (Priority: P2)

An interested visitor wants to schedule a consultation or request a proposal.

**Why this priority**: Converts traffic into leads, directly supporting the business goal.

**Independent Test**: Complete the contact form flow, receive confirmation, and trigger the proper notifications/storage.

**Acceptance Scenarios**:

1. **Given** a visitor is ready to engage, **When** they open the contact form, **Then** they can progress through multi-step fields with validation and submit successfully.
2. **Given** the submission succeeds, **When** the team logs into connected systems, **Then** the request is captured (Sanity or CSV export) and a confirmation email is dispatched.

---

### User Story 4 - Researcher Consumes Insights (Priority: P3)

A policy researcher or journalist reads blog content and case studies to cite DCC's expertise.

**Why this priority**: Reinforces authority and SEO goals, though secondary to conversion flows.

**Independent Test**: Navigate to the Blog and Case Studies pages, load individual entries via SSG + ISR, and confirm metadata and accessibility compliance.

**Acceptance Scenarios**:

1. **Given** a user opens a case study, **When** they review objectives, approach, and outcomes, **Then** they can reference DCC's methodology.
2. **Given** a user opens a blog post, **When** they read the article, **Then** the content renders with semantic headings, structured data, and shareable OG tags.

### Edge Cases

- What happens when agency logo or testimonial permission is not granted? Suppress logo/quote display and surface CTA to request permission.
- How does system handle empty case-study collections at launch? Render "Coming Soon" placeholders with subscribe CTA and avoid dead-ends.
- How are map pins handled when coordinates are missing or inaccurate? Provide validation in CMS and fall back to list view with warning banner.
- What if contact form submissions exceed rate limits or fail validation? Return accessible error messaging, preserve user input, and block spam retries gracefully.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST deliver a statically generated Home page with mission, service summaries, and key metrics sourced from Sanity.
- **FR-002**: System MUST provide dedicated Service pages (Policy Assessment, Bias-Free Policing, Implementation Assessment, Data Analytics, Innovation & Training) with reusable component layouts.
- **FR-003**: System MUST implement an interactive agency map with filters and pin details sourced from Sanity and rendered with SSR/CSR hybrid data fetching.
- **FR-004**: System MUST allow prospective clients to submit a multi-step contact form with server-side validation (Zod), honeypot, and rate limiting.
- **FR-005**: System MUST manage content via Sanity schemas for Agency, CaseStudy, Service, Post, Testimonial, People, and SiteSettings, including geo and permission fields.
- **FR-006**: System MUST support blog articles and case study detail pages generated via SSG with ISR for freshness.
- **FR-007**: System MUST integrate Framer Motion animations that respect `prefers-reduced-motion`.
- **FR-008**: System MUST enforce accessibility (WCAG 2.1 AA) through semantic HTML, keyboard navigation, focus states, and an Accessibility Statement page.
- **FR-009**: System MUST implement structured data (JSON-LD) and generate sitemaps and robots directives via `next-sitemap`.
- **FR-010**: System MUST store contact submissions directly in Sanity using a restricted service token; no automated email notifications are required at launch.
- **FR-011**: System MUST expose CLI entry points for each workspace to run tests, builds, and linting for observability.

*Clarifications Pending*:

- **FR-012**: System MUST present concrete Data Analytics KPIs and Innovation & Training program details [NEEDS CLARIFICATION: specific tools, metrics, session durations].
- **FR-013**: System MUST surface case studies with measurable outcomes or testimonials [NEEDS CLARIFICATION: real metrics, quotes, attribution].

### Key Entities *(include if feature involves data)*

- **Agency**: Represents a client organization; attributes include name, jurisdiction, geolocation, logo asset, engagement types, permission flags, case study relationships, and year.
- **Service**: Represents a consulting offering; includes title, slug, overview, methodology body, FAQs, related case studies, and SEO metadata.
- **CaseStudy**: Captures an engagement narrative with objectives, approach, outcomes, agency reference, metrics, and media assets.
- **Post**: Blog content with body rich text, authors, hero imagery, categories, and SEO data.
- **Testimonial**: Quote entity with attribution, role, agency link, permission documentation, and publication date.
- **People**: Team member profile with credentials, bio, headshot, and media links.
- **SiteSettings**: Global brand tokens, navigation items, social links, contact info, and default SEO fields.
- **ContactSubmission**: Form submissions with step data, metadata (timestamp, consent), anti-spam markers (honeypot flag, IP hash), persisted in Sanity via restricted service token.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of priority pages (Home, Services, Case Studies, Blog, Contact) pass automated WCAG 2.1 AA audits via tooling (e.g., axe).
- **SC-002**: 80%+ automated test coverage across unit, integration, and E2E suites with CI gating before deployment.
- **SC-003**: Initial page load (LCP) on 3G emulation remains under 2 seconds for Home and Service pages when tested via Lighthouse CI.
- **SC-004**: Contact form submissions persist safely in Sanity within 5 seconds and display on-screen confirmation messaging to the submitter.
- **SC-005**: ISR rebuild latency stays under 60 seconds for content updates triggered via Sanity webhook.
