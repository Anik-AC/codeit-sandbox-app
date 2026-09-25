/** Task persistence. The only feature today is listing; see README for what is next. */
import type { Task } from "../shared/types.ts";
import type { Db } from "./db.ts";

interface TaskRow {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
}

function toTask(row: TaskRow): Task {
  return { id: row.id, title: row.title, description: row.description, createdAt: row.created_at };
}

/** Newest first. */
export function listTasks(db: Db): Task[] {
  const rows = db
    .prepare("SELECT id, title, description, created_at FROM tasks ORDER BY created_at DESC, id DESC")
    .all() as unknown as TaskRow[];
  return rows.map(toTask);
}
