"use client";
import { useState } from "react";
import {
  Save,
  X,
  Calendar,
  User,
  AlertTriangle,
  FileText,
  Tag,
  Clock,
  PlayCircle,
  CheckCircle,
} from "lucide-react";

export function TaskComposer({
  onCreate,
  onUpdate,
  selectedTask,
  onCancelEdit,
  members = [],
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(selectedTask && selectedTask._id);

  const submit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        assignee: assignee || undefined,
        dueDate: new Date(dueDate).toISOString() || undefined,
        priority,
        status,
      };

      if (isEditing) {
        await onUpdate(selectedTask._id, payload);
      } else {
        await onCreate(payload);
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignee("");
    setDueDate("");
    setPriority("medium");
    setStatus("todo");
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) onCancelEdit();
  };

  // Initialize form with selected task data
  if (isEditing && title === "" && description === "" && selectedTask) {
    setTitle(selectedTask.title || "");
    setDescription(selectedTask.description || "");
    setAssignee(selectedTask.assignee?._id || selectedTask.assignee || "");
    setDueDate(selectedTask.dueDate ? selectedTask.dueDate.split("T")[0] : "");
    setPriority(selectedTask.priority || "medium");
    setStatus(selectedTask.status || "todo");
  }

  const priorityOptions = [
    {
      value: "low",
      label: "Low Priority",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      value: "medium",
      label: "Medium Priority",
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      value: "high",
      label: "High Priority",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  const statusOptions = [
    { value: "todo", label: "To Do", Icon: Clock },
    { value: "in_progress", label: "In Progress", Icon: PlayCircle },
    { value: "done", label: "Done", Icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="space-y-6"
      >
        {/* Title Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4" />
            Task Title
          </label>
          <input
            type="text"
            placeholder="Enter a clear, descriptive task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-4 px-4 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-lg font-medium"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Tag className="w-4 h-4" />
            Description
          </label>
          <textarea
            placeholder="Add more details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-4 px-4 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 resize-none"
          />
        </div>

        {/* Form Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Assignee Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4" />
              Assignee
            </label>
            <div className="relative">
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-4 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-4 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <AlertTriangle className="w-4 h-4" />
              Priority
            </label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-4 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {/* Use the icon matching the current status */}
            {(() => {
              const current = statusOptions.find((s) => s.value === status) || statusOptions[0];
              const Icon = current.Icon;
              return <Icon className="w-4 h-4" />;
            })()}
            Status
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-4 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              {(() => {
                const current = statusOptions.find((s) => s.value === status) || statusOptions[0];
                const Icon = current.Icon;
                return <Icon className="w-5 h-5 text-gray-400" />;
              })()}
            </div>
          </div>
        </div>

        {/* Priority Indicator */}
        {priority && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Selected priority:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                priorityOptions.find((p) => p.value === priority)?.bg
              } ${priorityOptions.find((p) => p.value === priority)?.color}`}
            >
              {priorityOptions.find((p) => p.value === priority)?.label}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? "Update Task" : "Create Task"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
