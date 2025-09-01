"use client";

import { useState } from "react";
import { api } from "../lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", server: "" });
  const router = useRouter();

  const validate = () => {
    let valid = true;
    let newErrors = { email: "", password: "", server: "" };

    // Email validation
    if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Email must include '@' and '.'";
      valid = false;
    }

    // Password validation
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setError(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!name || !email || !password) return;
    if (!validate()) return;

    try {
      await api.post("/auth/register", { name, email, password });
      router.push("/login");
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err.response?.status === 409 || err.response?.status === 400) {
        message = "User with this email already exists.";
      }
      setError((prev) => ({ ...prev, server: message }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4  bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors">
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Join us today and start exploring!
        </p>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            {error.email && (
              <p className="mt-1 text-sm text-red-500">{error.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {error.password && (
              <p className="mt-1 text-sm text-red-500">{error.password}</p>
            )}
          </div>

          {/* Server error */}
          {error.server && (
            <p className="text-center text-sm text-red-600">{error.server}</p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-lg font-medium text-white 
                       bg-gradient-to-r from-blue-500 to-indigo-500
                       hover:from-blue-600 hover:to-indigo-600
                       focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       transition"
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
