"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { createPortal } from "react-dom";
import { TaskCard } from "./taskCard";
import { Clock, CheckCircle, PlayCircle } from "lucide-react";

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
  const grouped = Object.fromEntries(
    columns.map((c) => [c.key, tasks.filter((t) => t.status === c.key)])
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Task Board
        </h2>
        <div className="flex items-center gap-4 text-sm">
          {columns.map((col) => (
            <div key={col.key} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-r ${col.gradient}`}
              ></div>
              <span className="text-gray-600 dark:text-gray-400">
                {col.title}: {grouped[col.key].length}
              </span>
            </div>
          ))}
        </div>
      </div>

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
                    className={`
                      relative overflow-hidden rounded-2xl border-2 transition-all duration-300 min-h-[400px]
                      ${
                        snapshot.isDraggingOver
                          ? `${col.bgColor} ${col.borderColor} shadow-lg `
                          : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:shadow-md"
                      }
                    `}
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

                        {/* Progress Indicator */}
                        <div
                          className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${
                            col.key === "todo"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              : ""
                          }
                          ${
                            col.key === "in_progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                              : ""
                          }
                          ${
                            col.key === "done"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : ""
                          }
                        `}
                        >
                          {grouped[col.key].length}
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
                            {(providedDraggable, snapshotDraggable) => (
                              (() => {
                                const content = (
                                  <div
                                    ref={providedDraggable.innerRef}
                                    {...providedDraggable.draggableProps}
                                    className={`
        ${
          snapshotDraggable.isDragging
            ? "transition-none shadow-2xl z-50"
            : "transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        }
      `}
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
                              })()
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>

                    {/* Drag Target Indicator */}
                    {snapshot.isDraggingOver && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div
                          className={`absolute inset-2 border-2 border-dashed rounded-xl opacity-50 ${col.borderColor}`}
                        ></div>
                      </div>
                    )}
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
