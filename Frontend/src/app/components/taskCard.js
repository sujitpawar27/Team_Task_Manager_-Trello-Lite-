export function TaskCard({ task }) {
  return (
    <div className="card p-3 text-sm">
      <div className="font-medium">{task.title}</div>
      {task.description && (
        <div className="text-zinc-500 line-clamp-2">{task.description}</div>
      )}
      {task.dueDate && (
        <div className="mt-1 text-xs">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
