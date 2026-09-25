import { useEffect, useState } from "react";
import type { Task } from "../shared/types.ts";
import { fetchTasks } from "./api.ts";
import { TaskCount } from "./TaskCount.tsx";
import { TaskList } from "./TaskList.tsx";

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; tasks: Task[] };

export function App() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchTasks()
      .then((tasks) => !cancelled && setState({ status: "ready", tasks }))
      .catch((e: unknown) => !cancelled && setState({ status: "error", message: (e as Error).message }));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <h1>Tasks</h1>
      {state.status === "loading" && <p>Loading...</p>}
      {state.status === "error" && <p role="alert">{state.message}</p>}
      {state.status === "ready" && (
        <>
          <TaskCount count={state.tasks.length} />
          <TaskList tasks={state.tasks} />
        </>
      )}
    </main>
  );
}
