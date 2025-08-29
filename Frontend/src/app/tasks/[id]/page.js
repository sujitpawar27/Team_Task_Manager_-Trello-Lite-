"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, Flag, User2 } from "lucide-react";
import { api } from "@/app/lib/api";
import CommentsPanel from "@/app/components/commentsPanel";
import Loading from "@/app/components/loading";

export default function TaskPage({ params }) {
  const unwrapped = React.use(params);
  const taskId = unwrapped.id;
  const search = useSearchParams();
  const projectId = search?.get("projectId");
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/tasks/${taskId}`, {
          params: { projectId },
        });
        setTask(data.task);
      } catch (err) {
        console.error("Failed to load task", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [taskId, projectId]);

  if (loading) return <Loading />;
  if (!task)
    return (
      <div className="p-8">
        <h3 className="text-xl font-semibold">Task not found</h3>
        <button
          onClick={() => router.back()}
          className="mt-4 px-3 py-2 bg-indigo-600 text-white rounded"
        >
          Back
        </button>
      </div>
    );

  const statusPill = (status) => {
    const map = {
      todo: "bg-gray-100 text-gray-700 dark:bg-gray-900/60 dark:text-gray-300",
      "in-progress":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
      done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
      blocked:
        "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
    };
    const cls =
      map[String(status || "").toLowerCase()] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/60 dark:text-gray-300";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}
      >
        {String(status || "Unknown").replace(/\b\w/g, (m) => m.toUpperCase())}
      </span>
    );
  };

  const priorityPill = (priority) => {
    const map = {
      low: "bg-gray-100 text-gray-700 dark:bg-gray-900/60 dark:text-gray-300",
      medium:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
      high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
    };
    const cls =
      map[String(priority || "").toLowerCase()] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/60 dark:text-gray-300";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}
      >
        {String(priority || "-").replace(/\b\w/g, (m) => m.toUpperCase())}
      </span>
    );
  };

  return (
    <main className="min-h-screen p-8  bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="text-2xl font-bold tracking-tight">
                {task.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {statusPill(task.status)}
              {priorityPill(task.priority)}
            </div>
          </div>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
              {task.description}
            </p>
          )}
        </header>

        <section className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Details</h2>
            <div className="text-sm text-gray-700 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="font-medium">Assignee:</span>{" "}
                  {task.assignee
                    ? task.assignee.name || task.assignee
                    : "Unassigned"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="font-medium">Due:</span>{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "—"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="font-medium">Priority:</span>{" "}
                  {priorityPill(task.priority)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Attachments</h2>
            {task.attachments && task.attachments.length ? (
              <div className="space-y-2">
                {Array.from(
                  new Map(
                    (task.attachments || []).map((a) => [
                      a.url || `${a.name}-${a.size}`,
                      a,
                    ])
                  ).values()
                ).map((a, i) => (
                  <div
                    key={`${a.url}-${i}`}
                    className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-sm text-indigo-600 hover:underline"
                        title={a.name}
                      >
                        {a.name}
                      </a>
                      <span className="text-xs text-gray-500 shrink-0">
                        {a.size ? `${Math.round(a.size / 1024)} KB` : ""}
                      </span>
                    </div>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No attachments.</div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CommentsPanel taskId={taskId} projectId={projectId} />
          </div>
        </section>
      </div>
    </main>
  );
}
