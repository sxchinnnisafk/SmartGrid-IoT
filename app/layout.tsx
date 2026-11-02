import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GridProvider } from "./context/GridContext";
import { ThemeProvider } from "./context/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SmartGrid AIoT • Command & Digital Twin Dashboard",
  description: "Next.js App Router digital twin dashboard for ESP32 edge node grid telemetry and rover patrol control.",
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
      </head>
      <body className={`${inter.variable} font-sans bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen antialiased selection:bg-[var(--color-accent)] selection:text-[var(--color-text-inverse)]`}>
        <ThemeProvider>
          <GridProvider>{children}</GridProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}