import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center">
      <div className="max-w-4xl w-full grid gap-8 md:grid-cols-2">
        {/* Welcome Card */}
        <div className="card p-8 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">
            Welcome 👋
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Create a project and start adding tasks in your personal Kanban
            board.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/signup"
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card p-8 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
            Quick Links
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <Link
                href="/projects"
                className="block px-3 py-2 rounded-md text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-zinc-800 transition"
              >
                📂 Projects
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
