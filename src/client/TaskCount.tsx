export function TaskCount({ count }: { count: number }) {
  if (count === 0) {
    return null;
  }
  return <p>{count === 1 ? "You have 1 task" : `You have ${count} tasks`}</p>;
}
