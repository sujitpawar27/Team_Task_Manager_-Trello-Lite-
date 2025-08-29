"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";
import Loading from "../components/loading";
import { Pencil, Trash2 } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Edit state
  const [editingProject, setEditingProject] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      if (editingProject) {
        await api.patch(`/projects/${editingProject._id}`, {
          name,
          description: desc,
        });
      } else {
        await api.post("/projects", { name, description: desc });
      }
      setName("");
      setDesc("");
      setEditingProject(null);
      await load();
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setName(project.name);
    setDesc(project.description || "");
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setName("");
    setDesc("");
  };

  const deleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await api.delete(`/projects/${projectId}`);
    await load();
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
            {editingProject ? "Edit Project" : "Projects"}
          </h1>

          <form
            onSubmit={handleSubmit}
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

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 select-none disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin cursor-pointer"></div>
                    {editingProject ? "Saving..." : "Creating..."}
                  </>
                ) : editingProject ? (
                  "Save Changes"
                ) : (
                  "Create"
                )}
              </button>

              {editingProject && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold shadow-md transition duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Projects List */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300"
            >
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
                    <Pencil
                      className="w-4 h-4 cursor-pointer"
                      title="Edit project"
                    />
                  </button>
                  <button
                    onClick={() => deleteProject(p._id)}
                    className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    title="Delete project"
                  >
                    <Trash2
                      className="w-4 h-4 cursor-pointer"
                      title="Delete project"
                    />
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
          ))}
        </section>
      </div>
    </main>
  );
}
