/** SQLite access through Node's built-in `node:sqlite`. Migrations run on open. */
import { DatabaseSync } from "node:sqlite";

export type Db = DatabaseSync;

const MIGRATIONS: string[] = [
  `CREATE TABLE tasks (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     title TEXT NOT NULL,
     description TEXT,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
   )`,
];

export function openDb(path: string): Db {
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON");
  migrate(db);
  return db;
}

function migrate(db: Db): void {
  const current = Number((db.prepare("PRAGMA user_version").get() as { user_version: number }).user_version);
  MIGRATIONS.slice(current).forEach((sql, i) => {
    db.exec("BEGIN");
    db.exec(sql);
    db.exec(`PRAGMA user_version = ${current + i + 1}`);
    db.exec("COMMIT");
  });
}

export const DEMO_TASKS = [
  { title: "Write the project plan", description: "Outline the features for the first release." },
  { title: "Set up CI", description: null },
  { title: "Review open pull requests", description: "Check the agent PRs before lunch." },
];

export function seed(db: Db): void {
  const insert = db.prepare("INSERT INTO tasks (title, description, created_at) VALUES (?, ?, ?)");
  DEMO_TASKS.forEach((t, i) => {
    // Oldest first, a minute apart, so the list order is predictable.
    insert.run(t.title, t.description, new Date(Date.UTC(2026, 0, 1, 9, i)).toISOString());
  });
}
