import "./globals.css";
import { Providers } from "./components/providers";
import { ThemeSwitcher } from "./components/themeToggle";
import Link from "next/link";

export const metadata = {
  title: "Rast AI • Trello-Lite",
  description: "Team Task Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-zinc-200/70 dark:border-zinc-800/70 glass shadow-md">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="font-extrabold text-xl text-primary hover:text-primary-hover transition-colors"
              >
                Trello-Lite
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-4">
                <Link
                  href="/projects"
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary hover:text-primary dark:hover:bg-secondary-hover transition"
                >
                  Projects
                </Link>
                <ThemeSwitcher />
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="mx-auto ">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
