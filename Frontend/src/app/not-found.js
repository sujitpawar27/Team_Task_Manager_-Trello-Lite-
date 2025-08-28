import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center">
      <h1 className="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
      >
        Go Home
      </Link>
    </main>
  );
}
