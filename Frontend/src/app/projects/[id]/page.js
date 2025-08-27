"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { KanbanBoard } from "@/components/kanban-board";
import { TaskComposer } from "@/components/task-composer";

export default function ProjectBoard({ params }) {
  const projectId = params.id;
  const [tasks, setTasks] = useState([]);

  const load = async () => {
    const { data } = await api.get(`/tasks/project/${projectId}`);
    setTasks(data.tasks);
  };

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const onMove = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/move`, { status });
    await load();
  };

  const createTask = async (payload) => {
    await api.post("/tasks", { ...payload, project: projectId });
    await load();
  };

  return (
    <div className="grid gap-4">
      <TaskComposer onCreate={createTask} />
      <KanbanBoard tasks={tasks} onMove={onMove} />
    </div>
  );
}
