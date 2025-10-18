# Quickstart Guide: Del Carmen Consulting Monorepo

## 1. Prerequisites

- Node.js 18.18+ (aligns with Next.js 14 support matrix)  
- pnpm 9.x (workspace manager)  
- Sanity CLI (`npm install -g @sanity/cli`)  
- Vercel CLI (optional for deploy previews)  
- Access to Sanity project (project ID, dataset, read/write tokens)

## 2. Repository Setup

```bash
pnpm install
```

Workspace layout:

- `web-app` — Next.js 14 app using App Router.  
- `ui-library` — Chakra UI theme and reusable components.  
- `cms-schemas` — Sanity schema definitions and custom inputs.

## 3. Environment Variables

Create `.env.local` in `web-app` with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...
SANITY_PREVIEW_SECRET=...
CONTACT_SUBMISSION_TOKEN=...   # optional separate token with create permissions
RESEND_API_KEY=...             # placeholder if email notifications enabled
RATE_LIMIT_SECRET=...          # used for HMAC-based rate limiting
```

Create `.env` in `cms-schemas` with Sanity credentials for schema validation. Do not commit secrets.

## 4. CLI Commands

Root-level helpers (run from repo root):

```bash
pnpm lint          # Runs ESLint + Prettier check across all packages
pnpm typecheck     # TSC in each workspace
pnpm test          # Aggregated Jest + Playwright suites
pnpm build         # Builds ui-library, cms-schemas, then web-app
```

Workspace-specific (via pnpm filters):

```bash
pnpm --filter web-app dev        # Next.js dev server
pnpm --filter web-app test:unit  # Jest unit/integration
pnpm --filter web-app test:e2e   # Playwright
pnpm --filter ui-library build   # Bundle components (tsup/rollup)
pnpm --filter cms-schemas deploy # Sanity schema deploy
```

Each command must output machine-readable logs when `--json` flag supplied (implement in CLI contracts).

## 5. Sanity Project

```bash
pnpm --filter cms-schemas sanity init     # (one-time) link repo to project
pnpm --filter cms-schemas sanity dataset create production
pnpm --filter cms-schemas sanity deploy
```

Set up webhooks in Sanity Studio:

- **ISR Revalidation**: POST to `https://<domain>/api/revalidate` with secret.  
- **Contact Notification**: optional event to email/Slack via future function.

Seed initial content via scripts (`cms-schemas/cli/seed.ts`) once created.

## 6. Development Workflow

1. Write failing tests in relevant package (unit/integration/e2e).  
2. Implement feature using shared components from `ui-library`.  
3. Update Sanity schemas/types if content changes required.  
4. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`.  
5. Capture accessibility/performance checks (axe, Lighthouse).  
6. Commit with descriptive message referencing spec tasks.

## 7. Deployments

- **Preview**: `pnpm --filter web-app vercel --prebuilt` (requires Vercel token).  
- **Production**: Merge to default branch triggers Vercel build; ISR ensures freshness.  
- **Rollback**: Use Vercel deploy history; ensure Sanity migrations reversible.

## 8. Support & Observability

- CLI observability commands (planned):  
  - `pnpm --filter web-app status` → prints health checks (API routes, ISR).  
  - `pnpm --filter ui-library analyze` → bundle stats for components.  
  - `pnpm --filter cms-schemas validate` → schema consistency + dangling refs.
- Logs: rely on Vercel + Sanity logs; forward contact form errors to monitoring stack (Datadog/Sentry placeholder).
