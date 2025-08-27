"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskCard } from "./taskCard";

const columns = [
  { key: "todo", title: "To Do" },
  { key: "in_progress", title: "In Progress" },
  { key: "done", title: "Done" },
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <Droppable droppableId={col.key} key={col.key}>
            {(provided) => (
              <section
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 min-h-[320px] flex flex-col transition-colors duration-300"
              >
                <header className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white select-none">
                    {col.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 select-none">
                    {grouped[col.key].length}
                  </span>
                </header>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {grouped[col.key].map((t, idx) => (
                    <Draggable key={t._id} draggableId={t._id} index={idx}>
                      {(providedDraggable) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                        >
                          <TaskCard
                            task={t}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </section>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
