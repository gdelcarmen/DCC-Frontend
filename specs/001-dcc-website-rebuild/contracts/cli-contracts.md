# CLI Contracts: Del Carmen Consulting Monorepo

## Overview

Every workspace must expose deterministic CLI entry points for observability, testing, and build operations. Commands accept standard flags (`--help`, `--json`) and exit with non-zero codes on failure. Output should be parseable (JSON or newline delimited key/value) when `--json` provided.

## 1. web-app (Next.js)

| Command | Purpose | Inputs | Outputs |
|---------|---------|--------|---------|
| `pnpm --filter web-app dev` | Run Next.js dev server | `--port`, `--turbo`, `--inspect` | Logs server URL, port |
| `pnpm --filter web-app build` | Production build | `--analyze` | Build summary JSON (when `--json`) |
| `pnpm --filter web-app lint` | ESLint + Prettier check | `--fix` | ESLint report |
| `pnpm --filter web-app typecheck` | TypeScript diagnostics | `--watch` | tsc output / JSON diagnostics |
| `pnpm --filter web-app test:unit` | Jest unit/integration | `--watch`, `--coverage`, `--json` | Jest results (coverage) |
| `pnpm --filter web-app test:e2e` | Playwright tests | `--headed`, `--project=<name>` | Playwright summary / traces path |
| `pnpm --filter web-app status` | Observability health check | `--json` | JSON: `{ apiRoutes: OK, sitemap: OK, lastISR: <timestamp> }` |

## 2. ui-library (Chakra components)

| Command | Purpose | Inputs | Outputs |
|---------|---------|--------|---------|
| `pnpm --filter ui-library build` | Bundle components (tsup/rollup) | `--watch`, `--analyze` | Bundle stats JSON |
| `pnpm --filter ui-library lint` | ESLint + Prettier | `--fix` | Lint report |
| `pnpm --filter ui-library typecheck` | tsc for library | `--watch` | Diagnostic summary |
| `pnpm --filter ui-library test` | Jest + RTL | `--coverage`, `--watch` | Test results |
| `pnpm --filter ui-library story` | (Optional) Storybook dev server | `--port` | URL output |
| `pnpm --filter ui-library analyze` | Snapshot component bundle + accessibility audit | `--json` | JSON with bundle size, axe summary |

## 3. cms-schemas (Sanity)

| Command | Purpose | Inputs | Outputs |
|---------|---------|--------|---------|
| `pnpm --filter cms-schemas sanity <cmd>` | Proxy Sanity CLI (deploy, dataset) | `--project`, `--dataset` | Sanity CLI output |
| `pnpm --filter cms-schemas validate` | Custom schema validation | `--json` | JSON array of issues |
| `pnpm --filter cms-schemas typegen` | Generate TypeScript types | `--watch` | Generated file path |
| `pnpm --filter cms-schemas seed` | Populate sample data | `--file=<path>` | Import summary |
| `pnpm --filter cms-schemas export` | Export schema bundle (for sharing) | `--out=<dir>` | Artifact location |

## Error Handling Contract

- Commands must exit with code `0` on success, non-zero on failure.  
- When `--json` is provided, commands should suppress non-JSON logs and emit a single JSON object.  
- Any command that writes files must respect workspace boundaries and document outputs in README.  
- Rate-limited or long-running commands (e.g., Playwright) should emit progress updates every 30 seconds for CI visibility.
