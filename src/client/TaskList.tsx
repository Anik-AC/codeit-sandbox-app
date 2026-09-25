import type { Task } from "../shared/types.ts";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }
  return (
    <ul aria-label="Tasks">
      {tasks.map((task) => (
        <li key={task.id}>
          <strong>{task.title}</strong>
          {task.description && <p>{task.description}</p>}
        </li>
      ))}
    </ul>
  );
}
