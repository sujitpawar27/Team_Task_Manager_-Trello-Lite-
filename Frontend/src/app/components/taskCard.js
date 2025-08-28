import {
  Calendar,
  User,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
  PlayCircle2,
  PlayCircle,
} from "lucide-react";

export function TaskCard({
  task,
  onEdit,
  onDelete,
  columnType,
  dragHandleProps,
}) {
  const getStatusIcon = () => {
    switch (task.status) {
      case "todo":
        return <Clock className="w-4 h-4 text-red-500" />;
      case "in_progress":
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case "done":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "todo":
        return "border-l-red-400";
      case "in_progress":
        return "border-l-blue-400";
      case "done":
        return "border-l-green-400";
      default:
        return "border-l-gray-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: "Due today", isToday: true };
    } else if (diffDays <= 3) {
      return { text: `Due in ${diffDays} days`, isSoon: true };
    } else {
      return { text: date.toLocaleDateString(), isNormal: true };
    }
  };

  const dueDateInfo = formatDate(task.dueDate);

  return (
    <article
      className={`
      group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
  border-l-4 ${getStatusColor()} p-5 transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600
    `}
    >
      {/* Task Header */}
      <div className="flex items-start gap-2 flex-1">
        {getStatusIcon()}
        <h4 className="font-semibold text-gray-900 dark:text-white leading-tight flex-1">
          {task.title}
        </h4>
        {/* Edit & Delete Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              console.log("Edit clicked", task);
              onEdit(task);
            }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Edit Task"
            tabIndex={0}
            aria-label="Edit Task"
          >
            <Edit3 className="w-4 h-4 text-blue-500" />
          </button>
          <button
            onClick={() => {
              console.log("Delete clicked", task);
              onDelete(task);
            }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Delete Task"
            tabIndex={0}
            aria-label="Delete Task"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          {/* Drag Handle Area */}
          {dragHandleProps && (
            <div
              {...dragHandleProps}
              className="ml-2 cursor-grab active:cursor-grabbing flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Drag to move"
              tabIndex={0}
              aria-label="Drag handle"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6" cy="7" r="1.5" fill="currentColor" />
                <circle cx="6" cy="13" r="1.5" fill="currentColor" />
                <circle cx="10" cy="7" r="1.5" fill="currentColor" />
                <circle cx="10" cy="13" r="1.5" fill="currentColor" />
                <circle cx="14" cy="7" r="1.5" fill="currentColor" />
                <circle cx="14" cy="13" r="1.5" fill="currentColor" />
              </svg>
            </div>
          )}
        </div>
      </div>
      {/* Task Description */}
      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Task Metadata */}
      <div className="space-y-3">
        {/* Assignee */}
        {task.assignee && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {(task.assignee.name || task.assignee).charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {task.assignee.name || task.assignee}
              </span>
            </div>
          </div>
        )}

        {/* Due Date */}
        {dueDateInfo && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <time
              className={`text-sm font-medium px-2 py-1 rounded-md ${
                dueDateInfo.isOverdue
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  : dueDateInfo.isToday
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                  : dueDateInfo.isSoon
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
              dateTime={task.dueDate}
            >
              {dueDateInfo.text}
            </time>
          </div>
        )}

        {/* Priority */}
        {task.priority && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Priority:
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-current rounded-full -translate-y-10 translate-x-10 pointer-events-none"></div>
      </div>

      {/* Progress Indicator for In Progress tasks */}
      {task.status === "in_progress" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 pointer-events-none">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse pointer-events-none"></div>
        </div>
      )}

      {/* Completed Indicator */}
      {task.status === "done" && (
        <div className="absolute top-2 right-2 opacity-10 dark:opacity-20 pointer-events-none">
          <CheckCircle2 className="w-12 h-12 text-green-500 pointer-events-none" />
        </div>
      )}
    </article>
  );
}
