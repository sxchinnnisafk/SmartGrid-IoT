import type { Metadata } from "next";
import "./globals.css";
import { GridProvider } from "./context/GridContext";
import { ThemeProvider } from "./context/ThemeContext";
import ScrollRevealObserver from "./components/ScrollRevealObserver";

export const metadata: Metadata = {
  title: "SmartGrid AIoT • Intelligent Power Monitoring & Management System",
  description:
    "Team Celestia's prototype combining an edge rover, a live grid twin, and AI-assisted operator response for Power Hack 2026.",
  icons: {
    icon: "/assets/team_celestia_logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#12151c] text-[#f4f5f8] min-h-screen antialiased selection:bg-[#3b59f8] selection:text-white">
        {/* Skip Link for Keyboard Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <ThemeProvider>
          <GridProvider>
            <ScrollRevealObserver />
            <div id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </div>
          </GridProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
