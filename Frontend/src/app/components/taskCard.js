export function TaskCard({ task, onEdit, onDelete }) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {task.title}
        </h4>
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="text-xs px-2 py-1 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2 select-text">
          {task.description}
        </p>
      )}
      {task.dueDate && (
        <time
          className="text-xs text-gray-500 dark:text-gray-400 select-none"
          dateTime={task.dueDate}
        >
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </time>
      )}
    </article>
  );
}
