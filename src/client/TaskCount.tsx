export function TaskCount({ count }: { count: number }) {
  if (count === 0) {
    return null;
  }
  return <p>{count === 1 ? "1 task" : `${count} tasks`}</p>;
}
