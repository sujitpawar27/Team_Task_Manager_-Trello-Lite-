"use client";
import { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { createPortal } from "react-dom";
import { TaskCard } from "./taskCard";
import { Clock, CheckCircle, PlayCircle, Search } from "lucide-react";

const columns = [
  {
    key: "todo",
    title: "To Do",
    icon: Clock,
    gradient: "from-red-500 to-orange-500",
    bgColor: "bg-red-50 dark:bg-red-900/10",
    borderColor: "border-red-200 dark:border-red-800/30",
  },
  {
    key: "in_progress",
    title: "In Progress",
    icon: PlayCircle,
    gradient: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
    borderColor: "border-blue-200 dark:border-blue-800/30",
  },
  {
    key: "done",
    title: "Done",
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/10",
    borderColor: "border-green-200 dark:border-green-800/30",
  },
];

export function KanbanBoard({ tasks, onMove, onEditTask, onDeleteTask }) {
  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesAssignee =
        !assigneeFilter ||
        (t.assignee &&
          ((typeof t.assignee === "object" &&
            t.assignee._id === assigneeFilter) ||
            (typeof t.assignee !== "object" && t.assignee === assigneeFilter)));

      const matchesStatus = !statusFilter || t.status === statusFilter;

      const matchesDueDate =
        !dueDateFilter || (t.dueDate && t.dueDate.startsWith(dueDateFilter));

      return (
        matchesSearch && matchesAssignee && matchesStatus && matchesDueDate
      );
    });
  }, [tasks, search, assigneeFilter, statusFilter, dueDateFilter]);

  const grouped = Object.fromEntries(
    columns.map((c) => [c.key, filteredTasks.filter((t) => t.status === c.key)])
  );

  const handleDragEnd = (result) => {
    const { draggableId, destination, source } = result;
    if (!destination) return;
    const destStatus = destination.droppableId;
    const srcStatus = source.droppableId;
    if (destStatus !== srcStatus) {
      onMove(draggableId, destStatus);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
          >
            <option value="">All Assignees</option>
            {[
              ...new Map(
                tasks
                  .map((t) => t.assignee)
                  .filter(Boolean)
                  .map((a) => [typeof a === "object" ? a._id : a, a])
              ).values(),
            ].map((a) => {
              if (typeof a === "object") {
                return (
                  <option key={a._id} value={a._id}>
                    {a.name || a.email || a._id}
                  </option>
                );
              } else {
                return (
                  <option key={a} value={a}>
                    {a}
                  </option>
                );
              }
            })}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            {columns.map((c) => (
              <option key={c.key} value={c.key}>
                {c.title}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const Icon = col.icon;
            return (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided, snapshot) => (
                  <section
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 min-h-[400px] ${
                      snapshot.isDraggingOver
                        ? `${col.bgColor} ${col.borderColor} shadow-lg`
                        : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:shadow-md"
                    }`}
                  >
                    {/* Column Header */}
                    <header className="sticky top-0 z-10 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 bg-gradient-to-r ${col.gradient} rounded-lg text-white shadow-md`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {col.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {grouped[col.key].length}{" "}
                              {grouped[col.key].length === 1 ? "task" : "tasks"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </header>

                    {/* Tasks Container */}
                    <div className="p-4 space-y-3">
                      {grouped[col.key].length === 0 ? (
                        <div className="text-center py-12">
                          <div
                            className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${col.gradient} opacity-20 flex items-center justify-center mb-4`}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No tasks in {col.title.toLowerCase()}
                          </p>
                        </div>
                      ) : (
                        grouped[col.key].map((t, idx) => (
                          <Draggable
                            key={t._id}
                            draggableId={t._id}
                            index={idx}
                          >
                            {(providedDraggable, snapshotDraggable) => {
                              const content = (
                                <div
                                  ref={providedDraggable.innerRef}
                                  {...providedDraggable.draggableProps}
                                  className={`${
                                    snapshotDraggable.isDragging
                                      ? "transition-none shadow-2xl z-50"
                                      : "transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                                  }`}
                                >
                                  <TaskCard
                                    task={t}
                                    onEdit={onEditTask}
                                    onDelete={onDeleteTask}
                                    columnType={col.key}
                                    dragHandleProps={
                                      providedDraggable.dragHandleProps
                                    }
                                  />
                                </div>
                              );
                              return snapshotDraggable.isDragging
                                ? createPortal(content, document.body)
                                : content;
                            }}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  </section>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
