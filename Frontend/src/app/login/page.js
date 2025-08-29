"use client";

import { useState } from "react";
import { useAppDispatch } from "../store/hook";
import { loginThunk } from "../store/slices/auth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ErrorMessage = ({ error, className }) => {
    if (!error) return null;
    return (
      <p className={`text-sm text-red-600 dark:text-red-400 ${className}`}>
        {error}
      </p>
    );
  };

  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500">
      <section className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center select-none">
          Welcome Back{" "}
          <span aria-label="waving hand" role="img">
            👋
          </span>
        </h1>
        <p className="mt-3 text-center text-gray-600 dark:text-gray-400 text-base select-none">
          Login to access your projects
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            const res = await dispatch(loginThunk({ email, password }));
            setIsLoading(false);
            if (res.meta.requestStatus === "fulfilled") {
              router.push("/projects");
            } else {
              setErrors({ password: "Invalid email or password" });
            }
          }}
          className="mt-8 space-y-6"
          noValidate
        >
          {/* Email */}
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 select-none">
              Email
            </span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
            />
          </label>

          <label className="block relative">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4 select-none">
              Password
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[42px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:from-indigo-800 active:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-60 transition duration-300 select-none disabled:opacity-70"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Continue →"
            )}
          </button>

          <ErrorMessage
            error={errors.password}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          />
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 select-none">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline focus:underline transition duration-200"
          >
            Sign up
          </a>
        </p>
      </section>
    </main>
  );
}
