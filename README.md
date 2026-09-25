# codeit-sandbox-app

A small task tracker, and the target repo for [CodeIt](https://github.com/Anik-AC/codeit)'s agents. Today it can only **list tasks**. Everything else (creating, completing, due dates, filters, editing, dependencies) is planned in [CodeIt's sample plan](https://github.com/Anik-AC/codeit/blob/main/docs/samples/sample-plan.md) and will be built by the agents, one ticket at a time.

## Stack

- **Frontend:** React 19 + Vite + TypeScript (`src/client/`)
- **API:** Express 5 + TypeScript, run with `tsx` (`src/server/`)
- **Database:** SQLite through Node's built-in `node:sqlite`. Migrations are in `src/server/db.ts`.
- **Tests:** Vitest (unit, `tests/unit/`) and Playwright 1.63 (end to end, `e2e/`)

Requires Node 24.

## Commands

```bash
npm ci
npm run dev          # API on :3001 and the Vite dev server on :5173 (proxying /api)
npm run lint
npm run typecheck
npm test             # unit tests (add -- --run for a single run)
npx playwright test  # end to end: builds the client and starts the server with demo data
```

`SEED=1 npm run dev:api` starts the API with demo tasks. The database file is `data/tasks.db`; set `DB_PATH` to change it.

## API

| Method | Path | Returns |
|---|---|---|
| GET | `/api/health` | `{ "ok": true }` |
| GET | `/api/tasks` | Tasks, newest first: `{ id, title, description, createdAt }` |

Errors are JSON: `{ "error": "..." }`.

## For CodeIt

`codeit.yaml` lists the commands CodeIt's Reviewer runs. The Playwright version must stay at 1.63.0 to match CodeIt's worker image.
