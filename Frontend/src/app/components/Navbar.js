"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./themeToggle";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/auth";

export const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 dark:border-zinc-800/70 glass shadow-md">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-extrabold text-xl text-primary hover:text-primary-hover transition-colors"
        >
          Trello-Lite
        </Link>

        <nav className="flex items-center gap-4">
          {/* Show Projects & Logout only if logged in */}
          {token ? (
            <>
              <Link
                href="/projects"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary hover:text-primary dark:hover:bg-secondary-hover transition"
              >
                Projects
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : null}

          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};
