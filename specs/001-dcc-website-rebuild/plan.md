# Implementation Plan: Del Carmen Consulting Website Rebuild

**Branch**: `[001-dcc-website-rebuild]` | **Date**: 2025-10-12 | **Spec**: specs/001-dcc-website-rebuild/spec.md  
**Input**: Feature specification from `/specs/001-dcc-website-rebuild/spec.md`

## Summary

Rebuild the Del Carmen Consulting marketing site with a modern, accessible Next.js 14 stack powered by Sanity CMS. Deliver reusable Chakra UI component libraries, Framer Motion-enhanced interactions, an interactive agency map, and a compliant multi-step contact workflow—while enforcing test-first development, strict TypeScript, and the three-workspace architecture (web-app, ui-library, cms-schemas).

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 18 (Next.js 14 App Router)  
**Primary Dependencies**: Next.js 14, React 18, Chakra UI, Framer Motion, React Leaflet (MapLibre fallback evaluation), Sanity v3, Zod, next-sitemap, Playwright (E2E)  
**Storage**: Sanity CMS (content + contact submissions), optional CSV export for submissions  
**Testing**: Jest + React Testing Library (unit/integration), Playwright (e2e), ESLint + Prettier + TypeScript type checks in CI  
**Target Platform**: Vercel (edge-enabled) with ISR revalidation hooks from Sanity  
**Project Type**: Multi-workspace web platform (marketing site + shared component library + CMS schemas)  
**Performance Goals**: <2s LCP on 3G for SSG pages, responsive map interactions under 100ms input latency, ISR rebuild under 60s  
**Constraints**: Library-first approach, ≤3 top-level packages, WCAG 2.1 AA compliance, CLI entry points per workspace, Framer Motion respecting reduced motion, minimal third-party scripts  
**Scale/Scope**: Marketing surface with ~10 evergreen pages, interactive map, blog archive, growing case study corpus, and automated lead-capture pipeline

## Constitution Check

- **Libraries First / CLI**: Plan enforces three discrete workspaces with shared components exported from `ui-library` and CLI scripts for lint, type-check, build, and test (Pass).  
- **Test-First Discipline**: Deliverables include dedicated test directories and mandate red-green workflow before feature implementation (Pass).  
- **Accessibility & Experience**: Chakra theme, semantic layout scaffolding, accessibility statement, and WCAG testing woven into tasks (Pass).  
- **Performance & Observability**: SSG/ISR strategy, map performance guardrails, and CLI observability commands outlined (Pass).  
- **Security & Privacy**: Server-side validation, spam controls, permission gating for assets are baked into requirements (Pass).

## Project Structure

### Documentation (this feature)

```
specs/001-dcc-website-rebuild/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── cli-contracts.md
└── spec.md
```

### Source Code (repository root)

```
web-app/
├── app/
│   ├── (routes via App Router)
│   ├── layout.tsx
│   └── api/            # contact API route, ISR handlers
├── components/         # app-specific orchestration wrappers
├── lib/                # data fetching utilities, SEO helpers
├── public/             # static assets (favicons, OG templates)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/            # Playwright specs
└── package.json        # CLI scripts (lint, test, build, analyze)

ui-library/
├── src/
│   ├── theme/
│   ├── components/
│   │   ├── Hero/
│   │   ├── StatStrip/
│   │   ├── LogoCloud/
│   │   ├── InteractiveMap/
│   │   ├── CaseCard/
│   │   ├── Testimonial/
│   │   └── ContactForm/
│   └── hooks/
├── stories/            # optional Storybook or MDX docs (deferred)
├── tests/
│   ├── unit/
│   └── accessibility/
└── package.json        # CLI scripts (build, lint, test, chromatic placeholder)

cms-schemas/
├── src/
│   ├── schemas/
│   │   ├── agency.ts
│   │   ├── caseStudy.ts
│   │   ├── service.ts
│   │   ├── post.ts
│   │   ├── testimonial.ts
│   │   ├── people.ts
│   │   └── siteSettings.ts
│   └── components/
│       ├── geoCoordinateInput.tsx
│       └── permissionToggle.tsx
├── cli/
│   └── index.ts        # wrappers for schema validation/export
├── tests/
│   └── unit/
└── package.json        # CLI scripts (schema lint, typegen, export)
```

**Structure Decision**: Adopt a tri-package monorepo (`web-app`, `ui-library`, `cms-schemas`) to satisfy the library-first constitution. Shared UI elements live in `ui-library`, content models in `cms-schemas`, and orchestration + routing in `web-app`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| _None_ | — | — |
