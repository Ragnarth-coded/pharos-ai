# Pharos

Pharos is a geopolitical intelligence dashboard built with Next.js, Prisma, and PostgreSQL. It combines structured conflict data, live event feeds, actor tracking, map overlays, market signals, and editorial tooling into one operational interface.

This repository is being prepared for public contribution. The goal is to make the codebase open and forkable while still maintaining a very high quality bar for the main hosted deployment.

## Status

- Active product codebase
- Open-source hardening in progress
- Contribution guidelines and CI are being tightened before broader public rollout

## Tech Stack

- Next.js App Router
- React + TypeScript
- Prisma + PostgreSQL
- Tailwind CSS + shadcn/ui
- Redux Toolkit + React Query
- Optional Electron wrapper for desktop packaging

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in the required values:

```bash
cp .env.local.example .env.local
```

At minimum, local development will usually require database and Supabase credentials. Some admin and verification features also require additional secrets.

### 3. Generate the Prisma client

This runs automatically on install via `postinstall`, but can also be run manually:

```bash
npm run db:generate
```

### 4. Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Common Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:migrate
npm run db:seed
npm run electron:dev
```

More scripts are defined in `package.json`.

## Project Structure

```text
src/
  app/          Next.js routes, layouts, and route handlers
  components/   UI components grouped by feature
  hooks/        React hooks
  lib/          shared helpers and server/client utilities
  store/        Redux state
  data/         static seeded or display data
  types/        shared domain types
  api/          client-side query modules (planned for cleanup)
```

Supporting directories:

- `docs/` - product and API documentation
- `prisma/` - schema, migrations, seed logic
- `electron/` - desktop wrapper entrypoint
- `public/` - static assets

## Working Standards

- Frontend conventions live in `CODEX.md`
- Open-source hardening work is tracked in `docs/open-source-hardening-plan.md`
- Prefer small, focused changes over broad refactors without tests

## Contribution Notes

Public contribution support is still being tightened, but targeted contributions are welcome.

Before opening a PR:

- read `CODEX.md`
- keep changes scoped
- avoid unrelated refactors
- include verification steps for your change

More detailed contribution guidance lives in `CONTRIBUTING.md`.

## Security

If you discover a vulnerability or secret-handling issue, please follow `SECURITY.md` instead of opening a public issue with exploit details.

## License

License selection is still being finalized.
