"use client";

import { useEffect, useState } from "react";
import React from "react";
import { api } from "@/app/lib/api";
import { KanbanBoard } from "@/app/components/kanbanBoard";
import { TaskComposer } from "@/app/components/taskComposer";
import { MembersPanel } from "@/app/components/membersPanel";
import { Users, Eye, Plus, Calendar, Target } from "lucide-react";
import Loading from "@/app/components/loading";

export default function ProjectBoard({ params }) {
  const unwrapped = React.use(params);
  const projectId = unwrapped.id;

  const [project, setProject] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOverview = async () => {
    const { data } = await api.get(`/projects/${projectId}/overview`);
    setProject(data.project);
    setIsMember(Boolean(data.isMember));
  };

  const loadMembersAndTasks = async () => {
    const { data: projRes } = await api.get(`/projects/${projectId}`);
    setProject(projRes.project);
    setMembers((projRes.project.members || []).map((m) => m.user));
    const { data: tasksRes } = await api.get(`/tasks/project/${projectId}`);
    setTasks(tasksRes.tasks);
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadOverview();
      setIsLoading(false);
    })();
  }, [projectId]);

  useEffect(() => {
    if (isMember) {
      (async () => {
        setIsLoading(true);
        await loadMembersAndTasks();
        setIsLoading(false);
      })();
    }
  }, [isMember]);

  const onMove = async (
    taskId,
    status,
    destIndex = undefined,
    srcIndex = undefined,
    srcStatus = undefined
  ) => {
    if (
      srcStatus &&
      srcStatus === status &&
      typeof destIndex === "number" &&
      typeof srcIndex === "number"
    ) {
      setTasks((prev) => {
        const sameIndexes = [];
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].status === status) sameIndexes.push(i);
        }
        if (
          srcIndex < 0 ||
          destIndex < 0 ||
          srcIndex >= sameIndexes.length ||
          destIndex > sameIndexes.length
        )
          return prev;

        const srcAbsolute = sameIndexes[srcIndex];
        const destAbsolute =
          destIndex === sameIndexes.length
            ? prev.length
            : sameIndexes[destIndex];

        const next = prev.slice();
        const [moving] = next.splice(srcAbsolute, 1);
        let adjustedDest = destAbsolute;
        if (srcAbsolute < destAbsolute) adjustedDest = destAbsolute - 1;
        next.splice(adjustedDest, 0, moving);
        return next;
      });
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status } : t))
    );
    try {
      await api.patch(`/tasks/${taskId}/move`, { status, project: projectId });
      await loadMembersAndTasks();
    } catch (err) {
      await loadMembersAndTasks();
      console.error("Failed to move task", err);
    }
  };

  const createTask = async (payload) => {
    console.log("Creating task with payload:", payload);

    const { data } = await api.post("/tasks", {
      ...payload,
      project: projectId,
    });
    await loadMembersAndTasks();
    return data.task;
  };

  const updateTask = async (taskId, payload) => {
    await api.patch(`/tasks/${taskId}`, { ...payload, project: projectId });
    setSelectedTask(null);
    await loadMembersAndTasks();
  };

  const deleteTask = async (task) => {
    await api.delete(`/tasks/${task._id}`, { data: { project: projectId } });
    if (selectedTask && selectedTask._id === task._id) {
      setSelectedTask(null);
    }
    await loadMembersAndTasks();
  };

  if (isLoading) {
    return <Loading />;
  }

  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Project Header */}
        {project && (
          <header className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                      <Target className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {project.name}
                    </h1>
                  </div>
                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Project Stats */}
                {isMember && (
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                        <Users className="w-4 h-4" />
                        <span>Members</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {members.length}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Tasks</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalTasks}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {isMember && totalTasks > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Project Progress
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {completedTasks}/{totalTasks} tasks completed
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Read-only Warning */}
              {!isMember && (
                <div className="flex items-center gap-2 mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                  <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-amber-800 dark:text-amber-300 font-medium">
                    You are viewing this project in read-only mode
                  </span>
                </div>
              )}
            </div>
          </header>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {isMember ? (
              <>
                {/* Task Composer */}
                <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl text-white">
                      <Plus className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedTask ? "Edit Task" : "Create New Task"}
                    </h2>
                  </div>
                  <TaskComposer
                    onCreate={createTask}
                    onUpdate={updateTask}
                    selectedTask={selectedTask}
                    onCancelEdit={() => setSelectedTask(null)}
                    members={members}
                    projectId={projectId}
                  />
                </section>

                {/* Kanban Board */}
                <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-2xl">
                  <KanbanBoard
                    tasks={tasks}
                    onMove={onMove}
                    onEditTask={(task) => setSelectedTask(task)}
                    onDeleteTask={deleteTask}
                  />
                </section>
              </>
            ) : (
              <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl text-white w-fit mx-auto mb-6">
                    <Eye className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Join Project to Continue
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Become a member of this project to view and manage tasks,
                    collaborate with team members, and track progress.
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Members Panel */}
          {isMember && project && project.members && (
            <div className="lg:col-span-1">
              <MembersPanel project={project} onChange={loadMembersAndTasks} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
