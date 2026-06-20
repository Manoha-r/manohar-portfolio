# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

### Portfolio (artifacts/portfolio) — Preview: /
Apple-inspired personal portfolio website for Manohar Naidu Bugatha. Single-page React app with:
- Sticky nav with smooth scroll-to-section
- Sections: Hero, About, Skills, Projects (NextStep & Airbnb Clone), Experience, Education, Contact
- Framer Motion scroll-triggered animations
- Inter font, electric blue (#0071E3) accent, white/black/light gray palette
- Social links: GitHub, LinkedIn, LeetCode
- Fully responsive (mobile + desktop)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
