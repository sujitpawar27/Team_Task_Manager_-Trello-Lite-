"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="mt-2">{error?.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}
