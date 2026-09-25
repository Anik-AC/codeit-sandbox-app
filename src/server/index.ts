/** Starts the API. Environment: PORT (3001), DB_PATH (data/tasks.db), SEED=1, SERVE_CLIENT=1. */
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createApp } from "./app.ts";
import { openDb, seed } from "./db.ts";

const port = Number(process.env.PORT ?? 3001);
const dbPath = process.env.DB_PATH ?? "data/tasks.db";
if (dbPath !== ":memory:") mkdirSync(dirname(dbPath), { recursive: true });

const db = openDb(dbPath);
if (process.env.SEED === "1") seed(db);

createApp(db, { serveClient: process.env.SERVE_CLIENT === "1" }).listen(port, "127.0.0.1", () => {
  console.log(`listening on http://127.0.0.1:${port}`);
});
