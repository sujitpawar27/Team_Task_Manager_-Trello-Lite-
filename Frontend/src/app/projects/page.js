"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const load = async () => {
    const { data } = await api.get("/projects");
    setProjects(data.projects);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return; // avoid empty names
    await api.post("/projects", { name, description: desc });
    setName("");
    setDesc("");
    await load();
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 px-6 py-10">
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
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-300 select-none"
            >
              Create
            </button>
          </form>
        </section>

        {/* Projects list */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link
              key={p._id}
              href={`/projects/${p._id}`}
              className="block rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300"
              title={p.name}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {p.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {p.description || "No description provided."}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
