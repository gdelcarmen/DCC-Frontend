# Research Notes: Del Carmen Consulting Website Rebuild

## 0. Objectives

- Validate technology choices (Next.js 14 App Router, Chakra UI, Framer Motion, Sanity) meet performance, accessibility, and library-first mandates.
- Determine content modeling requirements and map data acquisition strategy before implementation.
- Establish testing stack (Jest, React Testing Library, Playwright) aligned with test-first constitution.
- Identify integration touchpoints (Sanity webhooks, map provider assets, email notifications) and outstanding data gaps.

## 1. Technology Validation

- **Next.js 14 + App Router**: Supports hybrid SSG/ISR and selective SSR for interactive map. Route handlers simplify contact API. Works well with Vercel Edge and `next/image`.
- **Chakra UI**: Provides accessible primitives and theme extensibility. Need custom theme tokens (navy/slate, neutral greys, gold/teal accent) and typography pairing (humanist sans for headings, clean sans for body).
- **Framer Motion**: Compatible with Chakra components; must wrap with `LazyMotion` and guard animations via `useReducedMotion`.
- **Map Library**: Prefer **React Leaflet** for simplicity and community support. MapLibre remains fallback if we need vector tiles later. Tiles: evaluate OpenStreetMap tile usage limits vs. MapTiler plan; caching via Vercel Edge.
- **Sanity v3**: Hooks into monorepo via `cms-schemas`. Use GROQ queries in `web-app` and `@sanity/client` with server-side caching. Configure webhooks for ISR revalidation.
- **Form Processing**: Next.js Route Handler + Zod schema validation. For email notifications, plan to integrate with transactional service (e.g., Resend) but keep provider abstracted via interface for now (document as future enhancement).

## 2. Content & Data Considerations

- **Agency Data**: Requires lat/lon, permission flag, engagement types. Need guard for missing coords; implement validation in custom Sanity input. Consider optional `mapDisplay` toggle.
- **Case Studies**: Initial launch may include placeholders. Provide `status` field (e.g., draft, comingSoon) to manage display.
- **Data Analytics Offerings**: Highlight comprehensive racial-profiling reports, SB 1074 compliance audits, and unique data audit service. Clarify tooling (e.g., statistical packages) with client later.
- **Innovation & Training**: Currently only implicit bias workshops known. Capture configurable fields (audience, duration, delivery format) to adapt when more detail arrives.
- **Testimonials & Logos**: `permissionReceived` boolean plus `permissionNotes` for auditing. Tooltip requirements captured in UI spec.
- **Contact Submissions**: Decide between storing in Sanity (via `create` mutation) vs. temporary CSV export. Preference: Sanity dataset with restricted token. Document retention policy once clarified.

## 3. Testing Strategy

- **Unit**: Chakra-based components tested with React Testing Library + Jest DOM matchers. Snapshot testing limited to theme tokens.
- **Integration**: Test page-level data fetching (mock Sanity client) and map filter interactions using Playwright component tests or RTL with MSW.
- **E2E**: Playwright flows for Home navigation, service detail, map filter, blog article, contact form multi-step submission (happy path, validation error, spam block).
- **Accessibility Audits**: Integrate `@axe-core/playwright` into CI; include manual keyboard traversal checklist.
- **Coverage**: Use `--coverage` in Jest and Playwright trace viewer. Coverage gate set to 80% overall with per-package enforcement.

## 4. DevOps & Tooling

- **Monorepo Management**: Use pnpm workspaces. Root `package.json` orchestrates lint/test across packages. Consider Turborepo caching for builds/tests.
- **CI Pipeline**: GitHub Actions (assumed) running lint, type check, unit tests, Playwright (CI mode), and Lighthouse performance budgets.
- **Sanity Deployment**: Provide CLI command for schema deploy and dataset seeding. Document environment variables in `quickstart.md`.
- **Sitemaps & SEO**: Configure `next-sitemap` with ISR aware settings; generate on build. JSON-LD helpers in `web-app/lib/seo.ts`.
- **Observability CLI**: Each package exposes `pnpm --filter <pkg> exec` commands for diagnostics (e.g., `pnpm web-app dev`, `pnpm ui-library story`, `pnpm cms-schemas validate`).

## 5. Risks & Mitigations

- **Data Completeness**: Lack of detailed metrics/testimonials could weaken credibility. Mitigation: build CMS fields for future data, add placeholders with subscribe CTA at launch.
- **Map Performance**: Many pins may degrade performance. Mitigation: cluster markers, lazy-load map, and prefetch data with caching.
- **Accessibility Regressions**: Framer Motion may interfere with focus. Mitigation: use Chakra focus management, run automated and manual audits.
- **Form Spam**: Multi-step with honeypot and rate limiting (per-IP, per-email) plus optional hCaptcha fallback (documented but disabled until consent).

## 6. Outstanding Questions

1. What specific analytics tools or KPIs should be referenced for the Data Analytics offering? (e.g., turnaround times, number of audits)  
2. Are there preferred map tile providers or branding constraints for the interactive map?  
3. Should contact submissions trigger integration with an email provider (which service, credentials)?  
4. Are additional workshop types (leadership, supervisory training) planned for Innovation & Training that need placeholders now?  
5. Timeline for gathering case study details and testimonials to replace placeholders?

Document answers in `research.md` updates before implementation begins.
