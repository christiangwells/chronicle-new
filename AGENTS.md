# AGENTS.md

## Purpose

Build and maintain Chronicle (TanStack Start + React + TypeScript + Prisma/SQLite) with minimal, safe, reviewable changes.

## Core Rules

- Keep changes small and focused on the user request.
- Prefer existing patterns over introducing new abstractions.
- Do not edit generated files.
- Run validation after meaningful edits.
- If behavior is unclear, inspect nearby code before implementing.

## Project Map

- App entry and router setup: `src/start.ts`, `src/router.tsx`
- File-based routes: `src/routes/**`
- Feature code: `src/features/**`
- Shared UI: `src/components/**`, `src/components/ui/**`
- Shared utilities: `src/lib/**`, `src/hooks/**`
- Prisma schema and seed: `prisma/schema.prisma`, `prisma/seed.ts`
- Generated Prisma client: `src/generated/prisma/**` (do not edit)
- Generated route tree: `src/routeTree.gen.ts` (do not edit)

## Commands (Yarn 4)

- Install deps: `yarn install`
- Dev server: `yarn dev`
- Build: `yarn build`
- Tests: `yarn test`
- Lint: `yarn lint`
- Format: `yarn format`
- Autofix lint + format: `yarn check`

## Database Workflow

- Uses Prisma + SQLite.
- Change schema in `prisma/schema.prisma`.
- Then run:
  1.  `yarn db:generate`
  2.  `yarn db:migrate` (or `yarn db:push` for local iteration)
  3.  `yarn db:seed` if seed data needs updates

## Coding Conventions

- TypeScript first; keep types explicit at boundaries.
- Reuse helpers in `src/lib/utils.ts` and existing UI primitives before adding new ones.
- Follow current route and feature organization.
- Keep server/client concerns separated per existing route patterns.
- Avoid unrelated refactors in task-driven changes.

## Pre-Completion Checklist

- Relevant tests pass (at least targeted scope).
- Lint passes for touched files.
- No generated files manually modified.
- Imports and naming follow existing conventions.
- Any schema change includes generated/migration follow-through.
