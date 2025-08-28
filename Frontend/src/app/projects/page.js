"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";
import Loading from "../components/loading";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Edit state
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      await api.post("/projects", { name, description: desc });
      setName("");
      setDesc("");
      await load();
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDesc(project.description || "");
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setEditName("");
    setEditDesc("");
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    setIsEditing(true);
    try {
      await api.patch(`/projects/${editingProject._id}`, {
        name: editName,
        description: editDesc,
      });
      await load();
      cancelEdit();
    } finally {
      setIsEditing(false);
    }
  };

  const deleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${projectId}`);
      await load();
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPageLoading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500 px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header + Form */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white select-none">
            Projects
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              create();
            }}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 select-none disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {"Creating..."}
                </>
              ) : (
                "Create"
              )}
            </button>
          </form>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {editingProject?._id === p._id ? (
                // Edit mode
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    placeholder="Project name"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    placeholder="Description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      disabled={isEditing}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-3 text-sm font-medium transition duration-300 disabled:opacity-70"
                    >
                      {isEditing ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={isEditing}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg py-2 px-3 text-sm font-medium transition duration-300 disabled:opacity-70"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/projects/${p._id}`}
                      className="flex-1 hover:opacity-80 transition-opacity"
                    >
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {p.name}
                      </h2>
                    </Link>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Edit project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteProject(p._id)}
                        disabled={isDeleting}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete project"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <Link
                    href={`/projects/${p._id}`}
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {p.description || "No description provided."}
                    </p>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
