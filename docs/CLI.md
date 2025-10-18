# Monorepo CLI Reference

The Del Carmen Consulting workspaces expose consistent command entry points. All commands accept `--help` and `--json`; when `--json` is provided the command emits a single JSON payload that is safe to parse in CI.

## web-app (Next.js)

| Command | Purpose | Notes | Example |
|---------|---------|-------|---------|
| `pnpm --filter web-app dev` | Start the Next.js development server | Inherits standard Next.js flags (`--turbo`, `--port`) | `pnpm --filter web-app dev --port 4000` |
| `pnpm --filter web-app build` | Create a production build | Use `--analyze` when bundle stats are required | `pnpm --filter web-app build --analyze` |
| `pnpm --filter web-app lint` | Run ESLint + Next lint rules | Follows repository formatter settings | `pnpm --filter web-app lint` |
| `pnpm --filter web-app typecheck` | Validate TypeScript types | Runs `tsc --noEmit` | `pnpm --filter web-app typecheck` |
| `pnpm --filter web-app test:unit` | Execute Jest unit/integration suites | Add `--watch`/`--coverage` as needed | `pnpm --filter web-app test:unit -- --coverage` |
| `pnpm --filter web-app test:e2e` | Execute Playwright journeys | Pass `--project` to target a browser | `pnpm --filter web-app test:e2e -- --project=chromium` |
| `pnpm --filter web-app status` | Emits observability status JSON | Placeholder output until task T063 | `pnpm --filter web-app status -- --json` |

## ui-library (Chakra UI components)

| Command | Purpose | Notes | Example |
|---------|---------|-------|---------|
| `pnpm --filter ui-library build` | Bundle components with tsup | Emits both ESM and CJS outputs | `pnpm --filter ui-library build` |
| `pnpm --filter ui-library lint` | ESLint against `src/` | Aligns with root lint config | `pnpm --filter ui-library lint` |
| `pnpm --filter ui-library typecheck` | Library type validation | Uses shared `tsconfig.base.json` | `pnpm --filter ui-library typecheck` |
| `pnpm --filter ui-library test` | Run Jest component specs | `--watch` supported | `pnpm --filter ui-library test -- --watch` |
| `pnpm --filter ui-library story` | Storybook dev placeholder | Prints setup reminder until Storybook lands | `pnpm --filter ui-library story` |
| `pnpm --filter ui-library analyze` | Component bundle + accessibility report | Outputs JSON placeholder pending implementation | `pnpm --filter ui-library analyze -- --json` |

## cms-schemas (Sanity content model)

| Command | Purpose | Notes | Example |
|---------|---------|-------|---------|
| `pnpm --filter cms-schemas sanity <cmd>` | Proxy to the Sanity CLI | Supports all upstream flags | `pnpm --filter cms-schemas sanity deploy` |
| `pnpm --filter cms-schemas validate` | Schema validation placeholder | Emits JSON until validation pipeline is delivered | `pnpm --filter cms-schemas validate -- --json` |
| `pnpm --filter cms-schemas typegen` | Type generation placeholder | Will hook into sanity-codegen | `pnpm --filter cms-schemas typegen -- --json` |
| `pnpm --filter cms-schemas seed` | Dataset seeding placeholder | Future work to load sample content | `pnpm --filter cms-schemas seed -- --file=./seeds/seed.json` |
| `pnpm --filter cms-schemas export` | Export schema bundle placeholder | Future work for artifact packaging | `pnpm --filter cms-schemas export -- --out=./dist` |
| `pnpm --filter cms-schemas status` | Emit high-level schema status | Placeholder JSON until observability task completes | `pnpm --filter cms-schemas status -- --json` |

> **Note:** Placeholder commands satisfy the CLI contract shape and return simple JSON dictionaries today. They will be upgraded in later tasks (see T063) to perform real health checks, bundle analysis, and content workflows.
