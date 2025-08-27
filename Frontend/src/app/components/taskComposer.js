"use client";
import { useState } from "react";

export function TaskComposer({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = async () => {
    if (!title.trim()) return;
    await onCreate({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <div className="card p-4 grid gap-3">
      <div className="grid md:grid-cols-3 gap-3">
        <input
          className="input"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn-primary" onClick={submit}>
          Add Task
        </button>
      </div>
    </div>
  );
}
