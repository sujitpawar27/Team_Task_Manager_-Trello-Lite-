import Link from "next/link";
import Error from "./error";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <section>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              Treelo-Lite
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Task Management <span className="text-indigo-600">Reimagined</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
            Organize your projects, collaborate with your team, and track
            progress effortlessly — all in one modern Kanban workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 text-base font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Log In
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
