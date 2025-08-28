import "./globals.css";
import { Providers } from "./components/providers";
import { Navbar } from "./components/Navbar";

export const metadata = {
  title: "Rast AI • Trello-Lite",
  description: "Team Task Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto ">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
