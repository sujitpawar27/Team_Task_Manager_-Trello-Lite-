"use client";

import { useEffect, useState } from "react";
import React from "react";
import { api } from "@/app/lib/api";
import { KanbanBoard } from "@/app/components/kanbanBoard";
import { TaskComposer } from "@/app/components/taskComposer";

export default function ProjectBoard({ params }) {
  // ✅ unwrap the params promise
  const unwrapped = React.use(params);
  const projectId = unwrapped.id;

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/tasks/project/${projectId}`);
    setTasks(data.tasks);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const onMove = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/move`, { status, project: projectId });
    await load();
  };

  const createTask = async (payload) => {
    await api.post("/tasks", { ...payload, project: projectId });
    await load();
  };

  const updateTask = async (taskId, payload) => {
    await api.patch(`/tasks/${taskId}`, { ...payload, project: projectId });
    setSelectedTask(null);
    await load();
  };

  const deleteTask = async (task) => {
    await api.delete(`/tasks/${task._id}`, { data: { project: projectId } });
    if (selectedTask && selectedTask._id === task._id) {
      setSelectedTask(null);
    }
    await load();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500 px-6 py-8">
      <div className="max-w-7xl mx-auto grid gap-8">
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-shadow hover:shadow-lg">
          <TaskComposer
            onCreate={createTask}
            onUpdate={updateTask}
            selectedTask={selectedTask}
            onCancelEdit={() => setSelectedTask(null)}
          />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-shadow hover:shadow-lg">
          <KanbanBoard
            tasks={tasks}
            onMove={onMove}
            onEditTask={(task) => setSelectedTask(task)}
            onDeleteTask={deleteTask}
          />
        </section>
      </div>
    </main>
  );
}
