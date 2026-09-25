/** Typed calls to the API. */
import type { Task } from "../shared/types.ts";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error(`Could not load tasks (${res.status})`);
  return (await res.json()) as Task[];
}
