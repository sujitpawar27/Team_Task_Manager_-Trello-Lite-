"use client";
import { useState } from "react";

  export function TaskComposer({ onCreate, onUpdate, selectedTask, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isEditing = Boolean(selectedTask && selectedTask._id);

  const submit = async () => {
    if (!title.trim()) return;
    if (isEditing) {
      await onUpdate(selectedTask._id, { title, description });
    } else {
      await onCreate({ title, description });
    }
    setTitle("");
    setDescription("");
  };

  // hydrate fields when switching into edit mode
  if (isEditing && (title === "" && description === "") && selectedTask) {
    // initialize values from the selected task (client-only comp)
    // avoid useEffect to keep file minimal and deterministic across renders
    // this will only run once when both are empty
    // eslint-disable-next-line no-unused-expressions
    (function initFromTask(){
      setTitle(selectedTask.title || "");
      setDescription(selectedTask.description || "");
    })();
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-shadow hover:shadow-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="grid gap-4 md:grid-cols-3"
      >
        <input
          type="text"
          placeholder={isEditing ? "Edit title" : "Task title"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
        />
        <input
          type="text"
          placeholder={isEditing ? "Edit description" : "Description"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
        />
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setDescription("");
                onCancelEdit && onCancelEdit();
              }}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg font-semibold shadow-sm transition duration-300 select-none py-3 px-4"
            >
              Cancel
            </button>
          )}
          <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 select-none py-3 px-4"
          >
            {isEditing ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>
    </section>
  );
}
