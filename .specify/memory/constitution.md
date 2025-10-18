# Del Carmen Consulting Web Rebuild Constitution

## Core Principles

### I. Code Quality & Libraries First
Every deliverable uses a consistent Prettier + ESLint configuration, enforces strict TypeScript, and treats features as reusable library-grade components. All code changes are version-controlled with descriptive, intent-driven commit messages.

### II. Test-First Delivery
Each feature begins with unit, integration, and end-to-end tests (Jest, React Testing Library, Cypress/Playwright). Implementation may not begin until red-state tests exist and is complete only when the full suite is green with ≥80% coverage.

### III. Accessibility & Experience Consistency
WCAG 2.1 AA compliance, semantic HTML, keyboard navigation, descriptive alt text, and respect for user motion/contrast preferences are mandatory. Shared design tokens ensure cohesive typography, colour, and component behaviour across devices.

### IV. Performance & Observability
Pages target under 2s load on 3G through SSG/SSR discipline, optimized assets, deferred scripts, caching, and structured data for SEO. Every module exposes a CLI entry point for build/test/diagnostics to maintain observability.

### V. Security & Privacy
All user input is validated and sanitised server-side. Forms employ honeypots and rate limiting, third-party scripts are minimised, and consent is required before tracking. Privacy policies and disclaimers must reflect data practices accurately.

## Architectural Constraints

- Maximum of three top-level workspaces (web-app, ui-library, cms-schemas).  
- Sanity CMS is the single source of truth for content and permissions.  
- Framer Motion animations must honour `prefers-reduced-motion`.  
- Map visualisations surface only permission-validated agencies and data.

## Workflow Expectations

- Documentation (spec, plan, research, contracts, tasks) must be current before implementation.  
- CI pipelines block merges without lint, type, and test success.  
- Accessibility, performance, and security gates are re-verified at each milestone.  
- Any deviation from constraints requires documented justification in Complexity Tracking.

## Governance

This constitution supersedes other practices for the DCC rebuild. Amendments require written rationale, risk assessment, and approval before implementation changes proceed.

**Version**: 1.0.0 | **Ratified**: 2025-10-12 | **Last Amended**: 2025-10-12
