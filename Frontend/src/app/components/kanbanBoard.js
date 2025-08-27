"use client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";

const columns = [
  { key: "todo", title: "To Do" },
  { key: "in_progress", title: "In Progress" },
  { key: "done", title: "Done" },
];

export function KanbanBoard({ tasks, onMove }) {
  const grouped = Object.fromEntries(
    columns.map((c) => [c.key, tasks.filter((t) => t.status === c.key)])
  );

  const handleDragEnd = (result) => {
    const { draggableId, destination, source } = result;
    if (!destination) return;
    const destStatus = destination.droppableId;
    const srcStatus = source.droppableId;
    if (destStatus !== srcStatus) onMove(draggableId, destStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <Droppable droppableId={col.key} key={col.key}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="card p-3 min-h-[300px]"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{col.title}</h3>
                  <span className="text-xs text-zinc-500">
                    {grouped[col.key].length}
                  </span>
                </div>
                <div className="grid gap-2">
                  {grouped[col.key].map((t, idx) => (
                    <Draggable key={t._id} draggableId={t._id} index={idx}>
                      {(p) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                        >
                          <TaskCard task={t} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
